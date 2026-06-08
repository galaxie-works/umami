import { AdminNav } from '@/app/(main)/admin/AdminNav';
import { SettingsNav } from '@/app/(main)/settings/SettingsNav';
import { WebsiteNav } from '@/app/(main)/websites/[websiteId]/WebsiteNav';
import Link from '@/components/common/Link';
import { useGlobalState, useMessages, useNavigation } from '@/components/hooks';
import {
  Globe,
  Grid2x2,
  LayoutDashboard,
  LinkIcon,
  PanelLeft,
  PanelsLeftBottom,
  Users,
} from '@/components/icons';
import { TeamsButton } from '@/components/input/TeamsButton';
import { UserButton } from '@/components/input/UserButton';
import { Logo } from '@/components/svg';
import styles from './Shell.module.css';

export function SideNav() {
  const { t, labels } = useMessages();
  const { pathname, renderUrl, websiteId, teamId } = useNavigation();
  const [isCollapsed, setIsCollapsed] = useGlobalState('sidenav-collapsed', false);

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

  return (
    <nav className={classNames(styles.sideNav, isCollapsed && styles.sideNavCollapsed)}>
      <div className={styles.brandRow}>
        {!isCollapsed && (
          <div className={styles.brand}>
            <Logo />
            <span>Cosmolytics</span>
          </div>
        )}
        <button
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={styles.collapseButton}
          onClick={() => setIsCollapsed(!isCollapsed)}
          type="button"
        >
          <PanelLeft />
        </button>
      </div>

      <div className={styles.contextArea}>
        {isCollapsed ? (
          <div className={styles.collapsedContext}>
            <Users />
          </div>
        ) : (
          <TeamsButton />
        )}
      </div>

      <div className={styles.navScroll}>
        {websiteId ? (
          <div className={styles.subNavFrame}>
            <WebsiteNav websiteId={websiteId} isCollapsed={isCollapsed} />
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
