import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { differenceInMinutes } from "date-fns";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const body = await request.json();

            const timeIn = new Date(body.validatedData.time_in);
            const timeOut = new Date(body.validatedData.time_out);
            const duration = differenceInMinutes(timeOut, timeIn);
            const entry = timeIn.toISOString().split('T')[0];

            const parsedData = {
                ...body.validatedData,
                duration: duration,
                entry_date: entry,
            };

            const supabase = await createServerSupabaseClient();

            const { error, data } = await supabase
                .schema("hr")
                .from("timesheet_entries")
                .insert(parsedData)
                .select()
                .single();

            if (error) {
                return NextResponse.json({ error: 'Failed to upadte timesheet entry' }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                message: 'Successfully added timesheet entry'
            });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : 'Failed to create timesheet entry' },
                { status: 500 }
            );
        }
    });
}