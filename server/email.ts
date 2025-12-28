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

// Send welcome email when student signs up
export async function sendWelcomeEmail(to: string, firstName: string): Promise<boolean> {
  try {
    const { client, fromEmail } = await getResendClient();
    
    // Use Resend's onboarding domain - gmail.com is not allowed by Resend
    // Only use fromEmail if it's from a verified non-gmail domain
    const senderEmail = (fromEmail && !fromEmail.includes('@gmail.com')) 
      ? fromEmail 
      : 'INTRN <onboarding@resend.dev>';
    console.log(`Sending welcome email from: ${senderEmail} to: ${to}`);
    
    const result = await client.emails.send({
      from: senderEmail,
      to: [to],
      subject: 'Welcome to INTRN - Your Internship Journey Begins!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #7c3aed, #a855f7); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Welcome to INTRN!</h1>
            </div>
            <div class="content">
              <h2>Hi ${firstName || 'there'}!</h2>
              <p>Welcome to <strong>INTRN</strong> - the platform that connects high school students with amazing internship opportunities!</p>
              <p>Here's what you can do now:</p>
              <ul>
                <li>📋 <strong>Complete your profile</strong> - Add your skills, interests, and academic details</li>
                <li>🔍 <strong>Browse internships</strong> - Explore opportunities from various companies</li>
                <li>⭐ <strong>Save favorites</strong> - Bookmark internships you're interested in</li>
                <li>📨 <strong>Apply</strong> - Submit applications with your cover letter</li>
              </ul>
              <p>We're excited to help you kickstart your career journey!</p>
              <a href="https://internhub.replit.app/internships" class="button">Explore Internships</a>
            </div>
            <div class="footer">
              <p>© 2024 INTRN - Internships for High Schoolers</p>
              <p>This email was sent because you signed up on INTRN.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log(`Welcome email result:`, JSON.stringify(result));
    console.log(`Welcome email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

// Send application acceptance email with confirmation link
export async function sendApplicationAcceptedEmail(
  to: string, 
  firstName: string,
  internshipTitle: string,
  companyName: string,
  confirmationToken: string,
  baseUrl: string
): Promise<boolean> {
  try {
    const { client, fromEmail } = await getResendClient();
    const confirmationLink = `${baseUrl}/api/applications/confirm/${confirmationToken}`;
    
    // Use Resend's onboarding domain - gmail.com is not allowed by Resend
    const senderEmail = (fromEmail && !fromEmail.includes('@gmail.com')) 
      ? fromEmail 
      : 'INTRN <onboarding@resend.dev>';
    console.log(`Sending acceptance email from: ${senderEmail} to: ${to}`);
    
    const result = await client.emails.send({
      from: senderEmail,
      to: [to],
      subject: `🎉 Congratulations! Your Application Has Been Accepted - ${internshipTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #34d399); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
            .button { display: inline-block; background: #10b981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; margin-top: 20px; font-weight: bold; font-size: 16px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            .important { color: #dc2626; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Congratulations!</h1>
              <p>Your Application Has Been Accepted!</p>
            </div>
            <div class="content">
              <h2>Hi ${firstName || 'there'}!</h2>
              <p>We are thrilled to inform you that your application for the internship has been <strong>accepted</strong>!</p>
              
              <div class="highlight">
                <p><strong>📋 Position:</strong> ${internshipTitle}</p>
                <p><strong>🏢 Company:</strong> ${companyName}</p>
              </div>
              
              <p class="important">⚠️ Important: Please confirm your acceptance by clicking the button below:</p>
              
              <center>
                <a href="${confirmationLink}" class="button">✅ Confirm My Acceptance</a>
              </center>
              
              <p style="margin-top: 30px;">By confirming, you agree to participate in this internship opportunity. The company will be notified and will reach out to you with next steps.</p>
              
              <p>If you have any questions, feel free to reach out to us!</p>
              
              <p>Best of luck on your internship journey!</p>
              <p><strong>The INTRN Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2024 INTRN - Internships for High Schoolers</p>
              <p>This email was sent because you applied for an internship on INTRN.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log(`Application accepted email result:`, JSON.stringify(result));
    console.log(`Application accepted email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Failed to send application accepted email:', error);
    return false;
  }
}

// Send notification when student applies to an internship
export async function sendApplicationReceivedEmail(
  to: string, 
  firstName: string,
  internshipTitle: string,
  companyName: string
): Promise<boolean> {
  try {
    const { client, fromEmail } = await getResendClient();
    
    // Use Resend's onboarding domain - gmail.com is not allowed by Resend
    const senderEmail = (fromEmail && !fromEmail.includes('@gmail.com')) 
      ? fromEmail 
      : 'INTRN <onboarding@resend.dev>';
    
    await client.emails.send({
      from: senderEmail,
      to: [to],
      subject: `Application Received - ${internshipTitle} at ${companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #7c3aed, #a855f7); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { background: #f3e8ff; border-left: 4px solid #7c3aed; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📨 Application Received!</h1>
            </div>
            <div class="content">
              <h2>Hi ${firstName || 'there'}!</h2>
              <p>Thank you for applying! We've received your internship application.</p>
              
              <div class="highlight">
                <p><strong>📋 Position:</strong> ${internshipTitle}</p>
                <p><strong>🏢 Company:</strong> ${companyName}</p>
                <p><strong>📅 Status:</strong> Under Review</p>
              </div>
              
              <p>What happens next:</p>
              <ul>
                <li>The company will review your application</li>
                <li>You'll receive an email if you're selected</li>
                <li>You can track your application status on INTRN</li>
              </ul>
              
              <p>Good luck!</p>
              <p><strong>The INTRN Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2024 INTRN - Internships for High Schoolers</p>
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
