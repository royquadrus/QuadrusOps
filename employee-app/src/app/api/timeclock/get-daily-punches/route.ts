import TimesheetsPage from "@/app/(protected-pages)/timesheets/page";
import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!user.email) {
            return NextResponse.json({ error: "User email not found" }, { status: 400 });
        }

        try {
            const url = new URL(request.url);
            const day = url.searchParams.get("day");

            if (!day) {
                return NextResponse.json({ error: "Date is required" }, { status: 400 });
            }

            console.log('Day:', day);

            const supabase = await createServerSupabaseClient();

            const { data, error } = await supabase
                .rpc('get_daily_punches', {
                    input_date: day,
                    user_email: user.email
                });

            if (error) throw error;

            return NextResponse.json({ data });
        } catch (error) {
            console.log(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to get the day's timesheet entries." },
                { status: 500 }
            );
        }
    });
}