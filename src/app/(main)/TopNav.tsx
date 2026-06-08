'use client';
import { Icon, Row } from '@umami/react-zen';
import { useNavigation } from '@/components/hooks';
import { Slash } from '@/components/icons';
import { BoardSelect } from '@/components/input/BoardSelect';
import { LinkSelect } from '@/components/input/LinkSelect';
import { PixelSelect } from '@/components/input/PixelSelect';
import { WebsiteSelect } from '@/components/input/WebsiteSelect';
import styles from './Shell.module.css';

export function TopNav() {
  const { websiteId, linkId, pixelId, boardId, teamId, router, renderUrl } = useNavigation();
  const hasEntityContext = websiteId || linkId || pixelId || boardId;

  const handleWebsiteChange = (value: string) => {
    router.push(renderUrl(`/websites/${value}`, false));
  };

  const handleLinkChange = (value: string) => {
    router.push(renderUrl(`/links/${value}`, false));
  };

  const handlePixelChange = (value: string) => {
    router.push(renderUrl(`/pixels/${value}`, false));
  };

  const handleBoardChange = (value: string) => {
    router.push(renderUrl(`/boards/${value}`, false));
  };

  if (!hasEntityContext) {
    return null;
  }

  return (
    <div className={styles.contextBar}>
      <Row alignItems="center">
        <Icon size="sm" color="muted" style={{ opacity: 0.7, marginRight: 8 }}>
          <Slash />
        </Icon>
        {websiteId && (
          <WebsiteSelect
            websiteId={websiteId}
            teamId={teamId}
            onChange={handleWebsiteChange}
            buttonProps={{
              variant: 'quiet',
              style: { minHeight: 40, minWidth: 220, maxWidth: 260 },
            }}
          />
        )}
        {linkId && (
          <LinkSelect
            linkId={linkId}
            teamId={teamId}
            onChange={handleLinkChange}
            buttonProps={{
              variant: 'quiet',
              style: { minHeight: 40, minWidth: 220, maxWidth: 260 },
            }}
          />
        )}
        {pixelId && (
          <PixelSelect
            pixelId={pixelId}
            teamId={teamId}
            onChange={handlePixelChange}
            buttonProps={{
              variant: 'quiet',
              style: { minHeight: 40, minWidth: 220, maxWidth: 260 },
            }}
          />
        )}
        {boardId && (
          <BoardSelect
            boardId={boardId}
            teamId={teamId}
            onChange={handleBoardChange}
            buttonProps={{
              variant: 'quiet',
              style: { minHeight: 40, minWidth: 220, maxWidth: 260 },
            }}
          />
        )}
      </Row>
    </div>
  );
}
