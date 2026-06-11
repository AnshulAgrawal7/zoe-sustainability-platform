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
  const makeProject = (id: string, en: string, el: string, de: string, descEn: string, descEl: string, descDe: string, sdgs: number[], category: string, points: number, location: string, status = 'OPEN', imageUrl: string | null = null, sourceNote: string | null = SRC, listed = true) =>
    prisma.project.upsert({
      where: { id },
      update: {},
      create: { id, titleEn: en, titleEl: el, titleDe: de, descriptionEn: descEn, descriptionEl: descEl, descriptionDe: descDe, sdgIds: JSON.stringify(sdgs), category, status, rewardPoints: points, location, imageUrl, sourceNote, listed, createdById: admin.id },
    });

  const [p1, p2, p3, p4, p5, p6, p7, p8] = await Promise.all([
    // Mobility
    makeProject('proj-greenmove', 'GreenMove — Sustainable Mobility', 'GreenMove — Βιώσιμη Κινητικότητα', 'GreenMove — Nachhaltige Mobilität', 'Sustainable urban mobility for North Corfu under the EU programme GreenMove — promoting low-emission transport and active mobility.', 'Βιώσιμη αστική κινητικότητα για τη Βόρεια Κέρκυρα στο πλαίσιο του ευρωπαϊκού προγράμματος GreenMove — μεταφορές χαμηλών εκπομπών και ήπια κινητικότητα.', 'Nachhaltige urbane Mobilität für Nordkorfu im Rahmen des EU-Programms GreenMove — emissionsarme und aktive Mobilität.', [11, 13], 'MOBILITY', 40, 'Municipality of North Corfu'),
    // Waste / circular economy
    makeProject('proj-circular', 'Circular Economy Network', 'Δίκτυο Κυκλικής Οικονομίας', 'Kreislaufwirtschafts-Netzwerk', 'Municipal circular-economy programme: in 2025 it diverted 2,682.699 t of residual waste from landfill — 15.08% of 17,787 t. It runs 20 recycling streams across 210 collection points (up to 95% sorting purity, a separate process measure) and educates 2,000+ pupils; host of the Circular Municipalities Forum (Feb 2025).', 'Δημοτικό πρόγραμμα κυκλικής οικονομίας: το 2025 εκτράπηκαν 2.682,699 t σύμμεικτων από την ταφή — 15,08% των 17.787 t. Λειτουργεί 20 ρεύματα ανακύκλωσης σε 210 σημεία συλλογής (καθαρότητα έως 95%) και εκπαιδεύει 2.000+ μαθητές· διοργανωτής του Φόρουμ Κυκλικών Δήμων (Φεβ. 2025).', 'Kommunales Kreislaufwirtschaftsprogramm: 2025 wurden 2.682,699 t Restmüll aus der Deponierung ausgeschleust — 15,08 % von 17.787 t. Es betreibt 20 Wertstoffströme an 210 Sammelpunkten (bis zu 95 % Sortenreinheit, eine separate Prozessgröße) und bildet 2.000+ Schüler:innen; Gastgeber des Forums der Kreislauf-Kommunen (Feb. 2025).', [12, 11, 4], 'COMMUNITY', 50, 'Municipality-wide, North Corfu', 'OPEN', null, 'Attica Green Expo 2026 / kerkyrasimera.gr (diversion); Verde.tec 2026 (streams, points, purity, education)'),
    // Marine protection
    makeProject('proj-marine', 'Marine Protection & Sea Turtles', 'Προστασία Θάλασσας & Θαλάσσιες Χελώνες', 'Meeresschutz & Meeresschildkröten', 'Marine protection on the North Corfu coast: sea-turtle conservation with ARCHELON (nest fencing and awareness campaigns) and marine-mammal stranding response with ODEK Kerkyra, the local cetacean rescue team, plus a marine-mammal congress (May 2025). Action is still needed: 17 sea turtles were found dead off Corfu in Q1 2026 (parliamentary question; Corfu Stories, 15.04.2026).', 'Προστασία θάλασσας στις ακτές της Βόρειας Κέρκυρας: προστασία θαλάσσιων χελωνών με τον ΑΡΧΕΛΩΝ (περίφραξη φωλιών, εκστρατείες) και αντιμετώπιση εκβρασμών θαλάσσιων θηλαστικών με το ΟΔΕΚ Κέρκυρας, την τοπική ομάδα διάσωσης κητωδών, καθώς και συνέδριο θαλάσσιων θηλαστικών (Μάιος 2025). Η ανάγκη δράσης παραμένει: 17 θαλάσσιες χελώνες βρέθηκαν νεκρές το Α΄ τρίμηνο 2026 (κοινοβουλευτική ερώτηση· Corfu Stories, 15.04.2026).', 'Meeresschutz an der Küste Nordkorfus: Schutz von Meeresschildkröten mit ARCHELON (Nest-Einzäunungen, Kampagnen) und Bergung gestrandeter Meeressäuger durch ODEK Kerkyra, das lokale Rettungsteam für Wale und Delfine, sowie ein Kongress zu Meeressäugern (Mai 2025). Handlungsbedarf besteht weiter: 17 tote Meeresschildkröten im 1. Quartal 2026 (parlamentarische Anfrage; Corfu Stories, 15.04.2026).', [14, 15], 'ENVIRONMENT', 60, 'North Corfu coast', 'OPEN', null, 'Corfu TV News, 31.07.2025 (ODEK/ARCHELON); Corfu Stories, 15.04.2026 (turtle deaths)'),
    // Natural monuments
    makeProject('proj-antinioti', 'Antinioti Lagoon — Natural Monument', 'Λιμνοθάλασσα Αντινιώτη — Φυσικό Μνημείο', 'Antinioti-Lagune — Naturdenkmal', 'Protection of the Antinioti Lagoon, a Natura 2000 wetland between Kassiopi and Roda — part of ZOE\'s natural-monuments axis.', 'Προστασία της Λιμνοθάλασσας Αντινιώτη, υγρότοπος Natura 2000 — άξονας φυσικών μνημείων του ZOE.', 'Schutz der Antinioti-Lagune, eines Natura-2000-Feuchtgebiets — Teil der ZOE-Achse Naturdenkmäler.', [15, 6, 14], 'ENVIRONMENT', 65, 'Antinioti Lagoon, NE Corfu', 'OPEN', 'https://placehold.co/800x400/16a34a/ffffff?text=Antinioti+Lagoon'),
    makeProject('proj-natural-monuments', 'Natural Monuments & Reforestation', 'Φυσικά Μνημεία & Αναδάσωση', 'Naturdenkmäler & Aufforstung', 'Conservation and monitoring of North Corfu\'s natural monuments — Erimitis, the Nymfes waterfalls, the Agios Panteleimon lake basin and the Klimatia watermills — with reforestation.', 'Διατήρηση και παρακολούθηση φυσικών μνημείων: Ερημίτης, καταρράκτες Νυμφών, λεκάνη Αγίου Παντελεήμονα, νερόμυλοι Κληματιάς — με αναδάσωση.', 'Erhalt und Monitoring der Naturdenkmäler Nordkorfus — Erimitis, Wasserfälle von Nymfes, Seebecken Agios Panteleimon, Wassermühlen Klimatia — samt Aufforstung.', [15, 13], 'ENVIRONMENT', 65, 'Northern Corfu'),
    // Energy
    makeProject('proj-led', 'LED Street Lighting Upgrade', 'Αναβάθμιση Δημοτικού Φωτισμού σε LED', 'Umrüstung der Straßenbeleuchtung auf LED', 'Replacement of 4,866 municipal luminaires with energy-efficient LED, reducing energy use and CO₂ emissions across North Corfu.', 'Αντικατάσταση 4.866 φωτιστικών σωμάτων με LED, μειώνοντας την κατανάλωση ενέργειας και τις εκπομπές CO₂.', 'Austausch von 4.866 Leuchten gegen energieeffiziente LED — geringerer Energieverbrauch und CO₂-Ausstoß.', [12, 13], 'COMMUNITY', 45, 'Municipality-wide, North Corfu', 'COMPLETED', 'https://placehold.co/800x400/f59e0b/ffffff?text=LED+Upgrade'),
    // Education / participation
    makeProject('proj-education', 'Environmental Education & University Partnership', 'Περιβαλλοντική Εκπαίδευση & Πανεπιστημιακή Συνεργασία', 'Umweltbildung & Universitätspartnerschaft', 'Environmental education and research with the Ionian University and the University of Nuremberg — scientific congresses and active student participation.', 'Περιβαλλοντική εκπαίδευση και έρευνα με το Ιόνιο Πανεπιστήμιο και το Πανεπιστήμιο της Νυρεμβέργης — επιστημονικά συνέδρια και συμμετοχή φοιτητών.', 'Umweltbildung und Forschung mit der Ionischen Universität und der Universität Nürnberg — wissenschaftliche Kongresse und Studierendenbeteiligung.', [4, 17], 'EDUCATION', 55, 'North Corfu / Ionian University'),
    // Natural monuments — freshwater
    makeProject('proj-water-quality', 'Drinking Water Quality Monitoring', 'Παρακολούθηση Ποιότητας Πόσιμου Νερού', 'Trinkwasserqualitäts-Monitoring', 'Monitoring of drinking-water quality and protection of freshwater sources across North Corfu, including the Agios Panteleimon basin.', 'Παρακολούθηση ποιότητας πόσιμου νερού και προστασία πηγών γλυκού νερού στη Βόρεια Κέρκυρα, μεταξύ άλλων στη λεκάνη Αγίου Παντελεήμονα.', 'Überwachung der Trinkwasserqualität und Schutz der Süßwasserquellen in Nordkorfu, u. a. im Becken von Agios Panteleimon.', [6, 11], 'ENVIRONMENT', 45, 'Northern Corfu'),
  ]);

  // Structural umbrella project (listed=false): hidden from public lists/counts,
  // exists to give cross-cutting events (e.g. the annual SDG forum) a required
  // project home (Decision A). Trilingual content is human-authored (matches the
  // A migration); no metrics → no invented figures.
  await makeProject(
    'proj-zoe-programme',
    'ZOE Programme — Cross-cutting Initiatives',
    'Πρόγραμμα ZOE — Οριζόντιες Δράσεις',
    'ZOE-Programm — Übergreifende Initiativen',
    'The ZOE umbrella programme of the Municipality of Northern Corfu. This structural entry groups cross-cutting activities and events — such as the annual SDG forum — that span several thematic projects rather than belonging to a single one. It carries no separate impact figures of its own.',
    'Το πρόγραμμα-ομπρέλα ZOE του Δήμου Βόρειας Κέρκυρας. Αυτή η δομική καταχώριση ομαδοποιεί οριζόντιες δράσεις και εκδηλώσεις — όπως το ετήσιο φόρουμ SDG — που εκτείνονται σε πολλά θεματικά έργα αντί να ανήκουν σε ένα. Δεν φέρει δικά της μεγέθη επίδρασης.',
    'Das ZOE-Dachprogramm der Gemeinde Nordkorfu. Dieser strukturelle Eintrag bündelt übergreifende Aktivitäten und Veranstaltungen — etwa das jährliche SDG-Forum —, die mehrere thematische Projekte umfassen, statt zu einem einzelnen zu gehören. Er weist keine eigenen Wirkungszahlen aus.',
    [],
    'COMMUNITY',
    0,
    'Municipality of Northern Corfu',
    'OPEN',
    null,
    null,
    false
  );

  // --- Map coordinates (WGS84), verified to public North-Corfu locations.
  // Three municipality-wide actions share the Acharavi centroid (greenmove =
  // exact); led + education get a small deterministic DISPLAY offset (~180 m) so
  // all three markers stay individually clickable (they are not point locations).
  const coords: Record<string, { lat: number; lng: number }> = {
    'proj-greenmove': { lat: 39.7467, lng: 19.9244 }, // Acharavi (municipal centre)
    'proj-circular': { lat: 39.7433, lng: 19.9178 }, // Acharavi recycling area
    'proj-marine': { lat: 39.8019, lng: 19.8697 }, // Kassiopi coast
    'proj-antinioti': { lat: 39.7792, lng: 19.8534 }, // Antinioti lagoon (Natura 2000)
    'proj-natural-monuments': { lat: 39.765, lng: 19.865 }, // Erimitis peninsula
    'proj-led': { lat: 39.748, lng: 19.93 }, // municipality-wide (offset from centroid)
    'proj-education': { lat: 39.7454, lng: 19.9188 }, // municipality-wide (offset from centroid)
    'proj-water-quality': { lat: 39.735, lng: 19.905 }, // Acharavi-south supply area
  };
  await Promise.all(
    Object.entries(coords).map(([id, { lat, lng }]) =>
      prisma.project.update({ where: { id }, data: { lat, lng } })
    )
  );

  // --- Value chain (Hammer & Champy 1993): Input -> Activity -> Output, trilingual.
  // Programme/municipal facts grounded in each project's sourced description; output
  // statements use documented figures where they exist, otherwise the programme aim
  // (no fabricated measured impact). Shown on the project detail page.
  const valueChain: Record<
    string,
    {
      inputResourcesEn: string; inputResourcesEl: string; inputResourcesDe: string;
      keyActivitiesEn: string; keyActivitiesEl: string; keyActivitiesDe: string;
      outputResultsEn: string; outputResultsEl: string; outputResultsDe: string;
    }
  > = {
    'proj-greenmove': {
      inputResourcesEn: 'EU GreenMove programme funding; municipal mobility planning; partner operators.',
      inputResourcesEl: 'Χρηματοδότηση προγράμματος GreenMove (ΕΕ)· δημοτικός σχεδιασμός κινητικότητας· συνεργαζόμενοι φορείς.',
      inputResourcesDe: 'Förderung aus dem EU-Programm GreenMove; kommunale Mobilitätsplanung; Partnerbetreiber.',
      keyActivitiesEn: 'Promoting low-emission transport and active mobility across North Corfu.',
      keyActivitiesEl: 'Προώθηση μεταφορών χαμηλών εκπομπών και ήπιας κινητικότητας στη Βόρεια Κέρκυρα.',
      keyActivitiesDe: 'Förderung emissionsarmer Verkehrsmittel und aktiver Mobilität in Nordkorfu.',
      outputResultsEn: 'Lower-emission mobility options for residents and visitors (programme aim).',
      outputResultsEl: 'Επιλογές κινητικότητας χαμηλών εκπομπών για κατοίκους και επισκέπτες (στόχος προγράμματος).',
      outputResultsDe: 'Emissionsärmere Mobilitätsangebote für Einwohner:innen und Gäste (Programmziel).',
    },
    'proj-circular': {
      inputResourcesEn: '20 recycling streams across 210 collection points; municipal sorting hub; school programme.',
      inputResourcesEl: '20 ρεύματα ανακύκλωσης σε 210 σημεία συλλογής· δημοτικό κέντρο διαλογής· σχολικό πρόγραμμα.',
      inputResourcesDe: '20 Wertstoffströme an 210 Sammelpunkten; kommunales Sortierzentrum; Schulprogramm.',
      keyActivitiesEn: 'Separate collection and sorting (up to 95% purity); educating 2,000+ pupils.',
      keyActivitiesEl: 'Χωριστή συλλογή και διαλογή (καθαρότητα έως 95%)· εκπαίδευση 2.000+ μαθητών.',
      keyActivitiesDe: 'Getrenntsammlung und Sortierung (bis zu 95% Sortenreinheit); Bildung von 2.000+ Schüler:innen.',
      outputResultsEn: '2,682.699 t residual waste diverted from landfill in 2025 — 15.08% of 17,787 t.',
      outputResultsEl: '2.682,699 t σύμμεικτων εκτράπηκαν από την ταφή το 2025 — 15,08% των 17.787 t.',
      outputResultsDe: '2.682,699 t Restmüll 2025 aus der Deponierung ausgeschleust — 15,08% von 17.787 t.',
    },
    'proj-marine': {
      inputResourcesEn: 'ARCHELON and ODEK Kerkyra volunteers; nest-fencing and stranding-response equipment.',
      inputResourcesEl: 'Εθελοντές ΑΡΧΕΛΩΝ και ΟΔΕΚ Κέρκυρας· εξοπλισμός περίφραξης φωλιών και αντιμετώπισης εκβρασμών.',
      inputResourcesDe: 'Freiwillige von ARCHELON und ODEK Kerkyra; Ausrüstung für Nest-Einzäunung und Strandungsbergung.',
      keyActivitiesEn: 'Sea-turtle nest protection, awareness campaigns and marine-mammal stranding response.',
      keyActivitiesEl: 'Προστασία φωλιών χελωνών, εκστρατείες ευαισθητοποίησης και αντιμετώπιση εκβρασμών θαλάσσιων θηλαστικών.',
      keyActivitiesDe: 'Schutz von Schildkrötennestern, Aufklärungskampagnen und Bergung gestrandeter Meeressäuger.',
      outputResultsEn: 'Protected nests and a local stranding-response capacity on the North Corfu coast (programme aim).',
      outputResultsEl: 'Προστατευμένες φωλιές και τοπική ικανότητα αντιμετώπισης εκβρασμών στις ακτές της Β. Κέρκυρας (στόχος προγράμματος).',
      outputResultsDe: 'Geschützte Nester und lokale Strandungs-Bergungskapazität an der Küste Nordkorfus (Programmziel).',
    },
    'proj-antinioti': {
      inputResourcesEn: 'Natura 2000 wetland; conservation volunteers and monitoring effort.',
      inputResourcesEl: 'Υγρότοπος Natura 2000· εθελοντές διατήρησης και προσπάθεια παρακολούθησης.',
      inputResourcesDe: 'Natura-2000-Feuchtgebiet; Naturschutz-Freiwillige und Monitoring.',
      keyActivitiesEn: 'Protecting the lagoon from runoff and unregulated access; habitat monitoring.',
      keyActivitiesEl: 'Προστασία της λιμνοθάλασσας από απορροές και ανεξέλεγκτη πρόσβαση· παρακολούθηση οικοτόπων.',
      keyActivitiesDe: 'Schutz der Lagune vor Abflüssen und unkontrolliertem Zugang; Lebensraum-Monitoring.',
      outputResultsEn: 'Safeguarded wetland habitat between Kassiopi and Roda (conservation aim).',
      outputResultsEl: 'Διαφυλαγμένος υγροτοπικός οικότοπος μεταξύ Κασσιόπης και Ρόδα (στόχος διατήρησης).',
      outputResultsDe: 'Gesicherter Feuchtgebiets-Lebensraum zwischen Kassiopi und Roda (Schutzziel).',
    },
    'proj-natural-monuments': {
      inputResourcesEn: 'Volunteers, tools and native saplings; sites at Erimitis, Nymfes and Klimatia.',
      inputResourcesEl: 'Εθελοντές, εργαλεία και ιθαγενή δενδρύλλια· τοποθεσίες Ερημίτη, Νυμφών και Κληματιάς.',
      inputResourcesDe: 'Freiwillige, Werkzeug und heimische Setzlinge; Standorte Erimitis, Nymfes und Klimatia.',
      keyActivitiesEn: "Conservation, monitoring and reforestation of North Corfu's natural monuments.",
      keyActivitiesEl: 'Διατήρηση, παρακολούθηση και αναδάσωση των φυσικών μνημείων της Βόρειας Κέρκυρας.',
      keyActivitiesDe: 'Erhalt, Monitoring und Aufforstung der Naturdenkmäler Nordkorfus.',
      outputResultsEn: 'Restored slopes and protected natural monuments (programme aim).',
      outputResultsEl: 'Αποκατεστημένες πλαγιές και προστατευμένα φυσικά μνημεία (στόχος προγράμματος).',
      outputResultsDe: 'Wiederhergestellte Hänge und geschützte Naturdenkmäler (Programmziel).',
    },
    'proj-led': {
      inputResourcesEn: 'Municipal energy-efficiency budget; 4,866 existing luminaires.',
      inputResourcesEl: 'Δημοτικός προϋπολογισμός ενεργειακής απόδοσης· 4.866 υφιστάμενα φωτιστικά.',
      inputResourcesDe: 'Kommunales Energieeffizienz-Budget; 4.866 vorhandene Leuchten.',
      keyActivitiesEn: 'Replacing municipal luminaires with energy-efficient LEDs.',
      keyActivitiesEl: 'Αντικατάσταση δημοτικών φωτιστικών με ενεργειακά αποδοτικά LED.',
      keyActivitiesDe: 'Austausch kommunaler Leuchten gegen energieeffiziente LED.',
      outputResultsEn: '4,866 LED luminaires installed, reducing energy use and CO₂.',
      outputResultsEl: 'Εγκαταστάθηκαν 4.866 φωτιστικά LED, μειώνοντας ενέργεια και CO₂.',
      outputResultsDe: '4.866 LED-Leuchten installiert, weniger Energie und CO₂.',
    },
    'proj-education': {
      inputResourcesEn: 'Partnership with the Ionian University and the University of Nuremberg; student volunteers.',
      inputResourcesEl: 'Συνεργασία με το Ιόνιο Πανεπιστήμιο και το Πανεπιστήμιο της Νυρεμβέργης· φοιτητές εθελοντές.',
      inputResourcesDe: 'Partnerschaft mit der Ionischen Universität und der Universität Nürnberg; studentische Freiwillige.',
      keyActivitiesEn: 'Environmental education, scientific congresses and active student participation.',
      keyActivitiesEl: 'Περιβαλλοντική εκπαίδευση, επιστημονικά συνέδρια και ενεργή συμμετοχή φοιτητών.',
      keyActivitiesDe: 'Umweltbildung, wissenschaftliche Kongresse und aktive Studierendenbeteiligung.',
      outputResultsEn: 'Joint research and an engaged student community (programme aim).',
      outputResultsEl: 'Κοινή έρευνα και ενεργή φοιτητική κοινότητα (στόχος προγράμματος).',
      outputResultsDe: 'Gemeinsame Forschung und eine engagierte Studierendengemeinschaft (Programmziel).',
    },
    'proj-water-quality': {
      inputResourcesEn: 'Volunteer monitors, test kits and the Agios Panteleimon basin sources.',
      inputResourcesEl: 'Εθελοντές παρακολούθησης, κιτ ελέγχου και πηγές της λεκάνης Αγίου Παντελεήμονα.',
      inputResourcesDe: 'Freiwillige Messende, Testkits und die Quellen des Agios-Panteleimon-Beckens.',
      keyActivitiesEn: 'Monitoring drinking-water quality and protecting freshwater sources.',
      keyActivitiesEl: 'Παρακολούθηση ποιότητας πόσιμου νερού και προστασία πηγών γλυκού νερού.',
      keyActivitiesDe: 'Überwachung der Trinkwasserqualität und Schutz der Süßwasserquellen.',
      outputResultsEn: 'Continuous water-quality oversight across North Corfu (programme aim).',
      outputResultsEl: 'Συνεχής εποπτεία ποιότητας νερού στη Βόρεια Κέρκυρα (στόχος προγράμματος).',
      outputResultsDe: 'Kontinuierliche Überwachung der Wasserqualität in Nordkorfu (Programmziel).',
    },
  };
  await Promise.all(
    Object.entries(valueChain).map(([id, data]) =>
      prisma.project.update({ where: { id }, data })
    )
  );

  // --- Demo events (concrete dates for the real projects above). DEMO/PROGRAMME
  // DATA: plausible illustrative dates, not official municipal fixtures. Ids reuse
  // the legacy `evt-*` keys so any historical EventRegistration rows stay linked.
  const makeEvent = (
    id: string,
    titleEn: string, titleEl: string, titleDe: string,
    descEn: string, descEl: string, descDe: string,
    date: string, location: string, category: string,
    projectId: string, rewardPoints = 20, capacity: number | null = null,
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
      '2026-07-16T09:00:00.000Z', 'Kassiopi Beach, North Corfu', 'ENVIRONMENT', 'proj-marine', 25, 80),
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
      '2026-09-27T09:00:00.000Z', 'Kassiopi Community Hall', 'COMMUNITY', 'proj-zoe-programme', 30, 200),
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
      'The municipality has replaced 4,866 luminaires with energy-efficient LED, cutting energy use and CO₂ emissions across North Corfu.',
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

  // --- Demo citizen ideas (Z3 public board). DEMO DATA: plausible anonymous
  // citizen suggestions tied to real local features, pre-approved (ACCEPTED) so
  // the public /ideas board is not empty. No personal data (anonymous).
  const makeIdea = (
    id: string, title: string, description: string, category: string,
  ) =>
    prisma.idea.upsert({
      where: { id },
      update: {},
      create: { id, title, description, category, status: 'ACCEPTED' },
    });

  await Promise.all([
    makeIdea('idea-demo-bikeracks',
      'Covered bike parking in Acharavi',
      'Add shaded, covered bicycle racks near the Acharavi seafront and the main bus stops to make cycling easier during the summer heat.',
      'MOBILITY'),
    makeIdea('idea-demo-refill',
      'Water refill stations on the trails',
      'Install drinking-water refill points along the Erimitis and Nymfes trails to cut down on single-use plastic bottles for hikers.',
      'ENVIRONMENT'),
    makeIdea('idea-demo-adoptspot',
      'Adopt-a-spot for the coastline',
      'Let families, schools and local businesses adopt a stretch of coastline, keep it clean and report litter through the platform.',
      'COMMUNITY'),
    makeIdea('idea-demo-schoolvisits',
      'School visits to the recycling hub',
      'Organise regular pupil visits to the municipal sorting hub so children learn first-hand how the 20 recycling streams work.',
      'EDUCATION'),
  ]);

  // --- Learning resources (Z5). REAL, locally-grounded educational content,
  // linked to the matching real projects. Descriptive (no fabricated statistics).
  const makeLearn = (
    id: string,
    titleEn: string, titleEl: string, titleDe: string,
    bodyEn: string, bodyEl: string, bodyDe: string,
    category: string, sdgIds: number[], projectId: string | null,
    sourceNote: string | null = null,
  ) =>
    prisma.learningResource.upsert({
      where: { id },
      update: {},
      create: {
        id, titleEn, titleEl, titleDe, bodyEn, bodyEl, bodyDe,
        category, sdgIds: JSON.stringify(sdgIds), projectId, sourceNote,
      },
    });

  await Promise.all([
    makeLearn('learn-antinioti',
      'The Antinioti Lagoon — a Natura 2000 wetland',
      'Η Λιμνοθάλασσα Αντινιώτη — υγρότοπος Natura 2000',
      'Die Antinioti-Lagune — ein Natura-2000-Feuchtgebiet',
      'The Antinioti Lagoon, between Kassiopi and Roda in north-east Corfu, is a coastal wetland protected under the EU Natura 2000 network. Its reed beds and brackish water host migratory birds, fish and amphibians. The main pressures are agricultural run-off, unregulated access and the loss of traditional land management.',
      'Η Λιμνοθάλασσα Αντινιώτη, μεταξύ Κασσιόπης και Ρόδα στη βορειοανατολική Κέρκυρα, είναι παράκτιος υγρότοπος που προστατεύεται από το δίκτυο Natura 2000 της ΕΕ. Οι καλαμιώνες και τα υφάλμυρα νερά φιλοξενούν αποδημητικά πουλιά, ψάρια και αμφίβια. Οι κύριες πιέσεις είναι οι αγροτικές απορροές, η ανεξέλεγκτη πρόσβαση και η εγκατάλειψη της παραδοσιακής διαχείρισης.',
      'Die Antinioti-Lagune zwischen Kassiopi und Roda im Nordosten Korfus ist ein Küstenfeuchtgebiet, das durch das EU-Netzwerk Natura 2000 geschützt ist. Schilfgürtel und Brackwasser beherbergen Zugvögel, Fische und Amphibien. Hauptbelastungen sind landwirtschaftliche Abflüsse, unkontrollierter Zugang und der Verlust traditioneller Landnutzung.',
      'ENVIRONMENT', [15, 6, 14], 'proj-antinioti', 'EU Natura 2000 network'),
    makeLearn('learn-erimitis',
      'Erimitis — a protected natural landscape',
      'Ερημίτης — ένα προστατευόμενο φυσικό τοπίο',
      'Erimitis — eine geschützte Naturlandschaft',
      'The Erimitis area in north-east Corfu combines forest, wetlands and an undeveloped coastline, and is one of the natural monuments North Corfu works to conserve, together with the Nymfes waterfalls and the Agios Panteleimon basin. Conservation here pairs habitat monitoring with reforestation of fire-affected slopes.',
      'Η περιοχή του Ερημίτη στη βορειοανατολική Κέρκυρα συνδυάζει δάσος, υγροτόπους και αδόμητη ακτή και αποτελεί ένα από τα φυσικά μνημεία που διατηρεί η Βόρεια Κέρκυρα, μαζί με τους καταρράκτες των Νυμφών και τη λεκάνη του Αγίου Παντελεήμονα. Η διατήρηση συνδυάζει την παρακολούθηση οικοτόπων με την αναδάσωση πληγεισών από πυρκαγιά πλαγιών.',
      'Das Gebiet Erimitis im Nordosten Korfus verbindet Wald, Feuchtgebiete und eine unbebaute Küste und gehört zu den Naturdenkmälern, die Nordkorfu erhält — neben den Nymfes-Wasserfällen und dem Agios-Panteleimon-Becken. Schutz bedeutet hier Lebensraum-Monitoring zusammen mit der Aufforstung brandgeschädigter Hänge.',
      'ENVIRONMENT', [15, 13], 'proj-natural-monuments'),
    makeLearn('learn-marine',
      'Sea turtles and marine mammals off North Corfu',
      'Θαλάσσιες χελώνες και θαλάσσια θηλαστικά στη Βόρεια Κέρκυρα',
      'Meeresschildkröten und Meeressäuger vor Nordkorfu',
      'The waters off North Corfu are home to loggerhead sea turtles and marine mammals. ARCHELON volunteers protect turtle nests on the coast through fencing and awareness work, while ODEK Kerkyra — the local cetacean (whale and dolphin) rescue team — responds to marine-mammal strandings. Citizens can help by reporting nests and strandings and keeping beaches clean.',
      'Τα νερά της Βόρειας Κέρκυρας φιλοξενούν θαλάσσιες χελώνες καρέτα-καρέτα και θαλάσσια θηλαστικά. Εθελοντές του ΑΡΧΕΛΩΝ προστατεύουν τις φωλιές στην ακτή με περιφράξεις και ενημέρωση, ενώ το ΟΔΕΚ Κέρκυρας — η τοπική ομάδα διάσωσης κητωδών — αντιμετωπίζει τους εκβρασμούς. Οι πολίτες βοηθούν αναφέροντας φωλιές και εκβρασμούς και κρατώντας τις παραλίες καθαρές.',
      'Die Gewässer vor Nordkorfu beherbergen Unechte Karettschildkröten und Meeressäuger. ARCHELON-Freiwillige schützen Nester an der Küste durch Einzäunung und Aufklärung, während ODEK Kerkyra — das lokale Rettungsteam für Wale und Delfine — auf Strandungen reagiert. Bürger:innen helfen, indem sie Nester und Strandungen melden und Strände sauber halten.',
      'ENVIRONMENT', [14, 15], 'proj-marine', 'ARCHELON; ODEK Kerkyra'),
    makeLearn('learn-circular',
      'How recycling works in North Corfu',
      'Πώς λειτουργεί η ανακύκλωση στη Βόρεια Κέρκυρα',
      'Wie Recycling in Nordkorfu funktioniert',
      'North Corfu runs a municipal circular-economy programme with separate collection across many recycling streams and collection points, feeding a municipal sorting hub. Sorting at home — paper, glass, metal, plastic and organic waste — is the first and most important step; cleaner separation means more material is recovered instead of going to landfill.',
      'Η Βόρεια Κέρκυρα λειτουργεί δημοτικό πρόγραμμα κυκλικής οικονομίας με χωριστή συλλογή σε πολλά ρεύματα ανακύκλωσης και σημεία συλλογής, που τροφοδοτούν δημοτικό κέντρο διαλογής. Η διαλογή στο σπίτι — χαρτί, γυαλί, μέταλλο, πλαστικό και οργανικά — είναι το πρώτο και πιο σημαντικό βήμα· η καθαρότερη διαλογή σημαίνει ότι ανακτάται περισσότερο υλικό αντί να καταλήγει σε ταφή.',
      'Nordkorfu betreibt ein kommunales Kreislaufwirtschaftsprogramm mit Getrenntsammlung über viele Wertstoffströme und Sammelpunkte, die ein kommunales Sortierzentrum speisen. Die Trennung zu Hause — Papier, Glas, Metall, Kunststoff und Bioabfall — ist der erste und wichtigste Schritt; sauberere Trennung bedeutet, dass mehr Material zurückgewonnen wird, statt auf der Deponie zu landen.',
      'COMMUNITY', [12, 11], 'proj-circular', 'Verde.tec 2026 / Attica Green Expo 2026'),
  ]);

  // --- Documented impact figures (Z1). ONLY real, sourced numbers; every other
  // project has none (UI shows "not yet measured"). Idempotent: clear + recreate.
  await prisma.projectMetric.deleteMany({
    where: { projectId: { in: ['proj-led', 'proj-circular'] } },
  });
  await prisma.projectMetric.createMany({
    data: [
      {
        projectId: 'proj-led',
        labelEn: 'LED luminaires upgraded',
        labelEl: 'Φωτιστικά που αναβαθμίστηκαν σε LED',
        labelDe: 'Auf LED umgerüstete Leuchten',
        value: '4,866', unit: null, source: 'Verde.tec 2026',
      },
      {
        projectId: 'proj-circular',
        labelEn: 'Residual waste diverted from landfill (2025)',
        labelEl: 'Σύμμεικτα που εκτράπηκαν από την ταφή (2025)',
        labelDe: 'Aus der Deponierung ausgeschleuster Restmüll (2025)',
        value: '2,682.699', unit: 't', source: 'Attica Green Expo 2026',
      },
      {
        projectId: 'proj-circular',
        labelEn: 'Diversion rate (2025)',
        labelEl: 'Ποσοστό εκτροπής (2025)',
        labelDe: 'Ausschleusungsquote (2025)',
        value: '15.08', unit: '%', source: 'Attica Green Expo 2026',
      },
      {
        projectId: 'proj-circular',
        labelEn: 'Recycling streams',
        labelEl: 'Ρεύματα ανακύκλωσης',
        labelDe: 'Wertstoffströme',
        value: '20', unit: null, source: 'Verde.tec 2026',
      },
      {
        projectId: 'proj-circular',
        labelEn: 'Collection points',
        labelEl: 'Σημεία συλλογής',
        labelDe: 'Sammelpunkte',
        value: '210', unit: null, source: 'Verde.tec 2026',
      },
    ],
  });

  console.log(`Seeded: ${[p1,p2,p3,p4,p5,p6,p7,p8].length} projects, 4 users, 5 badges, 4 posts, 4 demo ideas, 4 learning resources, 5 impact metrics`);
  console.log('Admin:    admin@zoe-corfu.gr / ZoeAdmin2026!');
  console.log('Users:    citizen1@example.com, citizen2@example.com, tourist@example.com / Test1234!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
