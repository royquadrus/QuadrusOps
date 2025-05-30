create schema if not exists "crm";

create table "crm"."customers" (
    "customer_id" bigint generated by default as identity not null,
    "customer_name" text not null,
    "address" text,
    "phone" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "crm"."customers" enable row level security;

CREATE UNIQUE INDEX customers_pkey ON crm.customers USING btree (customer_id);

alter table "crm"."customers" add constraint "customers_pkey" PRIMARY KEY using index "customers_pkey";

create table "crm"."suppliers" (
    "supplier_id" bigint generated by default as identity not null,
    "supplier_name" text not null,
    "address" text,
    "phone" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "crm"."suppliers" enable row level security;

CREATE UNIQUE INDEX suppliers_pkey ON crm.suppliers USING btree (supplier_id);

alter table "crm"."suppliers" add constraint "suppliers_pkey" PRIMARY KEY using index "suppliers_pkey";

create table "crm"."contacts" (
    "contact_id" bigint generated by default as identity not null,
    "contact_name" text not null,
    "position" text,
    "phone" text,
    "email" text,
    "customer_id" bigint,
    "supplier_id" bigint,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "crm"."contacts" enable row level security;

CREATE UNIQUE INDEX contacts_pkey ON crm.contacts USING btree (contact_id);

alter table "crm"."contacts" add constraint "contacts_pkey" PRIMARY KEY using index "contacts_pkey";

alter table "crm"."contacts" add constraint "contacts_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES crm.customers(customer_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "crm"."contacts" validate constraint "contacts_customer_id_fkey";

alter table "crm"."contacts" add constraint "contacts_supplier_id_fkey" FOREIGN KEY (supplier_id) REFERENCES crm.suppliers(supplier_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "crm"."contacts" validate constraint "contacts_supplier_id_fkey";

create table "crm"."job_sites" (
    "job_site_id" bigint generated by default as identity not null,
    "site_name" text not null,
    "address" text,
    "status" text,
    "customer_id" bigint,
    "site_contact_id" bigint,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "crm"."job_sites" enable row level security;

CREATE UNIQUE INDEX job_sites_pkey ON crm.job_sites USING btree (job_site_id);

alter table "crm"."job_sites" add constraint "job_sites_pkey" PRIMARY KEY using index "job_sites_pkey";

alter table "crm"."job_sites" add constraint "job_sites_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES crm.customers(customer_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "crm"."job_sites" validate constraint "job_sites_customer_id_fkey";

alter table "crm"."job_sites" add constraint "job_sites_site_contact_id_fkey" FOREIGN KEY (site_contact_id) REFERENCES crm.contacts(contact_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "crm"."job_sites" validate constraint "job_sites_site_contact_id_fkey";