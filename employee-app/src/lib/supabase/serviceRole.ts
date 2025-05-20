import { createClient } from '@supabase/supabase-js';

// In your GET function:
try {
    // Create a supabase client with the service role key (bypasses RLS)
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!, // Make sure this is set in your environment
        { 
            auth: { persistSession: false }
        }
    );
    
    const { data, error } = await supabaseAdmin
        .from('projects')  // Note: You might not need schema prefix with service role
        .select("*")
        .in("project_status", ['Design', 'Queued', 'WIP', 'Built'])
        .order("project_number", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
} catch (error) {
    console.error(error);
    return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to fetch projects" },
        { status: 500 }
    );
}