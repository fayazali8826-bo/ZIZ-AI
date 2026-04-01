import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail(options: EmailOptions) {
  try {
    const result = await resend.emails.send({
      from: options.from || process.env.EMAIL_FROM || 'noreply@ziz.app',
      to: options.to,
      subject: options.subject,
      html: options.html,
    })
    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}

export function generateVerificationEmailHtml(code: string, name?: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Email - Ziz</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .code { font-size: 32px; font-weight: bold; color: #2e7dff; text-align: center; margin: 30px 0; letter-spacing: 4px; }
          .footer { margin-top: 40px; font-size: 14px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Ziz! 🎉</h1>
            <p>Hi${name ? ` ${name}` : ''}, please verify your email address to complete your registration.</p>
          </div>

          <div class="code">${code}</div>

          <p>Enter this verification code on the registration page to activate your account.</p>
          <p>If you didn't create an account with Ziz, please ignore this email.</p>

          <div class="footer">
            <p>This verification code will expire in 10 minutes.</p>
            <p>© 2024 Ziz. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function generatePasswordResetEmailHtml(resetUrl: string, name?: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password - Ziz</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #2e7dff; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; }
          .footer { margin-top: 40px; font-size: 14px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
            <p>Hi${name ? ` ${name}` : ''}, we received a request to reset your password for your Ziz account.</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>

          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #2e7dff;">${resetUrl}</p>

          <p>This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.</p>

          <div class="footer">
            <p>© 2024 Ziz. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}