alter table "inv"."inventory_audit" drop constraint "inventory_audit_performed_by_fkey";

alter table "inv"."inventory_audit" drop column "performed_by";

alter table "inv"."inventory_audit" add column "performed_by_id" bigint;

alter table "inv"."inventory_audit" add constraint "inventory_audit_performed_by_fkey" FOREIGN KEY (performed_by_id) REFERENCES hr.employees(employee_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "inv"."inventory_audit" validate constraint "inventory_audit_performed_by_fkey";


