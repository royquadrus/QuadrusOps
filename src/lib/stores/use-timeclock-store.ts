import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TimeclockState {
    // Data
    currentPayPeriod: { id: string, startDate: string, endDate: string } | null;
    currentTimesheet: any | null;
    activeEntry: any | null;
    selectedDate: string | null;
    projects: any[];
    tasks: any[];

    // Actions
    setCurrentPayPeriod: (payPeriod: any) => void;
    setCurrentTimesheet: (timesheet: any) => void;
    setActiveEntry: (entry: any | null) => void;
    setSelectedDate: (date: string) => void;
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
            projects: [],
            tasks: [],

            // Actions
            setCurrentPayPeriod: (payPeriod) => set({ currentPayPeriod }),
            setCurrentTimesheet: (timesheet) => set({ currentTimesheet }),
            setActiveEntry: (entry) => set({ activeEntry }),
            setSelectedDate: (date) => set({ selectedDate }),
            setProjects: (projects) => set({ projects }),
            setTasks: (tasks) => set({ tasks }),
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