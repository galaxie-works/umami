import { z } from 'zod';
import { createOpaqueToken, hashAuthToken, normalizeLoginIdentifier } from '@/lib/auth-tokens';
import {
  isAuthEmailConfigured,
  renderMagicLinkEmail,
  sendAuthEmail,
} from '@/lib/cosmolytics-auth-email';
import { uuid } from '@/lib/crypto';
import { getAuthLinkBaseUrl } from '@/lib/get-base-url';
import { parseRequest } from '@/lib/request';
import { json } from '@/lib/response';
import { createMagicLink, getUserByUsername, markMagicLinkSent, pruneMagicLinks } from '@/queries/prisma';

const magicLinkMinutes = 15;

export async function POST(request: Request) {
  const schema = z.object({
    username: z.string().max(255),
  });

  const { body, error } = await parseRequest(request, schema, { skipAuth: true });

  if (error) {
    return error();
  }

  await pruneMagicLinks();

  const username = normalizeLoginIdentifier(body.username);
  const user = username ? await getUserByUsername(username) : null;

  if (user) {
    const deliveryToken = createOpaqueToken();
    const magicLink = await createMagicLink({
      id: uuid(),
      userId: user.id,
      tokenHash: hashAuthToken(deliveryToken),
      expiresAt: new Date(Date.now() + magicLinkMinutes * 60 * 1000),
    });

    const delivery = await sendMagicLinkEmail(user.username, deliveryToken);

    if (delivery.sent) {
      await markMagicLinkSent(magicLink.id);
    }
  }

  return json({
    ok: true,
    emailConfigured: isAuthEmailConfigured(),
  });
}

async function sendMagicLinkEmail(email: string, token: string) {
  const baseUrl = getAuthLinkBaseUrl();
  const url = new URL(`${process.env.basePath || ''}/magic-login`, baseUrl);
  url.searchParams.set('token', token);
  const emailBody = renderMagicLinkEmail({ url: url.toString() });

  return sendAuthEmail({
    kind: 'magic-link',
    to: email,
    url: url.toString(),
    ...emailBody,
  });
}
