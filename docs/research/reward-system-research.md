# Reward Systems for Civic Engagement — Literature Review & Design Recommendations

**Document type:** Literature review and design rationale for DSR artefact  
**Project:** ZOE Sustainability Platform  
**Seminar:** FAU WInf IS Seminar SoSe 2026, Group 1  
**DSR phase:** Activity 2 (Define Objectives) and Activity 3 (Design and Development) per Peffers et al. (2007)  
**Related artefact component:** `/rewards` route; `src/data/rewards.ts`; `src/pages/RewardsPage.tsx`

---

## 1. Key Findings

- Gamification in civic contexts — the application of game-design elements to non-game settings — has demonstrated measurable but context-dependent effects on participation behaviour; effects are strongest when game elements align with users' pre-existing motivations (Hamari, Koivisto, & Sarsa, 2014).
- The distinction between intrinsic motivation (acting for the value of the action itself) and extrinsic motivation (acting for external rewards) is central to reward system design; well-designed civic gamification supports both, rather than substituting one for the other (Deterding, Dixon, Khaled, & Nacke, 2011).
- Leaderboard-only designs risk demotivating the majority of participants who do not place near the top; point and badge systems are more inclusive because they reward individual progress independent of others' activity (Hamari et al., 2014).
- Platform evidence from Decidim, CitizenLab, FixMyStreet, and My Street Helsinki demonstrates that lightweight acknowledgement mechanisms — progress indicators, completion confirmations, visible community milestones — increase return visits and sustained engagement without requiring complex gamification infrastructure.
- Mediterranean and Southern European civic cultures show stronger responses to community recognition and social embeddedness than to competitive ranking, with implications for how reward visibility should be framed (Putnam, 1993; Fung, 2006).
- The ZOE platform's five-tier progression system (Seed → Leaf → Branch → Guardian → Steward), using Greek-language tier names, is consistent with the literature's recommendation for contextually grounded, identity-affirming reward structures in local civic engagement platforms.

---

## 2. Gamification in Civic Tech

### 2.1 Defining Gamification

Deterding et al. (2011) provide the canonical definition: gamification is "the use of game design elements in non-game contexts" (p. 9). This definition distinguishes gamification from full games (entertainment products) and from serious games (which are complete game experiences applied to non-entertainment ends). In the civic technology context, gamification typically refers to the selective adoption of specific mechanics — points, badges, leaderboards, progress bars, levels, and challenges — within a participation platform that is not itself a game.

The distinction matters for ZOE because the platform is primarily a transparency and participation tool, not an entertainment product. Gamification is a design layer on top of real civic actions (attending cleanups, reporting issues, volunteering), not the platform's core purpose.

### 2.2 Evidence for Gamification Effectiveness

Hamari et al. (2014) conducted a systematic literature review of 24 empirical studies on gamification across domains including civic participation, health, education, and work. Their key findings, relevant to ZOE, are:

1. **Gamification generally shows positive effects on motivation and engagement**, but effect sizes vary significantly by context, user type, and which game elements are used.
2. **Points and progress indicators** are the most consistently effective elements across contexts.
3. **Badges** are effective when they carry social meaning — that is, when they are visible to others and perceived as a genuine marker of contribution rather than as a trivial achievement.
4. **Leaderboards** are effective for already-engaged users at the top, but frequently demotivating for the majority. A platform with 1,000 participants and a top-10 leaderboard actively discourages the 990 who will never appear on it.
5. Effects are stronger when **game elements align with users' existing goals** — in the environmental civic context, this means reward structures that affirm environmental values rather than merely competitive instincts.

### 2.3 The Self-Determination Theory Basis

The academic consensus on why gamification works (or fails) draws heavily on Self-Determination Theory (SDT), originating with Deci and Ryan's distinction between intrinsic and extrinsic motivation. Deterding et al. (2011) and subsequent IS literature (e.g., Hamari et al., 2014) apply SDT to gamification as follows:

- **Intrinsic motivation** — doing something because the activity itself is satisfying (participating in a beach cleanup because one cares about the beach, not for a reward).
- **Extrinsic motivation** — doing something for an external outcome (points, a badge, a discount).

