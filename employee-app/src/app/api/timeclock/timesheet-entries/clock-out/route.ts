import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { differenceInMinutes } from "date-fns";
import { NextResponse, type NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const body = await request.json();
            const entryId = body.entryId;

            const supabase = await createServerSupabaseClient();

            const { data: currentEntry, error: currentEntryError } = await supabase
                .schema("hr")
                .from("timesheet_entries")
                .select("time_in")
                .eq("timesheet_entry_id", entryId)
                .single();

            if (currentEntryError || !currentEntry) {
                return NextResponse.json({ error: 'Timesheet entry not found' }, { status: 400 });
            }

            const now = new Date();
            const timeOut = now.toISOString();
            const timeIn = new Date(currentEntry.time_in);

            // Calculate duration
            const durationMinutes = differenceInMinutes(now, timeIn);

            const { error: updateError } = await supabase
                .schema("hr")
                .from("timesheet_entries")
                .update({
                    time_out: timeOut,
                    duration: durationMinutes,
                    updated_at: timeOut,
                })
                .eq("timesheet_entry_id", entryId);

            if (updateError) {
                return NextResponse.json({ error: 'Failed to clock out' }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
            });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: 'Failed to clock out' },
                { status: 500 }
            )
        }
    });    
}