import { createServerSupabaseClient } from "@/lib/supabase/server";
import { resetPasswordSchema } from "@/lib/validation/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = resetPasswordSchema.parse(body);

        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.auth.resetPasswordForEmail(validatedData.email, {
            redirectTo: `${request.nextUrl.origin}/auth/callback`,
        });

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to register" },
            { status: 400 }
        );
    }
}