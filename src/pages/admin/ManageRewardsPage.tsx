import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Save, Loader2 } from 'lucide-react';
import { getRewardTiers, updateRewardTier } from '../../services/rewardService';
import { useToastStore } from '../../stores/toastStore';
import type { ApiRewardTier, UserProfile } from '../../types';

const ROLES: UserProfile[] = ['RESIDENT', 'VISITOR', 'STUDENT', 'VOLUNTEER'];
// Language field suffixes — technical codes, deliberately untranslated.
const LANGS = ['En', 'El', 'De'] as const;
type Lang = (typeof LANGS)[number];

interface VariantForm {
  nameEn: string;
  nameEl: string;
  nameDe: string;
  descriptionEn: string;
  descriptionEl: string;
  descriptionDe: string;
  rewardsEn: string;
  rewardsEl: string;
  rewardsDe: string;
}

interface TierForm {
  greekName: string;
  icon: string;
  pointsMin: string;
  pointsMax: string; // '' = open-ended top tier
  variants: Record<UserProfile, VariantForm>;
}

const emptyVariant: VariantForm = {
  nameEn: '',
  nameEl: '',
  nameDe: '',
  descriptionEn: '',
  descriptionEl: '',
  descriptionDe: '',
  rewardsEn: '',
  rewardsEl: '',
  rewardsDe: '',
};

function toForm(tier: ApiRewardTier): TierForm {
  const variants = {} as Record<UserProfile, VariantForm>;
  for (const role of ROLES) {
    const v = tier.roleVariants.find((rv) => rv.role === role);
    variants[role] = v
      ? {
          nameEn: v.nameEn,
          nameEl: v.nameEl,
          nameDe: v.nameDe,
          descriptionEn: v.descriptionEn,
          descriptionEl: v.descriptionEl,
          descriptionDe: v.descriptionDe,
          rewardsEn: v.rewardsEn,
          rewardsEl: v.rewardsEl,
          rewardsDe: v.rewardsDe,
        }
      : { ...emptyVariant };
  }
  return {
    greekName: tier.greekName,
    icon: tier.icon,
    pointsMin: String(tier.pointsMin),
    pointsMax: tier.pointsMax === null ? '' : String(tier.pointsMax),
    variants,
  };
}

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white';
const labelClass =
  'mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300';

