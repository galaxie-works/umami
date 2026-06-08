'use client';
import { Column } from '@umami/react-zen';
import { Building2, ShieldCheck, UserPlus, Users } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { useMessages } from '@/components/hooks';
import { UserAddButton } from './UserAddButton';
import { UsersDataTable } from './UsersDataTable';
import styles from './UsersPage.module.css';

export function UsersPage() {
  const { t, labels } = useMessages();

  const handleSave = () => {};

  return (
    <Column gap="6" margin="2">
      <PageHeader title={t(labels.users)}>
        <UserAddButton onSave={handleSave} />
      </PageHeader>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.kicker}>
            <ShieldCheck />
            Access management
          </div>
          <h1>Users, teams, and invitations</h1>
          <p>Create a team first, then manage its members and website access from the team page.</p>
        </div>
        <div className={styles.quickLinks} aria-label="Access sections">
          <Link className={styles.quickLink} href="/admin/users">
            <Users />
            <span>Users</span>
          </Link>
          <Link className={styles.quickLink} href="/admin/teams">
            <Building2 />
            <span>Teams</span>
          </Link>
          <a className={styles.quickLink} href="#invite-user">
            <UserPlus />
            <span>Invite</span>
          </a>
        </div>
      </section>

      <div className={styles.layout}>
        <section className={styles.usersPanel}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Active users</h2>
              <p>Accounts that can sign in to this Umami workspace.</p>
            </div>
            <Link className={styles.teamLink} href="/admin/teams">
              <Building2 />
              Manage teams
            </Link>
          </div>
          <Panel>
            <UsersDataTable />
          </Panel>
        </section>
      </div>
    </Column>
  );
}
