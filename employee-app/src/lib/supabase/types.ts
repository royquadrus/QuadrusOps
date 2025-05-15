export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  comm: {
    Tables: {
      comments: {
        Row: {
          author_id: number
          comment_id: number
          content: string
          created_at: string
          post_id: number
        }
        Insert: {
          author_id: number
          comment_id?: number
          content: string
          created_at?: string
          post_id: number
        }
        Update: {
          author_id?: number
          comment_id?: number
          content?: string
          created_at?: string
          post_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          employee_id: number
          like_id: number
          post_id: number
        }
        Insert: {
          created_at?: string
          employee_id: number
          like_id?: number
          post_id: number
        }
        Update: {
          created_at?: string
          employee_id?: number
          like_id?: number
          post_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: number
          content: string
          created_at: string
          is_automated: boolean | null
          post_id: number
          post_type: string
        }
        Insert: {
          author_id: number
          content: string
          created_at?: string
          is_automated?: boolean | null
          post_id?: number
          post_type: string
        }
        Update: {
          author_id?: number
          content?: string
          created_at?: string
          is_automated?: boolean | null
          post_id?: number
          post_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  crm: {
    Tables: {
      contacts: {
        Row: {
          contact_id: number
          contact_name: string
          created_at: string
          customer_id: number | null
          email: string | null
          phone: string | null
          position: string | null
          supplier_id: number | null
          updated_at: string
        }
        Insert: {
          contact_id?: number
          contact_name: string
          created_at?: string
          customer_id?: number | null
          email?: string | null
          phone?: string | null
          position?: string | null
          supplier_id?: number | null
          updated_at?: string
        }
        Update: {
          contact_id?: number
          contact_name?: string
          created_at?: string
          customer_id?: number | null
          email?: string | null
          phone?: string | null
          position?: string | null
          supplier_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "contacts_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["supplier_id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          customer_id: number
          customer_name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          customer_id?: number
          customer_name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          customer_id?: number
          customer_name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      job_sites: {
        Row: {
          address: string | null
          created_at: string
          customer_id: number | null
          job_site_id: number
          site_contact_id: number | null
          site_name: string
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          customer_id?: number | null
          job_site_id?: number
          site_contact_id?: number | null
          site_name: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          customer_id?: number | null
          job_site_id?: number
          site_contact_id?: number | null
          site_name?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_sites_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "job_sites_site_contact_id_fkey"
            columns: ["site_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["contact_id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          created_at: string
          phone: string | null
          supplier_id: number
          supplier_name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          phone?: string | null
          supplier_id?: number
          supplier_name: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          phone?: string | null
          supplier_id?: number
          supplier_name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  hr: {
    Tables: {
      calendar: {
        Row: {
          date: string
          day_of_month: number | null
          day_of_week: number | null
          month: number | null
          quarter: number | null
          year: number | null
        }
        Insert: {
          date: string
          day_of_month?: number | null
          day_of_week?: number | null
          month?: number | null
          quarter?: number | null
          year?: number | null
        }
        Update: {
          date?: string
          day_of_month?: number | null
          day_of_week?: number | null
          month?: number | null
          quarter?: number | null
          year?: number | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          address: string | null
          created_at: string
          dob: string | null
          email: string
          employee_id: number
          employee_number: string
          first_name: string
          hire_date: string | null
          is_active: boolean | null
          last_name: string
          manager_id: number | null
          phone: string | null
          position_id: number | null
          rate: number | null
          termination_date: string | null
          updated_at: string
          work_email: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          dob?: string | null
          email: string
          employee_id?: number
          employee_number: string
          first_name: string
          hire_date?: string | null
          is_active?: boolean | null
          last_name: string
          manager_id?: number | null
          phone?: string | null
          position_id?: number | null
          rate?: number | null
          termination_date?: string | null
          updated_at?: string
          work_email?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          dob?: string | null
          email?: string
          employee_id?: number
          employee_number?: string
          first_name?: string
          hire_date?: string | null
          is_active?: boolean | null
          last_name?: string
          manager_id?: number | null
          phone?: string | null
          position_id?: number | null
          rate?: number | null
          termination_date?: string | null
          updated_at?: string
          work_email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "employees_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["position_id"]
          },
        ]
      }
      pay_periods: {
        Row: {
          end_date: string | null
          pay_period_id: string
          start_date: string
        }
        Insert: {
          end_date?: string | null
          pay_period_id: string
          start_date: string
        }
        Update: {
          end_date?: string | null
          pay_period_id?: string
          start_date?: string
        }
        Relationships: []
      }
      payroll_entries: {
        Row: {
          created_at: string
          minutes_paid: number | null
          payroll_entry_id: number
          payroll_id: number | null
          timesheet_entry_id: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          minutes_paid?: number | null
          payroll_entry_id?: number
          payroll_id?: number | null
          timesheet_entry_id?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          minutes_paid?: number | null
          payroll_entry_id?: number
          payroll_id?: number | null
          timesheet_entry_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_entries_payroll_id_fkey"
            columns: ["payroll_id"]
            isOneToOne: false
            referencedRelation: "payrolls"
            referencedColumns: ["payroll_id"]
          },
          {
            foreignKeyName: "payroll_entries_timesheet_entry_id_fkey"
            columns: ["timesheet_entry_id"]
            isOneToOne: false
            referencedRelation: "timesheet_entries"
            referencedColumns: ["timesheet_entry_id"]
          },
        ]
      }
      payrolls: {
        Row: {
          created_at: string
          employee_id: number | null
          pay_period_id: string | null
          payroll_id: number
          processed_on: string | null
          processor_id: number | null
          processor_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          employee_id?: number | null
          pay_period_id?: string | null
          payroll_id?: number
          processed_on?: string | null
          processor_id?: number | null
          processor_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          employee_id?: number | null
          pay_period_id?: string | null
          payroll_id?: number
          processed_on?: string | null
          processor_id?: number | null
          processor_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payrolls_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "payrolls_pay_period_id_fkey"
            columns: ["pay_period_id"]
            isOneToOne: false
            referencedRelation: "pay_periods"
            referencedColumns: ["pay_period_id"]
          },
          {
            foreignKeyName: "payrolls_processor_id_fkey"
            columns: ["processor_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      positions: {
        Row: {
          agreement_status: string
          created_at: string
          is_manager: boolean | null
          manager_id: number | null
          position_id: number
          position_standards: string | null
          position_status: string
          position_title: string
          results_statement: string | null
          strategic_work: string | null
          tactical_work: string | null
          updated_at: string
        }
        Insert: {
          agreement_status: string
          created_at?: string
          is_manager?: boolean | null
          manager_id?: number | null
          position_id?: number
          position_standards?: string | null
          position_status: string
          position_title: string
          results_statement?: string | null
          strategic_work?: string | null
          tactical_work?: string | null
          updated_at?: string
        }
        Update: {
          agreement_status?: string
          created_at?: string
          is_manager?: boolean | null
          manager_id?: number | null
          position_id?: number
          position_standards?: string | null
          position_status?: string
          position_title?: string
          results_statement?: string | null
          strategic_work?: string | null
          tactical_work?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["position_id"]
          },
        ]
      }
      timesheet_entries: {
        Row: {
          created_at: string
          duration: number | null
          entry_date: string | null
          minutes_banked: number | null
          minutes_paid: number | null
          project_id: number | null
          time_in: string
          time_out: string | null
          timesheet_entry_id: number
          timesheet_id: number | null
          timesheet_task_id: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration?: number | null
          entry_date?: string | null
          minutes_banked?: number | null
          minutes_paid?: number | null
          project_id?: number | null
          time_in?: string
          time_out?: string | null
          timesheet_entry_id?: number
          timesheet_id?: number | null
          timesheet_task_id?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration?: number | null
          entry_date?: string | null
          minutes_banked?: number | null
          minutes_paid?: number | null
          project_id?: number | null
          time_in?: string
          time_out?: string | null
          timesheet_entry_id?: number
          timesheet_id?: number | null
          timesheet_task_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "timesheet_entries_timesheet_id_fkey"
            columns: ["timesheet_id"]
            isOneToOne: false
            referencedRelation: "timesheets"
            referencedColumns: ["timesheet_id"]
          },
          {
            foreignKeyName: "timesheet_entries_timesheet_task_id_fkey"
            columns: ["timesheet_task_id"]
            isOneToOne: false
            referencedRelation: "timesheet_tasks"
            referencedColumns: ["timesheet_task_id"]
          },
        ]
      }
      timesheet_tasks: {
        Row: {
          created_at: string
          description: string | null
          task_name: string
          timesheet_task_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          task_name: string
          timesheet_task_id?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          task_name?: string
          timesheet_task_id?: number
          updated_at?: string
        }
        Relationships: []
      }
      timesheets: {
        Row: {
          approved_on: string | null
          approver_id: number | null
          approver_name: string | null
          created_at: string
          employee_id: number
          note: string | null
          pay_period_id: string | null
          status: string
          timesheet_id: number
          updated_at: string
        }
        Insert: {
          approved_on?: string | null
          approver_id?: number | null
          approver_name?: string | null
          created_at?: string
          employee_id: number
          note?: string | null
          pay_period_id?: string | null
          status: string
          timesheet_id?: number
          updated_at?: string
        }
        Update: {
          approved_on?: string | null
          approver_id?: number | null
          approver_name?: string | null
          created_at?: string
          employee_id?: number
          note?: string | null
          pay_period_id?: string | null
          status?: string
          timesheet_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "timesheets_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "timesheets_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "timesheets_pay_period_id_fkey"
            columns: ["pay_period_id"]
            isOneToOne: false
            referencedRelation: "pay_periods"
            referencedColumns: ["pay_period_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  inv: {
    Tables: {
      customer_items: {
        Row: {
          created_at: string
          customer_id: number
          customer_item_id: number
          item_sku: string
          project_id: number | null
          quantity: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: number
          customer_item_id?: number
          item_sku: string
          project_id?: number | null
          quantity?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: number
          customer_item_id?: number
          item_sku?: string
          project_id?: number | null
          quantity?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_items_item_sku_fkey"
            columns: ["item_sku"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["item_sku"]
          },
        ]
      }
      inventory_audit: {
        Row: {
          customer_id: number
          inventory_audit_id: number
          item_sku: string
          new_quantity: number | null
          performed_by_id: number | null
          previous_quantity: number | null
          project_id: number | null
          quantity: number | null
          transaction_time: string
          transaction_type: string
          work_order_id: number | null
        }
        Insert: {
          customer_id: number
          inventory_audit_id?: number
          item_sku: string
          new_quantity?: number | null
          performed_by_id?: number | null
          previous_quantity?: number | null
          project_id?: number | null
          quantity?: number | null
          transaction_time?: string
          transaction_type: string
          work_order_id?: number | null
        }
        Update: {
          customer_id?: number
          inventory_audit_id?: number
          item_sku?: string
          new_quantity?: number | null
          performed_by_id?: number | null
          previous_quantity?: number | null
          project_id?: number | null
          quantity?: number | null
          transaction_time?: string
          transaction_type?: string
          work_order_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_audit_item_sku_fkey"
            columns: ["item_sku"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["item_sku"]
          },
        ]
      }
      inventory_items: {
        Row: {
          board_feet: number | null
          item_description: string | null
          item_name: string
          item_sku: string
          item_type: string
          quantity: number | null
        }
        Insert: {
          board_feet?: number | null
          item_description?: string | null
          item_name: string
          item_sku: string
          item_type: string
          quantity?: number | null
        }
        Update: {
          board_feet?: number | null
          item_description?: string | null
          item_name?: string
          item_sku?: string
          item_type?: string
          quantity?: number | null
        }
        Relationships: []
      }
      inventory_order_items: {
        Row: {
          created_at: string
          inventory_order_id: number
          inventory_order_item_id: number
          item_sku: string | null
          quantity_ordered: number | null
          quantity_received: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          inventory_order_id: number
          inventory_order_item_id?: number
          item_sku?: string | null
          quantity_ordered?: number | null
          quantity_received?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          inventory_order_id?: number
          inventory_order_item_id?: number
          item_sku?: string | null
          quantity_ordered?: number | null
          quantity_received?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_order_items_inventory_order_id_fkey"
            columns: ["inventory_order_id"]
            isOneToOne: false
            referencedRelation: "inventory_orders"
            referencedColumns: ["inventory_order_id"]
          },
          {
            foreignKeyName: "inventory_order_items_item_sku_fkey"
            columns: ["item_sku"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["item_sku"]
          },
        ]
      }
      inventory_orders: {
        Row: {
          created_at: string
          delivery_date: string | null
          inventory_order_id: number
          order_date: string
          order_number: string
          order_status: string
          ordered_by_id: number | null
          received_by_id: number | null
          received_date: string | null
          supplier_contact_id: number | null
          supplier_id: number | null
          updated_at: string
          work_order_id: number | null
        }
        Insert: {
          created_at?: string
          delivery_date?: string | null
          inventory_order_id?: number
          order_date?: string
          order_number: string
          order_status?: string
          ordered_by_id?: number | null
          received_by_id?: number | null
          received_date?: string | null
          supplier_contact_id?: number | null
          supplier_id?: number | null
          updated_at?: string
          work_order_id?: number | null
        }
        Update: {
          created_at?: string
          delivery_date?: string | null
          inventory_order_id?: number
          order_date?: string
          order_number?: string
          order_status?: string
          ordered_by_id?: number | null
          received_by_id?: number | null
          received_date?: string | null
          supplier_contact_id?: number | null
          supplier_id?: number | null
          updated_at?: string
          work_order_id?: number | null
        }
        Relationships: []
      }
      inventory_remaining: {
        Row: {
          counted_by_id: number | null
          created_at: string
          date_counted: string
          inventory_remaining_id: number
          item_sku: string
          quantity: number | null
          updated_at: string
          work_order_id: number | null
        }
        Insert: {
          counted_by_id?: number | null
          created_at?: string
          date_counted?: string
          inventory_remaining_id?: number
          item_sku: string
          quantity?: number | null
          updated_at?: string
          work_order_id?: number | null
        }
        Update: {
          counted_by_id?: number | null
          created_at?: string
          date_counted?: string
          inventory_remaining_id?: number
          item_sku?: string
          quantity?: number | null
          updated_at?: string
          work_order_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_remaining_item_sku_fkey"
            columns: ["item_sku"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["item_sku"]
          },
        ]
      }
      inventory_return_items: {
        Row: {
          created_at: string
          inventory_return_id: number
          inventory_return_item_id: number
          item_sku: string | null
          quantity_shipped: number | null
          quantity_to_return: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          inventory_return_id: number
          inventory_return_item_id?: number
          item_sku?: string | null
          quantity_shipped?: number | null
          quantity_to_return?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          inventory_return_id?: number
          inventory_return_item_id?: number
          item_sku?: string | null
          quantity_shipped?: number | null
          quantity_to_return?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_return_items_inventory_return_id_fkey"
            columns: ["inventory_return_id"]
            isOneToOne: false
            referencedRelation: "inventory_returns"
            referencedColumns: ["inventory_return_id"]
          },
          {
            foreignKeyName: "inventory_return_items_item_sku_fkey"
            columns: ["item_sku"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["item_sku"]
          },
        ]
      }
      inventory_returns: {
        Row: {
          created_at: string
          customer_id: number | null
          inventory_return_id: number
          return_date: string | null
          return_number: string
          returned_by_id: number | null
          shipped_by_id: number | null
          shipped_date: string | null
          status: string
          submitted_date: string
          supplier_contact_id: number | null
          supplier_id: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: number | null
          inventory_return_id?: number
          return_date?: string | null
          return_number: string
          returned_by_id?: number | null
          shipped_by_id?: number | null
          shipped_date?: string | null
          status?: string
          submitted_date?: string
          supplier_contact_id?: number | null
          supplier_id?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: number | null
          inventory_return_id?: number
          return_date?: string | null
          return_number?: string
          returned_by_id?: number | null
          shipped_by_id?: number | null
          shipped_date?: string | null
          status?: string
          submitted_date?: string
          supplier_contact_id?: number | null
          supplier_id?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      inventory_used: {
        Row: {
          created_at: string
          date_loaded: string
          inventory_used_id: number
          item_sku: string
          loaded_by_id: number | null
          quantity: number | null
          updated_at: string
          work_order_id: number | null
        }
        Insert: {
          created_at?: string
          date_loaded?: string
          inventory_used_id?: number
          item_sku: string
          loaded_by_id?: number | null
          quantity?: number | null
          updated_at?: string
          work_order_id?: number | null
        }
        Update: {
          created_at?: string
          date_loaded?: string
          inventory_used_id?: number
          item_sku?: string
          loaded_by_id?: number | null
          quantity?: number | null
          updated_at?: string
          work_order_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_used_item_sku_fkey"
            columns: ["item_sku"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["item_sku"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  pm: {
    Tables: {
      floor_panels: {
        Row: {
          created_at: string
          depth: number | null
          floor_type: string
          length: number | null
          panel_id: number
          square_footage: number | null
          updated_at: string
          width: number | null
        }
        Insert: {
          created_at?: string
          depth?: number | null
          floor_type: string
          length?: number | null
          panel_id?: number
          square_footage?: number | null
          updated_at?: string
          width?: number | null
        }
        Update: {
          created_at?: string
          depth?: number | null
          floor_type?: string
          length?: number | null
          panel_id?: number
          square_footage?: number | null
          updated_at?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "floor_panels_panel_id_fkey"
            columns: ["panel_id"]
            isOneToOne: true
            referencedRelation: "panels"
            referencedColumns: ["panel_id"]
          },
        ]
      }
      floor_stacks: {
        Row: {
          created_at: string
          floor_type: string
          stack_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          floor_type: string
          stack_id?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          floor_type?: string
          stack_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "floor_stacks_stack_id_fkey"
            columns: ["stack_id"]
            isOneToOne: true
            referencedRelation: "stacks"
            referencedColumns: ["stack_id"]
          },
        ]
      }
      panels: {
        Row: {
          created_at: string
          panel_file: Json | null
          panel_id: number
          panel_number: string
          panel_status: string
          sequence_number: number | null
          stack_id: number
          updated_at: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          panel_file?: Json | null
          panel_id?: number
          panel_number: string
          panel_status?: string
          sequence_number?: number | null
          stack_id: number
          updated_at?: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          panel_file?: Json | null
          panel_id?: number
          panel_number?: string
          panel_status?: string
          sequence_number?: number | null
          stack_id?: number
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "panels_stack_id_fkey"
            columns: ["stack_id"]
            isOneToOne: false
            referencedRelation: "stacks"
            referencedColumns: ["stack_id"]
          },
        ]
      }
      projects: {
        Row: {
          builder_id: number | null
          created_at: string
          customer_id: number | null
          designer_id: number | null
          est_framing_start: string | null
          job_site_id: number | null
          material_customer_id: number | null
          number_units: number | null
          project_id: number
          project_name: string
          project_number: string | null
          project_status: string
          scope: string | null
          supplier_contact_id: number | null
          supplier_id: number | null
          updated_at: string
        }
        Insert: {
          builder_id?: number | null
          created_at?: string
          customer_id?: number | null
          designer_id?: number | null
          est_framing_start?: string | null
          job_site_id?: number | null
          material_customer_id?: number | null
          number_units?: number | null
          project_id?: number
          project_name: string
          project_number?: string | null
          project_status?: string
          scope?: string | null
          supplier_contact_id?: number | null
          supplier_id?: number | null
          updated_at?: string
        }
        Update: {
          builder_id?: number | null
          created_at?: string
          customer_id?: number | null
          designer_id?: number | null
          est_framing_start?: string | null
          job_site_id?: number | null
          material_customer_id?: number | null
          number_units?: number | null
          project_id?: number
          project_name?: string
          project_number?: string | null
          project_status?: string
          scope?: string | null
          supplier_contact_id?: number | null
          supplier_id?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      roof_panels: {
        Row: {
          created_at: string
          depth: number | null
          length: number | null
          panel_id: number
          roof_type: string
          square_footage: number | null
          updated_at: string
          width: number | null
        }
        Insert: {
          created_at?: string
          depth?: number | null
          length?: number | null
          panel_id?: number
          roof_type: string
          square_footage?: number | null
          updated_at?: string
          width?: number | null
        }
        Update: {
          created_at?: string
          depth?: number | null
          length?: number | null
          panel_id?: number
          roof_type?: string
          square_footage?: number | null
          updated_at?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "roof_panels_panel_id_fkey"
            columns: ["panel_id"]
            isOneToOne: true
            referencedRelation: "panels"
            referencedColumns: ["panel_id"]
          },
        ]
      }
      roof_stacks: {
        Row: {
          created_at: string
          roof_type: string
          stack_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          roof_type: string
          stack_id?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          roof_type?: string
          stack_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roof_stacks_stack_id_fkey"
            columns: ["stack_id"]
            isOneToOne: true
            referencedRelation: "stacks"
            referencedColumns: ["stack_id"]
          },
        ]
      }
      stacks: {
        Row: {
          created_at: string
          production_line_id: number | null
          stack_file: Json | null
          stack_id: number
          stack_number: string
          stack_panel_file: Json | null
          stack_status: string
          updated_at: string
          work_order_id: number
        }
        Insert: {
          created_at?: string
          production_line_id?: number | null
          stack_file?: Json | null
          stack_id?: number
          stack_number: string
          stack_panel_file?: Json | null
          stack_status: string
          updated_at?: string
          work_order_id: number
        }
        Update: {
          created_at?: string
          production_line_id?: number | null
          stack_file?: Json | null
          stack_id?: number
          stack_number?: string
          stack_panel_file?: Json | null
          stack_status?: string
          updated_at?: string
          work_order_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "stacks_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["work_order_id"]
          },
        ]
      }
      wall_panels: {
        Row: {
          created_at: string
          height: number | null
          length: number | null
          panel_id: number
          updated_at: string
          wall_type: string
        }
        Insert: {
          created_at?: string
          height?: number | null
          length?: number | null
          panel_id?: number
          updated_at?: string
          wall_type: string
        }
        Update: {
          created_at?: string
          height?: number | null
          length?: number | null
          panel_id?: number
          updated_at?: string
          wall_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "wall_panels_panel_id_fkey"
            columns: ["panel_id"]
            isOneToOne: true
            referencedRelation: "panels"
            referencedColumns: ["panel_id"]
          },
        ]
      }
      wall_stacks: {
        Row: {
          created_at: string
          stack_id: number
          updated_at: string
          wall_type: string
        }
        Insert: {
          created_at?: string
          stack_id?: number
          updated_at?: string
          wall_type: string
        }
        Update: {
          created_at?: string
          stack_id?: number
          updated_at?: string
          wall_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "wall_stacks_stack_id_fkey"
            columns: ["stack_id"]
            isOneToOne: true
            referencedRelation: "stacks"
            referencedColumns: ["stack_id"]
          },
        ]
      }
      work_orders: {
        Row: {
          created_at: string
          production_start: string | null
          project_id: number
          revenue: number | null
          ship_date: string | null
          square_footage: number | null
          updated_at: string
          work_order_id: number
          work_order_level: string | null
          work_order_number: string
          work_order_status: string
          work_order_type: string
        }
        Insert: {
          created_at?: string
          production_start?: string | null
          project_id: number
          revenue?: number | null
          ship_date?: string | null
          square_footage?: number | null
          updated_at?: string
          work_order_id?: number
          work_order_level?: string | null
          work_order_number: string
          work_order_status?: string
          work_order_type: string
        }
        Update: {
          created_at?: string
          production_start?: string | null
          project_id?: number
          revenue?: number | null
          ship_date?: string | null
          square_footage?: number | null
          updated_at?: string
          work_order_id?: number
          work_order_level?: string | null
          work_order_number?: string
          work_order_status?: string
          work_order_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  prod: {
    Tables: {
      floor_stack_trackers: {
        Row: {
          created_at: string
          employee_one_id: number | null
          employee_two_id: number | null
          floor_stack_tracker_id: number
          production_date: string
          quality_checks_performed: boolean | null
          stack_id: number
          time_to_build: number | null
          total_area: number | null
        }
        Insert: {
          created_at?: string
          employee_one_id?: number | null
          employee_two_id?: number | null
          floor_stack_tracker_id?: number
          production_date?: string
          quality_checks_performed?: boolean | null
          stack_id: number
          time_to_build?: number | null
          total_area?: number | null
        }
        Update: {
          created_at?: string
          employee_one_id?: number | null
          employee_two_id?: number | null
          floor_stack_tracker_id?: number
          production_date?: string
          quality_checks_performed?: boolean | null
          stack_id?: number
          time_to_build?: number | null
          total_area?: number | null
        }
        Relationships: []
      }
      production_line_stations: {
        Row: {
          production_line_id: number
          sequence_number: number
          work_station_id: number
        }
        Insert: {
          production_line_id: number
          sequence_number: number
          work_station_id: number
        }
        Update: {
          production_line_id?: number
          sequence_number?: number
          work_station_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "production_line_stations_production_line_id_fkey"
            columns: ["production_line_id"]
            isOneToOne: false
            referencedRelation: "production_lines"
            referencedColumns: ["production_line_id"]
          },
          {
            foreignKeyName: "production_line_stations_work_station_id_fkey"
            columns: ["work_station_id"]
            isOneToOne: false
            referencedRelation: "work_stations"
            referencedColumns: ["work_station_id"]
          },
        ]
      }
      production_lines: {
        Row: {
          created_at: string
          line_name: string
          production_line_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          line_name: string
          production_line_id?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          line_name?: string
          production_line_id?: number
          updated_at?: string
        }
        Relationships: []
      }
      production_queue: {
        Row: {
          production_queue_id: number
          sequence_number: number | null
          stack_id: number | null
          status: string
          work_order_id: number | null
        }
        Insert: {
          production_queue_id?: number
          sequence_number?: number | null
          stack_id?: number | null
          status?: string
          work_order_id?: number | null
        }
        Update: {
          production_queue_id?: number
          sequence_number?: number | null
          stack_id?: number | null
          status?: string
          work_order_id?: number | null
        }
        Relationships: []
      }
      production_trackers: {
        Row: {
          duration: number | null
          employee_one_id: number | null
          employee_two_id: number | null
          end_time: string | null
          notes: string | null
          panel_id: number
          production_tracker_id: number
          start_time: string
          work_station_id: number | null
        }
        Insert: {
          duration?: number | null
          employee_one_id?: number | null
          employee_two_id?: number | null
          end_time?: string | null
          notes?: string | null
          panel_id: number
          production_tracker_id?: number
          start_time?: string
          work_station_id?: number | null
        }
        Update: {
          duration?: number | null
          employee_one_id?: number | null
          employee_two_id?: number | null
          end_time?: string | null
          notes?: string | null
          panel_id?: number
          production_tracker_id?: number
          start_time?: string
          work_station_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "production_trackers_work_station_id_fkey"
            columns: ["work_station_id"]
            isOneToOne: false
            referencedRelation: "work_stations"
            referencedColumns: ["work_station_id"]
          },
        ]
      }
      roof_stack_trackers: {
        Row: {
          created_at: string
          employee_one_id: number | null
          employee_two_id: number | null
          production_date: string
          quality_checks_performed: boolean | null
          roof_stack_tracker_id: number
          stack_id: number
          time_to_build: number | null
          total_area: number | null
        }
        Insert: {
          created_at?: string
          employee_one_id?: number | null
          employee_two_id?: number | null
          production_date?: string
          quality_checks_performed?: boolean | null
          roof_stack_tracker_id?: number
          stack_id: number
          time_to_build?: number | null
          total_area?: number | null
        }
        Update: {
          created_at?: string
          employee_one_id?: number | null
          employee_two_id?: number | null
          production_date?: string
          quality_checks_performed?: boolean | null
          roof_stack_tracker_id?: number
          stack_id?: number
          time_to_build?: number | null
          total_area?: number | null
        }
        Relationships: []
      }
      wall_stack_trackers: {
        Row: {
          created_at: string
          employee_one_id: number | null
          employee_two_id: number | null
          production_date: string
          quality_checks_performed: boolean | null
          stack_id: number
          time_to_build: number | null
          total_length: number | null
          wall_stack_tracker_id: number
        }
        Insert: {
          created_at?: string
          employee_one_id?: number | null
          employee_two_id?: number | null
          production_date?: string
          quality_checks_performed?: boolean | null
          stack_id: number
          time_to_build?: number | null
          total_length?: number | null
          wall_stack_tracker_id?: number
        }
        Update: {
          created_at?: string
          employee_one_id?: number | null
          employee_two_id?: number | null
          production_date?: string
          quality_checks_performed?: boolean | null
          stack_id?: number
          time_to_build?: number | null
          total_length?: number | null
          wall_stack_tracker_id?: number
        }
        Relationships: []
      }
      work_station_assignments: {
        Row: {
          employee_id: number
          end_time: string | null
          start_time: string
          work_station_assignment_id: number
          work_station_id: number
        }
        Insert: {
          employee_id: number
          end_time?: string | null
          start_time?: string
          work_station_assignment_id?: number
          work_station_id: number
        }
        Update: {
          employee_id?: number
          end_time?: string | null
          start_time?: string
          work_station_assignment_id?: number
          work_station_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "work_station_assignments_work_station_id_fkey"
            columns: ["work_station_id"]
            isOneToOne: false
            referencedRelation: "work_stations"
            referencedColumns: ["work_station_id"]
          },
        ]
      }
      work_stations: {
        Row: {
          created_at: string
          is_idle: boolean | null
          number_operators: number
          updated_at: string
          work_station_id: number
          work_station_name: string
        }
        Insert: {
          created_at?: string
          is_idle?: boolean | null
          number_operators: number
          updated_at?: string
          work_station_id?: number
          work_station_name: string
        }
        Update: {
          created_at?: string
          is_idle?: boolean | null
          number_operators?: number
          updated_at?: string
          work_station_id?: number
          work_station_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  comm: {
    Enums: {},
  },
  crm: {
    Enums: {},
  },
  graphql_public: {
    Enums: {},
  },
  hr: {
    Enums: {},
  },
  inv: {
    Enums: {},
  },
  pm: {
    Enums: {},
  },
  prod: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const