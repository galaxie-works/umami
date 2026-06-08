import { AdminNav } from '@/app/(main)/admin/AdminNav';
import { SettingsNav } from '@/app/(main)/settings/SettingsNav';
import Link from '@/components/common/Link';
import { useGlobalState, useMessages, useNavigation, useWebsiteNavItems } from '@/components/hooks';
import {
  Globe,
  Grid2x2,
  LayoutDashboard,
  LinkIcon,
  PanelsLeftBottom,
  Users,
} from '@/components/icons';
import { BoardSelect } from '@/components/input/BoardSelect';
import { LinkSelect } from '@/components/input/LinkSelect';
import { PixelSelect } from '@/components/input/PixelSelect';
import { TeamsButton } from '@/components/input/TeamsButton';
import { UserButton } from '@/components/input/UserButton';
import { WebsiteSelect } from '@/components/input/WebsiteSelect';
import { Logo } from '@/components/svg';
import styles from './Shell.module.css';

export function SideNav() {
  const { t, labels } = useMessages();
  const { pathname, renderUrl, router, websiteId, linkId, pixelId, boardId, teamId } =
    useNavigation();
  const [isCollapsed] = useGlobalState('sidenav-collapsed', false);
  const { items: websiteNavItems, selectedKey } = useWebsiteNavItems(websiteId || '');
  const hasEntityContext = websiteId || linkId || pixelId || boardId;

  const links = [
    ...(!teamId
      ? [
          {
            id: 'dashboard',
            label: t(labels.dashboard),
            path: '/dashboard',
            icon: <PanelsLeftBottom />,
          },
        ]
      : []),
    {
      id: 'boards',
      label: t(labels.boards),
      path: '/boards',
      icon: <LayoutDashboard />,
    },
    {
      id: 'websites',
      label: t(labels.websites),
      path: '/websites',
      icon: <Globe />,
    },
    {
      id: 'links',
      label: t(labels.links),
      path: '/links',
      icon: <LinkIcon />,
    },
    {
      id: 'pixels',
      label: t(labels.pixels),
      path: '/pixels',
      icon: <Grid2x2 />,
    },
  ];

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

  return (
    <nav className={classNames(styles.sideNav, isCollapsed && styles.sideNavCollapsed)}>
      <div className={styles.contextArea}>
        {websiteId ? (
          <WebsiteSelect
            websiteId={websiteId}
            teamId={teamId}
            onChange={handleWebsiteChange}
            isCollapsed={isCollapsed}
            showDomain
            buttonProps={{
              variant: 'quiet',
              style: { minHeight: isCollapsed ? 44 : 58, width: '100%' },
            }}
            listProps={{
              style: { width: 320 },
            }}
          />
        ) : linkId ? (
          <LinkSelect
            linkId={linkId}
            teamId={teamId}
            onChange={handleLinkChange}
            isCollapsed={isCollapsed}
            buttonProps={{
              variant: 'quiet',
              style: { minHeight: isCollapsed ? 44 : 52, width: '100%' },
            }}
          />
        ) : pixelId ? (
          <PixelSelect
            pixelId={pixelId}
            teamId={teamId}
            onChange={handlePixelChange}
            isCollapsed={isCollapsed}
            buttonProps={{
              variant: 'quiet',
              style: { minHeight: isCollapsed ? 44 : 52, width: '100%' },
            }}
          />
        ) : boardId ? (
          <BoardSelect
            boardId={boardId}
            teamId={teamId}
            onChange={handleBoardChange}
            isCollapsed={isCollapsed}
            buttonProps={{
              variant: 'quiet',
              style: { minHeight: isCollapsed ? 44 : 52, width: '100%' },
            }}
          />
        ) : (
          <div className={styles.brandContext}>
            <Logo />
            {!isCollapsed && (
              <div className={styles.brandText}>
                <strong>Cosmolytics</strong>
                <span>Analytics workspace</span>
              </div>
            )}
          </div>
        )}
      </div>

      {!hasEntityContext && (
        <div className={styles.teamContext}>
          {isCollapsed ? (
            <div className={styles.collapsedContext}>
              <Users />
            </div>
          ) : (
            <TeamsButton />
          )}
        </div>
      )}

      <div className={styles.navScroll}>
        {websiteId ? (
          <div className={styles.websiteNav}>
            {websiteNavItems.map(({ label: sectionLabel, items: sectionItems }, sectionIndex) => (
              <div className={styles.navGroup} key={`${sectionLabel}${sectionIndex}`}>
                {!isCollapsed && <div className={styles.navLabel}>{sectionLabel}</div>}
                {sectionItems.map(({ id, path, label, icon }) => {
                  const isSelected = selectedKey === id;

                  return (
                    <Link
                      className={classNames(styles.navLink, isSelected && styles.navLinkActive)}
                      href={path}
                      key={id}
                      title={isCollapsed ? label : undefined}
                    >
                      <span className={styles.navIcon}>{icon}</span>
                      {!isCollapsed && <span>{label}</span>}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        ) : pathname.includes('/settings') ? (
          <div className={styles.subNavFrame}>
            <SettingsNav isCollapsed={isCollapsed} />
          </div>
        ) : pathname.includes('/admin') ? (
          <AdminNav isCollapsed={isCollapsed} />
        ) : (
          <div className={styles.navGroup}>
            {!isCollapsed && <div className={styles.navLabel}>Workspace</div>}
            {links.map(({ id, path, label, icon }) => {
              const isSelected = pathname.startsWith(renderUrl(path, false));

              return (
                <Link
                  className={classNames(styles.navLink, isSelected && styles.navLinkActive)}
                  href={renderUrl(path, false)}
                  key={id}
                  title={isCollapsed ? label : undefined}
                >
                  <span className={styles.navIcon}>{icon}</span>
                  {!isCollapsed && <span>{label}</span>}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.bottomArea}>
        <UserButton showText={!isCollapsed} />
      </div>
    </nav>
  );
}

function classNames(...names: Array<string | false | undefined>) {
  return names.filter(Boolean).join(' ');
}
