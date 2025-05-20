import { withAuth } from "@/lib/api/with-auth"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const supabase = await createServerSupabaseClient();

            const { data, error } = await supabase
                .schema("hr")
                .from("timesheet_tasks")
                .select("*");

            if (error) throw error;

            return NextResponse.json({ data });
        } catch (error) {
            console.log(error);
            return NextResponse.json(
                { error: "Failed to fetch timesheet tasks" },
                { status: 500 }
            );
        }
    });
}