import nodemailer from 'nodemailer';

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (
    !user ||
    !pass ||
    user === 'your-gmail@gmail.com' ||
    pass === 'your-16-char-app-password'
  ) {
    throw new Error('EMAIL_NOT_CONFIGURED');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"TodoFlow" <${user}>`,
    to,
    subject: 'Reset your TodoFlow password',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#1a1d23;color:#e6edf3;border-radius:12px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px">
          <div style="width:32px;height:32px;background:#4f8ef7;border-radius:8px;display:flex;align-items:center;justify-content:center">
            <span style="color:#fff;font-size:18px;font-weight:700">✓</span>
          </div>
          <span style="font-size:18px;font-weight:700;color:#e6edf3">TodoFlow</span>
        </div>
        <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#e6edf3">Reset your password</h2>
        <p style="margin:0 0 24px;color:#9ca3af;font-size:14px;line-height:1.6">
          Click the button below to reset your TodoFlow password.<br/>
          This link expires in <strong style="color:#e6edf3">1 hour</strong>.
        </p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:12px 28px;background:#4f8ef7;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
          Reset Password
        </a>
        <p style="margin-top:28px;color:#6b7280;font-size:12px">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
