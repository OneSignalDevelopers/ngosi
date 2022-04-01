CREATE TABLE "public"."profiles" (
    "id" uuid NOT NULL,
    "updated_at" timestamptz DEFAULT now(),
    "username" text CHECK (char_length(username) >= 3),
    "avatar_url" text,
    "website" text,
    PRIMARY KEY ("id"),
    CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "Preso" (
	"id" TEXT NOT NULL,
	"eventName" TEXT NOT NULL,
	"eventLocation" TEXT NULL,
	"title" TEXT NOT NULL,
	"url" TEXT,
	"shortCode" TEXT,
	"userId" UUID NOT NULL,
    "publishedContentUrl" TEXT,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "Preso_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Preso_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "Attendee" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendee_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Attendee_email_key" ON "Attendee"("email");

CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "presoId" TEXT NOT NULL,
    "attendeeId" TEXT NOT NULL,
    "notifyWhenVideoPublished" BOOLEAN NOT NULL,
    "sendPresoFeedback" BOOLEAN NOT NULL,
    "notifyOfOtherTalks" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Survey_presoId_fkey" FOREIGN KEY ("presoId") REFERENCES "Preso"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Survey_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "Attendee"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE VIEW attendees_view AS (
    SELECT p."userId" AS presenter,
        p.id AS preso,
        a.id AS attendee,
        a.email,
        a."fullName" AS name,
        a."createdAt" AS created_at,
        s."notifyOfOtherTalks",
        s."notifyWhenVideoPublished",
        s."sendPresoFeedback"
    FROM "Preso" p
        JOIN "Survey" s ON p.id = s."presoId"
        JOIN "Attendee" a ON s."attendeeId" = a.id
);
