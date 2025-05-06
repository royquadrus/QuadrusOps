alter table "pm"."stacks" add column "production_line_id" bigint;

alter table "pm"."stacks" add constraint "stacks_production_line_id_fkey" FOREIGN KEY (production_line_id) REFERENCES prod.production_lines(production_line_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "pm"."stacks" validate constraint "stacks_production_line_id_fkey";