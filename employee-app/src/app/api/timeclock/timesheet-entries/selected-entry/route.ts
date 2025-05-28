import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
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
                .eq("timesheet_entry_id", timesheetEntryId)
                .single();

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