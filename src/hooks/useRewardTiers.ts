import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getRewardTiers } from '../services/rewardService';
import { rewardTiers as fallbackTiers } from '../data/rewards';
import type { ApiRewardTier, UiRewardTier, UserProfile } from '../types';

const ROLES: UserProfile[] = ['RESIDENT', 'VISITOR', 'STUDENT', 'VOLUNTEER'];

// Card colours stay a pure frontend concern (not admin-editable) — keyed by
// tier id, sourced from the static fallback data.
const COLOR_BY_ID = new Map(fallbackTiers.map((t) => [t.id, t.colorClasses]));
const DEFAULT_COLOR = 'bg-gray-50 border-gray-300 text-gray-800';

function pick(lang: string, en: string, el: string, de: string): string {
  if (lang === 'el') return el;
  if (lang === 'de') return de;
  return en;
}

function normalize(apiTiers: ApiRewardTier[], lang: string): UiRewardTier[] {
  return apiTiers.map((tier) => {
    const byRole = {} as UiRewardTier['byRole'];
    for (const role of ROLES) {
      const v = tier.roleVariants.find((rv) => rv.role === role);
      byRole[role] = v
        ? {
            name: pick(lang, v.nameEn, v.nameEl, v.nameDe),
            description: pick(
              lang,
              v.descriptionEn,
              v.descriptionEl,
              v.descriptionDe
            ),
            rewards: pick(lang, v.rewardsEn, v.rewardsEl, v.rewardsDe)
              .split('\n')
              .map((r) => r.trim())
              .filter(Boolean),
          }
        : { name: tier.greekName, description: '', rewards: [] };
    }
    return {
      id: tier.id,
      greekName: tier.greekName,
      icon: tier.icon,
      colorClasses: COLOR_BY_ID.get(tier.id) ?? DEFAULT_COLOR,
      pointsMin: tier.pointsMin,
      pointsMax: tier.pointsMax,
      byRole,
    };
  });
}

// The five ZOE levels for the UI: loaded from the API (admin-editable DB
// content) with the static data + i18n texts as PROTOTYPE FALLBACK while
// loading or when the backend is unreachable. Already language-resolved.
export function useRewardTiers(): { tiers: UiRewardTier[]; loading: boolean } {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);

  const [apiTiers, setApiTiers] = useState<ApiRewardTier[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getRewardTiers()
      .then((tiers) => {
        if (!cancelled && tiers.length > 0) setApiTiers(tiers);
      })
      .catch(() => null) // fallback stays in place
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const tiers = useMemo(() => {
    if (apiTiers) return normalize(apiTiers, lang);
    // Fallback: static ranges + the i18n roleTiers texts.
    return fallbackTiers.map((tier) => {
      const byRole = {} as UiRewardTier['byRole'];
      for (const role of ROLES) {
        byRole[role] = {
          name: t(`rewardData.roleTiers.${role}.${tier.id}.name`),
          description: t(`rewardData.roleTiers.${role}.${tier.id}.description`),
          rewards: t(`rewardData.roleTiers.${role}.${tier.id}.rewards`, {
            returnObjects: true,
          }) as string[],
        };
      }
      return {
        id: tier.id,
        greekName: tier.greekName,
        icon: tier.icon,
        colorClasses: tier.colorClasses,
        pointsMin: tier.pointsMin,
        pointsMax: tier.pointsMax,
        byRole,
      };
    });
  }, [apiTiers, lang, t]);

  return { tiers, loading };
}

/** The tier a given points total falls into (first tier as safety net). */
export function tierForPoints(
  tiers: UiRewardTier[],
  points: number
): UiRewardTier | undefined {
  return (
    tiers.find(
      (tier) =>
        points >= tier.pointsMin &&
        (tier.pointsMax === null || points <= tier.pointsMax)
    ) ?? tiers[0]
  );
}
