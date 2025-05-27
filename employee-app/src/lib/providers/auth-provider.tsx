"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "../stores/use-auth-store";
import { createClientSupabaseClient } from "../supabase/client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setUser, setLoading } = useAuthStore();
    const supabase = createClientSupabaseClient();
    const initialized = useRef(false);

    useEffect(() => {
        // Prevent multiple initializations
        if (initialized.current) return;
        initialized.current = true;

        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    setUser(session.user);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return <>{children}</>
}