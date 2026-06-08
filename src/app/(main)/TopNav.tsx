'use client';
import { useGlobalState, useMessages, useNavigation, useWebsiteNavItems } from '@/components/hooks';
import { PanelLeft } from '@/components/icons';
import styles from './Shell.module.css';

export function TopNav() {
  const { t, labels } = useMessages();
  const { pathname, websiteId, linkId, pixelId, boardId } = useNavigation();
  const [isCollapsed, setIsCollapsed] = useGlobalState('sidenav-collapsed', false);
  const { items, selectedKey } = useWebsiteNavItems(websiteId || '');
  const websiteItem = items.flatMap(({ items }) => items).find(({ id }) => id === selectedKey);
  const title = getTitle({
    pathname,
    websiteLabel: websiteItem?.label,
    linkLabel: linkId ? t(labels.links) : undefined,
    pixelLabel: pixelId ? t(labels.pixels) : undefined,
    boardLabel: boardId ? t(labels.boards) : undefined,
    dashboardLabel: t(labels.dashboard),
    websitesLabel: t(labels.websites),
    settingsLabel: t(labels.settings),
    adminLabel: t(labels.admin),
  });

  return (
    <div className={styles.topBar}>
      <button
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className={styles.collapseButton}
        onClick={() => setIsCollapsed(!isCollapsed)}
        type="button"
      >
        <PanelLeft />
      </button>
      <div className={styles.topTitle}>{title}</div>
    </div>
  );
}

function getTitle({
  pathname,
  websiteLabel,
  linkLabel,
  pixelLabel,
  boardLabel,
  dashboardLabel,
  websitesLabel,
  settingsLabel,
  adminLabel,
}: {
  pathname: string;
  websiteLabel?: string;
  linkLabel?: string;
  pixelLabel?: string;
  boardLabel?: string;
  dashboardLabel: string;
  websitesLabel: string;
  settingsLabel: string;
  adminLabel: string;
}) {
  if (websiteLabel) {
    return websiteLabel;
  }

  if (linkLabel) {
    return linkLabel;
  }

  if (pixelLabel) {
    return pixelLabel;
  }

  if (boardLabel) {
    return boardLabel;
  }

  if (pathname.includes('/admin')) {
    return adminLabel;
  }

  if (pathname.includes('/settings')) {
    return settingsLabel;
  }

  if (pathname.includes('/websites')) {
    return websitesLabel;
  }

  return dashboardLabel;
}
