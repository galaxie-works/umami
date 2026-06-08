import { headers } from 'next/headers';
import { createOpaqueToken, hashAuthToken } from '@/lib/auth-tokens';
import { renderInvitationEmail, sendAuthEmail } from '@/lib/cosmolytics-auth-email';
import { getBaseUrl } from '@/lib/get-base-url';
import { parseRequest } from '@/lib/request';
import { badRequest, json, notFound, unauthorized } from '@/lib/response';
import { canCreateUser } from '@/permissions';
import { getInvitation, updateInvitation } from '@/queries/prisma';

const invitationTtlDays = 7;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ invitationId: string }> },
) {
  const { auth, error } = await parseRequest(request);

  if (error) {
    return error();
  }

  if (!(await canCreateUser(auth))) {
    return unauthorized();
  }

  const { invitationId } = await params;
  const invitation = await getInvitation(invitationId);

  if (!invitation) {
    return notFound();
  }

  if (invitation.acceptedAt) {
    return badRequest({ message: 'Invitation has already been accepted.' });
  }

  const deliveryToken = createOpaqueToken();
  const delivery = await sendInvitationEmail(invitation.email, deliveryToken);
  await updateInvitation(invitationId, {
    tokenHash: hashAuthToken(deliveryToken),
    expiresAt: new Date(Date.now() + invitationTtlDays * 24 * 60 * 60 * 1000),
    sentAt: delivery.sent ? new Date() : null,
    revokedAt: null,
  });

  return json({
    ok: true,
    emailDelivery: delivery.sent ? 'sent' : delivery.reason,
  });
}

async function sendInvitationEmail(email: string, token: string) {
  const headerStore = await headers();
  const baseUrl = getBaseUrl(headerStore);
  const url = new URL(`${process.env.basePath || ''}/invite`, baseUrl);
  url.searchParams.set('token', token);
  const emailBody = renderInvitationEmail({ url: url.toString() });

  return sendAuthEmail({
    kind: 'invitation',
    to: email,
    url: url.toString(),
    ...emailBody,
  });
}
