import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TimeclockState {
    // Data
    currentPayPeriod: { id: string, startDate: string, endDate: string } | null;
    currentTimesheet: any | null;
    activeEntry: any | null;
    selectedDate: string | null;
    last52PayPeriods: any[];
    selectedPayPeriod: string | null;
    selectedEntry: string | null;
    projects: any[];
    tasks: any[];

    // Actions
    setCurrentPayPeriod: (payPeriod: any) => void;
    setCurrentTimesheet: (timesheet: any) => void;
    setActiveEntry: (entry: any | null) => void;
    setSelectedDate: (date: string) => void;
    setLast52PayPeriods: (payPeriods: any[]) => void;
    setSelectedPayPeriod: (payPeriod: string | null) => void;
    setSelectedEntry: (entry: string | null) => void;
    setProjects: (projects: any[]) => void;
    setTasks: (tasks: any[]) => void;
    clearTimesheetData: () => void;
}

export const useTimeclockStore = create<TimeclockState>()(
    persist(
        (set) => ({
            // Initial state
            currentPayPeriod: null,
            currentTimesheet: null,
            activeEntry: null,
            selectedDate: new Date().toISOString().split('T')[0],
            last52PayPeriods: [],
            selectedPayPeriod: null,
            selectedEntry: null,
            projects: [],
            tasks: [],

            // Actions
            setCurrentPayPeriod: (payPeriod) => set({ currentPayPeriod: payPeriod }),
            setCurrentTimesheet: (timesheet) => set({ currentTimesheet: timesheet }),
            setActiveEntry: (entry) => set({ activeEntry: entry }),
            setSelectedDate: (date) => set({ selectedDate: date }),
            setLast52PayPeriods: (payPeriods) => set({ last52PayPeriods: payPeriods }),
            setSelectedPayPeriod: (payPeriod) => set({ selectedPayPeriod: payPeriod }),
            setSelectedEntry: (entry) => set({ selectedEntry: entry}),
            setProjects: (projects) => set({ projects: projects }),
            setTasks: (tasks) => set({ tasks: tasks }),
            clearTimesheetData: () => set({
                currentTimesheet: null,
                activeEntry: null,
            }),
        }),
        {
            name: 'timeclock-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);