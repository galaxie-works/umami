import Link from '@/components/common/Link';
import { useMessages, useNavigation } from '@/components/hooks';
import { ArrowLeft, Globe, User, Users } from '@/components/icons';
import styles from '../Shell.module.css';

export function AdminNav({
  isCollapsed,
  onItemClick,
}: {
  isCollapsed?: boolean;
  onItemClick?: () => void;
}) {
  const { t, labels } = useMessages();
  const { pathname, renderUrl } = useNavigation();

  const items = [
    {
      id: 'users',
      label: t(labels.users),
      path: '/admin/users',
      icon: <User />,
    },
    {
      id: 'websites',
      label: t(labels.websites),
      path: '/admin/websites',
      icon: <Globe />,
    },
    {
      id: 'teams',
      label: t(labels.teams),
      path: '/admin/teams',
      icon: <Users />,
    },
  ];

  return (
    <div className={styles.navGroup}>
      <Link
        className={styles.navLink}
        href={renderUrl('/websites', false)}
        onClick={onItemClick}
        title={isCollapsed ? t(labels.back) : undefined}
      >
        <span className={styles.navIcon}>
          <ArrowLeft />
        </span>
        {!isCollapsed && <span>{t(labels.back)}</span>}
      </Link>

      {!isCollapsed && <div className={styles.navLabel}>{t(labels.admin)}</div>}
      {items.map(({ id, path, label, icon }) => {
        const isSelected = pathname.startsWith(path);

        return (
          <Link
            className={classNames(styles.navLink, isSelected && styles.navLinkActive)}
            href={path}
            key={id}
            onClick={onItemClick}
            title={isCollapsed ? label : undefined}
          >
            <span className={styles.navIcon}>{icon}</span>
            {!isCollapsed && <span>{label}</span>}
          </Link>
        );
      })}
    </div>
  );
}

function classNames(...names: Array<string | false | undefined>) {
  return names.filter(Boolean).join(' ');
}
