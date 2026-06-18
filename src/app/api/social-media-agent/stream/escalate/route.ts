/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/admin';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { streamItemId, content, senderUsername, platform, channelId, externalId } = await req.json();

    if (!streamItemId || !content || !channelId || !externalId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch the Channel's Access Token so we can ask Meta for the link
    const { data: channel, error: channelErr } = await supabase
      .from('channels')
      .select('encrypted_access_token')
      .eq('id', channelId)
      .single();

    if (channelErr) throw new Error("Could not find channel token.");

    // 2. Fetch the live Permalink URL from Meta's Graph API
    let commentUrl = '#'; // Fallback

    try {
      if (platform === 'facebook') {
        // Facebook comments have a direct 'permalink_url' field
        const fbRes = await fetch(`https://graph.facebook.com/v21.0/${externalId}?fields=permalink_url&access_token=${channel.encrypted_access_token}`);
        const fbData = await fbRes.json();
        if (fbData.permalink_url) commentUrl = fbData.permalink_url;
      } else if (platform === 'instagram') {
        // Instagram comments are tied to media, so we ask for the parent media's permalink
        const igRes = await fetch(`https://graph.facebook.com/v21.0/${externalId}?fields=media{permalink}&access_token=${channel.encrypted_access_token}`);
        const igData = await igRes.json();
        if (igData.media?.permalink) commentUrl = igData.media.permalink;
      }
    } catch (apiErr) {
      console.warn("Failed to fetch permalink from Meta:", apiErr);
      // If it fails, fallback to a generic search link to the user
      commentUrl = platform === 'instagram'
        ? `https://instagram.com/${senderUsername}`
        : `https://facebook.com/search/top/?q=${encodeURIComponent(senderUsername)}`;
    }

    // 3. Update the item in Supabase to mark it as escalated
    const { error: dbError } = await supabase
      .from('stream_items')
      .update({ is_escalated: true })
      .eq('id', streamItemId);

    if (dbError) throw new Error(`Database error: ${dbError.message}`);

    // 2. Configure the Email Transporter (Use your own SMTP credentials in production)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 3. Craft the Support Alert Email
    const mailOptions = {
      from: `"Solvetude AI Agent" <${process.env.SUPPORT_EMAIL_USER}>`,
      to: 'ritik.solvetude@gmail.com',
      subject: `🚨 URGENT: Negative Social Media Interaction Escalated (@${senderUsername})`,
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px; overflow: hidden;">
          <!-- Header -->
          <div style="background: #0f172a; padding: 28px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                🚨 CRITICAL CUSTOMER ESCALATION 🚨
              </h1>
              <p style="margin: 8px 0 0 0; color: #fee2e2; font-size: 14px;">
                Solvetude AI Agent has detected high-priority negative sentiment requiring immediate attention.
              </p>
          </div>
          <!-- Body -->
          <div style="padding: 30px;">
              <div style="background: #fff7ed; border: 1px solid #fdba74; border-radius: 10px; padding: 18px; margin-bottom: 24px;">
                <p style="margin: 0; color: #991b1b; font-size: 16px; font-weight: 700;">
                    ⚠ Immediate Human Intervention Required
                </p>
                <p style="margin: 10px 0 0 0; color: #7f1d1d; line-height: 1.6;">
                    A potentially reputation-impacting interaction has been detected on
                    <strong>${platform}</strong>. <br/> Rapid engagement is recommended to mitigate potential customer dissatisfaction,
                    public escalation, and brand reputation risk.
                </p>
              </div>
              <!-- Social Post -->
              <div style="border: 2px solid #ef4444; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                <div style="background: #fee2e2; padding: 12px 18px;">
                    <span style="font-size: 13px; font-weight: 700; color: #991b1b;">
                    FLAGGED SOCIAL MEDIA MESSAGE
                    </span>
                </div>
                <div style="padding: 20px; background: #ffffff;">
                    <p style="margin: 0 0 12px 0; color: #334155;">
                      <strong>User:</strong> @${senderUsername}
                    </p>
                    <div style="background: #f8fafc; border-left: 5px solid #dc2626; padding: 16px; border-radius: 6px;">
                      <p style="margin: 0; color: #0f172a; font-size: 15px; line-height: 1.7;">
                          "${content}"
                      </p>
                    </div>
                </div>
              </div>
              <!-- Action Center -->
              <div style="padding: 20px; text-align: center; margin-top: 24px;">
                <a href="${commentUrl}" target="_blank" style=" display: inline-block; background: linear-gradient(135deg, #dc2626, #991b1b); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 15px;">
                  Review Original Comment
                </a>
              </div>
          </div>
          <!-- Footer -->
          <div style="background: #0f172a; padding: 20px; text-align: center;">
            <p style="margin: 0; color: #cbd5e1; font-size: 13px;">
              Powered by <strong style="color: #ffffff;">Solvetude AI Agent</strong>
            </p>
            <p style="margin: 6px 0 0 0; color: #64748b; font-size: 12px;">
              Automated Sentiment Monitoring • Real-Time Escalation • Brand Protection
            </p>
          </div>
        </div>
      `,
    };

    // 4. Send the Email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Escalation Error]:", error);
    return NextResponse.json({ error: 'Failed to escalate item' }, { status: 500 });
  }
}