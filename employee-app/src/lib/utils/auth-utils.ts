import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/use-auth-store";
import { createClientSupabaseClient } from "../supabase/client";
import { useCallback } from "react";

export function useSignOut() {
    const router = useRouter();
    const { setLoading, clearSession } = useAuthStore();
    const supabase = createClientSupabaseClient();

    const signOut = useCallback(async () => {
        try {
            setLoading(true);
            await supabase.auth.signOut();
            clearSession();
            router.replace("/login");
            router.refresh();
        } catch (error) {
            console.error("Error signing out:", error);
        } finally {
            setLoading(false);
        }
    }, [supabase, clearSession, setLoading, router]);

    return signOut;
}

export function useAuthSession() {
    const { user, isLoading } = useAuthStore();

    return {
        session: user ? { user } : null,
        isLoading,
    };
}