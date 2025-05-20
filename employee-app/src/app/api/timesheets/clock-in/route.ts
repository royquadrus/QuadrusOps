import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const body = await request.json();
            const { payPeriodId, projectId, taskId } = body;

            if (!payPeriodId || !projectId || !taskId) {
                return NextResponse.json(
                    { error: 'Pay period id, project ID and task ID are required' },
                    { status: 400 },
                );
            }

            const supabase = await createServerSupabaseClient();

            // Get the employee ID from the user's email
            const { data: employeeData, error: employeeError } = await supabase
                .schema("hr")
                .from("employees")
                .select("employee_id")
                .eq("email", user.email)
                .single();

            if (employeeError) throw employeeError;

            if (!employeeData) {
                return NextResponse.json({ error: "Employee not found." }, { status: 404 });
            }

            const employeeId = employeeData.employee_id;

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
                        status: "Open"
                    })
                    .select("timesheet_id")
                    .single();

                if (newTimesheetError) throw newTimesheetError;
                timesheetId = newTimesheetData.timesheet_id;
            }

            // Create a new timesheet entry
            const now = new Date();
            const today = now.toISOString().split('T')[0];

            const { data: entryData, error: entryError } = await supabase
                .schema("hr")
                .from("timesheet_entries")
                .insert({
                    timesheet_id: timesheetId,
                    project_id: projectId,
                    timesheet_task_id: taskId,
                    entry_date: today,
                    time_in: now.toISOString()
                })
                .select()
                .single();

            if (entryError) throw entryError;

            return NextResponse.json({ success: true, data: entryData });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to clock in" },
                { status: 500 }
            );
        }
    });
}