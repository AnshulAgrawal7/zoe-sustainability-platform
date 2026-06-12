import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { useTranslation } from 'react-i18next';
import {
  Eye,
  Users,
  LogIn,
  UserPlus,
  CalendarCheck,
  Lightbulb,
  MessageSquare,
  Mail,
  BarChart3,
} from 'lucide-react';
import {
  getAdminMetrics,
  type AdminMetrics,
} from '../../services/metricsService';
import { formatNumber } from '../../utils/format';

const PERIODS = [7, 30, 90] as const;

/** Continuous list of the last n UTC day keys, oldest first. */
function lastNDays(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    out.push(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10));
  }
  return out;
}

// Admin monitoring: anonymous aggregate page-view/visit counters plus platform
// activity derived from existing DB timestamps. No personal data anywhere —
// see metricsService / metricsController for the privacy constraints.
export default function MonitoringPage() {
  const { t, i18n } = useTranslation();
  const [days, setDays] = useState<(typeof PERIODS)[number]>(30);
  const [data, setData] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminMetrics(days)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [days]);

  const fmt = (n: number) => formatNumber(n, i18n.language);

  // Chart series: continuous days (gaps = 0), capped to 30 bars for legibility.
  const chartDays = lastNDays(Math.min(days, 30));
  const viewsByDay = new Map(
    (data?.pageViews ?? []).map((r) => [r.day, r.count])
  );
  const series = chartDays.map((day) => ({
    day,
    count: viewsByDay.get(day) ?? 0,
  }));
  const maxCount = Math.max(1, ...series.map((s) => s.count));
  const topMax = Math.max(1, ...(data?.topPages ?? []).map((p) => p.count));

  const kpis = data
    ? [
        {
          icon: Eye,
          value: data.totals.pageViews,
          label: t('adminMonitoring.kpiViews'),
        },
        {
          icon: Users,
          value: data.totals.visits,
          label: t('adminMonitoring.kpiVisits'),
        },
        {
          icon: LogIn,
          value: data.totals.logins,
          label: t('adminMonitoring.kpiLogins'),
        },
        {
          icon: UserPlus,
          value: data.totals.newUsers,
          label: t('adminMonitoring.kpiNewUsers'),
        },
      ]
    : [];

  const activityRows = data
    ? [
        {
          icon: LogIn,
          label: t('adminMonitoring.rowLogins'),
          value: data.totals.logins,
        },
        {
          icon: UserPlus,
          label: t('adminMonitoring.rowNewUsers'),
          value: data.totals.newUsers,
        },
        {
          icon: CalendarCheck,
          label: t('adminMonitoring.rowEventRegs'),
          value: data.totals.eventRegistrations,
        },
        {
          icon: Lightbulb,
          label: t('adminMonitoring.rowIdeas'),
          value: data.totals.ideas,
        },
        {
          icon: MessageSquare,
          label: t('adminMonitoring.rowSubmissions'),
          value: data.totals.submissions,
        },
        {
          icon: Mail,
          label: t('adminMonitoring.rowNewsletter'),
          value: data.totals.newsletterSignups,
        },
      ]
    : [];

  return (
    <Container className="py-8">
      <h1 className="mb-2 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
        <BarChart3
          size={24}
          aria-hidden="true"
          className="text-green-600 dark:text-green-400"
        />
        {t('adminMonitoring.title')}
      </h1>
      <p className="mb-6 max-w-3xl text-sm text-gray-500 dark:text-gray-400">
        {t('adminMonitoring.intro')}
      </p>

      {/* Period selector */}
      <div
        role="group"
        aria-label={t('adminMonitoring.periodLabel')}
        className="mb-6 flex flex-wrap gap-2"
      >
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setDays(p)}
            aria-pressed={days === p}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
              days === p
                ? 'border-green-600 bg-green-600 text-white'
                : 'border-gray-300 bg-white text-gray-600 hover:border-green-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {t('adminMonitoring.periodDays', { count: p })}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : !data ? (
        <p className="text-gray-500 dark:text-gray-400">{t('common.error')}</p>
      ) : (
        <div className="space-y-6">
          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {kpis.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Icon
                    className="h-4 w-4 text-green-600 dark:text-green-400"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {fmt(value)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Page views per day — simple accessible CSS bar chart */}
          <section
            aria-label={t('adminMonitoring.chartAria', {
              total: data.totals.pageViews,
            })}
            className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
          >
            <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
              {t('adminMonitoring.chartTitle')}
            </h2>
            <div className="flex h-36 items-end gap-[3px]" aria-hidden="true">
              {series.map((s) => (
                <div
                  key={s.day}
                  title={`${s.day}: ${s.count}`}
                  className="group relative flex-1 rounded-t bg-green-500/80 transition-colors hover:bg-green-600 dark:bg-green-600/70 dark:hover:bg-green-500"
                  style={{
                    height: `${Math.max((s.count / maxCount) * 100, s.count > 0 ? 4 : 1)}%`,
                  }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-gray-400 dark:text-gray-500">
              <span>{series[0]?.day}</span>
              <span>{series[series.length - 1]?.day}</span>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Top pages */}
            <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t('adminMonitoring.topPagesTitle')}
              </h2>
              {data.topPages.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('adminMonitoring.empty')}
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {data.topPages.map((p) => (
                    <li key={p.path}>
                      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                        <span className="truncate font-mono text-xs text-gray-700 dark:text-gray-200">
                          {p.path}
                        </span>
                        <span className="shrink-0 font-semibold text-gray-900 dark:text-white">
                          {fmt(p.count)}
                        </span>
                      </div>
                      <div
                        className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700"
                        aria-hidden="true"
                      >
                        <div
                          className="h-1.5 rounded-full bg-green-500"
                          style={{ width: `${(p.count / topMax) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Platform activity in the period */}
            <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t('adminMonitoring.activityTitle')}
              </h2>
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {activityRows.map(({ icon: Icon, label, value }) => (
                  <li
                    key={label}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Icon
                        size={15}
                        aria-hidden="true"
                        className="text-gray-400"
                      />
                      {label}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {fmt(value)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-400 dark:border-gray-700 dark:text-gray-500">
                {t('adminMonitoring.footnote', {
                  users: fmt(data.totals.totalUsers),
                  views: fmt(data.totals.pageViewsAllTime),
                })}
              </p>
            </section>
          </div>
        </div>
      )}
    </Container>
  );
}
