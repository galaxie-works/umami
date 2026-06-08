import { z } from 'zod';
import { createLoginSession } from '@/lib/auth-session';
import { hashAuthToken, normalizeLoginIdentifier } from '@/lib/auth-tokens';
import { uuid } from '@/lib/crypto';
import { hashPassword } from '@/lib/password';
import { parseRequest } from '@/lib/request';
import { badRequest, json, unauthorized } from '@/lib/response';
import {
  acceptInvitation,
  createUser,
  getInvitationByTokenHash,
  getUserByUsername,
} from '@/queries/prisma';

export async function POST(request: Request) {
  const schema = z.object({
    token: z.string().min(16),
    password: z.string().min(8).max(255),
  });

  const { body, error } = await parseRequest(request, schema, { skipAuth: true });

  if (error) {
    return error();
  }

  const invitation = await getInvitationByTokenHash(hashAuthToken(body.token));

  if (
    !invitation ||
    invitation.acceptedAt ||
    invitation.revokedAt ||
    invitation.expiresAt < new Date()
  ) {
    return unauthorized({ code: 'invalid-invitation' });
  }

  const username = normalizeLoginIdentifier(invitation.email);
  let user: any = await getUserByUsername(username);

  if (!user) {
    user = await createUser({
      id: uuid(),
      username,
      password: hashPassword(body.password),
      role: invitation.role as any,
    });
  }

  const accepted = await acceptInvitation(invitation.id, user.id);

  if (accepted.count !== 1) {
    return badRequest({ message: 'Invitation has already been used.' });
  }

  return json(await createLoginSession(user));
}
