// Email utility using Resend integration
import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return { apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email };
}

async function getResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}

const BASE_STYLES = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background: #f4f4f5; }
  .wrapper { background: #f4f4f5; padding: 32px 16px; }
  .container { max-width: 560px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
  .header { background: #7c3aed; color: white; padding: 36px 32px; text-align: center; }
  .header h1 { margin: 0 0 6px; font-size: 24px; font-weight: 700; color: white; letter-spacing: -0.3px; }
  .header p { margin: 0; font-size: 15px; color: rgba(255,255,255,0.85); }
  .content { background: white; padding: 32px; }
  .content h2 { color: #111827; margin: 0 0 16px; font-size: 20px; font-weight: 600; }
  .content p { color: #374151; margin: 0 0 14px; font-size: 15px; }
  .highlight { background: #f5f3ff; border-left: 3px solid #7c3aed; border-radius: 0 8px 8px 0; padding: 16px 20px; margin: 20px 0; }
  .highlight p { margin: 0 0 8px; font-size: 15px; color: #374151; }
  .highlight p:last-child { margin: 0; }
  .highlight strong { color: #111827; }
  .btn-wrap { text-align: center; margin: 24px 0; }
  .button { display: inline-block; background: #7c3aed; color: white !important; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; }
  ul { color: #374151; padding-left: 20px; margin: 0 0 16px; }
  li { margin-bottom: 10px; font-size: 15px; }
  li strong { color: #111827; }
  .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
  .footer { background: #fafafa; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb; }
  .footer p { margin: 0 0 4px; font-size: 12px; color: #9ca3af; }
`;

// ─── 1. Welcome Email ────────────────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, firstName: string): Promise<boolean> {
  try {
    const { client } = await getResendClient();

    await client.emails.send({
      from: 'INTRN <team@intrn.xyz>',
      to: [to],
      subject: `You're in, ${firstName || 'there'}! 🎓 Start exploring internships`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>${BASE_STYLES}</style></head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <h1>Welcome to INTRN 🎓</h1>
                <p>Real internships for high school students</p>
              </div>
              <div class="content">
                <h2>Hey ${firstName || 'there'}, you're officially in!</h2>
                <p>You've just joined a platform built specifically for high schoolers like you — where you can get real work experience, build your CV, and actually impress future universities and employers.</p>
                <p>Here's how to get started:</p>
                <ul>
                  <li><strong>Browse internships</strong> — 9 hand-picked opportunities across marketing, research, design, and more</li>
                  <li><strong>Apply in minutes</strong> — just a cover letter, no CV needed</li>
                  <li><strong>Track your applications</strong> — see updates directly in your dashboard</li>
                </ul>
                <div class="btn-wrap">
                  <a href="https://intrn.xyz/search" class="button">Browse Internships →</a>
                </div>
                <hr class="divider" />
                <p style="font-size: 13px; color: #6b7280; margin: 0;">Questions? Just reply to this email — we're a small team and we actually read them.</p>
              </div>
              <div class="footer">
                <p>© 2025 INTRN — Internships for High Schoolers</p>
                <p>You're receiving this because you signed up at intrn.xyz</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log(`Welcome email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

// ─── 2. Application Received Email ──────────────────────────────────────────
export async function sendApplicationReceivedEmail(
  to: string,
  firstName: string,
  internshipTitle: string,
  companyName: string
): Promise<boolean> {
  try {
    const { client } = await getResendClient();

    await client.emails.send({
      from: 'INTRN <team@intrn.xyz>',
      to: [to],
      subject: `Got it! ✅ Your application to ${companyName} is under review`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>${BASE_STYLES}</style></head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <h1>Application Received 📨</h1>
                <p>You're one step closer to your first internship</p>
              </div>
              <div class="content">
                <h2>Nice work, ${firstName || 'there'}!</h2>
                <p>Your application has been submitted and is now under review. Here's what you applied for:</p>
                <div class="highlight">
                  <p><strong>📋 Role:</strong> ${internshipTitle}</p>
                  <p><strong>🏢 Company:</strong> ${companyName}</p>
                  <p><strong>📅 Status:</strong> Under Review</p>
                </div>
                <p>What happens next:</p>
                <ul>
                  <li>The INTRN team reviews your application first</li>
                  <li>If selected, the company will be introduced to you</li>
                  <li>You'll get an email the moment there's an update</li>
                </ul>
                <div class="btn-wrap">
                  <a href="https://intrn.xyz/dashboard" class="button">Track Your Application →</a>
                </div>
                <p style="font-size: 13px; color: #6b7280; margin: 0;">In the meantime, keep applying — students who apply to more internships have a much better shot.</p>
              </div>
              <div class="footer">
                <p>© 2025 INTRN — Internships for High Schoolers</p>
                <p>You're receiving this because you applied for an internship on intrn.xyz</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log(`Application received email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Failed to send application received email:', error);
    return false;
  }
}

// ─── 3. Application Accepted Email ──────────────────────────────────────────
export async function sendApplicationAcceptedEmail(
  to: string,
  firstName: string,
  internshipTitle: string,
  companyName: string,
  confirmationToken: string,
  baseUrl: string
): Promise<boolean> {
  try {
    const { client } = await getResendClient();
    const confirmationLink = `${baseUrl}/api/applications/confirm/${confirmationToken}`;

    await client.emails.send({
      from: 'INTRN <team@intrn.xyz>',
      to: [to],
      subject: `🎉 You've been accepted, ${firstName || 'there'}! One quick step left`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>${BASE_STYLES}
          .accepted-header { background: linear-gradient(135deg, #7c3aed, #9333ea); }
          .confirm-box { background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 10px; padding: 24px; text-align: center; margin: 24px 0; }
          .confirm-box p { color: #374151; margin: 0 0 16px; font-size: 15px; }
        </style></head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header accepted-header">
                <h1>🎉 You're Accepted!</h1>
                <p>Congratulations — your hard work paid off</p>
              </div>
              <div class="content">
                <h2>Amazing news, ${firstName || 'there'}!</h2>
                <p>Your application has been accepted. Here are the details:</p>
                <div class="highlight">
                  <p><strong>📋 Role:</strong> ${internshipTitle}</p>
                  <p><strong>🏢 Company:</strong> ${companyName}</p>
                </div>
                <div class="confirm-box">
                  <p>To lock in your spot, please confirm your acceptance below. <strong>You have 48 hours</strong> before this offer expires.</p>
                  <a href="${confirmationLink}" class="button">Confirm My Acceptance ✅</a>
                </div>
                <p>Once you confirm, the company will be notified and will reach out to you directly with next steps — expect to hear from them within a few days.</p>
                <p>You've earned this. Good luck! 🚀</p>
                <p><strong>The INTRN Team</strong></p>
                <hr class="divider" />
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">If the button doesn't work, copy and paste this link: <span style="color: #7c3aed;">${confirmationLink}</span></p>
              </div>
              <div class="footer">
                <p>© 2025 INTRN — Internships for High Schoolers</p>
                <p>You're receiving this because you applied for an internship on intrn.xyz</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log(`Application accepted email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Failed to send application accepted email:', error);
    return false;
  }
}
