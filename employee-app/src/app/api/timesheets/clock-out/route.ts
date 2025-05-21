import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const body = await request.json();
            const { timesheetEntryId } = body;

            if (!timesheetEntryId) {
                return NextResponse.json({ error: "Missing timesheet entry ID" }, { status: 400 });
            }

            const supabase = await createServerSupabaseClient();

            const { data: currentEntry, error: fetchError } = await supabase
                .schema("hr")
                .from("timesheet_entries")
                .select("timesheet_entry_id, time_in, timesheet_id")
                .eq("timesheet_entry_id", timesheetEntryId)
                .single();

            if (fetchError || !currentEntry) {
                return NextResponse.json({ error: "Timesheet entry not found" }, { status: 400 });
            }

            const now = new Date();
            const timeOut = now.toISOString();
            const timeIn = new Date(currentEntry.time_in);

            // Calculate the duration
            const durationMinutes = Math.floor((now.getTime() - timeIn.getTime()) / (1000 * 60));

            // Update the timeseheet entry
            const { error: updateError } = await supabase
                .schema("hr")
                .from("timesheet_entries")
                .update({
                    time_out: timeOut,
                    duration: durationMinutes,
                    updated_at: timeOut,
                })
                .eq("timesheet_entry_id", timesheetEntryId);

            if (updateError) {
                return NextResponse.json({ error: "Failed to updated timesheet entry" }, { status: 500 });
            }

            return NextResponse.json({ success: true });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: "Failed to update timesheet entry" },
                { status: 500 }
            );
        }
    });
}