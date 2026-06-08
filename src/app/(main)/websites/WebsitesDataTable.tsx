'use client';

import * as React from 'react';
import { Favicon } from '@/components/common/Favicon';
import Link from '@/components/common/Link';
import { useLoginQuery } from '@/components/hooks/queries/useLoginQuery';
import { useUserWebsitesQuery } from '@/components/hooks/queries/useUserWebsitesQuery';
import { useMessages } from '@/components/hooks/useMessages';
import { useNavigation } from '@/components/hooks/useNavigation';
import { ChevronRight, Search, SquarePen } from '@/components/icons';
import {
  Button,
  Empty,
  Input,
  Loading,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import styles from './WebsitesPage.module.css';

export function WebsitesDataTable({
  userId,
  teamId,
  allowEdit = true,
  allowView = true,
  showActions = true,
}: {
  userId?: string;
  teamId?: string;
  allowEdit?: boolean;
  allowView?: boolean;
  showActions?: boolean;
}) {
  const { user } = useLoginQuery();
  const { t, labels, messages } = useMessages();
  const { query, renderUrl, router, updateParams } = useNavigation();
  const queryResult = useUserWebsitesQuery({ userId: userId || user?.id, teamId });
  const { data, error, isFetching, isLoading } = queryResult;
  const [search, setSearch] = React.useState(String(query?.search || data?.search || ''));
  const rows = Array.isArray(data?.data) ? data.data : [];
  const page = Number(data?.page || query?.page || 1);
  const pageSize = Number(data?.pageSize || 0);
  const count = Number(data?.count || 0);
  const maxPage = pageSize && count ? Math.ceil(count / pageSize) : 0;
  const canPageBack = page > 1;
  const canPageForward = maxPage > 0 && page < maxPage;

  React.useEffect(() => {
    setSearch(String(query?.search || data?.search || ''));
  }, [data?.search, query?.search]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(updateParams({ search, page: 1 }));
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage > 0 && (!maxPage || nextPage <= maxPage)) {
      router.push(updateParams({ search, page: nextPage }));
    }
  };

  if (error) {
    return <Empty title={t(messages.error)} description={t(messages.noDataAvailable)} />;
  }

  return (
    <div className={styles.tableStack}>
      <form className={styles.toolbar} onSubmit={handleSearch}>
        <label className={styles.searchField}>
          <Search aria-hidden="true" />
          <Input
            aria-label={t(labels.search)}
            onChange={event => setSearch(event.currentTarget.value)}
            placeholder={t(labels.search)}
            value={search}
          />
        </label>
        <Button type="submit" variant="outline">
          {t(labels.search)}
        </Button>
      </form>

      {isLoading || isFetching ? (
        <div className={styles.loadingState}>
          <Loading label="Loading" />
        </div>
      ) : rows.length ? (
        <Table aria-label={t(labels.websites)}>
          <TableHeader>
            <TableRow>
              <TableHead>{t(labels.name)}</TableHead>
              <TableHead>{t(labels.domain)}</TableHead>
              {showActions && allowEdit ? (
                <TableHead className={styles.actionHead}> </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row: any) => (
              <TableRow key={row.id}>
                <TableCell>
                  <div className={styles.websiteCell}>
                    <span className={styles.favicon}>
                      <Favicon domain={row.domain} />
                    </span>
                    {allowView ? (
                      <Link
                        className={styles.websiteLink}
                        href={renderUrl(`/websites/${row.id}`, false)}
                      >
                        {row.name}
                      </Link>
                    ) : (
                      <span className={styles.websiteName}>{row.name}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={styles.domain}>{row.domain}</span>
                </TableCell>
                {showActions && allowEdit ? (
                  <TableCell className={styles.actionCell}>
                    <Link
                      aria-label={t(labels.settings)}
                      className={styles.actionLink}
                      href={renderUrl(`/websites/${row.id}/settings`, false)}
                    >
                      <SquarePen aria-hidden="true" />
                    </Link>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Empty title={t(messages.noDataAvailable)} description={t(labels.websites)} />
      )}

      {maxPage > 1 ? (
        <div className={styles.pager}>
          <span>{t(labels.numberOfRecords, { x: count.toLocaleString() })}</span>
          <div className={styles.pagerControls}>
            <span>
              {t(labels.pageOf, {
                current: page.toLocaleString(),
                total: maxPage.toLocaleString(),
              })}
            </span>
            <Button
              aria-label={t(labels.previous)}
              disabled={!canPageBack}
              onClick={() => handlePageChange(page - 1)}
              size="icon"
              variant="outline"
            >
              <ChevronRight aria-hidden="true" className={styles.previousIcon} />
            </Button>
            <Button
              aria-label="Next page"
              disabled={!canPageForward}
              onClick={() => handlePageChange(page + 1)}
              size="icon"
              variant="outline"
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
