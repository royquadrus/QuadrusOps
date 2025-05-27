import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";
import { clockInSchema } from "@/lib/validation/timeclock";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const body = await request.json();
            
            // validate the basic clock-in data
            const validatedData = clockInSchema.parse(body);

            const supabase = await createServerSupabaseClient();

            type TiemsheetEntry = Database['hr']['Tables']['timesheet_entries']['Insert'];
            // Create the timesheet entry with current timestamp
            const entryData: TiemsheetEntry = {
                timesheet_id: validatedData.timesheet_id,
                project_id: validatedData.project_id ? Number(validatedData.project_id) || null : null,
                timesheet_task_id: validatedData.timesheet_task_id ? Number(validatedData.timesheet_task_id) || null : null,
                entry_date: new Date().toISOString().split('T')[0],
                time_in: new Date().toISOString(),
            };

            const { data, error } = await supabase
                .schema("hr")
                .from("timesheet_entries")
                .insert(entryData)
                .select()
                .single();

            if (error) throw error;

            let formattedData = null;
            if (data) {
                let projectData = null;
                if (data.project_id) {
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
                message: 'Successfully clocked in'
            });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : 'Failed to clock in' },
                { status: 500 }
            );
        }
    });
}