ALTER TABLE "user_invitation" ADD COLUMN "team_id" UUID;
ALTER TABLE "user_invitation" ADD COLUMN "team_role" VARCHAR(50);

CREATE INDEX "user_invitation_team_id_idx" ON "user_invitation"("team_id");
