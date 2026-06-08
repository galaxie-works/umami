'use client';

import type { FormEvent } from 'react';
import { useUpdateQuery } from '@/components/hooks/queries/useUpdateQuery';
import { useMessages } from '@/components/hooks/useMessages';
import { Button, Field, Input } from '@/components/ui';
import { DOMAIN_REGEX } from '@/lib/constants';
import styles from './WebsitesPage.module.css';

export function WebsiteAddForm({
  teamId,
  onSave,
  onClose,
}: {
  teamId?: string;
  onSave?: () => void;
  onClose?: () => void;
}) {
  const { t, labels, messages } = useMessages();
  const { mutateAsync, error, isPending, toast } = useUpdateQuery('/websites', { teamId });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') || '').trim();
    const domain = String(formData.get('domain') || '').trim();

    await mutateAsync(
      { name, domain },
      {
        onSuccess: async () => {
          toast(t(messages.saved));
          onSave?.();
          onClose?.();
        },
      },
    );
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Field label={t(labels.name)}>
        <Input autoComplete="off" data-test="input-name" name="name" required />
      </Field>

      <Field description={t(messages.invalidDomain)} label={t(labels.domain)}>
        <Input
          autoComplete="off"
          data-test="input-domain"
          name="domain"
          pattern={DOMAIN_REGEX.source}
          required
        />
      </Field>

      {error ? <div className={styles.formError}>{error.message}</div> : null}

      <div className={styles.formActions}>
        {onClose ? (
          <Button disabled={isPending} onClick={onClose} variant="secondary">
            {t(labels.cancel)}
          </Button>
        ) : null}
        <Button data-test="button-submit" disabled={isPending} type="submit" variant="primary">
          {t(labels.save)}
        </Button>
      </div>
    </form>
  );
}
