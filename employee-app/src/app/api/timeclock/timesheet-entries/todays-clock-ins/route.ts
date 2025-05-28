import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const url = new URL(request.url);
            const timesheetId = Number(url.searchParams.get("timesheetId"));

            if (!timesheetId) {
                return NextResponse.json({ error: "Timesheet ID is required" }, { status: 400 });
            }
            const today = new Date().toISOString().split('T')[0];

            const supabase = await createServerSupabaseClient();

            const { data, error } = await supabase
                .schema("hr")
                .from("timesheet_entries")
                .select("timesheet_entry_id, time_in, project_id, timesheet_task_id, time_out")
                .eq("timesheet_id", timesheetId)
                .eq("entry_date", today)
                .order("time_in", { ascending: true });

            if (error) throw error;

            const formattedPunchIns = await Promise.all(
                data.map(async (entry) => {
                    let projectData = null;
                    if (entry.project_id) {
                        const { data: project, error: projectError } = await supabase
                            .schema("pm")
                            .from("projects")
                            .select("project_id, project_number, project_name")
                            .eq("project_id", entry.project_id)
                            .single();

                        if (!projectError) {
                            projectData = project;
                        }
                    }

                    let taskData = null;
                    if (entry.timesheet_task_id) {
                        const { data: task, error: taskError } = await supabase
                            .schema("hr")
                            .from("timesheet_tasks")
                            .select("timesheet_task_id, task_name")
                            .eq("timesheet_task_id", entry.timesheet_task_id)
                            .single();

                        if (!taskError) {
                            taskData = task;
                        }
                    }

                    return {
                        id: entry.timesheet_entry_id,
                        timeIn: entry.time_in,
                        timeOut: entry.time_out ? entry.time_out : 'Active',
                        projectName: projectData?.project_number && projectData?.project_name
                            ? `${projectData.project_number} - ${projectData.project_name}`
                            : null,
                        taskName: taskData?.task_name || null,
                    };
                })
            );

            return NextResponse.json({ formattedPunchIns });
        } catch (error) {
            console.log(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to get today's timesheet entries" },
                { status: 500 }
            );
        }
    });
}