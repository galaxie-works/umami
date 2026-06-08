import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useMessages, useTeam, useUpdateQuery } from '@/components/hooks';
import { RefreshCw } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getRandomChars } from '@/lib/generate';
import styles from './TeamEditForm.module.css';

const generateId = () => `team_${getRandomChars(16)}`;

export function TeamEditForm({
  teamId,
  allowEdit,
  showAccessCode,
  onSave,
}: {
  teamId: string;
  allowEdit?: boolean;
  showAccessCode?: boolean;
  onSave?: () => void;
}) {
  const team = useTeam();
  const { t, labels, messages, getErrorMessage } = useMessages();
  const initialValues = useMemo(
    () => ({
      accessCode: team?.accessCode || '',
      id: team?.id || teamId,
      name: team?.name || '',
    }),
    [team?.accessCode, team?.id, team?.name, teamId],
  );
  const [name, setName] = useState(initialValues.name);
  const [accessCode, setAccessCode] = useState(initialValues.accessCode);

  useEffect(() => {
    setName(initialValues.name);
    setAccessCode(initialValues.accessCode);
  }, [initialValues.accessCode, initialValues.name]);

  const { mutateAsync, error, isPending, touch, toast } = useUpdateQuery(`/teams/${teamId}`);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await mutateAsync(
      {
        ...team,
        accessCode,
        name,
      },
      {
        onSuccess: async () => {
          toast(t(messages.saved));
          touch('teams');
          touch(`teams:${teamId}`);
          onSave?.();
        },
      },
    );
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="team-name">{t(labels.name)}</Label>
        <Input
          id="team-name"
          onChange={event => setName(event.currentTarget.value)}
          readOnly={!allowEdit}
          required
          value={name}
        />
      </div>

      <details className={styles.advanced}>
        <summary className={styles.summary}>Advanced</summary>
        <div className={styles.advancedBody}>
          <div className="grid gap-2">
            <Label htmlFor="team-id">{t(labels.teamId)}</Label>
            <Input id="team-id" readOnly value={initialValues.id} />
          </div>
          {showAccessCode && (
            <div className="grid gap-2">
              <Label htmlFor="team-access-code">{t(labels.accessCode)}</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input className="flex-1" id="team-access-code" readOnly value={accessCode} />
                {allowEdit && (
                  <Button
                    onClick={() => setAccessCode(generateId())}
                    type="button"
                    variant="outline"
                  >
                    <RefreshCw className="size-4" />
                    {t(labels.regenerate)}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </details>

      {getErrorMessage(error) && (
        <p className="text-sm text-destructive">{getErrorMessage(error)}</p>
      )}

      {allowEdit && (
        <div className="flex justify-end">
          <Button disabled={isPending} type="submit">
            {t(labels.save)}
          </Button>
        </div>
      )}
    </form>
  );
}
