import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const supabase = await createServerSupabaseClient();

            const now = new Date();

            const { data, error } = await supabase
                .schema("hr")
                .from("pay_periods")
                .select("pay_period_id, start_date, end_date")
                .lte("start_date", now.toISOString())
                .order("start_date", { ascending: false })
                .limit(52);

            if (error) throw error;

            return NextResponse.json({ data });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to fetch last 52 pay periods" },
                { status: 500 }
            );
        }
    });
}