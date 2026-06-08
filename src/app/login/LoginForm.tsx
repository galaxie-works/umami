'use client';

import { useTheme } from '@umami/react-zen';
import { KeyRound, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { useApi, useLocale } from '@/components/hooks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { setClientAuthToken } from '@/lib/client';
import { setUser } from '@/store/app';
import styles from './CosmolyticsAuth.module.css';

type LoginMode = 'password' | 'magic';

export function LoginForm() {
  const router = useRouter();
  const { post, useMutation } = useApi();
  const { locale } = useLocale();
  const { theme } = useTheme();
  const copy = getLoginCopy(locale);
  const [mode, setMode] = useState<LoginMode>('magic');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');

  const passwordLogin = useMutation({
    mutationFn: (data: Record<string, any>) => post('/auth/login', data),
    onSuccess: data => {
      setClientAuthToken(data.token);
      setUser(data.user);
      router.push('/');
    },
  });

  const magicLink = useMutation({
    mutationFn: (data: Record<string, any>) => post('/auth/magic-link/request', data),
    onSuccess: data => {
      setNotice(data.emailConfigured ? copy.magicSent : copy.magicNotConfigured);
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setNotice('');

    if (mode === 'password') {
      passwordLogin.mutate({ username, password });
      return;
    }

    magicLink.mutate({ username });
  };

  const error = passwordLogin.error || magicLink.error;
  const isPending = passwordLogin.isPending || magicLink.isPending;

  return (
    <Card className={styles.card}>
      <div className={styles.brand}>
        <img
          alt="Cosmolytics"
          className={styles.logoMark}
          src={
            theme === 'dark'
              ? '/brand/cosmolytics-logo-dark.webp'
              : '/brand/cosmolytics-logo-light.webp'
          }
        />
        <p className={styles.brandCopy}>{copy.authorizedOnly}</p>
        <p className={styles.securityCopy}>{copy.unauthorized}</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>
            {mode === 'magic' ? copy.email : copy.emailOrUsername}
          </span>
          <Input
            autoComplete="username"
            className={styles.input}
            data-test="input-username"
            onChange={event => setUsername(event.currentTarget.value)}
            required
            value={username}
          />
        </label>

        {mode === 'password' && (
          <label className={styles.field}>
            <span className={styles.label}>{copy.password}</span>
            <Input
              autoComplete="current-password"
              className={styles.input}
              data-test="input-password"
              onChange={event => setPassword(event.currentTarget.value)}
              required
              type="password"
              value={password}
            />
          </label>
        )}

        {notice && <div className={styles.message}>{notice}</div>}
        {error && <div className={`${styles.message} ${styles.error}`}>{error.message}</div>}

        <Button className={styles.button} data-test="button-submit" disabled={isPending}>
          {mode === 'password' ? <KeyRound /> : <Mail />}
          {mode === 'password' ? copy.logIn : copy.getMagicLink}
        </Button>

        <Button
          className={styles.fallbackButton}
          onClick={() => {
            setNotice('');
            setMode(mode === 'magic' ? 'password' : 'magic');
          }}
          type="button"
          variant="ghost"
        >
          {mode === 'magic' ? copy.usePassword : copy.useMagicLink}
        </Button>
      </form>
    </Card>
  );
}

function getLoginCopy(locale: string) {
  if (locale === 'pt-BR' || locale === 'pt-PT') {
    return {
      authorizedOnly: 'Esta \u00e1rea administrativa \u00e9 exclusiva para pessoas autorizadas.',
      unauthorized:
        'Tentativas de acesso n\u00e3o autorizadas ser\u00e3o ejetadas para o espa\u00e7o profundo.',
      email: 'E-mail',
      emailOrUsername: 'E-mail ou usu\u00e1rio',
      password: 'Senha',
      logIn: 'Entrar',
      getMagicLink: 'Receber link m\u00e1gico de login',
      usePassword: 'Usar senha',
      useMagicLink: 'Usar magic link',
      magicSent: 'Se esta conta existir, um link seguro de login foi enviado.',
      magicNotConfigured: 'O envio de magic link ainda n\u00e3o est\u00e1 configurado.',
    };
  }

  if (locale.startsWith('es')) {
    return {
      authorizedOnly: 'Esta \u00e1rea administrativa es solo para personal autorizado.',
      unauthorized:
        'Los intentos de acceso no autorizado ser\u00e1n expulsados al espacio profundo.',
      email: 'E-mail',
      emailOrUsername: 'E-mail o usuario',
      password: 'Contrase\u00f1a',
      logIn: 'Iniciar sesi\u00f3n',
      getMagicLink: 'Recibir enlace m\u00e1gico de acceso',
      usePassword: 'Usar contrase\u00f1a',
      useMagicLink: 'Usar enlace m\u00e1gico',
      magicSent: 'Si esta cuenta existe, se envi\u00f3 un enlace seguro de acceso.',
      magicNotConfigured:
        'El env\u00edo de enlaces m\u00e1gicos a\u00fan no est\u00e1 configurado.',
    };
  }

  return {
    authorizedOnly: 'This admin area is for authorized personnel only.',
    unauthorized: 'Unauthorized access attempts will be ejected into deep space.',
    email: 'E-mail',
    emailOrUsername: 'Email or username',
    password: 'Password',
    logIn: 'Log in',
    getMagicLink: 'Get a magic login link',
    usePassword: 'Use password instead',
    useMagicLink: 'Use magic link instead',
    magicSent: 'If this account exists, a secure login link is on its way.',
    magicNotConfigured: 'Magic link email delivery is not configured yet.',
  };
}
