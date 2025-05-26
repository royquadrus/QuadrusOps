import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if(!user.email) {
            return NextResponse.json({ error: "User email not found" }, { status: 400 });
        }

        try {
            const { searchParams } = new URL(request.url);
            const payPeriodId = searchParams.get('payPeriodId');
            const userEmail = user.email;

            const supabase = await createServerSupabaseClient();

            const { data: employee, error: employeeError } = await supabase
                .schema("hr")
                .from("employees")
                .select("employee_id")
                .eq("email", userEmail)
                .single();

            if (employeeError) throw employeeError;

            if (!employee) {
                return NextResponse.json({ error: "Employee not found" }, { status: 404 });
            }

            const employeeId = employee.employee_id;

            let timesheetId;
            const { data: timesheet, error: timesheetError } = await supabase
                .schema("hr")
                .from("timesheets")
                .select("timesheet_id")
                .eq("employee_id", employeeId)
                .eq("pay_period_id", payPeriodId)
                .single();

            if (timesheetError && timesheetError.code !== 'PGRST116') {
                throw timesheetError;
            }

            if (timesheet) {
                timesheetId = timesheet.timesheet_id;
            } else {
                const { data: newTimesheet, error: newTimesheetError } = await supabase
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
                timesheetId = newTimesheet.timesheet_id;
            }

            return NextResponse.json({ timesheetId });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to get or create timesheet" },
                { status: 500 }
            );
        }
    });
}