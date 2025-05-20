"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEmployee } from "@/hooks/use-employee";
import { EmployeeFormData, employeeSchema } from "@/lib/validation/employee";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function EmployeePage() {
    const { employee, updateEmployee } = useEmployee();
    const form = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            employee_number: "",
            is_active: true,
        },
    });

    useEffect(() => {
        if (employee) {
            form.reset({
                first_name: employee.first_name || "",
                last_name: employee.last_name || "",
                email: employee.email || "",
                phone: employee.phone || "",
                employee_number: employee.employee_number || "",
                is_active: employee.is_active || true,
            })
        }
    }, [employee, form]);

    return (
        <div className="container mx-auto py-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Employee Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and employee profile
                    </p>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(updateEmployee)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        First Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </div>
        </div>
    );
}