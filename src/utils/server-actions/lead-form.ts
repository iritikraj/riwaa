"use server";

import nodemailer from "nodemailer";

interface LeadFormData {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  note: string;
}

export async function submitLeadForm(data: LeadFormData) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: 'ak@solvetude.com',
      subject: `RIWAA Walkthrough Request: ${data.name}`,
      html: `
        <div style="font-family: 'Jost', Helvetica, Arial, sans-serif; background-color: #FCFBF8; padding: 40px 20px; color: #14181F;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid rgba(20, 24, 31, 0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.04);">
            
            <!-- Header -->
            <div style="background-color: #14181F; padding: 40px 40px; text-align: center;">
              <h1 style="color: #FCFBF8; margin: 0; font-size: 24px; font-weight: 500; letter-spacing: 4px;">RIWAA</h1>
              <p style="color: #9C7A3C; margin: 8px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 3px;">Walkthrough Request</p>
            </div>

            <!-- Body -->
            <div style="padding: 40px;">
              <p style="margin: 0 0 32px 0; font-size: 15px; color: #565C6B; line-height: 1.6;">
                A new lead has been received for RIWAA. Their contact details and objectives are enclosed below.
              </p>

              <!-- Details -->
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 16px 0; border-bottom: 1px solid rgba(20, 24, 31, 0.05);">
                    <span style="display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #9C7A3C; margin-bottom: 6px;">Prospect Name</span>
                    <span style="font-size: 16px; font-weight: 500; color: #14181F;">${data.name}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 0; border-bottom: 1px solid rgba(20, 24, 31, 0.05);">
                    <span style="display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #9C7A3C; margin-bottom: 6px;">Email Address</span>
                    <a href="mailto:${data.email}" style="font-size: 16px; font-weight: 500; color: #14181F; text-decoration: none;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 0; border-bottom: 1px solid rgba(20, 24, 31, 0.05);">
                    <span style="display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #9C7A3C; margin-bottom: 6px;">Phone Number</span>
                    <a href="tel:${data.countryCode}${data.phone}" style="font-size: 16px; font-weight: 500; color: #14181F; text-decoration: none;">${data.countryCode} ${data.phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 0 0 0;">
                    <span style="display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #9C7A3C; margin-bottom: 12px;">Client Objective / Note</span>
                    <div style="background-color: #FCFBF8; padding: 20px; border-radius: 12px; border-left: 3px solid #14181F;">
                      <p style="margin: 0; font-size: 14px; color: #565C6B; line-height: 1.6;">
                        ${data.note ? data.note.replace(/\n/g, '<br/>') : "<i>No additional context provided.</i>"}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Footer -->
            <div style="background-color: #FCFBF8; padding: 24px 40px; text-align: center; border-top: 1px solid rgba(20, 24, 31, 0.05);">
              <p style="margin: 0; font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #565C6B;">
                &copy; Riwaa - by Solvetude | ${new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Failed to send lead email:", error);
    return { success: false, message: "Failed to send request." };
  }
}