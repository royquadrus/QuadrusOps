import { withAuth } from "@/lib/api/with-auth"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            //const supabase = await createServerSupabaseClient();
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    auth: { persistSession: false }
                }
            );
            const { data, error } = await supabase
                .schema("pm")
                .from("projects")
                .select("*")
                .in("project_status", ['Design', 'Queued', 'WIP', 'Built'])
                .order("project_number", { ascending: false });

            /*const { data, error } = await supabase
                .schema("pm")
                .from("projects")
                .select("project_id")
                .limit(1);*/

            if (error) throw error;

            return NextResponse.json({ data });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to fetch projects" },
                { status: 500 }
            );
        }
    });
}