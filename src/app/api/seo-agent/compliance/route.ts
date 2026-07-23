/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { Queue } from 'bullmq';
import { redisConnection } from '@/lib/seo-agent/queue';
import { withLogger } from '@/lib/logs/withLogger';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { v4 as uuidv4 } from 'uuid';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

const complianceQueue = new Queue('compliance-audit-queue', {
  connection: redisConnection as any,
});

/*
// ==================== AWS S3 CLIENT (TEMPORARILY COMMENTED) ====================
// const s3Client = new S3Client({
//   region: process.env.AWS_REGION!,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });
// ==============================================================================
*/

export const POST = withLogger('/api/seo-agent/compliance', async (req: NextRequest, routeLogger: any) => {
  try {
    const formData = await req.formData();
    const targetUrl = formData.get('url') as string;
    const file = formData.get('brief') as File;

    if (!targetUrl || !file) {
      routeLogger.warn({ event: 'compliance_validation_failed' }, 'Missing required fields: targetUrl or file.');
      return NextResponse.json(
        { error: 'Target URL and Docx brief are required.' },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    /*
    // ==================== AWS S3 UPLOAD LOGIC (TEMPORARILY COMMENTED) ====================
    // const s3Key = `compliance-briefs/${uuidv4()}-${file.name}`;
    // await s3Client.send(
    //   new PutObjectCommand({
    //     Bucket: process.env.AWS_S3_BUCKET_NAME!,
    //     Key: s3Key,
    //     Body: fileBuffer,
    //     ContentType: file.type,
    //   })
    // );
    // ====================================================================================
    */

    // ==================== STRAPI MEDIA UPLOAD LOGIC ====================
    const strapiFormData = new FormData();
    const fileBlob = new Blob([fileBuffer], {
      type: file.type || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    strapiFormData.append('files', fileBlob, file.name);

    routeLogger.info({ event: 'strapi_upload_started', fileName: file.name }, 'Uploading brief file to Strapi...');

    const uploadResponse = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: strapiFormData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      routeLogger.error({ event: 'strapi_upload_failed', errorText }, 'Failed to upload brief to Strapi');
      throw new Error(`Failed to upload brief to Strapi: ${uploadResponse.statusText}`);
    }

    const uploadedFiles = await uploadResponse.json();
    const uploadedFile = uploadedFiles[0];
    const strapiFileUrl = uploadedFile.url.startsWith('http')
      ? uploadedFile.url
      : `${STRAPI_URL}${uploadedFile.url}`;

    const strapiFileId = uploadedFile.id;
    console.log('strapiFileUrl - uploadedFile.id', strapiFileId);
    // ===================================================================

    // 1. Create initial processing placeholder in Strapi
    let documentId = '';
    routeLogger.info({ event: 'compliance_save_started', targetUrl }, 'Creating placeholder record in Strapi...');

    const auditRecordResponse = await fetch(`${STRAPI_URL}/api/compliance-audits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          target_url: targetUrl,
          audit_status: 'processing',
          brief_file: strapiFileId,
          report_data: {},
        },
      }),
    });

    if (!auditRecordResponse.ok) {
      const errorText = await auditRecordResponse.text();
      routeLogger.error({ event: 'strapi_record_error', errorText }, 'Could not create placeholder record prior to queueing.');
      throw new Error(`Strapi Create Error: ${errorText}`);
    }

    const recordData = await auditRecordResponse.json();
    documentId = recordData.data?.documentId || recordData.data?.id || recordData.id;

    // 2. Add Job to BullMQ Queue
    try {
      routeLogger.info({ event: 'queue_attempt', documentId }, 'Triggering Compliance Worker...');

      const job = await complianceQueue.add('analyze-compliance', {
        documentId,
        targetUrl,
        fileUrl: strapiFileUrl,
        fileName: file.name,
        createdAt: new Date().toISOString(),
      }, {
        removeOnComplete: true,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        }
      });

      return NextResponse.json({
        success: true,
        jobId: job.id,
        documentId,
        message: 'Compliance audit queued successfully.'
      });

    } catch (redisError: any) {
      routeLogger.warn({ err: redisError }, 'Redis skipped or failed.');
      throw redisError; // Re-throw to be caught by the outer catch block
    }

  } catch (error: any) {
    routeLogger.error({ err: error }, 'Compliance Audit Save Error');
    return NextResponse.json(
      { error: error?.message || 'Failed to process compliance audit request.' },
      { status: 500 }
    );
  }
});

/*
import { NextResponse } from 'next/server';
import { Queue } from 'bullmq';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

// Initialize BullMQ Queue
const complianceQueue = new Queue('compliance-audits', {
  connection: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const targetUrl = formData.get('url') as string;
    const file = formData.get('brief') as File;

    if (!targetUrl || !file) {
      return NextResponse.json(
        { error: 'Target URL and Docx brief are required.' },
        { status: 400 }
      );
    }

    // 1. Upload Docx to S3 (Keeps Redis payload lightweight)
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const s3Key = `compliance-briefs/${uuidv4()}-${file.name}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: s3Key,
        Body: fileBuffer,
        ContentType: file.type,
      })
    );

    // 2. Add Job to BullMQ
    const job = await complianceQueue.add('analyze-compliance', {
      targetUrl,
      s3Key,
      fileName: file.name,
      createdAt: new Date().toISOString(),
    }, {
      removeOnComplete: true, // Keep Redis clean
      attempts: 3,            // Retry on transient scraping failures
      backoff: {
        type: 'exponential',
        delay: 5000,
      }
    });

    // 3. Return Job ID to client for polling
    return NextResponse.json({
      success: true,
      jobId: job.id,
      message: 'Compliance audit queued successfully.'
    });

  } catch (error) {
    console.error('[COMPLIANCE_PRODUCER_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to process compliance audit request.' },
      { status: 500 }
    );
  }
}
*/
