# Evaluation Plan — ZOE Platform

## 1. Purpose of This Document

This document defines how the ZOE platform artefact will be evaluated following the demonstration phase (Phase 1). It follows the Venable, Pries-Heje & Baskerville (2016) FEDS (Framework for Evaluation in Design Science) and adapts it to the specific context of a municipal sustainability participation platform.

Evaluation is the fifth activity in the Peffers et al. (2007) DSRM process. It is essential for Design Science Research because the artefact's value must be demonstrated empirically, not just asserted.

---

## 2. Validation vs Evaluation

| Concept | Definition | In This Project |
|---|---|---|
| **Validation** | Checking that the artefact is built correctly (technically sound) | TypeScript compilation, ESLint, build passes, navigation works, form shows success message |
| **Evaluation** | Checking that the artefact works well for its intended purpose | User testing, expert review, usefulness assessment |

Version 1 has passed **validation** (the build succeeds and all pages are functional). **Evaluation** is the next step and requires human participants.

---

## 3. Formative vs Summative Evaluation

### Formative evaluation (planned for Phase 2–3)
- Conducted during the design and iteration process
- Goal: identify problems and improve the artefact
- Methods: think-aloud testing, expert walkthroughs, semi-structured interviews
- Small number of participants (5–10 per cycle) is sufficient

### Summative evaluation (planned for Phase 3–4)
- Conducted after a stable version is available
- Goal: assess overall quality and impact
- Methods: quantitative usability survey (SUS), larger-scale interviews
- Requires more participants (15–30 recommended)

---

## 4. Artificial vs Naturalistic Evaluation

### Artificial evaluation (suitable for Phases 2–3)
- Conducted in a controlled setting (e.g., lab, office, video call)
- Researcher observes participants using the prototype
- Good for identifying usability issues
- Lower ecological validity but easier to control

### Naturalistic evaluation (suitable for Phase 4–5)
- Conducted with real citizens using the real deployed platform
- Higher ecological validity — data reflects actual use
- Requires real backend and public deployment
- Appropriate for summative evaluation

---

## 5. Evaluation Criteria

The ZOE platform should be evaluated against six criteria:

### 1. Usefulness
**Definition:** Does the platform provide citizens with value? Do they find it worth visiting?  
**Indicators:** Participants can articulate how they would use the platform; they identify a participation mode they would use; they report the information is valuable.  
**Method:** Post-session interview: "Would you use this platform if it were real? For what?"

### 2. Usability
**Definition:** Can users navigate and accomplish tasks without confusion or errors?  
**Indicators:** Task completion rates, time-on-task, error counts, SUS score ≥ 68 (average).  
**Method:** Think-aloud task scenarios (find a project, register interest, find an event); System Usability Scale (SUS, 10 items).

### 3. Completeness
**Definition:** Does the platform cover all information areas citizens need to understand the ZOE programme?  
**Indicators:** Users do not report major missing information; experts do not identify significant information gaps.  
**Method:** Expert review checklist; participant interview: "Is there information you needed but could not find?"

### 4. Accessibility
**Definition:** Can the platform be used by people with different abilities, technical literacy levels, and devices?  
**Indicators:** WCAG 2.1 AA audit results; no critical accessibility violations; readable on mobile.  
**Method:** Automated audit (axe-core or Lighthouse); manual keyboard navigation check; test with one participant over 60 years old.

### 5. Transparency
**Definition:** Does the platform help citizens feel informed about municipal environmental actions and outcomes?  
**Indicators:** Participants report they trust the information presented; they understand what is real data vs prototype data.  
**Method:** Post-session interview: "Do you feel the municipality is being transparent? Do you trust the data?" Note: the prototype label is intentional — evaluate whether it is understood.

### 6. Participation Support
**Definition:** Does the platform motivate and enable citizens to participate in environmental governance?  
**Indicators:** Participants identify at least one participation action they would take; participation intent scores; conversion of form interactions.  
**Method:** Interview: "Which participation option would you use? What would stop you?" Observe whether participants click through to the participation form.

---

## 6. Suggested Evaluation Protocol

### Participants
- **Minimum:** 8 participants for formative evaluation
- **Target:** 5 citizens (diverse age/background) + 3 municipality staff + 2 IS/sustainability researchers
- **Recruitment:** Via municipality contact list, university network

### Session structure (60–90 minutes)
1. **Introduction (5 min):** Explain purpose, consent, recording
2. **Background (5 min):** Questions on prior experience with municipal platforms, environmental concern level
3. **Exploration (10 min):** Let participant explore freely, think aloud
4. **Guided tasks (20 min):**
   - "Find the project about wetland restoration and tell me what citizens can do"
   - "How would you submit an idea for a new project?"
   - "Find an upcoming event you could attend"
   - "What does the municipality's SDG 13 progress look like?"
5. **SUS questionnaire (5 min)**
6. **Semi-structured interview (20–30 min):** Open questions on criteria above
7. **Debrief (5 min)**

### Data collection
- Audio/video recording (with consent)
- Facilitator notes on task completion, errors, expressions of confusion
- SUS scores (numeric)
- Interview transcript or detailed notes

---

## 7. Interview and Survey Questions

### Pre-session background questions
1. How often do you interact with municipal services online? (1–5 scale)
2. How concerned are you about environmental issues in Northern Corfu? (1–5)
3. Have you previously participated in any municipal environmental initiative? (Yes/No + details)

### Post-session SUS (System Usability Scale)
Standard 10-item SUS questionnaire with 5-point Likert responses.

### Post-session open interview questions

**Usefulness**
- "Would you use this platform if it were live? What would you use it for?"
- "What information was most valuable to you?"
- "Was there information you expected but did not find?"

**Transparency**
- "Do you feel this platform makes municipal environmental work more transparent?"
- "Did you trust the information you saw? What would make you trust it more?"

**Participation**
- "Which participation option most appeals to you and why?"
- "What would stop you from participating through this platform?"
- "How does this compare to how you currently learn about environmental issues locally?"

**Overall**
- "What is the single most important improvement you would suggest?"
- "Who else should use this platform?"

---

## 8. How Findings Should Lead to Iterations

Following DSR iterative principles:

1. **Collect evaluation data** → transcribe, code, theme
2. **Identify recurring issues** → group by evaluation criterion
3. **Prioritise changes** → distinguish critical (blocking) vs desirable improvements
4. **Update artefact** → implement the most important changes in the next version
5. **Document decisions** → update `docs/artifact-description.md` with design changes and rationale
6. **Re-evaluate** — at least one follow-up session to verify improvements worked

**Iteration rule:** Never make more changes than can be described in the evaluation report. If you change everything at once, you cannot explain what caused improvements.

---

## 9. Evaluation Timing

| Phase | Evaluation type | Expected by |
|---|---|---|
| Phase 1 (current) | Validation only | Spring 2025 |
| Phase 2 | Formative, artificial (5 sessions) | Summer 2025 |
| Phase 3 | Expert walkthroughs + SUS | Autumn 2025 |
| Phase 4 | Naturalistic formative (real backend) | 2026 |
| Phase 5 | Summative, naturalistic | 2026–2027 |
