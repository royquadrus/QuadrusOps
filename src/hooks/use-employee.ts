import { EmployeeFormData } from "@/lib/validation/employee";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface Employee {
    employee_id: number;
    first_name: string;
    last_name: string;
    email: string;
    employee_number: string;
    phone: string;
    is_active: boolean;
}

interface UseEmployee {
    employee: Employee | null;
    //updateEmployee: (data: EmployeeFormData) => Promise<void>;
    isLoading: boolean;
}

export function useEmployee(): UseEmployee {
    const [isLoading, setIsLoading] = useState(false);
    const [employee, setEmployee] = useState<Employee | null>(null);

    useEffect(() => {
        async function fetchEmployee() {
            try {
                const response = await fetch("/api/employee");
                if (!response.ok) throw new Error("Failed to fetch employee");

                const { data } = await response.json();
                setEmployee(data);
                /*
                const employee = data as Employee;
                setEmployee({
                    employee_id: employee.employee_id,
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    email: employee.email,
                    employee_number: employee.employee_number,
                    phone: employee.phone,
                    is_active: employee.is_active,
                });*/
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to fetch employee");
                setEmployee(null);
            }
        }

        fetchEmployee();
    });

    /*
    const updateEmployee = async (data: EmployeeFormData) => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/employee", {
                method: "PUT",
                headers: {
                    "Content-Type": "application-json",
                },
            });

            if (!response.ok) throw new Error("Failed to update employee");

            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };*/

    return { employee, isLoading };
}