import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validation/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = loginSchema.parse(body);

        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
            email: validatedData.email,
            password: validatedData.password,
        });

        if (error) throw error;

        return NextResponse.json({ data })
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to login' },
            { status: 400 }
        );
    }
}