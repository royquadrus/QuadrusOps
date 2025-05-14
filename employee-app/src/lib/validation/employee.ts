import { z } from "zod";

export const employeeSchema = z.object({
    first_name: z.string().min(2, 'First name must be at least 2 characters'),
    last_name: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string(),
    is_active: z.boolean(),
    employee_number: z.string(),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;