import { RegisterFormData } from "@/lib/validation/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface UseAuthRegister {
    isLoading: boolean;
    register: (data: RegisterFormData) => Promise<void>;
}

export function UseAuthRegister(): UseAuthRegister {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function register(data: RegisterFormData) {
        try {
            setIsLoading(true);
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }

            toast.success('You have successfully registered');

            router.push("/dashboard");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to register");
        } finally {
            setIsLoading(false);
        }
    }

    return { isLoading, register };
}