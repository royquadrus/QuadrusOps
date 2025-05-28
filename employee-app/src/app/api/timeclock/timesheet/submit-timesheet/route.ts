import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const body = await request.json();

            const supabase = await createServerSupabaseClient();

            const { data, error } = await supabase
                .schema("hr")
                .from("timesheets")
                .update({
                    status: 'Submitted',
                    updated_at: new Date().toISOString(),
                })
                .eq("timesheet_id", body)
                .select()
                .single();

            if (error) throw error;

            return NextResponse.json({
                success: true,
                message: 'TImesheet submitted succesfully',
            });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : 'Failed to submit timesheet.' },
                { status: 500 }
            );
        }
    });
}