import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TimesheetState {
    selectedTimesheet: number | null;
    selectedTimesheetStatus: string | null;
    setSelectedTimesheet: (timesheet: number | null) => void;
    setSelectedTimesheetStatus: (status: string | null) => void;
    clearSession: () => void;
}

export const useTimesheetStore = create<TimesheetState>() (
    persist(
        (set, get) => ({
            selectedTimesheet: null,
            selectedTimesheetStatus: null,

            setSelectedTimesheet: (timesheet) => set({ selectedTimesheet: timesheet }),
            setSelectedTimesheetStatus: (status) => set({ selectedTimesheetStatus: status }),

            clearSession: () => set({
                selectedTimesheet: null,
                selectedTimesheetStatus: null,
            }),
        }),
        
        {
            name: 'timesheet-storage',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                selectedTimesheet: state.selectedTimesheet,
                selectedTimesheetStatus: state.selectedTimesheetStatus,
            }),
        }
    )
);

