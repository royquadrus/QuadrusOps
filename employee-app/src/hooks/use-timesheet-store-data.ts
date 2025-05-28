import { useTimesheetStore } from "@/lib/stores/use-timesheet-store";

export function useTimesheetStoreData() {
    const { 
        selectedTimesheet,
        selectedTimesheetStatus,
        setSelectedTimesheet,
        setSelectedTimesheetStatus,
    } = useTimesheetStore();
}