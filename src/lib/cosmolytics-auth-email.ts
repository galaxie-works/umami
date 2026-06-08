type AuthEmailKind = 'invitation' | 'magic-link';

export interface AuthEmailInput {
  kind: AuthEmailKind;
  to: string;
  url: string;
  subject: string;
  text: string;
  html: string;
}

export function isAuthEmailConfigured() {
  return Boolean(process.env.AUTH_EMAIL_WEBHOOK_URL);
}

export async function sendAuthEmail(input: AuthEmailInput) {
  const webhookUrl = process.env.AUTH_EMAIL_WEBHOOK_URL;

  if (!webhookUrl) {
    return { sent: false, reason: 'email_transport_not_configured' };
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.AUTH_EMAIL_WEBHOOK_TOKEN
        ? { Authorization: `Bearer ${process.env.AUTH_EMAIL_WEBHOOK_TOKEN}` }
        : {}),
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    return { sent: false, reason: 'email_transport_failed' };
  }

  return { sent: true };
}

export function renderInvitationEmail({ url }: { url: string }) {
  const subject = 'You are invited to Cosmolytics';
  const text = [
    'You have been invited to Cosmolytics.',
    '',
    'Use the secure link below to accept the invitation and finish your account setup.',
    '',
    url,
    '',
    'If you were not expecting this invitation, you can ignore this message.',
  ].join('\n');

  return {
    subject,
    text,
    html: renderSimpleEmail({
      title: 'You are invited to Cosmolytics',
      body: 'Use the secure link below to accept the invitation and finish your account setup.',
      buttonLabel: 'Accept invitation',
      url,
    }),
  };
}

export function renderMagicLinkEmail({ url }: { url: string }) {
  const subject = 'Your Cosmolytics magic link';
  const text = [
    'Use the secure link below to log in to Cosmolytics.',
    '',
    url,
    '',
    'This link expires shortly and can only be used once.',
  ].join('\n');

  return {
    subject,
    text,
    html: renderSimpleEmail({
      title: 'Your Cosmolytics magic link',
      body: 'Use the secure link below to log in to Cosmolytics. It expires shortly and can only be used once.',
      buttonLabel: 'Log in to Cosmolytics',
      url,
    }),
  };
}

function renderSimpleEmail({
  title,
  body,
  buttonLabel,
  url,
}: {
  title: string;
  body: string;
  buttonLabel: string;
  url: string;
}) {
  const safeTitle = escapeHtml(title);
  const safeBody = escapeHtml(body);
  const safeLabel = escapeHtml(buttonLabel);
  const safeUrl = escapeHtml(url);

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f6f7fb;color:#111827;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
      <div style="font-weight:800;font-size:22px;margin-bottom:24px;">Cosmolytics</div>
      <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:28px;">
        <h1 style="font-size:22px;line-height:1.25;margin:0 0 12px;">${safeTitle}</h1>
        <p style="font-size:14px;line-height:1.6;margin:0 0 24px;color:#4b5563;">${safeBody}</p>
        <a href="${safeUrl}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;padding:11px 16px;font-size:14px;font-weight:700;">${safeLabel}</a>
        <p style="font-size:12px;line-height:1.5;margin:24px 0 0;color:#6b7280;word-break:break-all;">${safeUrl}</p>
      </div>
    </div>
  </body>
</html>`;
}

function escapeHtml(value: string) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
