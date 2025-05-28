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
            const timesheetId = Number(url.searchParams.get('timesheetId'));

            if (!timesheetId) {
                return NextResponse.json({ error: 'TImesheet ID is required' }, { status: 400 });
            }

            const supabase = await createServerSupabaseClient();

            const { data, error } = await supabase
                .schema("hr")
                .from("timesheet_entries")
                .select("timesheet_entry_id, time_in, project_id, timesheet_task_id")
                .eq("timesheet_id", timesheetId)
                .is("time_out", null)
                .single();
            
            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            let formattedData = null;
            if (data) {
                let projectData = null;
                if(data.project_id) {
                    const { data: project, error: projectError } = await supabase
                        .schema("pm")
                        .from("projects")
                        .select("project_id, project_number, project_name")
                        .eq("project_id", data.project_id)
                        .single();

                    if (!projectError) {
                        projectData = project;
                    }
                }

                let taskData = null;
                if (data.timesheet_task_id) {
                    const { data: task, error: taskError } = await supabase
                        .schema("hr")
                        .from("timesheet_tasks")
                        .select("timesheet_task_id, task_name")
                        .eq("timesheet_task_id", data.timesheet_task_id)
                        .single();

                    if (!taskError) {
                        taskData = task;
                    }
                }

                formattedData = {
                    timesheet_entry_id: data.timesheet_entry_id,
                    time_in: data.time_in,
                    project_name: projectData ? projectData.project_number + ' - ' + projectData.project_name : null,
                    task_name: taskData ? taskData.task_name : null,
                };
            }

            return NextResponse.json({
                success: true,
                formattedData,
                message: 'Currently clocked in'
            });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : 'Failed to get timesheet entry' },
                { status: 500 }
            );
        }
    });
}