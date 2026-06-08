create table "user_invitation" (
  "user_invitation_id" uuid not null,
  "email" varchar(255) not null,
  "role" varchar(50) not null,
  "token_hash" varchar(128) not null,
  "invited_by" uuid not null,
  "accepted_user_id" uuid,
  "sent_at" timestamptz(6),
  "expires_at" timestamptz(6) not null,
  "accepted_at" timestamptz(6),
  "revoked_at" timestamptz(6),
  "created_at" timestamptz(6) default current_timestamp,
  "updated_at" timestamptz(6),
  constraint "user_invitation_pkey" primary key ("user_invitation_id")
);

create unique index "user_invitation_token_hash_key" on "user_invitation"("token_hash");
create index "user_invitation_email_idx" on "user_invitation"("email");
create index "user_invitation_invited_by_idx" on "user_invitation"("invited_by");
create index "user_invitation_accepted_user_id_idx" on "user_invitation"("accepted_user_id");
create index "user_invitation_expires_at_idx" on "user_invitation"("expires_at");

create table "magic_link" (
  "magic_link_id" uuid not null,
  "user_id" uuid not null,
  "token_hash" varchar(128) not null,
  "sent_at" timestamptz(6),
  "expires_at" timestamptz(6) not null,
  "consumed_at" timestamptz(6),
  "created_at" timestamptz(6) default current_timestamp,
  constraint "magic_link_pkey" primary key ("magic_link_id")
);

create unique index "magic_link_token_hash_key" on "magic_link"("token_hash");
create index "magic_link_user_id_idx" on "magic_link"("user_id");
create index "magic_link_expires_at_idx" on "magic_link"("expires_at");
