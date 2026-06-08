import { z } from 'zod';
import { createLoginSession } from '@/lib/auth-session';
import { hashAuthToken } from '@/lib/auth-tokens';
import { parseRequest } from '@/lib/request';
import { json, unauthorized } from '@/lib/response';
import { consumeMagicLink, getMagicLinkByTokenHash } from '@/queries/prisma';

export async function POST(request: Request) {
  const schema = z.object({
    token: z.string().min(16),
  });

  const { body, error } = await parseRequest(request, schema, { skipAuth: true });

  if (error) {
    return error();
  }

  const magicLink = await getMagicLinkByTokenHash(hashAuthToken(body.token));

  if (
    !magicLink ||
    magicLink.consumedAt ||
    magicLink.expiresAt < new Date() ||
    magicLink.user?.deletedAt
  ) {
    return unauthorized({ code: 'invalid-magic-link' });
  }

  const consumed = await consumeMagicLink(magicLink.id);

  if (consumed.count !== 1) {
    return unauthorized({ code: 'invalid-magic-link' });
  }

  return json(await createLoginSession(magicLink.user));
}
