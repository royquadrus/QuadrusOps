import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
    user: User | null
    isLoading: boolean
    setUser: (user: User | null) => void
    setLoading: (isLoading: boolean) => void
    clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoading: true,
            setUser: (user) => set({ user }),
            setLoading: (isLoading) => set({ isLoading }),
            clearSession: () => set({ user: null }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)