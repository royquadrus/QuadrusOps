import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


export interface PayPeriod {
    pay_period_id: string;
    start_date: string;
    end_date: string;
};

export interface TimesheetDayEntry {
    date: string;
    timesheet_id: number | null;
    status: string | null;
    pay_period_id: string;
    start_date: string;
    end_date: string;
    total_punches: number;
    total_hours: number;
};

export interface TimesheetState {
    // Data
    payPeriods: PayPeriod[];
    selectedPayPeriod: PayPeriod | null;
    timesheetDays: TimesheetDayEntry[];
    isLoading: boolean;
    error: string | null;

    // Actions
    setPayPeriods: (payPeriods: PayPeriod[]) => void;
    setSelectedPayPeriod: (payPeriod: PayPeriod) => void;
    setTimesheetDays: (days: TimesheetDayEntry[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
};

export const useTimeSheetStore = create<TimesheetState>()(
    persist(
        (set) => ({
            // Initial state
            payPeriods: [],
            selectedPayPeriod: null,
            timesheetDays: [],
            isLoading: false,
            error: null,

            // Actions
            setPayPeriods: (payPeriods) => set({ payPeriods }),
            setSelectedPayPeriod: (payPeriod) => set({ selectedPayPeriod: payPeriod }),
            setTimesheetDays: (days) => set({ timesheetDays: days }),
            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),
        }),
        {
            name: 'timesheet-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);