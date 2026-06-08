'use client';

import { useState } from 'react';
import { useMessages } from '@/components/hooks/useMessages';
import { useModified } from '@/components/hooks/useModified';
import { Plus } from '@/components/icons';
import { Button, Dialog } from '@/components/ui';
import { WebsiteAddForm } from './WebsiteAddForm';

export function WebsiteAddButton({ teamId, onSave }: { teamId: string; onSave?: () => void }) {
  const { t, labels } = useMessages();
  const { touch } = useModified();
  const [open, setOpen] = useState(false);

  const handleSave = async () => {
    touch('websites');
    onSave?.();
  };

  return (
    <>
      <Button icon={<Plus />} onClick={() => setOpen(true)} variant="primary">
        {t(labels.addWebsite)}
      </Button>
      <Dialog
        description={t(labels.websites)}
        onOpenChange={setOpen}
        open={open}
        title={t(labels.addWebsite)}
      >
        <WebsiteAddForm onClose={() => setOpen(false)} onSave={handleSave} teamId={teamId} />
      </Dialog>
    </>
  );
}
