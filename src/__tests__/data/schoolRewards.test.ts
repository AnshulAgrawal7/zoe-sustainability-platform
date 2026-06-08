import { describe, it, expect } from 'vitest';
import {
  schoolRewardTiers,
  schoolTierForPoints,
} from '../../data/schoolRewards';
import { pickLang } from '../../utils/i18nFields';

describe('schoolTierForPoints', () => {
  it('returns the lowest tier for 0 points', () => {
    expect(schoolTierForPoints(0).id).toBe('sporeio');
  });

  it('returns the matching tier at a boundary', () => {
    expect(schoolTierForPoints(500).id).toBe('alsos');
    expect(schoolTierForPoints(1499).id).toBe('alsos');
    expect(schoolTierForPoints(1500).id).toBe('dasos');
  });

  it('returns the top tier above the last threshold', () => {
    const top = schoolRewardTiers[schoolRewardTiers.length - 1];
    expect(schoolTierForPoints(999999).id).toBe(top.id);
    expect(top.pointsMax).toBeNull();
  });
});

describe('pickLang', () => {
  it('picks the variant matching the language code', () => {
    expect(pickLang('en', 'A', 'B', 'C')).toBe('A');
    expect(pickLang('el', 'A', 'B', 'C')).toBe('B');
    expect(pickLang('de', 'A', 'B', 'C')).toBe('C');
  });

  it('handles regional codes and falls back to English', () => {
    expect(pickLang('en-US', 'A', 'B', 'C')).toBe('A');
    expect(pickLang('fr', 'A', 'B', 'C')).toBe('A');
  });
});
