import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  try {
    // Create a test account if we're in development mode
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    let transporter;
    
    if (isDevelopment) {
      // Use Ethereal for testing in development
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } else {
      // Use a real email service in production
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        secure: process.env.EMAIL_SERVER_PORT === '465',
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });
    }

    const info = await transporter.sendMail({
      from: `"SiyoMart Support" <${process.env.EMAIL_FROM || 'support@siyomart.com'}>`,
      to,
      subject,
      html,
    });

    if (isDevelopment) {
      // Log the Ethereal URL where we can preview the email in development
      console.log(`Email preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

// Email templates
export function getInquiryResponseEmailTemplate(
  userName: string,
  inquiry: string,
  response: string,
  inquiryId: string
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8b156; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">SiyoMart Support</h1>
      </div>
      
      <div style="padding: 20px; border: 1px solid #e5e5e5; border-top: none;">
        <p>Hello ${userName},</p>
        
        <p>Thank you for contacting SiyoMart. We have responded to your inquiry:</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #f8b156;">
          <p style="margin-top: 0;"><strong>Your inquiry:</strong></p>
          <p style="margin-bottom: 0;">${inquiry}</p>
        </div>
        
        <div style="background-color: #f0f7ff; padding: 15px; margin: 15px 0; border-left: 4px solid #3b82f6;">
          <p style="margin-top: 0;"><strong>Our response:</strong></p>
          <p style="margin-bottom: 0;">${response}</p>
        </div>
        
        <p>If you need further assistance, you can reply directly to this email or view your inquiry at: <a href="${process.env.NEXT_PUBLIC_APP_URL}/inquiries/${inquiryId}" style="color: #d97706;">View Inquiry</a></p>
        
        <p>Thank you for choosing SiyoMart.</p>
        
        <p>Best regards,<br>
        SiyoMart Support Team</p>
      </div>
      
      <div style="padding: 10px; text-align: center; font-size: 12px; color: #666;">
        <p>© ${new Date().getFullYear()} SiyoMart. All rights reserved.</p>
      </div>
    </div>
  `;
}
