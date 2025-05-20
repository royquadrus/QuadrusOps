import { PayPeriod } from "@/lib/validation/timesheet";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function usePayPeriod() {
    const [payPeriod, setPayPeriod] = useState<PayPeriod>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCurrentPayPeriod() {
            try {
                const response = await fetch("/api/current-pay-period");
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error);
                }

                const { data } = await response.json();
                setPayPeriod(data);
            } catch (error) {
                toast.error("Failed to fetch pay period.");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCurrentPayPeriod();
    }, []);

    return { payPeriod, isLoading };
}