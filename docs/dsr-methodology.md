# DSR Methodology — ZOE Platform

## 1. What Is Design Science Research?

Design Science Research (DSR) is a research paradigm in Information Systems that focuses on the **creation and evaluation of novel artefacts** to solve real-world problems. Unlike behavioural research, which seeks to explain or predict phenomena, DSR aims to **prescribe** solutions — designing something that didn't exist before and demonstrating that it works.

Key DSR references for this project:
- **Hevner et al. (2004)** — Seven guidelines for DSR in IS, establishing the field's foundational principles
- **Peffers et al. (2007)** — The DSR Methodology (DSRM) process model, providing a structured six-step workflow
- **Gregor & Hevner (2013)** — Knowledge contribution types in DSR

---

## 2. Why This Project Is Design Research (Not Behavioural Research)

| Dimension | Behavioural Research | This Project (DSR) |
|---|---|---|
| Goal | Explain/predict phenomena | Design and evaluate an artefact |
| Method | Surveys, experiments, case studies | Artefact construction + demonstration + evaluation |
| Output | Theory, propositions | Platform prototype + design knowledge |
| Problem | What IS? | What SHOULD BE? |

This project creates something new — a digital platform concept for environmental governance transparency — rather than explaining existing phenomena. The ZOE platform does not yet exist; we are designing and demonstrating it.

---

## 3. Artefact Definition

Following Hevner et al. (2004), DSR artefacts can be constructs, models, methods, or instantiations.

**Artefact type:** Instantiation (a working prototype system)

**Artefact name:** ZOE Sustainability Platform (Version 1 — Frontend MVP)

**Artefact composition:**
- A React TypeScript single-page application
- An information architecture for municipal environmental transparency
- Citizen participation interaction patterns
- SDG communication design
- Design knowledge encoded in documentation

---

## 4. Peffers et al. (2007) DSR Process Mapping

The Peffers DSRM defines six activities. Here is how each maps to this project:

### Activity 1: Problem Identification and Motivation

**Problem:** Municipalities running environmental action programmes lack effective digital tools to:
1. Communicate progress transparently to citizens
2. Enable meaningful citizen participation
3. Visualise alignment with global sustainability frameworks (SDGs)
4. Maintain accountability for environmental spending

**Specific context:** Northern Corfu municipality runs the ZOE environmental programme across eight project domains, but citizens have no single access point to view, understand, or contribute to these efforts.

**Motivation:** Digital participation platforms have been shown to increase civic engagement in sustainability governance (Falco & Kleinhans, 2018). However, local municipalities — especially small ones — rarely have such tools. Designing one demonstrates both feasibility and desirability.

### Activity 2: Define Objectives of a Solution

The ZOE platform should:
1. Allow any citizen to browse environmental projects with real progress data
2. Show how local actions contribute to specific UN SDGs
3. Provide multiple meaningful participation pathways (volunteer, submit idea, report issue, attend event, give feedback)
4. Present impact metrics transparently, with honest labelling of data quality
5. Function without requiring user accounts for basic access
6. Be accessible on mobile devices
7. Support future evolution to a full backend system

### Activity 3: Design and Development

**This prototype (Phase 1) implements:**
- Frontend-only React application with React Router
- Eight environmental projects with realistic dummy data
- SDG dashboard with nine relevant goals
- Citizen participation page with local-only form submission
- Events listing and impact metrics page
- Responsive design using Tailwind CSS

**Design decisions documented in:** `docs/artifact-description.md` and `docs/architecture.md`

**Dummy data rationale:** Since no real backend or dataset exists yet, all data is fictional but realistic, based on the types of actions described in municipal sustainability plans for Greek municipalities and comparable European programmes.

### Activity 4: Demonstration

**Demonstration audience:**
- University seminar instructors and peers
- Municipality of Northern Corfu stakeholders (if available)
- Citizens of Northern Corfu (as future users)

**Demonstration artefact:** This repository and running prototype at `npm run dev`

**Demonstration scope:**
- Walk through each page showing the information architecture
- Show the citizen participation form workflow (local mock)
- Show the SDG dashboard and project filtering
- Show the project detail page with transparency metrics

### Activity 5: Evaluation

Evaluation is planned but not yet completed for Version 1.  
See `docs/evaluation-plan.md` for the full evaluation design.

**Summary of planned evaluation:**
- Formative evaluation with 5–10 users (municipality staff + citizens)
- Expert walkthroughs with IS/HCI researchers
- System Usability Scale (SUS) questionnaire
- Semi-structured interviews on usefulness and participation intent
- DSR artefact quality criteria check

### Activity 6: Communication

**Communication outputs for this version:**
- This repository (academic and technical documentation)
- `docs/` folder (methodology, architecture, evaluation)
- University seminar presentation and report
- Potential stakeholder presentation to municipality

**Future communication:**
- Academic paper submission after evaluation (if findings are significant)
- Presentation to Northern Corfu municipality council

---

## 5. DSR Grid

The DSR Grid (adapted from Hevner et al., 2004) maps this project across knowledge and design dimensions:

| | **Application Domain** | **Knowledge Base** |
|---|---|---|
| **Problem** | Municipal environmental governance transparency; low citizen participation in ZOE programme | Literature on e-participation, digital governance, sustainability communication, SDGs |
| **Solution** | ZOE digital platform — DSR instantiation artefact | React/TypeScript frontend, citizen engagement patterns, SDG visualisation |
| **Research Rigour** | Grounded in Peffers DSRM; evaluation plan follows Venable et al. (2016) | IS research methods; usability evaluation; participatory design |
| **Research Relevance** | Addresses a real problem for a real municipality; scalable to other small municipalities | Contributes design knowledge for municipal sustainability platforms |

---

## 6. Relevance Cycle

The relevance cycle connects the application domain (Northern Corfu, ZOE programme) to the DSR activities:

1. **Environment inputs:** Municipal sustainability goals, citizen needs, EU Green Deal, SDG framework
2. **Requirements:** Platform must serve citizens, municipality staff, and researchers
3. **Artefact outputs feed back:** Platform design informs municipality communication strategy; evaluation findings inform future iterations

---

## 7. Rigor Cycle

The rigor cycle ensures the research is grounded in existing knowledge:

- **IS theory:** DSR methodology (Hevner, Peffers), e-participation theory (Macintosh, 2004), digital governance
- **Technical knowledge:** React ecosystem, frontend architecture patterns, progressive enhancement
- **Domain knowledge:** UN SDGs, European environmental governance, participatory sustainability
- **Evaluation knowledge:** Formative/summative evaluation (Venable et al., 2016), usability evaluation (Nielsen, 1994)

---

## 8. Contribution Type

Following Gregor & Hevner (2013):

**Contribution type:** "Improvement" — applying known technology (React, web applications) to solve a problem in a new application domain (municipal environmental governance in a Greek island municipality).

**Design knowledge contribution:** A reference information architecture for municipal environmental transparency platforms, documented in `docs/architecture.md`.

---

## 9. Iterativeness

This prototype is explicitly **Version 1**. DSR is inherently iterative. The roadmap (`docs/roadmap.md`) defines:

- **Version 1 (current):** Frontend MVP with dummy data — demonstration phase
- **Version 2:** UX improvement + formative evaluation + Greek language
- **Version 3:** DSR evaluation + iteration based on findings
- **Version 4:** Backend integration + real data
- **Version 5:** Production deployment + summative evaluation

Each version should be preceded by evaluation and followed by documented iteration rationale.
