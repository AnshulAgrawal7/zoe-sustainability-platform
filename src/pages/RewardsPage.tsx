import { useState } from 'react';
import { Award, Star, Users, ChevronDown, ChevronUp, CheckCircle, Circle, TrendingUp } from 'lucide-react';
import { rewardTiers, rewardActivities, communityMilestones } from '../data/rewards';
import type { RewardTier } from '../types';

const DEMO_POINTS = 130;

function TierCard({ tier, isCurrent }: { tier: RewardTier; isActive: boolean; isCurrent: boolean }) {
  const [open, setOpen] = useState(isCurrent);
  return (
    <div
      className={`rounded-xl border-2 transition-all ${tier.colorClasses} ${
        isCurrent ? 'ring-2 ring-offset-2 ring-green-500 shadow-md' : 'opacity-70'
      }`}
    >
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">{tier.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base">{tier.greekName}</span>
              <span className="text-sm font-medium opacity-70">— {tier.name}</span>
              {isCurrent && (
                <span className="text-xs bg-green-600 text-white rounded-full px-2 py-0.5 font-semibold">
                  Your tier
                </span>
              )}
            </div>
            <p className="text-xs opacity-70 mt-0.5">
              {tier.pointsMax
                ? `${tier.pointsMin}–${tier.pointsMax} points`
                : `${tier.pointsMin}+ points`}
            </p>
          </div>
        </div>
        {open ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-current/10 pt-3">
          <p className="text-sm mb-3 opacity-80">{tier.description}</p>
          <ul className="space-y-1.5">
            {tier.rewards.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm">
                <Star size={13} className="mt-0.5 flex-shrink-0 opacity-60" aria-hidden="true" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function RewardsPage() {
  const currentTier = rewardTiers.find(
    (t) => DEMO_POINTS >= t.pointsMin && (t.pointsMax === null || DEMO_POINTS <= t.pointsMax)
  )!;
  const nextTier = rewardTiers.find((t) => t.pointsMin > DEMO_POINTS) ?? null;
  const pointsToNext = nextTier ? nextTier.pointsMin - DEMO_POINTS : 0;
  const progressInTier = currentTier.pointsMax
    ? ((DEMO_POINTS - currentTier.pointsMin) / (currentTier.pointsMax - currentTier.pointsMin)) * 100
    : 100;

  const categoryColors: Record<string, string> = {
    Action: 'bg-green-100 text-green-800',
    Training: 'bg-blue-100 text-blue-800',
    Participation: 'bg-purple-100 text-purple-800',
    Community: 'bg-amber-100 text-amber-800',
    Business: 'bg-orange-100 text-orange-800',
    Education: 'bg-teal-100 text-teal-800',
    Ongoing: 'bg-cyan-100 text-cyan-800',
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-teal-700 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-green-200 text-sm mb-3">
            <Award size={14} aria-hidden="true" />
            <span>ZOE Community Rewards</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Earn Recognition for Your Impact</h1>
          <p className="text-xl text-green-100 leading-relaxed max-w-2xl">
            Every action you take for Northern Corfu earns points. Rise through five Greek-named tiers —
            from Σπόρος (Seed) to Θεματοφύλακας (Steward) — and unlock real recognition from the
            municipality and local community.
          </p>
        </div>
      </section>

      {/* Demo progress tracker */}
      <section className="py-10 bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 mb-6 text-sm text-amber-800">
            <span className="font-semibold">Prototype demo:</span> The tracker below shows a sample participant
            at {DEMO_POINTS} points. In the live platform, this reflects your real activity log.
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Current tier</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl" aria-hidden="true">{currentTier.icon}</span>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{currentTier.greekName}</p>
                    <p className="text-sm text-gray-500">{currentTier.name}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Total points</p>
                <p className="text-3xl font-bold text-green-700">{DEMO_POINTS}</p>
              </div>
            </div>

            <div className="mb-2 flex justify-between text-xs text-gray-500">
              <span>{currentTier.pointsMin} pts</span>
              {currentTier.pointsMax && <span>{currentTier.pointsMax} pts</span>}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all"
                style={{ width: `${Math.min(progressInTier, 100)}%` }}
                role="progressbar"
                aria-valuenow={DEMO_POINTS}
                aria-valuemin={currentTier.pointsMin}
                aria-valuemax={currentTier.pointsMax ?? DEMO_POINTS}
              />
            </div>

            {nextTier ? (
              <p className="text-sm text-gray-600 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-green-600" aria-hidden="true" />
                <span>
                  <strong>{pointsToNext} more points</strong> to reach {nextTier.greekName} ({nextTier.name}) {nextTier.icon}
                </span>
              </p>
            ) : (
              <p className="text-sm text-green-700 font-semibold">
                You have reached the highest tier. Thank you, Θεματοφύλακας!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">The Five ZOE Tiers</h2>
            <p className="text-gray-600">Each tier unlocks real, tangible recognition from the municipality and local partners.</p>
          </div>
          <div className="space-y-3">
            {rewardTiers.map((tier) => (
              <TierCard
                key={tier.id}
                tier={tier}
                isActive={DEMO_POINTS >= tier.pointsMin}
                isCurrent={tier.id === currentTier.id}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">
            All rewards listed are indicative for this prototype and subject to formal programme approval.
          </p>
        </div>
      </section>

      {/* How to earn points */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">How to Earn Points</h2>
            <p className="text-gray-600">Points are awarded for verified participation. Every contribution counts.</p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Activity</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold hidden sm:table-cell">Category</th>
                  <th className="text-right px-4 py-3 text-gray-600 font-semibold">Points</th>
                </tr>
              </thead>
              <tbody>
                {rewardActivities.map((activity, i) => (
                  <tr
                    key={activity.id}
                    className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                  >
                    <td className="px-4 py-3">
                      <span className="mr-2" aria-hidden="true">{activity.icon}</span>
                      {activity.label}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${categoryColors[activity.category] ?? 'bg-gray-100 text-gray-700'}`}>
                        {activity.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-green-700">+{activity.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Points are illustrative. Final values will be confirmed with municipality partners.
          </p>
        </div>
      </section>

      {/* Community milestones */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Community Milestones</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              When the whole community reaches a goal together, everyone benefits. These shared milestones
              reward collective action.
            </p>
          </div>
          <div className="space-y-4">
            {communityMilestones.map((milestone) => {
              const pct = Math.min((milestone.current / milestone.target) * 100, 100);
              return (
                <div
                  key={milestone.label}
                  className={`rounded-xl border p-5 ${
                    milestone.unlocked
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-start gap-2">
                      {milestone.unlocked ? (
                        <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      ) : (
                        <Circle size={18} className="text-gray-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      )}
                      <div>
                        <p className={`font-semibold text-sm ${milestone.unlocked ? 'text-green-900' : 'text-gray-900'}`}>
                          {milestone.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Reward: {milestone.reward}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold whitespace-nowrap ${milestone.unlocked ? 'text-green-700' : 'text-gray-500'}`}>
                      {milestone.unlocked ? 'Unlocked!' : `${milestone.current} / ${milestone.target}`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${milestone.unlocked ? 'bg-green-500' : 'bg-teal-400'}`}
                      style={{ width: `${pct}%` }}
                      role="progressbar"
                      aria-valuenow={milestone.current}
                      aria-valuemin={0}
                      aria-valuemax={milestone.target}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 bg-blue-50 rounded-xl border border-blue-100 p-4 text-sm text-blue-800 text-center">
            <span className="font-semibold">Prototype note:</span> Milestone progress shown here is illustrative dummy data.
          </div>
        </div>
      </section>

      {/* Why this system */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why a Points System?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Users size={22} className="text-green-600" aria-hidden="true" />,
                title: 'Low cost to the municipality',
                desc: 'Most rewards are recognition, certificates, and partnerships with local producers — not cash. The stewardship map and annual report cost almost nothing to operate.',
              },
              {
                icon: <Award size={22} className="text-teal-600" aria-hidden="true" />,
                title: 'Grounded in local culture',
                desc: 'Greek names and tangible local rewards (olive oil, compost, named map markers) resonate with Corfu residents far more than generic digital badges.',
              },
              {
                icon: <TrendingUp size={22} className="text-cyan-600" aria-hidden="true" />,
                title: 'Encourages long-term participation',
                desc: 'Monthly stewardship points and co-design access at the top tier give residents ongoing reasons to stay engaged — not just one-off event attendance.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <div className="mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
