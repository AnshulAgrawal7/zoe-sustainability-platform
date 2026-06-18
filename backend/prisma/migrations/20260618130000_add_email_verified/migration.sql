-- E-mail verification (Future_Work §2.2): timestamp the address was confirmed.
ALTER TABLE "User" ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);
