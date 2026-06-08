'use client';
import { Loading } from '@umami/react-zen';
import Script from 'next/script';
import { useEffect } from 'react';
import { MobileNav } from '@/app/(main)/MobileNav';
import { SideNav } from '@/app/(main)/SideNav';
import { TopNav } from '@/app/(main)/TopNav';
import { useConfig, useLoginQuery, useNavigation, useTeamQuery } from '@/components/hooks';
import { LAST_TEAM_CONFIG } from '@/lib/constants';
import { removeItem, setItem } from '@/lib/storage';
import styles from './Shell.module.css';
import { UpdateNotice } from './UpdateNotice';

export function App({ children }) {
  const { user, isLoading, error } = useLoginQuery();
  const config = useConfig();
  const { pathname, router, teamId } = useNavigation();
  const { isLoading: isTeamLoading, error: teamError } = useTeamQuery(teamId);

  useEffect(() => {
    if (teamId) {
      setItem(LAST_TEAM_CONFIG, teamId);
    } else {
      removeItem(LAST_TEAM_CONFIG);
    }
  }, [teamId]);

  useEffect(() => {
    if (teamId && teamError) {
      removeItem(LAST_TEAM_CONFIG);
      router.replace('/');
    }
  }, [teamId, teamError, router]);

  if (isLoading || !config || (teamId && isTeamLoading)) {
    return <Loading placement="absolute" />;
  }

  if (error) {
    window.location.href = config.cloudMode
      ? `${process.env.cloudUrl}/login`
      : `${process.env.basePath || ''}/login`;
    return null;
  }

  if (!user || !config) {
    return null;
  }

  if (teamId && teamError) {
    return null;
  }

  return (
    <div className={styles.shell}>
      <div className={styles.mobileBar}>
        <MobileNav />
      </div>
      <aside className={styles.sidebarSlot}>
        <SideNav />
      </aside>
      <main className={styles.main}>
        <TopNav />
        <div className={styles.content}>{children}</div>
      </main>
      <UpdateNotice user={user} config={config} />
      {process.env.NODE_ENV === 'production' && !pathname.includes('/share/') && (
        <Script src={`${process.env.basePath || ''}/telemetry.js`} />
      )}
      {process.env.selfTrack && (
        <Script
          async
          data-website-id={process.env.selfTrack}
          src={`${process.env.basePath || ''}/script.js`}
          data-cache="true"
          data-performance="true"
        />
      )}
      {process.env.selfRecord && (
        <Script
          async
          data-website-id={process.env.selfRecord}
          data-sample-rate="1"
          src={`${process.env.basePath || ''}/recorder.js`}
        />
      )}
    </div>
  );
}
