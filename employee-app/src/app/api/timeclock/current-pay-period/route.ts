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

            const currentDate = new Date().toISOString();

            const { data, error } = await supabase
                .schema("hr")
                .from("pay_periods")
                .select("*")
                .lte("start_date", currentDate)
                .gte("end_date", currentDate)
                .single();

            if (error) throw error;

            return NextResponse.json({ data });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to fetch current pay period." },
                { status: 500 }
            );
        }
    });
}