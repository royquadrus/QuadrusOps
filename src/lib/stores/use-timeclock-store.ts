import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Core interfaces
export interface PayPeriod {
    pay_period_id: string;
    start_date: string;
    end_date: string;
}

export interface TimesheetDayEntry {
    date: string;
    timesheet_id: number | null;
    status: string | null;
    pay_period_id: string;
    start_date: string;
    end_date: string;
    total_punches: number;
    total_hours: number;
}

export interface Timesheet {
    timesheet_id: string;
    pay_period_id: string;
    userEmail: string;
}

export interface ActiveEntry {
    timesheet_entry_id: string;
    time_in: string;
    project_name: string;
    task_name: string;
}

export interface Project {
    project_id: string;
    project_number: string;
    project_name: string;
}

export interface Task {
    timesheet_task_id: string;
    task_name: string;
}

interface TimeclockState {
    // Pay period data
    payPeriods: PayPeriod[];
    currentPayPeriod: PayPeriod | null;
    selectedPayPeriod: PayPeriod | null;

    // Timesheet data
    currentTimesheet: Timesheet | null;
    timesheetDays: TimesheetDayEntry[];
    activeEntry: ActiveEntry | null;

    // UI State
    selectedDate: string;
    selectedEntry: string | null;

    // Reference data
    projects: Project[];
    tasks: Task[];

    // Loading and Error States
    isDataLoading: boolean;
    isLoading: boolean;
    error: string | null;

    // Pay Period actions
    setPayPeriods: (payPeriods: PayPeriod[]) => void;
    setCurrentPayPeriod: (payPeriod: PayPeriod | null) => void;
    setSelectedPayPeriod: (payPeriod: PayPeriod | null) => void;

    // Timesheet actions
    setCurrentTimesheet: (timesheet: Timesheet | null) => void;
    setTimesheetDays: (days: TimesheetDayEntry[]) => void;
    setActiveEntry: (entry: ActiveEntry | null) => void;

    // UI actions
    setSelectedDate: (date: string) => void;
    setSelectedEntry: (entry: string | null) => void;

    // Reference data actions
    setProjects: (projects: Project[]) => void;
    setTasks: (tasks: Task[]) => void;

    // Loading and Error actions
    setDataLoading: (loading: boolean) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;

    // Utility actions
    clearTimesheetData: () => void;
    resetStore: () => void;
}

export const useTimeclockStore = create<TimeclockState>()(
    persist(
        (set, get) => ({
            // Initial state
            payPeriods: [],
            currentPayPeriod: null,
            selectedPayPeriod: null,
            currentTimesheet: null,
            timesheetDays: [],
            activeEntry: null,
            selectedDate: new Date().toISOString().split('T')[0],
            selectedEntry: null,
            projects: [],
            tasks: [],
            isDataLoading: false,
            isLoading: false,
            error: null,

            // Pay period actions
            setPayPeriods: (payPeriods) => set({ payPeriods }),
            setCurrentPayPeriod: (payPeriod) => set({ currentPayPeriod: payPeriod }),
            setSelectedPayPeriod: (payPeriod) => set({ selectedPayPeriod: payPeriod }),

            // Timesheet actions
            setCurrentTimesheet: (timesheet) => set({ currentTimesheet: timesheet }),
            setTimesheetDays: (days) => set({ timesheetDays: days }),
            setActiveEntry: (entry) => set({ activeEntry: entry }),

            // Ui Actions
            setSelectedDate: (date) => set({ selectedDate: date }),
            setSelectedEntry: (entry) => set({ selectedEntry: entry }),

            // Reference Data actions
            setProjects: (projects) => set({ projects }),
            setTasks: (tasks) => set({ tasks }),

            // Loading and error actions
            setDataLoading: (loading) => set({ isDataLoading: loading }),
            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),

            // Utility actions
            clearTimesheetData: () => set({
                currentTimesheet: null,
                activeEntry: null,
                timesheetDays: [],
            }),
            resetStore: () => set({
                payPeriods: [],
                currentPayPeriod: null,
                selectedPayPeriod: null,
                currentTimesheet: null,
                timesheetDays: [],
                activeEntry: null,
                selectedDate: new Date().toISOString().split('T')[0],
                selectedEntry: null,
                projects: [],
                tasks: [],
                isDataLoading: false,
                isLoading: false,
                error: null,
            }),
        }),
        {
            name: 'timeclock-storage',
            storage: createJSONStorage(() => sessionStorage),
            // Only persist certain keys to avoid storing laoding states
            partialize: (state) => ({
                payPeriods: state.payPeriods,
                currentPayPeriod: state.currentPayPeriod,
                currentTimesheet: state.currentTimesheet,
                activeEntry: state.activeEntry,
                selectedDate: state.selectedDate,
                selectedPayPeriod: state.selectedPayPeriod,
                selectedEntry: state.selectedEntry,
                projects: state.projects,
                tasks: state.tasks,
            }),
        }
    )
);
