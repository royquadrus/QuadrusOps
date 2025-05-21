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
                return NextResponse.json({ error: 'Pay Period ID is required' }, { status: 400 });
            }

            const supabase = await createServerSupabaseClient();

            // Get pay period timesheet
            const { data: timesheet, error: timesheetError } = await supabase
                .rpc('get_timesheet_data', {
                    selected_pay_period: payPeriodId,
                    user_email: user.email
                });

           
            if (timesheetError) throw timesheetError;

            return NextResponse.json({ timesheet });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to get pay period timesheet" },
                { status: 500 }
            );
        }
    });
}