The critical finding for civic platform design is that poorly designed extrinsic rewards can crowd out intrinsic motivation — a phenomenon known as the "overjustification effect." If citizens begin attending ZOE events primarily to accumulate points, the intrinsic motivation to protect the environment may weaken if the reward system is later removed. This argues for reward systems where the extrinsic element is modest and the intrinsic framing is primary: the reward acknowledges what the participant has already done for the environment, rather than incentivising them to do it.

This theoretical position directly justifies the ZOE reward design, described in Section 5.

---

## 3. Platform Examples

### 3.1 Decidim (Barcelona / Worldwide)

Decidim is an open-source participatory democracy platform used by the City of Barcelona and over 200 other municipalities. It does not implement gamification in the traditional sense (no points or badges), but it does use **participation counters** and **follower notifications** to signal community engagement. The absence of gamification in Decidim reflects its creators' ideological position that civic participation should not be gamified — participation is a right, not a game (Barandiaran et al., 2018).

**Lesson for ZOE:** The Decidim position is coherent but not universally applicable. For a small municipality with low existing digital engagement, a modest reward layer can lower the barrier to first engagement without implying that participation is conditional on reward. The ZOE approach is to treat the reward layer as an optional layer of recognition, not as a gate or incentive mechanism.

### 3.2 CitizenLab (Now Engagement HQ)

CitizenLab (rebranded as Engagement HQ in some markets) is a commercial civic engagement platform used by over 300 municipalities in Europe. Its research blog and published case studies document that **progress indicators**, **contribution acknowledgements**, and **community milestone displays** increase return-visit rates and sustained contribution without full gamification. CitizenLab does not use leaderboards; it uses visible contribution counts at the community level.

**Lesson for ZOE:** Community milestones (visible in `src/data/rewards.ts` and displayed on the ZOE rewards page) reflect CitizenLab's approach — celebrating collective progress rather than ranking individuals. This approach is directly applicable to a small-island community where social relationships are dense and individual ranking would be perceived as divisive.

### 3.3 FixMyStreet (MySociety, UK)

FixMyStreet is the UK's most-used civic issue-reporting platform. It does not use explicit gamification, but it tracks and displays each user's submitted issue count on their profile, and sends email notifications when issues are updated or fixed. The notification-of-outcome mechanism is particularly significant: research on FixMyStreet usage found that users who received feedback confirming their report had been addressed were significantly more likely to submit further reports (MySociety, 2019).

**Lesson for ZOE:** The "closing the loop" function is motivationally important. Points and badges are secondary to the experience of seeing that one's contribution had a visible effect. The ZOE platform's project status updates and transparency dashboard serve this function.

### 3.4 My Street Helsinki (City of Helsinki)

My Street Helsinki (Oma Kaupunginosa) is a participatory urban planning platform using interactive maps and task-based engagement. Helsinki's implementation included a digital badge system for completing contributions to neighbourhood improvement discussions. Internal evaluation (reported by the City of Helsinki digital services team) found that badge visibility on user profiles motivated a subset of users to contribute across multiple neighbourhood areas — going beyond their immediate residential area.

**Lesson for ZOE:** Badge visibility effects work when badges carry localised meaning. In the ZOE context, this suggests that tier names in Greek (Σπόρος, Φύλλο, Κλαδί, Φύλακας, Θεματοφύλακας) and tangible local rewards (olive oil from Agios Markos, named stewardship on the public map) will be more motivationally effective than generic digital badges.

---

## 4. Cultural Considerations for Mediterranean / Greek Communities

### 4.1 Social Capital and Community Recognition

Putnam (1993), in his foundational analysis of civic traditions in Italy, identifies two forms of social capital relevant to civic engagement platforms:

