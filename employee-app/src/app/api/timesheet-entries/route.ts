import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { timesheetEntrySchema } from "@/lib/validation/timesheet";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(request.url);
        const timesheetId = url.searchParams.get("timesheet_id");

        if (!timesheetId) {
            return NextResponse.json(
                { error: "Timesheet ID is required" },
                { status: 400 }
            );
        }

        try {
            const supabase = await createServerSupabaseClient();
            const { data, error } = await supabase
                .schema("hr")
                .from("timesheet_entries")
                .select("*, hr.timesheet_tasks(task_name), pm.projects(project_name)")
                .eq("timesheet_id", timesheetId)
                .order("entry_date", { ascending: true });

            if (error) throw error;

            return NextResponse.json({ data });
        } catch (error) {
            console.log(error);
            return NextResponse.json(
                { error: "Failed to fetch timesheet entry" },
                { status: 500 }
            );
        }
    });
}

export async function POST(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const body = await request.json();
            const validatedData = timesheetEntrySchema.parse(body);

            const supabase = await createServerSupabaseClient();
            const { data, error } = await supabase
                .schema("hr")
                .from("timesheet_entries")
                .insert(validatedData)
                .select();

            if (error) throw error;

            return NextResponse.json({ data });
        } catch (error) {
            console.log(error);
            NextResponse.json(
                { error: "Failed to create timesheet entry "},
                { status: 500 }
            );
        }
    });
}