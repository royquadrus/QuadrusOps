import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { employeeSchema } from "@/lib/validation/employee";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const supabase = await createServerSupabaseClient();
            const { data, error } = await supabase
                .schema("hr")
                .from("employees")
                .select("*");

            if (error) throw error;

            return NextResponse.json({ data });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to fetch employee" },
                { status: 500 }
            )
        }
    });
}

export async function PUT(request: NextRequest) {
    return withAuth(request, async () => {
        try {
            const body = await request.json();
            const validatedData = employeeSchema.parse(body);

            const supabase = await createServerSupabaseClient();
            const { error } = await supabase.auth.updateUser({
                data: {
                    ...validatedData,
                },
            });

            if (error) throw error;

            return NextResponse.json({ message: "Employee updated successfully" });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: "Failed to updated profile" },
                { status: 500 }
            );
        }
    });
}