- **Bridging social capital** — connections between groups who do not already know each other (relevant for connecting tourists and residents on the ZOE platform).
- **Bonding social capital** — connections within existing close-knit communities (dominant in small island municipalities like Northern Corfu's villages).

High-bonding, low-bridging social capital environments — characteristic of small Greek island communities — respond better to civic mechanisms that reinforce existing community identity than to anonymous competitive ranking. A leaderboard that places "User #1471" at the top is culturally incoherent in a village where everyone knows each other by name.

This observation supports ZOE's design choice of named stewardship recognition (e.g., "the Papadopoulos Beach Section" on the public map) over anonymous points ranking at the community's highest tier level.

### 4.2 Trust and Institutional Distance

As noted in `docs/research/corfu-context.md`, Greek civic culture is characterised by comparatively low institutional trust (European Commission, 2023). This creates a specific interaction effect with gamification: if reward systems are perceived as a manipulative attempt by the municipality to extract unpaid labour (environmental monitoring, issue reporting), the design will backfire.

Fung (2006) distinguishes between civic participation mechanisms that are genuinely empowering (citizens influence decisions) and those that are merely consultative (citizens provide input that may or may not be acknowledged). Reward systems attached to genuinely consultative mechanisms — where citizen input disappears into a municipal database with no visible follow-up — may accelerate civic disengagement rather than build it.

The implication for ZOE is that the reward system's credibility depends entirely on the platform's transparency layer: citizens must be able to see that their reported issues are acted upon, that their submitted ideas appear in project consideration, and that their volunteer hours contribute to documented outcomes.

### 4.3 Environmental Identity in Tourist-Dependent Economies

Northern Corfu's environmental civic culture has a specific economic dimension: local residents, fishers, farmers, and tourism businesses are directly economically exposed to environmental quality. Beach cleanliness affects tourism revenue. Wetland health affects fish stocks. Olive grove condition affects agricultural income. This economic embeddedness of environmental concern means that civic environmental participation is not purely altruistic; it is also instrumentally rational.

Reward systems can acknowledge this without being cynical about it: the ZOE eco-business certification activity (50 points for registering a business in the eco-scheme) explicitly recognises businesses as stakeholders in the environmental programme, not merely as objects of environmental regulation.

---

## 5. Recommendation for ZOE

### 5.1 Design Rationale: Points + Badges, Not Leaderboard Alone

The ZOE platform uses a combination of accumulated points, five named tier levels with Greek-language identities, activity-specific badges, and community milestones. The following argument justifies this combination for the specific Northern Corfu context.

**Points** provide a continuous, legible progress metric that every participant can improve regardless of others' activity. Unlike a leaderboard position, a points total is not a zero-sum quantity. For a community with strong bonding social capital and high-density social relationships, this is essential: a competitive ranking mechanism would introduce social friction into a small-island community where the "winners" and "losers" are neighbours.

**Badges** provide categorical recognition for qualitatively distinct contributions. A citizen who reports twenty environmental issues has contributed differently from one who led a school session or registered their business in the eco-scheme. Points alone flatten this distinction; badges preserve it. Hamari et al. (2014) find that badges are motivationally effective when they signal genuine achievement rather than trivial completion — the ZOE badge activities are calibrated to reflect real effort (40 points for completing water monitoring certification; 8 points for photo documentation).

**Tier progression** provides a long-horizon motivational arc. The Seed-to-Steward progression, with culturally resonant Greek-language tier names, allows citizens to understand their cumulative contribution in narrative terms — "I am a Branch in the ZOE community" — rather than purely numerical ones. The use of Greek botanical and civic vocabulary (Σπόρος, Φύλλο, Κλαδί, Φύλακας, Θεματοφύλακας) grounds the system in local identity.

**Community milestones** serve the function that leaderboards typically serve in gamified systems — motivating toward a collective goal — without the social fragmentation that individual ranking introduces. When the community reaches 500 volunteer-hours, twenty trees are planted along the Antinioti trail. Every participant contributed to that outcome; no one is ranked against another.

**Tangible local rewards at higher tiers** (municipal certificate, olive oil from a partner grove in Agios Markos, named stewardship on the public map, co-design session with municipal leadership) serve a function that digital rewards alone cannot: they connect platform engagement to real-world social status and material outcomes within the community. Deterding et al. (2011) note that gamification elements must be perceived as meaningful within the cultural context of use; in a close-knit Mediterranean island community, a stewardship plaque from the Municipality is meaningfully different from a digital badge on a screen.

### 5.2 Intrinsic-Extrinsic Balance

The design deliberately maintains the balance between intrinsic and extrinsic motivation identified by Deterding et al. (2011) and Hamari et al. (2014) as critical to effective civic gamification:

- **Intrinsic motivation is primary:** The platform frames all activity in terms of environmental outcomes first (trees planted, beaches cleaned, issues resolved). Rewards are presented as acknowledgement, not incentive.
- **Extrinsic rewards are meaningful but not manipulative:** Rewards are proportional to contribution effort; they do not manufacture artificial urgency (no limited-time badges, no streak mechanics that punish absence).
- **No gamification debt:** Citizens who stop engaging do not lose accumulated points or tier status. This avoids the "treadmill" dynamic where users continue engaging to protect prior gains rather than for genuine reasons.

---

## 6. Design Implications

| Research Finding | ZOE Design Response | Implementation |
|---|---|---|
| Leaderboard demotivates majority (Hamari et al., 2014) | No individual leaderboard; community milestones instead | `communityMilestones[]` in `src/data/rewards.ts` |
| Badges need cultural meaning (Deterding et al., 2011) | Greek-language tier names; place-specific rewards | `greekName` field in `RewardTier`; Agios Markos olive oil reward |
| Closing the loop increases re-engagement (MySociety, 2019) | Transparency page; project status updates | `/transparency` route; project `status` field |
| Bonding social capital resists competitive ranking (Putnam, 1993) | Named stewardship (not ranked) at Guardian tier | Guardian tier reward: named section on public map |
| Low institutional trust requires visible accountability (Fung, 2006) | SDG dashboard; KPI metrics; transparent progress | `/sdg-dashboard` route; `metrics.ts` data |
| Intrinsic motivation must not be crowded out (Deterding et al., 2011) | Rewards frame acknowledgement, not incentive | Tier descriptions: "You guard the landscape" not "Earn rewards by doing X" |
| Eco-business inclusion strengthens economic-environmental link | Business registration activity (50 pts) | `eco-business` activity in `rewardActivities[]` |
| Mobile-first access in island context (GSMA, 2023) | Rewards page fully responsive; touch-friendly tier cards | Tailwind responsive classes on RewardsPage |

---

## 7. Sources

Barandiaran, X., Calleja-López, A., Monterde, A., Pereira, I., & Subirats, J. (2018). *Decidim: Political and technopolitical networks for participatory democracy*. Ajuntament de Barcelona. https://www.decidim.org

Deterding, S., Dixon, D., Khaled, R., & Nacke, L. (2011). From game design elements to gamefulness: Defining "gamification." In *Proceedings of the 15th International Academic MindTrek Conference* (pp. 9–15). ACM. https://doi.org/10.1145/2181037.2181040

European Commission. (2022). *Digital Economy and Society Index (DESI) 2022 — Greece country profile*. Publications Office of the European Union. https://digital-strategy.ec.europa.eu/en/policies/desi

European Commission. (2023). *Eurobarometer 99 (Spring 2023): Public opinion in the European Union*. Directorate-General for Communication. https://europa.eu/eurobarometer

Fung, A. (2006). Varieties of participation in complex governance. *Public Administration Review*, 66(s1), 66–75. https://doi.org/10.1111/j.1540-6210.2006.00667.x

GSMA Intelligence. (2023). *The mobile economy Europe 2023*. GSMA. https://www.gsma.com/mobileeconomy/europe/

Hamari, J., Koivisto, J., & Sarsa, H. (2014). Does gamification work? A literature review of empirical studies on gamification. In *Proceedings of the 47th Hawaii International Conference on System Sciences (HICSS)* (pp. 3025–3034). IEEE. https://doi.org/10.1109/HICSS.2014.377

MySociety. (2019). *FixMyStreet impact report 2019: What happens when you report?* MySociety. https://www.mysociety.org/research/

Peffers, K., Tuunanen, T., Rothenberger, M. A., & Chatterjee, S. (2007). A design science research methodology for information systems research. *Journal of Management Information Systems*, 24(3), 45–77. https://doi.org/10.2753/MIS0742-1222240302

Putnam, R. D. (1993). *Making democracy work: Civic traditions in modern Italy*. Princeton University Press.

Venkatesh, V., Morris, M. G., Davis, G. B., & Davis, F. D. (2003). User acceptance of information technology: Toward a unified view. *MIS Quarterly*, 27(3), 425–478. https://doi.org/10.2307/30036540
