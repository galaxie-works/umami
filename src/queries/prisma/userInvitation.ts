import prisma from '@/lib/prisma';
import type { QueryFilters } from '@/lib/types';

const client = prisma.client as any;

export function getInvitations(filters: QueryFilters = {}) {
  const { search } = filters;

  const where: Record<string, any> = {
    ...prisma.getSearchParameters(search, [{ email: 'contains' }]),
  };

  return prisma.pagedQuery(
    'userInvitation',
    {
      where,
      select: {
        id: true,
        email: true,
        role: true,
        sentAt: true,
        expiresAt: true,
        acceptedAt: true,
        revokedAt: true,
        createdAt: true,
        updatedAt: true,
        invitedBy: {
          select: {
            id: true,
            username: true,
          },
        },
        acceptedUser: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    },
    {
      orderBy: 'createdAt',
      sortDescending: true,
      ...filters,
    },
  );
}

export function getInvitation(invitationId: string) {
  return client.userInvitation.findUnique({
    where: {
      id: invitationId,
    },
  });
}

export function getInvitationByTokenHash(tokenHash: string) {
  return client.userInvitation.findUnique({
    where: {
      tokenHash,
    },
  });
}

export function createInvitation(data: Record<string, any>) {
  return client.userInvitation.create({
    data,
    select: {
      id: true,
      email: true,
      role: true,
      sentAt: true,
      expiresAt: true,
      acceptedAt: true,
      revokedAt: true,
      createdAt: true,
    },
  });
}

export function updateInvitation(invitationId: string, data: Record<string, any>) {
  return client.userInvitation.update({
    where: {
      id: invitationId,
    },
    data,
  });
}

export function revokeInvitation(invitationId: string) {
  return updateInvitation(invitationId, { revokedAt: new Date() });
}

export function acceptInvitation(invitationId: string, acceptedUserId: string) {
  return client.userInvitation.updateMany({
    where: {
      id: invitationId,
      acceptedAt: null,
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    data: {
      acceptedAt: new Date(),
      acceptedUserId,
    },
  });
}
