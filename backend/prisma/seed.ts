// PROTOTYPE SEED DATA — ZOE Sustainability Platform
// Admin: admin@zoe-corfu.gr / ZoeAdmin2026!
// Users: citizen1@example.com, citizen2@example.com, tourist@example.com / Test1234!

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

  const makeProject = (id: string, en: string, el: string, de: string, descEn: string, descEl: string, descDe: string, sdgs: number[], category: string, points: number, location: string, status = 'OPEN', imageUrl: string | null = null) =>
    prisma.project.upsert({
      where: { id },
      update: {},
      create: { id, titleEn: en, titleEl: el, titleDe: de, descriptionEn: descEn, descriptionEl: descEl, descriptionDe: descDe, sdgIds: JSON.stringify(sdgs), category, status, rewardPoints: points, location, imageUrl, createdById: admin.id },
    });

  const [p1, p2, p3, p4, p5, p6, p7, p8] = await Promise.all([
    makeProject('proj-antinioti', 'Antinioti Lagoon Restoration', 'Αποκατάσταση Λιμνοθάλασσας Αντινιώτη', 'Wiederherstellung der Antinioti-Lagune', 'Multi-year restoration of the Antinioti Lagoon — a Natura 2000 protected wetland between Kassiopi and Roda.', 'Πολυετής αποκατάσταση της Λιμνοθάλασσας Αντινιώτη — υγρότοπος Natura 2000.', 'Mehrjährige Wiederherstellung der Antinioti-Lagune — Natura-2000-Schutzgebiet.', [13, 14, 15, 17], 'ENVIRONMENT', 75, 'Antinioti Lagoon, NE Corfu', 'OPEN', 'https://placehold.co/800x400/16a34a/ffffff?text=Antinioti+Lagoon'),
    // COMPLETED + image — demonstrates the "Completed" status filter and cover images.
    makeProject('proj-beach-clean', 'Kassiopi Coastal Clean-Up', 'Καθαρισμός Ακτής Κασσιωπής', 'Küstenreinigung Kassiopi', 'Monthly beach and underwater clean-up operations around Kassiopi harbour.', 'Μηνιαίος καθαρισμός παραλίας γύρω από το λιμάνι της Κασσιωπής.', 'Monatliche Strand- und Unterwasserreinigungen rund um den Hafen von Kassiopi.', [14, 12, 17], 'ENVIRONMENT', 50, 'Kassiopi Harbour, NE Corfu', 'COMPLETED', 'https://placehold.co/800x400/0ea5e9/ffffff?text=Kassiopi+Clean-Up'),
    makeProject('proj-solar-schools', 'Solar Panels for Corfu Schools', 'Ηλιακά Πάνελ για τα Σχολεία', 'Solaranlagen für Korfu-Schulen', 'Installing solar photovoltaic systems on municipal school rooftops across Northern Corfu.', 'Εγκατάσταση ηλιακών φωτοβολταϊκών συστημάτων στις στέγες σχολείων.', 'Installation von Photovoltaik-Systemen auf Schulgebäuden in Nordkorfu.', [7, 4, 13, 11], 'EDUCATION', 60, 'Various schools, Northern Corfu'),
    makeProject('proj-waste-sep', 'Waste Separation Network', 'Δίκτυο Διαχωρισμού Αποβλήτων', 'Mülltrennnetzwerk', 'Expanding recycling and composting infrastructure across 12 northern Corfu villages.', 'Επέκταση υποδομών ανακύκλωσης σε 12 χωριά.', 'Ausbau der Recycling-Infrastruktur in 12 Dörfern Nordkorfus.', [12, 11, 15], 'COMMUNITY', 40, 'Northern Corfu Villages', 'COMPLETED', 'https://placehold.co/800x400/f97316/ffffff?text=Waste+Separation'),
    makeProject('proj-erimitis', 'Erimitis Conservation Monitoring', 'Παρακολούθηση Διατήρησης Ερημίτη', 'Naturschutzmonitoring Erimitis', 'Citizen science monitoring program for the Erimitis peninsula.', 'Πρόγραμμα παρακολούθησης από πολίτες για τη χερσόνησο Ερημίτη.', 'Bürgerwissenschafts-Monitoring für die Erimitis-Halbinsel.', [15, 14, 13, 17], 'ENVIRONMENT', 65, 'Erimitis Peninsula, NE Corfu'),
    makeProject('proj-cycling', 'Sinies–Kassiopi Cycling Path', 'Ποδηλατόδρομος Σινιές–Κασσιώπη', 'Radweg Sinies–Kassiopi', 'Planning a 6km cycling path connecting Sinies, Avliotes, and Kassiopi.', 'Σχεδιασμός ποδηλατόδρομου 6χλμ.', 'Planung eines 6km Radweges.', [11, 13, 3, 8], 'MOBILITY', 35, 'Sinies to Kassiopi, NE Corfu'),
    makeProject('proj-olive-groves', 'Traditional Olive Grove Restoration', 'Αποκατάσταση Παραδοσιακών Ελαιώνων', 'Wiederherstellung traditioneller Olivenhaine', 'Restoring abandoned olive groves to preserve the UNESCO cultural landscape.', 'Αποκατάσταση εγκαταλελειμμένων ελαιώνων.', 'Wiederherstellung verlassener Olivenhaine.', [15, 8, 11, 12], 'COMMUNITY', 55, 'Northern Corfu hinterland'),
    makeProject('proj-water-quality', 'Drinking Water Quality Monitoring', 'Παρακολούθηση Ποιότητας Πόσιμου Νερού', 'Trinkwasserqualitäts-Monitoring', 'Community-led water quality testing at 18 sampling points across northern Corfu.', 'Έλεγχος ποιότητας νερού σε 18 σημεία δειγματοληψίας.', 'Wasserqualitäts-Tests an 18 Probenahmestellen.', [6, 3, 11], 'ENVIRONMENT', 45, 'Northern Corfu'),
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

  console.log(`Seeded: ${[p1,p2,p3,p4,p5,p6,p7,p8].length} projects, 4 users, 5 badges`);
  console.log('Admin: admin@zoe-corfu.gr / ZoeAdmin2026!');
  console.log('Users: citizen1@example.com, citizen2@example.com, tourist@example.com / Test1234!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
