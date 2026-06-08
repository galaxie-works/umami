'use client';

import { Loading } from '@umami/react-zen';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLoginQuery } from '@/components/hooks';
import { LoginForm } from './LoginForm';
import styles from './CosmolyticsAuth.module.css';

export function LoginPage() {
  const { user, isLoading } = useLoginQuery();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user]);

  if (user || isLoading) {
    return <Loading />;
  }

  return (
    <main className={styles.shell}>
      <section className={styles.panel}>
        <div className={styles.brand}>
          <img
            alt="Cosmolytics"
            className={styles.logoMark}
            src="/brand/cosmolytics-logo-dark.webp"
          />
          <h1 className={styles.brandName}>Cosmolytics</h1>
          <p className={styles.brandCopy}>
            Analytics, replay and growth intelligence for teams that need clear answers fast.
          </p>
        </div>
        <LoginForm />
      </section>
      <section className={styles.art} aria-hidden="true">
        <div className={styles.artText}>Know what changed, who moved, and where to go next.</div>
      </section>
    </main>
  );
}