// Admin editor for the five ZOE levels: point ranges + per-role trilingual
// designations and reward lists (one reward per line).
export default function ManageRewardsPage() {
  const { t } = useTranslation();
  const showToast = useToastStore((s) => s.showToast);

  const [tiers, setTiers] = useState<ApiRewardTier[]>([]);
  const [forms, setForms] = useState<Record<string, TierForm>>({});
  const [openTier, setOpenTier] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<UserProfile>('RESIDENT');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    getRewardTiers()
      .then((data) => {
        setTiers(data);
        setForms(Object.fromEntries(data.map((ti) => [ti.id, toForm(ti)])));
      })
      .catch(() => setTiers([]))
      .finally(() => setLoading(false));
  }, []);

  function setTierField(
    id: string,
    field: 'greekName' | 'icon' | 'pointsMin' | 'pointsMax',
    value: string
  ) {
    setForms((f) => ({ ...f, [id]: { ...f[id], [field]: value } }));
  }

  function setVariantField(
    id: string,
    role: UserProfile,
    field: keyof VariantForm,
    value: string
  ) {
    setForms((f) => ({
      ...f,
      [id]: {
        ...f[id],
        variants: {
          ...f[id].variants,
          [role]: { ...f[id].variants[role], [field]: value },
        },
      },
    }));
  }

  async function save(id: string) {
    const form = forms[id];
    if (!form) return;
    setSavingId(id);
    try {
      const updated = await updateRewardTier(id, {
        greekName: form.greekName,
        icon: form.icon,
        pointsMin: parseInt(form.pointsMin, 10) || 0,
        pointsMax: form.pointsMax === '' ? null : parseInt(form.pointsMax, 10),
        variants: ROLES.map((role) => ({ role, ...form.variants[role] })),
      });
      setTiers((prev) => prev.map((ti) => (ti.id === id ? updated : ti)));
      setForms((f) => ({ ...f, [id]: toForm(updated) }));
      showToast(t('adminRewards.saved'));
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : t('adminRewards.saveError')
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <Container className="py-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        {t('adminRewards.title')}
      </h1>
      <p className="mb-6 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
        {t('adminRewards.intro')}
      </p>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : tiers.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">{t('common.error')}</p>
      ) : (
        <div className="space-y-3">
          {tiers.map((tier) => {
            const form = forms[tier.id];
            const open = openTier === tier.id;
            if (!form) return null;
            return (
              <div
                key={tier.id}
                className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <button
                  type="button"
                  onClick={() => setOpenTier(open ? null : tier.id)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden="true">
                      {form.icon}
                    </span>
                    <span>
                      <span className="block font-bold text-gray-900 dark:text-white">
                        {form.greekName}
                      </span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">
                        {form.pointsMin}
                        {form.pointsMax === '' ? '+' : `–${form.pointsMax}`} ★
                      </span>
                    </span>
                  </span>
                  {open ? (
                    <ChevronUp size={16} aria-hidden="true" />
                  ) : (
                    <ChevronDown size={16} aria-hidden="true" />
                  )}
                </button>

                {open && (
                  <div className="space-y-5 border-t border-gray-100 p-4 dark:border-gray-700">
                    {/* Base fields */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div>
                        <label
                          htmlFor={`${tier.id}-greek`}
                          className={labelClass}
                        >
                          {t('adminRewards.greekName')}
                        </label>
                        <input
                          id={`${tier.id}-greek`}
                          type="text"
                          value={form.greekName}
                          onChange={(e) =>
                            setTierField(tier.id, 'greekName', e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`${tier.id}-icon`}
                          className={labelClass}
                        >
                          {t('adminRewards.icon')}
                        </label>
                        <input
                          id={`${tier.id}-icon`}
                          type="text"
                          value={form.icon}
                          onChange={(e) =>
                            setTierField(tier.id, 'icon', e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`${tier.id}-min`}
                          className={labelClass}
                        >
                          {t('adminRewards.pointsMin')}
                        </label>
                        <input
                          id={`${tier.id}-min`}
                          type="number"
                          min={0}
                          value={form.pointsMin}
                          onChange={(e) =>
                            setTierField(tier.id, 'pointsMin', e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`${tier.id}-max`}
                          className={labelClass}
                        >
                          {t('adminRewards.pointsMax')}
                        </label>
                        <input
                          id={`${tier.id}-max`}
                          type="number"
                          min={1}
                          value={form.pointsMax}
                          onChange={(e) =>
                            setTierField(tier.id, 'pointsMax', e.target.value)
                          }
                          placeholder={t('adminRewards.pointsMaxHint')}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Role tabs */}
                    <div
                      role="tablist"
                      aria-label={t('adminRewards.roleTabsLabel')}
                      className="flex flex-wrap gap-2"
                    >
                      {ROLES.map((role) => (
                        <button
                          key={role}
                          type="button"
                          role="tab"
                          aria-selected={activeRole === role}
                          onClick={() => setActiveRole(role)}
                          className={`rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                            activeRole === role
                              ? 'border-green-600 bg-green-600 text-white'
                              : 'border-gray-300 bg-white text-gray-600 hover:border-green-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                          }`}
                        >
                          {t(`profiles.${role}.label`)}
                        </button>
                      ))}
                    </div>

                    {/* Per-language fields for the active role */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                      {LANGS.map((lang: Lang) => (
                        <div
                          key={lang}
                          className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/40"
                        >
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                            {lang.toUpperCase()}
                          </p>
                          <div>
                            <label
                              htmlFor={`${tier.id}-${activeRole}-name${lang}`}
                              className={labelClass}
                            >
                              {t('adminRewards.nameLabel')}
                            </label>
                            <input
                              id={`${tier.id}-${activeRole}-name${lang}`}
                              type="text"
                              value={form.variants[activeRole][`name${lang}`]}
                              onChange={(e) =>
                                setVariantField(
                                  tier.id,
                                  activeRole,
                                  `name${lang}`,
                                  e.target.value
                                )
                              }
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`${tier.id}-${activeRole}-desc${lang}`}
                              className={labelClass}
                            >
                              {t('adminRewards.descriptionLabel')}
                            </label>
                            <textarea
                              id={`${tier.id}-${activeRole}-desc${lang}`}
                              rows={2}
                              value={
                                form.variants[activeRole][`description${lang}`]
                              }
                              onChange={(e) =>
                                setVariantField(
                                  tier.id,
                                  activeRole,
                                  `description${lang}`,
                                  e.target.value
                                )
                              }
                              className={`${inputClass} resize-none`}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`${tier.id}-${activeRole}-rew${lang}`}
                              className={labelClass}
                            >
                              {t('adminRewards.rewardsLabel')}
                            </label>
                            <textarea
                              id={`${tier.id}-${activeRole}-rew${lang}`}
                              rows={4}
                              value={
                                form.variants[activeRole][`rewards${lang}`]
                              }
                              onChange={(e) =>
                                setVariantField(
                                  tier.id,
                                  activeRole,
                                  `rewards${lang}`,
                                  e.target.value
                                )
                              }
                              className={inputClass}
                            />
                            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                              {t('adminRewards.rewardsHint')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => void save(tier.id)}
                      disabled={savingId === tier.id}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-60"
                    >
                      {savingId === tier.id ? (
                        <Loader2
                          size={15}
                          className="motion-safe:animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <Save size={15} aria-hidden="true" />
                      )}
                      {t('adminRewards.save')}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
}
