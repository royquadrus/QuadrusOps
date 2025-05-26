import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fullTimesheetEntrySchema } from "@/lib/validation/timeclock";
import { format } from "date-fns";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const { searchParams } = new URL(request.url);
            const timesheetEntryId = Number(searchParams.get('timesheetEntryId'));

            const supabase = await createServerSupabaseClient();

            const { data, error } = await supabase
                .schema("hr")
                .from("timesheet_entries")
                .select("timesheet_entry_id, time_in, time_out, duration, timesheet_task_id, project_id, entry_date")
                .eq("timesheet_entry_id", timesheetEntryId);

            if (error) throw error;

            return NextResponse.json({ data });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : 'Failed to get timesheet entry' },
                { status: 500 }
            );
        }
    });
}

export async function PUT(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const body = await request.json();
            const validatedData = fullTimesheetEntrySchema.parse(body);

            const supabase = await createServerSupabaseClient();

            const { data, error } = await supabase
                .schema("hr")
                .from("timesheet_entries")
                .update(validatedData)
                .eq("timesheet_entry_id", body.timesheet_entry_id)
                .select();

            if (error) {
                return NextResponse.json({ error: "Failed to update timesheet entry" }, { status: 500 });
            }

            return NextResponse.json({ data });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to update timesheet entry" },
                { status: 500 },
            );
        }
    });
}

export async function POST(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const body = await request.json();
            const validatedData = fullTimesheetEntrySchema.parse(body);

            const supabase = await createServerSupabaseClient();

            const { data, error } = await supabase
                .schema("hr")
                .from("timesheet_entries")
                .insert(validatedData)
                .select();

            if (error) throw error;

            return NextResponse.json({ data });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : 'Failed to create timesheet entry' },
                { status: 500 }
            )
        }
    });
}