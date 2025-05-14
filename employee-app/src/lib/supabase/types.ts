export type Database = {
    hr: {
        Tables: {
            employees: {
                Row: {
                    employee_id: string;
                    first_name: string;
                    last_name: string;
                    email: string;
                    phone: string;
                    is_active: boolean;
                    employee_number: string;
                    work_email: string | null;
                    dob: string | null;
                    address: string | null;
                    hire_date: string | null;
                    termination_date: string | null;
                    rate: number | null;
                    manager_id: string | null;
                    position_id: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    employee_id: string;
                    first_name: string;
                    last_name: string;
                    email: string;
                    phone: string;
                    is_active: boolean;
                    employee_number: string;
                    work_email?: string | null;
                    dob?: string | null;
                    address?: string | null;
                    hire_date?: string | null;
                    termination_date?: string | null;
                    rate?: number | null;
                    manager_id?: string | null;
                    position_id?: string | null;
                    created_at: string;
                    updated_at?: string;
                };
                Update: {
                    employee_id?: string;
                    first_name?: string;
                    last_name?: string;
                    email?: string;
                    phone?: string;
                    is_active?: boolean;
                    employee_number?: string;
                    work_email?: string | null;
                    dob?: string | null;
                    address?: string | null;
                    hire_date?: string | null;
                    termination_date?: string | null;
                    rate?: number | null;
                    manager_id?: string | null;
                    position_id?: string | null;
                    created_at: string;
                    updated_at?: string;
                };
            };
        };
    };
};