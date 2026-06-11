-- Decision A: Events must belong to a Project. A `listed` flag lets the ZOE
-- umbrella project group cross-cutting events without surfacing in public lists,
-- counts, teasers or filters (it stays reachable by direct link).

-- 1) Project.listed — public visibility. Existing projects stay listed.
ALTER TABLE "Project" ADD COLUMN "listed" BOOLEAN NOT NULL DEFAULT true;

-- 2) Umbrella project. Inserted ONLY where it is actually needed to rehome
--    existing null-project events (i.e. the already-seeded production DB). On a
--    fresh DB there are no events yet at migration time, so nothing is inserted
--    here and the seed creates the umbrella instead. Idempotent (ON CONFLICT).
--    createdById resolves to an existing ADMIN at runtime (no hard-coded id).
INSERT INTO "Project" (
  "id", "titleEn", "titleEl", "titleDe",
  "descriptionEn", "descriptionEl", "descriptionDe",
  "sdgIds", "category", "status", "rewardPoints", "listed", "location",
  "createdById", "createdAt", "updatedAt"
)
SELECT
  'proj-zoe-programme',
  'ZOE Programme — Cross-cutting Initiatives',
  'Πρόγραμμα ZOE — Οριζόντιες Δράσεις',
  'ZOE-Programm — Übergreifende Initiativen',
  'The ZOE umbrella programme of the Municipality of Northern Corfu. This structural entry groups cross-cutting activities and events — such as the annual SDG forum — that span several thematic projects rather than belonging to a single one. It carries no separate impact figures of its own.',
  'Το πρόγραμμα-ομπρέλα ZOE του Δήμου Βόρειας Κέρκυρας. Αυτή η δομική καταχώριση ομαδοποιεί οριζόντιες δράσεις και εκδηλώσεις — όπως το ετήσιο φόρουμ SDG — που εκτείνονται σε πολλά θεματικά έργα αντί να ανήκουν σε ένα. Δεν φέρει δικά της μεγέθη επίδρασης.',
  'Das ZOE-Dachprogramm der Gemeinde Nordkorfu. Dieser strukturelle Eintrag bündelt übergreifende Aktivitäten und Veranstaltungen — etwa das jährliche SDG-Forum —, die mehrere thematische Projekte umfassen, statt zu einem einzelnen zu gehören. Er weist keine eigenen Wirkungszahlen aus.',
  '[]', 'COMMUNITY', 'OPEN', 0, false, 'Municipality of Northern Corfu',
  (SELECT "id" FROM "User" WHERE "role" = 'ADMIN' ORDER BY "createdAt" ASC LIMIT 1),
  now(), now()
WHERE EXISTS (SELECT 1 FROM "Event" WHERE "projectId" IS NULL)
  AND EXISTS (SELECT 1 FROM "User" WHERE "role" = 'ADMIN')
ON CONFLICT ("id") DO NOTHING;

-- 3) Rehome any remaining null-project events to the umbrella.
UPDATE "Event" SET "projectId" = 'proj-zoe-programme' WHERE "projectId" IS NULL;

-- 4) A.1 — Event.projectId becomes required.
ALTER TABLE "Event" ALTER COLUMN "projectId" SET NOT NULL;

-- 5) A.3 — onDelete: Restrict (was SET NULL).
ALTER TABLE "Event" DROP CONSTRAINT "Event_projectId_fkey";
ALTER TABLE "Event" ADD CONSTRAINT "Event_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
