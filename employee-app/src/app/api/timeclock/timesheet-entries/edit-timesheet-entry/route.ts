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
            console.log('From api:', body);

            const timeIn = new Date(body.validatedData.time_in);
            const timeOut = new Date(body.validatedData.time_out);
            const duration = differenceInMinutes(timeOut, timeIn);
            const entry = timeIn.toISOString().split('T')[0];

            const parsedData = {
                ...body.validatedData,
                duration: duration,
                entry_date: entry,
                updated_at: new Date(),
            };

            console.log(parsedData);
            
            const supabase = await createServerSupabaseClient();

            const { error, data } = await supabase
                .schema("hr")
                .from("timesheet_entries")
                .update(parsedData)
                .eq("timesheet_entry_id", parsedData.timesheet_entry_id)
                .select()
                .single();

            if (error) {
                return NextResponse.json({ error: 'Failed to update timesheet entry' }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                message: 'Successfully edited timesheet entry'
            });
            
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : 'Failed to update timesheet entry' },
                { status: 500 },
            );
        }
    });
}