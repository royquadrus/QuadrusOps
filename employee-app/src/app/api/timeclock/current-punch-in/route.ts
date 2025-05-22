import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { timesheetEntrySchema } from "@/lib/validation/timeclock";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const url = new URL(request.url);
            const timesheetId = url.searchParams.get('timesheetId');

            if (!timesheetId) {
                return NextResponse.json({ error: "Timesheet ID is required" }, { status: 400 });
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

            let formattedPunchIn = null;
            if (data) {
                // If we have an entry, fetch realted project and task data
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
                    const {data: task, error:taskError } = await supabase
                        .schema("hr")
                        .from("timesheet_tasks")
                        .select("timesheet_task_id, task_name")
                        .eq("timesheet_task_id", data.timesheet_task_id)
                        .single();

                    if (!taskError) {
                        taskData = task;
                    }
                }

                formattedPunchIn = {
                    timesheet_entry_id: data.timesheet_entry_id,
                    time_in: data.time_in,
                    project_name: projectData?.project_number + ' - ' + projectData?.project_name || null,
                    task_name: taskData?.task_name || null,
                }
            }

            return NextResponse.json({ formattedPunchIn });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to get timesheet entry" },
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

            //Transform validated data to match the database schema
            const insertData = {
                timesheet_id: validatedData.timesheet_id,
                project_id: validatedData.project_id || null,
                timesheet_task_id: validatedData.timesheet_task_id || null,
                entry_date: validatedData.entry_date || new Date().toISOString().split('T')[0],
                time_in: validatedData.time_in || new Date().toISOString(),
                time_out: null,
                duration: null,
                minutes_paid: null,
                minutes_banked: null
            };

            const supabase = await createServerSupabaseClient();

            const { data, error } = await supabase
                .schema("hr")
                .from("timesheet_entries")
                .insert(insertData)
                .select();

            if (error) throw error;

            let formattedPunchIn = null;
            if (data) {
                // If we are clocked in, fetch related project and task data
                let projectData = null;
                if (data[0].project_id) {
                    const { data: project, error: projectError }  = await supabase
                        .schema("pm")
                        .from("projects")
                        .select("project_id, project_number, project_name")
                        .eq("project_id", data[0].project_id)
                        .single();

                    if (!projectError) {
                        projectData = project;
                    }
                    //console.log("After project data:", projectData);
                }

                let taskData = null;
                if (data[0].timesheet_task_id) {
                    const { data: task, error: taskError } = await supabase
                        .schema("hr")
                        .from("timesheet_tasks")
                        .select("timesheet_task_id, task_name")
                        .eq("timesheet_task_id", data[0].timesheet_task_id)
                        .single();

                    if (!taskError) {
                        taskData = task;
                    }
                }

                formattedPunchIn = {
                    id: data[0].timesheet_entry_id,
                    timeIn: data[0].time_in,
                    projectName: projectData?.project_number + ' - ' + projectData?.project_name || null,
                    taskName: taskData?.task_name || null,
                };
            }

            return NextResponse.json({ formattedPunchIn });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to clock in" },
                { status: 500 }
            );
        }
    });
}

export async function PUT(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const body = await request.json();
            const entryId = body.entryId;

            const supabase = await createServerSupabaseClient();

            const { data: currentEntry, error: currentEntryError } = await supabase
                .schema("hr")
                .from("timesheet_entries")
                .select("time_in")
                .eq("timesheet_entry_id", entryId)
                .single();

            if (currentEntryError || !currentEntry) {
                return NextResponse.json({ error: "Timesheet entry not found" }, { status: 400 });
            }

            const now = new Date();
            const timeOut = now.toISOString();
            const timeIn = new Date(currentEntry.time_in);

            // Calculate the duration
            const durationMinutes = Math.floor((now.getTime() - timeIn.getTime()) / (1000 * 60));

            const { error: updateError } = await supabase
                .schema("hr")
                .from("timesheet_entries")
                .update({
                    time_out: timeOut,
                    duration: durationMinutes,
                    updated_at: timeOut,
                })
                .eq("timesheet_entry_id", entryId);

            if (updateError) {
                return NextResponse.json({ error: "Failed to update timesheet entry" }, { status: 500 });
            }

            return NextResponse.json({ success: true });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: "Failed to update timesheet entry" },
                { status: 500 }
            );
        }
    });
}