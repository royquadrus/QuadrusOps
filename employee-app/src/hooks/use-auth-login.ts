import { useAuthStore } from "@/lib/stores/use-auth-store";
import { LoginFormData } from "@/lib/validation/auth";
//import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UseAuthLogin {
    isLoading: boolean;
    login: (data: LoginFormData) => Promise<void>;
}

export function UseAuthLogin(): UseAuthLogin {
    const { setUser, setLoading, isLoading } = useAuthStore();
    //const { toast } = useToast();
    const router = useRouter();

    async function login(data: LoginFormData) {
        try {
            setLoading(true);
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }

            const { data: responseData } = await response.json();
            setUser(responseData.user);

            /*toast({
                title: "Success",
                description: "You have successfully logged in.",
            });*/
           toast.success('You have successfully logged in.');

            router.push("/dashboard");
        } catch (error) {
            /*toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to login",
            });*/
            toast.error(error instanceof Error ? error.message : "Failed to login");
        } finally {
            setLoading(false);
        }
    }

    return { isLoading, login };
}