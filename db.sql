-- CreateTable
CREATE TABLE "Preso" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventLocation" TEXT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "shortCode" TEXT,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Preso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendee" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "presoId" TEXT NOT NULL,
    "attendeeId" TEXT NOT NULL,
    "notifyWhenVideoPublished" BOOLEAN NOT NULL,
    "sendPresoFeedback" BOOLEAN NOT NULL,
    "notifyOfOtherTalks" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_email_key" ON "Attendee"("email");

-- AddForeignKey
ALTER TABLE "Preso" ADD CONSTRAINT "Preso_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_presoId_fkey" FOREIGN KEY ("presoId") REFERENCES "Preso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "Attendee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "public"."profiles" (
    "id" uuid NOT NULL,
    "updated_at" timestamptz DEFAULT now(),
    "username" text CHECK (char_length(username) >= 3),
    "avatar_url" text,
    "website" text,
    CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id"),
    PRIMARY KEY ("id")
);

CREATE VIEW attendees_view AS (
	SELECT
		p. "userId",
		p. "id" presoId,
		a. "id" attendeeId,
		a. "email" attendeeEmail,
		a. "fullName" attendeeName
	FROM
		"Preso" p
		JOIN "Survey" s ON p.id = s. "presoId"
		JOIN "Attendee" a ON s. "attendeeId" = a.id
);
