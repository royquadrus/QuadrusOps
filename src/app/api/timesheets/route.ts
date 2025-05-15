import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { timesheetSchema } from "@/lib/validation/timesheet";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(request.url);
        const payPeriodId = url.searchParams.get("pay_period_id");

        try {
            const supabase = await createServerSupabaseClient();

            // Get the employee ID for the logged-in user
            const { data: employeeData, error: employeeError } = await supabase
                .schema("hr")
                .from("employees")
                .select("employee_id")
                .eq("email", user.email)
                .single();

            if (employeeError) throw employeeError;
            if (!employeeData) throw new Error("Employee not found");

            let query = supabase
                .schema("hr")
                .from("timesheets")
                .select("*")
                .eq("employee_id", employeeData.employee_id);

            if (payPeriodId) {
                query = query.eq("pay_period_id", payPeriodId);
            }

            const { data, error } = await query;

            if (error) throw error;

            return NextResponse.json({ data });
        } catch (error) {
            console.log(error);
            return NextResponse.json(
                { error: "Failed to fetch timesheets" },
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
            const validatedData = timesheetSchema.parse(body);

            const supabase = await createServerSupabaseClient();
            const { data, error } = await supabase
                .schema("hr")
                .from("timesheets")
                .insert(validatedData)
                .select();

            if (error) throw error;

            return NextResponse.json({ data });
        } catch (error) {
            console.log(error);
            return NextResponse.json(
                { error: "Failed to create timesheet" },
                { status: 500 }
            );
        }
    });
}