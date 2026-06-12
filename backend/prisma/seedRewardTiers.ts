// PROTOTYPE SEED DATA — ZOE reward tiers (levels) + role-specific designations.
// The initial trilingual content is read from the frontend locale files (the
// previous single source of truth) so the DB starts EXACTLY with what the UI
// showed before tiers became admin-editable. Idempotent: existing rows are
// left untouched (admins may have edited them), only missing rows are created.
import fs from 'fs';
import path from 'path';
import type { PrismaClient } from '@prisma/client';

const TIER_BASE = [
  { id: 'sporos', order: 1, greekName: 'Σπόρος', icon: '🌱', pointsMin: 0, pointsMax: 24 },
  { id: 'phyllo', order: 2, greekName: 'Φύλλο', icon: '🍃', pointsMin: 25, pointsMax: 99 },
  { id: 'kladi', order: 3, greekName: 'Κλαδί', icon: '🌿', pointsMin: 100, pointsMax: 249 },
  { id: 'fylakas', order: 4, greekName: 'Φύλακας', icon: '🛡️', pointsMin: 250, pointsMax: 499 },
  { id: 'thematofylakas', order: 5, greekName: 'Θεματοφύλακας', icon: '🏛️', pointsMin: 500, pointsMax: null },
] as const;

const ROLES = ['RESIDENT', 'VISITOR', 'STUDENT', 'VOLUNTEER'] as const;

interface RoleTierText {
  name: string;
  description: string;
  rewards: string[];
}
type LocaleRoleTiers = Record<string, Record<string, RoleTierText>>;

function loadLocaleRoleTiers(lang: string): LocaleRoleTiers {
  const file = path.join(__dirname, '..', '..', 'src', 'locales', lang, 'translation.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8')) as {
    rewardData: { roleTiers: LocaleRoleTiers };
  };
  return data.rewardData.roleTiers;
}

export async function seedRewardTiers(prisma: PrismaClient) {
  const en = loadLocaleRoleTiers('en');
  const el = loadLocaleRoleTiers('el');
  const de = loadLocaleRoleTiers('de');

  for (const tier of TIER_BASE) {
    await prisma.rewardTier.upsert({
      where: { id: tier.id },
      update: {},
      create: { id: tier.id, order: tier.order, greekName: tier.greekName, icon: tier.icon, pointsMin: tier.pointsMin, pointsMax: tier.pointsMax },
    });

    for (const role of ROLES) {
      const e = en[role]?.[tier.id];
      const l = el[role]?.[tier.id];
      const d = de[role]?.[tier.id];
      if (!e || !l || !d) {
        console.warn(`seedRewardTiers: missing locale content for ${role}/${tier.id} — skipped`);
        continue;
      }
      await prisma.rewardTierRole.upsert({
        where: { tierId_role: { tierId: tier.id, role } },
        update: {},
        create: {
          tierId: tier.id,
          role,
          nameEn: e.name, nameEl: l.name, nameDe: d.name,
          descriptionEn: e.description, descriptionEl: l.description, descriptionDe: d.description,
          rewardsEn: e.rewards.join('\n'), rewardsEl: l.rewards.join('\n'), rewardsDe: d.rewards.join('\n'),
        },
      });
    }
  }
  console.log('Reward tiers seeded (5 tiers × 4 roles).');
}
