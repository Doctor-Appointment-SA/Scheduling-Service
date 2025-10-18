-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CREDIT', 'PROMPTPAY', 'BANK', 'CASH');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'CANCEL', 'SUCCESS');

-- CreateEnum
CREATE TYPE "public"."TrackingStatus" AS ENUM ('PREPARE', 'SENDING', 'SUCCESS');

-- CreateEnum
CREATE TYPE "public"."UnitMethod" AS ENUM ('TABLET', 'CAPSULE', 'SYRUP');

-- CreateEnum
CREATE TYPE "public"."AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETE', 'CANCEL');

-- CreateTable
CREATE TABLE "public"."appointment" (
    "id" UUID NOT NULL,
    "patient_id" UUID,
    "doctor_id" UUID,
    "appoint_date" TIMESTAMP(6),
    "status" "public"."AppointmentStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."doctor" (
    "id" UUID NOT NULL,
    "specialty" TEXT,
    "detail" TEXT,

    CONSTRAINT "doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."medical_record" (
    "id" UUID NOT NULL,
    "doctor_id" UUID,
    "patient_id" UUID,
    "diagnosis" VARCHAR,
    "notes" VARCHAR,
    "createdAt" INTEGER,

    CONSTRAINT "medical_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."medication" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "strength" DOUBLE PRECISION,
    "unit" "public"."UnitMethod",

    CONSTRAINT "medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notification" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "title" TEXT,
    "message" TEXT,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."patient" (
    "id" UUID NOT NULL,
    "hospital_number" TEXT,
    "symptom_note" TEXT,
    "blood_drawn_at" TIMESTAMP(3),
    "missed_arv_days" INTEGER,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payment" (
    "id" UUID NOT NULL,
    "prescription_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6),
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "method" "public"."PaymentMethod",
    "cost" DOUBLE PRECISION,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."prescription" (
    "id" UUID NOT NULL,
    "patient_id" UUID,
    "doctor_id" UUID,
    "status" TEXT,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."prescription_item" (
    "id" UUID NOT NULL,
    "medication_id" UUID,
    "amount" INTEGER,
    "prescription_id" UUID,

    CONSTRAINT "prescription_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."schedule" (
    "id" UUID NOT NULL,
    "doctor_id" UUID,
    "timeslot" TEXT,

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tracking" (
    "id" UUID NOT NULL,
    "payment_id" UUID,
    "status" "public"."TrackingStatus",
    "location" TEXT,

    CONSTRAINT "tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user" (
    "id" UUID NOT NULL,
    "password" VARCHAR,
    "createdAt" TIMESTAMP(6),
    "role" TEXT,
    "id_card" TEXT NOT NULL,
    "username" TEXT,
    "lastname" TEXT,
    "name" TEXT,
    "phone" TEXT,
    "health_benefits" TEXT[],

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."refresh_token" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "hashed" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_prescription_id_key" ON "public"."payment"("prescription_id");

-- CreateIndex
CREATE UNIQUE INDEX "tracking_payment_id_key" ON "public"."tracking"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_card_key" ON "public"."user"("id_card");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_unique" ON "public"."user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_userId_key" ON "public"."refresh_token"("userId");

-- CreateIndex
CREATE INDEX "refresh_token_userId_idx" ON "public"."refresh_token"("userId");

-- AddForeignKey
ALTER TABLE "public"."appointment" ADD CONSTRAINT "appointment_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."appointment" ADD CONSTRAINT "appointment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."doctor" ADD CONSTRAINT "doctor_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."medical_record" ADD CONSTRAINT "medical_record_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."medical_record" ADD CONSTRAINT "medical_record_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."patient" ADD CONSTRAINT "patient_hospital_number_fkey" FOREIGN KEY ("hospital_number") REFERENCES "public"."user"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."patient" ADD CONSTRAINT "patient_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "public"."prescription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prescription" ADD CONSTRAINT "prescription_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prescription" ADD CONSTRAINT "prescription_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prescription_item" ADD CONSTRAINT "prescription_item_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "public"."medication"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prescription_item" ADD CONSTRAINT "prescription_item_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "public"."prescription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."schedule" ADD CONSTRAINT "schedule_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tracking" ADD CONSTRAINT "tracking_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."refresh_token" ADD CONSTRAINT "refresh_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
