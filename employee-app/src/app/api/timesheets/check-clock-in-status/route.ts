import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";
import { formatDate } from "date-fns";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const { searchParams } = new URL(request.url);
            const payPeriodId = searchParams.get('payPeriodId');

            if(!payPeriodId) {
                return NextResponse.json({ error: 'Pay period ID is required' }, { status: 400 });
            }

            const supabase = await createServerSupabaseClient();

            // First, get the employee id
            const { data: employeeData, error: employeeError } = await supabase
                .schema("hr")
                .from("employees")
                .select("employee_id")
                .eq("email", user.email)
                .single();

            if (employeeError) throw employeeError;

            if (!employeeData) {
                return NextResponse.json({ error: "Employee not found" }, { status: 404 });
            }

            const employeeId = employeeData.employee_id;

            // Check if timesheet exsist for thsi employee and pay period
            let timesheetId;
            const { data: timesheetData, error: timesheetError } = await supabase
                .schema("hr")
                .from("timesheets")
                .select("timesheet_id")
                .eq("employee_id", employeeId)
                .eq("pay_period_id", payPeriodId)
                .single();

            if (timesheetError && timesheetError.code !== 'PGRST116') {
                throw timesheetError;
            }

            if (timesheetData) {
                timesheetId = timesheetData.timesheet_id;
            } else {
                const { data: newTimesheetData, error: newTimesheetError } = await supabase
                    .schema("hr")
                    .from("timesheets")
                    .insert({
                        employee_id: employeeId,
                        pay_period_id: payPeriodId,
                        status: 'Open',
                    })
                    .select("timesheet_id")
                    .single();

                if (newTimesheetError) throw newTimesheetError;
                timesheetId = newTimesheetData.timesheet_id;
            }

            // Check if user is clocked in
            const { data: openEntryData, error: openEntryError } = await supabase
                .schema("hr")
                .from("timesheet_entries")
                .select("timesheet_entry_id, time_in, project_id, timesheet_task_id")
                .eq("timesheet_id", timesheetId)
                .is("time_out", null)
                .single();

            if (openEntryError && openEntryError.code !== 'PGRST116') {
                throw openEntryError;
            }

            let formattedCurrentEntry = null;
            if (openEntryData) {
                // If we have an entry, fetch the related project and task data
                let projectData = null;
                if(openEntryData.project_id) {
                    const { data: project, error: projectError } = await supabase
                        .schema("pm")
                        .from("projects")
                        .select("project_id, project_name")
                        .eq("project_id", openEntryData.project_id)
                        .single();

                    if (!projectError) {
                        projectData = project;
                    }
                }

                let taskData = null;
                if (openEntryData.timesheet_task_id) {
                    const { data: task, error: taskError } = await supabase
                        .schema("hr")
                        .from("timesheet_tasks")
                        .select("timesheet_task_id, task_name")
                        .eq("timesheet_task_id", openEntryData.timesheet_task_id)
                        .single();

                    if (!taskError) {
                        taskData = task;
                    }
                }

                formattedCurrentEntry = {
                    timesheet_entry_id: openEntryData.timesheet_entry_id,
                    time_in: openEntryData.time_in,
                    project_name: projectData?.project_name || null,
                    task_name: taskData?.task_name || null,
                }
            }

            const isClockedIn = !!openEntryData;

            const today = formatDate(new Date(), 'yyyy-MM-dd');

            const { data: dailyEntriesData, error: dailyEntriesError } = await supabase
                .schema("hr")
                .from("timesheet_entries")
                .select("time_in, time_out, duration")
                .eq("timesheet_id", timesheetId)
                .eq("entry_date", today);

            if (dailyEntriesError) throw dailyEntriesError;

            // Calculate total hours for the day
            let dailyHours = 0;
            if (dailyEntriesData && dailyEntriesData.length > 0) {
                dailyHours = dailyEntriesData.reduce((total, entry) => {
                    if (entry.duration) {
                        return total + (entry.duration / 60);
                    }
                    return total;
                }, 0);
            }
            
            return NextResponse.json({ isClockedIn, dailyHours, currentEntry: formattedCurrentEntry });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to check timesheet status" },
                { status: 500 }
            );
        }
    });
}