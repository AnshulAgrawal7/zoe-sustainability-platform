// PROTOTYPE SEED DATA — ZOE Sustainability Platform
// Admin:    admin@zoe-corfu.gr / ZoeAdmin2026!
// Users:    citizen1@example.com, citizen2@example.com, tourist@example.com / Test1234!

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ZOE prototype database...');

  const adminHash = await bcrypt.hash('ZoeAdmin2026!', 12);
  const userHash = await bcrypt.hash('Test1234!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@zoe-corfu.gr' },
    update: { profile: 'VOLUNTEER' },
    create: { email: 'admin@zoe-corfu.gr', password: adminHash, name: 'ZOE Admin', role: 'ADMIN', points: 0, language: 'EN', profile: 'VOLUNTEER' },
  });

  const citizen1 = await prisma.user.upsert({
    where: { email: 'citizen1@example.com' },
    update: { profile: 'RESIDENT' },
    create: { email: 'citizen1@example.com', password: userHash, name: 'Maria Papadopoulou', role: 'USER', points: 320, language: 'EL', profile: 'RESIDENT' },
  });

  const citizen2 = await prisma.user.upsert({
    where: { email: 'citizen2@example.com' },
    update: { profile: 'STUDENT' },
    create: { email: 'citizen2@example.com', password: userHash, name: 'Nikos Stavros', role: 'USER', points: 150, language: 'EL', profile: 'STUDENT' },
  });

  const tourist = await prisma.user.upsert({
    where: { email: 'tourist@example.com' },
    update: { profile: 'VISITOR' },
    create: { email: 'tourist@example.com', password: userHash, name: 'Hans Mueller', role: 'USER', points: 50, language: 'DE', profile: 'VISITOR' },
  });

  const badges = await Promise.all([
    prisma.badge.upsert({
      where: { id: 'badge-newcomer' },
      update: {},
      create: { id: 'badge-newcomer', nameEn: 'Newcomer', nameEl: 'Νεοφερμένος', nameDe: 'Neuling', descEn: 'Welcome to ZOE! You joined the community.', descEl: 'Καλωσήρθατε στο ZOE!', descDe: 'Willkommen bei ZOE!', iconName: 'Sprout', threshold: 0 },
    }),
    prisma.badge.upsert({
      where: { id: 'badge-activist' },
      update: {},
      create: { id: 'badge-activist', nameEn: 'Activist', nameEl: 'Ακτιβιστής', nameDe: 'Aktivist', descEn: 'Earned 100 points by participating in ZOE projects.', descEl: 'Κέρδισες 100 πόντους.', descDe: '100 Punkte verdient.', iconName: 'Flame', threshold: 100 },
    }),
    prisma.badge.upsert({
      where: { id: 'badge-eco-hero' },
      update: {},
      create: { id: 'badge-eco-hero', nameEn: 'Eco Hero', nameEl: 'Οικολογικός Ήρωας', nameDe: 'Umweltheld', descEn: 'Outstanding commitment to Corfu\'s environment.', descEl: 'Εξαιρετική δέσμευση για το περιβάλλον.', descDe: 'Herausragendes Umweltengagement.', iconName: 'Leaf', threshold: 300 },
    }),
    prisma.badge.upsert({
      where: { id: 'badge-ambassador' },
      update: {},
      create: { id: 'badge-ambassador', nameEn: 'Ambassador', nameEl: 'Πρεσβευτής', nameDe: 'Botschafter', descEn: 'You represent ZOE\'s values to your community.', descEl: 'Εκπροσωπείς τις αξίες του ZOE.', descDe: 'Du vertrittst ZOEs Werte.', iconName: 'Star', threshold: 500 },
    }),
    prisma.badge.upsert({
      where: { id: 'badge-legend' },
      update: {},
      create: { id: 'badge-legend', nameEn: 'Legend', nameEl: 'Θρύλος', nameDe: 'Legende', descEn: 'A legendary contribution to sustainability in Northern Corfu.', descEl: 'Θρυλική συνεισφορά στη βιωσιμότητα.', descDe: 'Legendärer Nachhaltigkeitsbeitrag.', iconName: 'Trophy', threshold: 1000 },
    }),
  ]);

  // Real ZOE measures (one+ per documented axis). Facts/figures: Verde.tec award
  // for the Municipality of North Corfu, Feb 2026 (life-news.gr, 03.03.2026), with
  // additional context from Attica Green Expo 2026 (kerkyrasimera.gr), the
  // ODEK/ARCHELON cooperation (Corfu TV News, 31.07.2025) and a parliamentary
  // question on turtle deaths (Corfu Stories, 15.04.2026) — programme statements,
  // NOT measured impact. SDGs from the official programme set
  // {4,6,11,12,13,14,15,17}. No figures beyond the sources are added.
  const SRC = 'Verde.tec 2026 / life-news.gr';
  const makeProject = (id: string, en: string, el: string, de: string, descEn: string, descEl: string, descDe: string, sdgs: number[], category: string, points: number, location: string, status = 'OPEN', imageUrl: string | null = null, sourceNote: string | null = SRC) =>
    prisma.project.upsert({
      where: { id },
      update: {},
      create: { id, titleEn: en, titleEl: el, titleDe: de, descriptionEn: descEn, descriptionEl: descEl, descriptionDe: descDe, sdgIds: JSON.stringify(sdgs), category, status, rewardPoints: points, location, imageUrl, sourceNote, createdById: admin.id },
    });

  const [p1, p2, p3, p4, p5, p6, p7, p8] = await Promise.all([
    // Mobility
    makeProject('proj-greenmove', 'GreenMove — Sustainable Mobility', 'GreenMove — Βιώσιμη Κινητικότητα', 'GreenMove — Nachhaltige Mobilität', 'Sustainable urban mobility for North Corfu under the EU programme GreenMove — promoting low-emission transport and active mobility.', 'Βιώσιμη αστική κινητικότητα για τη Βόρεια Κέρκυρα στο πλαίσιο του ευρωπαϊκού προγράμματος GreenMove — μεταφορές χαμηλών εκπομπών και ήπια κινητικότητα.', 'Nachhaltige urbane Mobilität für Nordkorfu im Rahmen des EU-Programms GreenMove — emissionsarme und aktive Mobilität.', [11, 13], 'MOBILITY', 40, 'Municipality of North Corfu'),
    // Waste / circular economy
    makeProject('proj-circular', 'Circular Economy Network', 'Δίκτυο Κυκλικής Οικονομίας', 'Kreislaufwirtschafts-Netzwerk', 'Municipal circular-economy programme: in 2025 it diverted 2,682.699 t of residual waste from landfill — 15.08% of 17,787 t (programme figure: Attica Green Expo 2026 / kerkyrasimera.gr). It runs 20 recycling streams across 210 collection points (up to 95% sorting purity, a separate process measure) and educates 2,000+ pupils; host of the Circular Municipalities Forum (Feb 2025). Municipal programme data, not a ZOE impact measurement.', 'Δημοτικό πρόγραμμα κυκλικής οικονομίας: το 2025 εκτράπηκαν 2.682,699 t σύμμεικτων από την ταφή — 15,08% των 17.787 t (στοιχείο προγράμματος: Attica Green Expo 2026 / kerkyrasimera.gr). Λειτουργεί 20 ρεύματα ανακύκλωσης σε 210 σημεία συλλογής (καθαρότητα έως 95%) και εκπαιδεύει 2.000+ μαθητές· διοργανωτής του Φόρουμ Κυκλικών Δήμων (Φεβ. 2025). Στοιχεία προγράμματος, όχι μέτρηση επίδρασης.', 'Kommunales Kreislaufwirtschaftsprogramm: 2025 wurden 2.682,699 t Restmüll aus der Deponierung ausgeschleust — 15,08 % von 17.787 t (Programmangabe: Attica Green Expo 2026 / kerkyrasimera.gr). Es betreibt 20 Wertstoffströme an 210 Sammelpunkten (bis zu 95 % Sortenreinheit, eine separate Prozessgröße) und bildet 2.000+ Schüler:innen; Gastgeber des Forums der Kreislauf-Kommunen (Feb. 2025). Programmangaben, keine Wirkungsmessung.', [12, 11, 4], 'COMMUNITY', 50, 'Municipality-wide, North Corfu', 'OPEN', null, 'Attica Green Expo 2026 / kerkyrasimera.gr (diversion); Verde.tec 2026 (streams, points, purity, education)'),
    // Marine protection
    makeProject('proj-marine', 'Marine Protection & Sea Turtles', 'Προστασία Θάλασσας & Θαλάσσιες Χελώνες', 'Meeresschutz & Meeresschildkröten', 'Marine protection on the North Corfu coast: sea-turtle conservation with ARCHELON (nest fencing and awareness campaigns) and marine-mammal stranding response with ODEK Kerkyra, the local cetacean rescue team, plus a marine-mammal congress (May 2025). Action is still needed: 17 sea turtles were found dead off Corfu in Q1 2026 (parliamentary question; Corfu Stories, 15.04.2026).', 'Προστασία θάλασσας στις ακτές της Βόρειας Κέρκυρας: προστασία θαλάσσιων χελωνών με τον ΑΡΧΕΛΩΝ (περίφραξη φωλιών, εκστρατείες) και αντιμετώπιση εκβρασμών θαλάσσιων θηλαστικών με το ΟΔΕΚ Κέρκυρας, την τοπική ομάδα διάσωσης κητωδών, καθώς και συνέδριο θαλάσσιων θηλαστικών (Μάιος 2025). Η ανάγκη δράσης παραμένει: 17 θαλάσσιες χελώνες βρέθηκαν νεκρές το Α΄ τρίμηνο 2026 (κοινοβουλευτική ερώτηση· Corfu Stories, 15.04.2026).', 'Meeresschutz an der Küste Nordkorfus: Schutz von Meeresschildkröten mit ARCHELON (Nest-Einzäunungen, Kampagnen) und Bergung gestrandeter Meeressäuger durch ODEK Kerkyra, das lokale Rettungsteam für Wale und Delfine, sowie ein Kongress zu Meeressäugern (Mai 2025). Handlungsbedarf besteht weiter: 17 tote Meeresschildkröten im 1. Quartal 2026 (parlamentarische Anfrage; Corfu Stories, 15.04.2026).', [14, 15], 'ENVIRONMENT', 60, 'North Corfu coast', 'OPEN', null, 'Corfu TV News, 31.07.2025 (ODEK/ARCHELON); Corfu Stories, 15.04.2026 (turtle deaths)'),
    // Natural monuments
    makeProject('proj-antinioti', 'Antinioti Lagoon — Natural Monument', 'Λιμνοθάλασσα Αντινιώτη — Φυσικό Μνημείο', 'Antinioti-Lagune — Naturdenkmal', 'Protection of the Antinioti Lagoon, a Natura 2000 wetland between Kassiopi and Roda — part of ZOE\'s natural-monuments axis.', 'Προστασία της Λιμνοθάλασσας Αντινιώτη, υγρότοπος Natura 2000 — άξονας φυσικών μνημείων του ZOE.', 'Schutz der Antinioti-Lagune, eines Natura-2000-Feuchtgebiets — Teil der ZOE-Achse Naturdenkmäler.', [15, 6, 14], 'ENVIRONMENT', 65, 'Antinioti Lagoon, NE Corfu', 'OPEN', 'https://placehold.co/800x400/16a34a/ffffff?text=Antinioti+Lagoon'),
    makeProject('proj-natural-monuments', 'Natural Monuments & Reforestation', 'Φυσικά Μνημεία & Αναδάσωση', 'Naturdenkmäler & Aufforstung', 'Conservation and monitoring of North Corfu\'s natural monuments — Erimitis, the Nymfes waterfalls, the Agios Panteleimon lake basin and the Klimatia watermills — with reforestation.', 'Διατήρηση και παρακολούθηση φυσικών μνημείων: Ερημίτης, καταρράκτες Νυμφών, λεκάνη Αγίου Παντελεήμονα, νερόμυλοι Κληματιάς — με αναδάσωση.', 'Erhalt und Monitoring der Naturdenkmäler Nordkorfus — Erimitis, Wasserfälle von Nymfes, Seebecken Agios Panteleimon, Wassermühlen Klimatia — samt Aufforstung.', [15, 13], 'ENVIRONMENT', 65, 'Northern Corfu'),
    // Energy
    makeProject('proj-led', 'LED Street Lighting Upgrade', 'Αναβάθμιση Δημοτικού Φωτισμού σε LED', 'Umrüstung der Straßenbeleuchtung auf LED', 'Replacement of 4,866 municipal luminaires with energy-efficient LED, reducing energy use and CO₂ emissions across North Corfu (programme figure: Verde.tec 2026).', 'Αντικατάσταση 4.866 φωτιστικών σωμάτων με LED, μειώνοντας την κατανάλωση ενέργειας και τις εκπομπές CO₂.', 'Austausch von 4.866 Leuchten gegen energieeffiziente LED — geringerer Energieverbrauch und CO₂-Ausstoß.', [12, 13], 'COMMUNITY', 45, 'Municipality-wide, North Corfu', 'COMPLETED', 'https://placehold.co/800x400/f59e0b/ffffff?text=LED+Upgrade'),
    // Education / participation
    makeProject('proj-education', 'Environmental Education & University Partnership', 'Περιβαλλοντική Εκπαίδευση & Πανεπιστημιακή Συνεργασία', 'Umweltbildung & Universitätspartnerschaft', 'Environmental education and research with the Ionian University and the University of Nuremberg — scientific congresses and active student participation.', 'Περιβαλλοντική εκπαίδευση και έρευνα με το Ιόνιο Πανεπιστήμιο και το Πανεπιστήμιο της Νυρεμβέργης — επιστημονικά συνέδρια και συμμετοχή φοιτητών.', 'Umweltbildung und Forschung mit der Ionischen Universität und der Universität Nürnberg — wissenschaftliche Kongresse und Studierendenbeteiligung.', [4, 17], 'EDUCATION', 55, 'North Corfu / Ionian University'),
    // Natural monuments — freshwater
    makeProject('proj-water-quality', 'Drinking Water Quality Monitoring', 'Παρακολούθηση Ποιότητας Πόσιμου Νερού', 'Trinkwasserqualitäts-Monitoring', 'Monitoring of drinking-water quality and protection of freshwater sources across North Corfu, including the Agios Panteleimon basin.', 'Παρακολούθηση ποιότητας πόσιμου νερού και προστασία πηγών γλυκού νερού στη Βόρεια Κέρκυρα, μεταξύ άλλων στη λεκάνη Αγίου Παντελεήμονα.', 'Überwachung der Trinkwasserqualität und Schutz der Süßwasserquellen in Nordkorfu, u. a. im Becken von Agios Panteleimon.', [6, 11], 'ENVIRONMENT', 45, 'Northern Corfu'),
  ]);

  // --- Demo events (concrete dates for the real projects above). DEMO/PROGRAMME
  // DATA: plausible illustrative dates, not official municipal fixtures. Ids reuse
  // the legacy `evt-*` keys so any historical EventRegistration rows stay linked.
  const makeEvent = (
    id: string,
    titleEn: string, titleEl: string, titleDe: string,
    descEn: string, descEl: string, descDe: string,
    date: string, location: string, category: string,
    projectId: string | null, rewardPoints = 20, capacity: number | null = null,
  ) =>
    prisma.event.upsert({
      where: { id },
      update: {},
      create: {
        id, titleEn, titleEl, titleDe,
        descriptionEn: descEn, descriptionEl: descEl, descriptionDe: descDe,
        date: new Date(date), location, category, rewardPoints, capacity, projectId,
      },
    });

  await Promise.all([
    makeEvent('evt-cleanup-jun25',
      'Northern Coastline Cleanup Day', 'Ημέρα Καθαρισμού Βόρειας Ακτής', 'Küstenreinigungstag Nordkorfu',
      'Monthly coastal cleanup with ARCHELON volunteers. Equipment and a citizen-science litter sheet provided; communal breakfast afterwards. All ages welcome.',
      'Μηνιαίος παράκτιος καθαρισμός με εθελοντές του ΑΡΧΕΛΩΝ. Παρέχονται εξοπλισμός και φύλλο καταγραφής απορριμμάτων· κοινό πρωινό μετά. Για όλες τις ηλικίες.',
      'Monatliche Küstenreinigung mit ARCHELON-Freiwilligen. Ausrüstung und Citizen-Science-Bogen werden gestellt; gemeinsames Frühstück danach. Für alle Altersgruppen.',
      '2026-07-12T09:00:00.000Z', 'Kassiopi Beach, North Corfu', 'ENVIRONMENT', 'proj-marine', 25, 80),
    makeEvent('evt-cleanup-jul25',
      'Second Coastline Cleanup', 'Δεύτερος Παράκτιος Καθαρισμός', 'Zweite Küstenreinigung',
      'Follow-up cleanup along the Almyros stretch, focusing on micro-litter and ghost nets. Boats provided by local fishers.',
      'Συνέχεια καθαρισμού στην παραλία Αλμυρού, με έμφαση στα μικροαπορρίμματα και τα εγκαταλελειμμένα δίχτυα. Σκάφη από τοπικούς αλιείς.',
      'Folge-Reinigung am Strandabschnitt Almyros mit Fokus auf Mikromüll und Geisternetze. Boote von lokalen Fischer:innen.',
      '2026-07-19T09:00:00.000Z', 'Almyros Beach, North Corfu', 'ENVIRONMENT', 'proj-marine', 25, 60),
    makeEvent('evt-biodiversity-workshop',
      'Wetland Biodiversity Walk', 'Περιήγηση Βιοποικιλότητας Υγροτόπου', 'Biodiversitäts-Spaziergang im Feuchtgebiet',
      'Guided walk around the Antinioti Lagoon to identify wetland birds and plants. Led by local naturalists; binoculars provided.',
      'Καθοδηγούμενη περιήγηση στη Λιμνοθάλασσα Αντινιώτη για αναγνώριση πτηνών και φυτών. Με τοπικούς φυσιοδίφες· παρέχονται κιάλια.',
      'Geführter Rundgang an der Antinioti-Lagune zur Bestimmung von Vögeln und Pflanzen. Mit lokalen Naturkundigen; Ferngläser werden gestellt.',
      '2026-07-26T08:30:00.000Z', 'Antinioti Lagoon, NE Corfu', 'ENVIRONMENT', 'proj-antinioti', 20, 25),
    makeEvent('evt-recycling-hub',
      'Recycling Hub Open Day', 'Ημέρα Ανοιχτών Θυρών Κέντρου Ανακύκλωσης', 'Tag der offenen Tür im Recycling-Hub',
      'Tour the municipal sorting hub, see the 20 recycling streams in action and join sorting games for children.',
      'Ξενάγηση στο δημοτικό κέντρο διαλογής, παρουσίαση των 20 ρευμάτων ανακύκλωσης και παιχνίδια διαλογής για παιδιά.',
      'Führung durch das kommunale Sortierzentrum, die 20 Wertstoffströme in Aktion und Sortierspiele für Kinder.',
      '2026-08-02T11:00:00.000Z', 'Municipal Hub, North Corfu', 'COMMUNITY', 'proj-circular', 20, 150),
    makeEvent('evt-composting-expansion',
      'Community Composting Planning', 'Σχεδιασμός Κοινοτικής Κομποστοποίησης', 'Planung der Gemeinschaftskompostierung',
      'Open planning meeting for villages joining the next composting wave. Hear the pilot results and register interest.',
      'Ανοιχτή συνάντηση σχεδιασμού για χωριά που εντάσσονται στο επόμενο κύμα κομποστοποίησης. Αποτελέσματα πιλότου και δήλωση ενδιαφέροντος.',
      'Offenes Planungstreffen für Dörfer der nächsten Kompostierungswelle. Pilot-Ergebnisse und Interessenbekundung.',
      '2026-08-23T18:30:00.000Z', 'Town Hall, North Corfu', 'COMMUNITY', 'proj-circular', 20, 80),
    makeEvent('evt-water-monitoring',
      'Citizen Water Monitor Training', 'Εκπαίδευση Εθελοντών Παρακολούθησης Νερού', 'Schulung Wasser-Monitoring',
      'Full-day training for new volunteer water-quality monitors: test kits, GPS data entry and the reporting protocol. Certification on completion.',
      'Ολοήμερη εκπαίδευση νέων εθελοντών: κιτ ελέγχου, καταχώριση GPS και πρωτόκολλο αναφοράς. Πιστοποίηση με την ολοκλήρωση.',
      'Ganztägige Schulung für neue Freiwillige: Testkits, GPS-Dateneingabe und Meldeprotokoll. Zertifikat nach Abschluss.',
      '2026-08-30T08:30:00.000Z', 'Acharavi, North Corfu', 'ENVIRONMENT', 'proj-water-quality', 30, 15),
    makeEvent('evt-reforestation-day',
      'Reforestation Volunteer Day', 'Ημέρα Εθελοντικής Αναδάσωσης', 'Aufforstungs-Freiwilligentag',
      'Plant native trees on a fire-affected slope near the Nymfes waterfalls. Tools and saplings provided.',
      'Φύτευση ιθαγενών δέντρων σε πληγείσα από πυρκαγιά πλαγιά κοντά στους καταρράκτες Νυμφών. Παρέχονται εργαλεία και δενδρύλλια.',
      'Pflanzung heimischer Bäume an einem brandgeschädigten Hang nahe den Nymfes-Wasserfällen. Werkzeug und Setzlinge gestellt.',
      '2026-09-13T09:00:00.000Z', 'Nymfes, North Corfu', 'ENVIRONMENT', 'proj-natural-monuments', 25, 50),
    makeEvent('evt-youth-eco',
      'Youth Eco Workshop', 'Εργαστήριο Νέων για το Περιβάλλον', 'Jugend-Umweltworkshop',
      'Hands-on sustainability workshop for secondary students with the Ionian University. Project ideas pitched by youth teams.',
      'Πρακτικό εργαστήριο βιωσιμότητας για μαθητές με το Ιόνιο Πανεπιστήμιο. Ομάδες νέων παρουσιάζουν ιδέες έργων.',
      'Praxis-Nachhaltigkeitsworkshop für Schüler:innen mit der Ionischen Universität. Jugendteams stellen Projektideen vor.',
      '2026-09-20T09:00:00.000Z', 'Ionian University, Corfu', 'EDUCATION', 'proj-education', 20, 30),
    makeEvent('evt-sdg-forum',
      'Annual ZOE SDG Forum', 'Ετήσιο Φόρουμ SDG του ZOE', 'Jährliches ZOE-SDG-Forum',
      'Public forum on ZOE programme results, SDG progress and community priorities for next year. All citizens welcome; translation available.',
      'Δημόσιο φόρουμ για τα αποτελέσματα του ZOE, την πρόοδο SDG και τις προτεραιότητες της κοινότητας. Ανοιχτό σε όλους· διαθέσιμη μετάφραση.',
      'Öffentliches Forum zu ZOE-Ergebnissen, SDG-Fortschritt und Prioritäten. Alle Bürger:innen willkommen; Übersetzung verfügbar.',
      '2026-09-27T09:00:00.000Z', 'Kassiopi Community Hall', 'COMMUNITY', null, 30, 200),
  ]);

  // Participations
  const upsertParticipation = (userId: string, projectId: string, points: number) =>
    prisma.participation.upsert({
      where: { userId_projectId: { userId, projectId } },
      update: {},
      create: { userId, projectId, pointsAwarded: points },
    });

  await Promise.all([
    upsertParticipation(citizen1.id, p1.id, 75),
    upsertParticipation(citizen1.id, p2.id, 50),
    upsertParticipation(citizen1.id, p5.id, 65),
    upsertParticipation(citizen1.id, p7.id, 55),
    upsertParticipation(citizen2.id, p2.id, 50),
    upsertParticipation(citizen2.id, p6.id, 35),
    upsertParticipation(tourist.id, p2.id, 50),
  ]);

  // Badges earned
  const upsertBadge = (userId: string, badgeId: string) =>
    prisma.userBadge.upsert({ where: { userId_badgeId: { userId, badgeId } }, update: {}, create: { userId, badgeId } });

  await Promise.all([
    upsertBadge(citizen1.id, badges[0].id),
    upsertBadge(citizen1.id, badges[1].id),
    upsertBadge(citizen1.id, badges[2].id),
    upsertBadge(citizen2.id, badges[0].id),
    upsertBadge(citizen2.id, badges[1].id),
    upsertBadge(tourist.id, badges[0].id),
  ]);

  // --- News / blog posts (manual + auto-style, linked to projects where relevant) ---
  const makePost = (
    id: string, type: string,
    titleEn: string, titleEl: string, titleDe: string,
    bodyEn: string, bodyEl: string, bodyDe: string,
    projectId: string | null = null, imageUrl: string | null = null,
  ) =>
    prisma.post.upsert({
      where: { id },
      update: {},
      create: { id, type, titleEn, titleEl, titleDe, bodyEn, bodyEl, bodyDe, projectId, imageUrl, published: true },
    });

  await Promise.all([
    makePost('post-welcome', 'ANNOUNCEMENT',
      'Welcome to the ZOE platform', 'Καλωσήρθατε στην πλατφόρμα ZOE', 'Willkommen auf der ZOE-Plattform',
      'ZOE brings transparency and citizen participation to sustainability projects across Northern Corfu. Explore projects, join events, and earn rewards for your community.',
      'Το ZOE φέρνει διαφάνεια και συμμετοχή των πολιτών στα έργα βιωσιμότητας σε όλη τη Βόρεια Κέρκυρα. Εξερευνήστε έργα, λάβετε μέρος σε εκδηλώσεις και κερδίστε ανταμοιβές.',
      'ZOE bringt Transparenz und Bürgerbeteiligung in Nachhaltigkeitsprojekte in ganz Nordkorfu. Entdecke Projekte, nimm an Veranstaltungen teil und sammle Belohnungen für deine Gemeinde.'),
    makePost('post-completed-led', 'PROJECT_COMPLETED',
      'Completed: 4,866 luminaires upgraded to LED', 'Ολοκληρώθηκε: 4.866 φωτιστικά σε LED', 'Abgeschlossen: 4.866 Leuchten auf LED umgerüstet',
      'The municipality has replaced 4,866 luminaires with energy-efficient LED, cutting energy use and CO₂ emissions across North Corfu. (Programme figure: Verde.tec 2026.)',
      'Ο Δήμος αντικατέστησε 4.866 φωτιστικά με LED, μειώνοντας την ενέργεια και τις εκπομπές CO₂.',
      'Die Gemeinde hat 4.866 Leuchten gegen LED ausgetauscht — weniger Energie und CO₂.',
      p6.id, 'https://placehold.co/800x400/f59e0b/ffffff?text=LED+Upgrade'),
    makePost('post-new-marine', 'PROJECT_NEW',
      'New: Sea-turtle protection with ARCHELON', 'Νέο: Προστασία θαλάσσιων χελωνών με τον ΑΡΧΕΛΩΝ', 'Neu: Schutz von Meeresschildkröten mit ARCHELON',
      'North Corfu protects sea-turtle nests with ARCHELON (fencing and awareness campaigns); marine-mammal strandings are handled by ODEK Kerkyra, the local cetacean (whale and dolphin) rescue team.',
      'Η Βόρεια Κέρκυρα προστατεύει τις φωλιές θαλάσσιων χελωνών με τον ΑΡΧΕΛΩΝ (περιφράξεις, εκστρατείες)· τους εκβρασμούς θαλάσσιων θηλαστικών αναλαμβάνει το ΟΔΕΚ Κέρκυρας, η τοπική ομάδα διάσωσης κητωδών.',
      'Nordkorfu schützt Schildkröten-Nester mit ARCHELON (Einzäunung, Kampagnen); um gestrandete Meeressäuger kümmert sich ODEK Kerkyra, das lokale Rettungsteam für Wale und Delfine.',
      p3.id),
    makePost('post-circular-forum', 'ANNOUNCEMENT',
      'Circular Municipalities Forum hosted in North Corfu', 'Φόρουμ Κυκλικών Δήμων στη Βόρεια Κέρκυρα', 'Forum der Kreislauf-Kommunen in Nordkorfu',
      'North Corfu hosted the Circular Municipalities Forum (Feb 2025), part of a circular-economy programme spanning 20 recycling streams and 210 collection points.',
      'Η Βόρεια Κέρκυρα φιλοξένησε το Φόρουμ Κυκλικών Δήμων (Φεβ. 2025), μέρος προγράμματος με 20 ρεύματα ανακύκλωσης και 210 σημεία συλλογής.',
      'Nordkorfu war Gastgeber des Forums der Kreislauf-Kommunen (Feb. 2025) — Teil eines Programms mit 20 Wertstoffströmen und 210 Sammelpunkten.',
      p2.id),
  ]);

  console.log(`Seeded: ${[p1,p2,p3,p4,p5,p6,p7,p8].length} projects, 4 users, 5 badges, 4 posts`);
  console.log('Admin:    admin@zoe-corfu.gr / ZoeAdmin2026!');
  console.log('Users:    citizen1@example.com, citizen2@example.com, tourist@example.com / Test1234!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
