"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDailyPunches, useTimesheetEntries } from "@/hooks/use-timesheet-entries-data";
import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { format } from "date-fns";
import { EditDrawer } from "./edit-drawer";
import { useCallback, useState } from "react";
import { dateTime } from "@/lib/utils/datetime-utils";
import { NewDrawer } from "./new-drawer";
import { Button } from "@/components/ui/button";
import { useTimesheetStore } from "@/lib/stores/use-timesheet-store";

export function DailyPunchesList() {
    const { clockIns, isLoading, refetch } = useDailyPunches();
    const { selectedDate, setSelectedEntry } = useTimeclockStore();
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
    const { selectedTimesheet, selectedTimesheetStatus } = useTimesheetStore();

    const isTimesheetLocked = selectedTimesheetStatus === 'Approved' || selectedTimesheetStatus === 'Submitted';

    const handleCardClick = (id: string) => {

        if (isTimesheetLocked) {
            return;
        }

        setSelectedEntry(id);
        setIsEditDrawerOpen(true);
    }

    const handleEditDrawerClose = useCallback((wasUpdated?: boolean) => {
        setIsEditDrawerOpen(false);
        // CLear selected entry when drawer closes
        setSelectedEntry(null);
        
        // Refresh list if an update was made
        if (wasUpdated) {
            refetch();
        }
    }, [refetch, setSelectedEntry]);

    const handleNewDrawerOpen = () => {

        // Prevent adding new entries if timesheet is locked
        if (isTimesheetLocked) {
            return;
        }

        setIsNewDrawerOpen(true);
    }

    const handleNewDrawerClose = useCallback((wasUpdated?: boolean) => {
        setIsNewDrawerOpen(false);

        if (wasUpdated) {
            refetch();
        }
    }, [refetch]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Card className="animate-pulse">
                    <CardHeader>
                        <div className="h-4 bg-muted rounded w-24"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="h-3 bg-muted rounded w-full"></div>
                            <div className="h-3 bg-muted rounded w-full"></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="items-center">
                <h2 className="text-3xl font-bold text-center">{format(new Date(selectedDate + 'T00:00:00'), 'iii. MMM, d')}</h2>
                <h3 className="text-lg font-semibold text-center">{format(new Date(selectedDate + 'T00:00:00'), 'EEEE')}'s Clock In's</h3>
            </div>

            {clockIns.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    No timesheet entries found for selected day.
                </div>
            ) : (
                clockIns.map((clockIn) => (
                    <Card
                        key={clockIn.timesheet_entry_id}
                        className={`transition-all duration-200 ${
                            isTimesheetLocked
                            ? 'opacity-60 cursor-not-allowed'
                            : 'hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                        }`}
                        onClick={() => handleCardClick(clockIn.timesheet_entry_id)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleCardClick(clockIn.timesheet_entry_id);
                            }
                        }}
                        tabIndex={0}
                        role="button"
                    >
                        <CardContent>
                            <div className="text-lg font-bold">{clockIn.project_name}</div>
                            <div className="flex">
                                <div className="font-bold">
                                    <p>Time In:</p>
                                    <p>Time Out:</p>
                                    <p>Total:</p>
                                </div>
                                <div className="ml-2">
                                    <p>{dateTime.formatForDisplay(clockIn.time_in, { includeTime: true, format: 'h:mm a'})}</p>
                                    <p>{clockIn.time_out ? dateTime.formatForDisplay(clockIn.time_out, { format: 'h:mm a'}) : 'Active'}</p>
                                    <p>{dateTime.formatDuration(clockIn.duration)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}

            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleNewDrawerOpen}
                disabled={isTimesheetLocked}
                title={isTimesheetLocked ? 'Cannot add entries to approved/submitted timesheet' : 'Add New Clock In'}
            >
                Add New Clock In
            </Button>

            <EditDrawer
                isOpen={isEditDrawerOpen}
                onOpenChange={handleEditDrawerClose}
            />

            <NewDrawer
                isOpen={isNewDrawerOpen}
                onOpenChange={handleNewDrawerClose}
            />
        </div>
    );
}