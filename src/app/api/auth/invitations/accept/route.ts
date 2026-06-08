import { z } from 'zod';
import { createLoginSession } from '@/lib/auth-session';
import { hashAuthToken, normalizeLoginIdentifier } from '@/lib/auth-tokens';
import { uuid } from '@/lib/crypto';
import { hashPassword } from '@/lib/password';
import { parseRequest } from '@/lib/request';
import { badRequest, json, unauthorized } from '@/lib/response';
import {
  acceptInvitation,
  createTeamUser,
  createUser,
  getInvitationByTokenHash,
  getTeamUser,
  getUserByUsername,
} from '@/queries/prisma';
import { ROLES } from '@/lib/constants';

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

  if (invitation.teamId && !(await getTeamUser(invitation.teamId, user.id))) {
    await createTeamUser(
      user.id,
      invitation.teamId,
      invitation.teamRole || ROLES.teamMember,
      getInvitationWebsiteIds(invitation.websiteIds),
    );
  }

  const accepted = await acceptInvitation(invitation.id, user.id);

  if (accepted.count !== 1) {
    return badRequest({ message: 'Invitation has already been used.' });
  }

  return json(await createLoginSession(user));
}

function getInvitationWebsiteIds(value: unknown) {
  return Array.isArray(value) && value.every(item => typeof item === 'string') ? value : null;
}
