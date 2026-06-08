import { saveAuth } from '@/lib/auth';
import { ROLES } from '@/lib/constants';
import { secret } from '@/lib/crypto';
import { createSecureToken } from '@/lib/jwt';
import redis from '@/lib/redis';
import { getAllUserTeams } from '@/queries/prisma';

export async function createLoginSession(user: {
  id: string;
  username: string;
  role: string;
  createdAt?: Date | string | null;
}) {
  const { id, username, role, createdAt } = user;
  const token = redis.enabled
    ? await saveAuth({ userId: id, role })
    : createSecureToken({ userId: id, role }, secret());
  const teams = await getAllUserTeams(id);

  return {
    token,
    user: {
      id,
      username,
      role,
      createdAt,
      isAdmin: role === ROLES.admin,
      teams,
    },
  };
}
