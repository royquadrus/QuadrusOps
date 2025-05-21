import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    return withAuth(request, async (user) => {
      if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        try {
            const { searchParams } = new URL(request.url);
            const payPeriodId = searchParams.get('payPeriodId');

            if (!payPeriodId) {
                return NextResponse.json({ error: "Missing pay period ID" }, { status: 400 });
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

            // Get the timesheet for the current user and pay period
            const { data: timesheet, error: timesheetError } = await supabase
                .schema("hr")
                .from("timesheets")
                .select("timesheet_id")
                .eq("employee_id", employeeId)
                .eq("pay_period_id", payPeriodId)
                .single();

            if (timesheetError) {
                return NextResponse.json({ data: [] });
            }

            // Get today's date in ISO format
            const today = new Date().toISOString().split('T')[0];

            // Get all entries for today
            const { data: entries, error: entriesError } = await supabase
                .schema("hr")
                .from("timesheet_entries")
                .select(`
                    timesheet_entry_id,
                    time_in,
                    time_out,
                    duration,
                    project_id,
                    tasks:timesheet_task_id (
                        task_name
                    )
                `)
                .eq("timesheet_id", timesheet.timesheet_id)
                .gte("time_in", `${today}T00:00:00.000Z`)
                .order("time_in", { ascending: false });

            if (entriesError) {
                return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 });
            }

            const formattedEntries = await Promise.all((entries || []).map(async (entry) => {
                let projectData = null;

                if (entry.project_id) {
                    const { data: project, error: projectError } = await supabase
                        .schema("pm")
                        .from("projects")
                        .select("project_id, project_name")
                        .eq("project_id", entry.project_id)
                        .single();

                    if (!projectError && project) {
                        projectData = project;
                    }
                }

                return {
                    timesheet_entry_id: entry.timesheet_entry_id,
                    time_in: entry.time_in,
                    time_out: entry.time_out,
                    duration: entry.duration,
                    project_name: projectData?.project_name || null,
                    task_name: entry.tasks?.task_name || null,
                };
            }));

            return NextResponse.json({ data: formattedEntries });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to fetch entries" },
                { status: 500 }
            );
        }
    });
}