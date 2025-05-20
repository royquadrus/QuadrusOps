"use client";

import { TimesheetEntry } from "@/lib/validation/timesheet";
import { differenceInMinutes, format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";

interface TimesheetEntriesTableProps {
    entries: TimesheetEntry[];
    isLoading?: boolean;
    onEdit?: (entry: TimesheetEntry) => void;
    onDelete?: (entryId: number) => void;
}

export function TimesheetEntriesTable({
    entries,
    isLoading = false,
    onEdit,
    onDelete,
}: TimesheetEntriesTableProps) {
    function formatDuration(minutes?: number) {
        if (!minutes) return "-";
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }

    function calculateDuration(entry: TimesheetEntry): number | undefined {
        if (entry.duration) return entry.duration;
        if (!entry.time_out) return undefined;

        const timeIn = new Date(entry.time_in);
        const timeOut = new Date(entry.time_out);
        return differenceInMinutes(timeOut, timeIn);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Timesheet Entries</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : entries.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                        No time entries for this period
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Time In</TableHead>
                                <TableHead>Time Out</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead>Task</TableHead>
                                {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {entries.map((entry) => (
                                <TableRow key={entry.timesheet_entry_id}>
                                    <TableCell>
                                        {format(new Date(entry.entry_date), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell>{format(new Date(entry.time_in), "h:mm a")}</TableCell>
                                    <TableCell>
                                        {entry.time_out
                                            ? format(new Date(entry.time_out), "h:mm a")
                                            : "-"}
                                    </TableCell>
                                    <TableCell>{formatDuration(calculateDuration(entry))}</TableCell>
                                    <TableCell>
                                        {entry.project_id ? (entry as any).project?.project_name : "-"}
                                    </TableCell>
                                    <TableCell>
                                        {entry.timesheet_task_id ? (entry as any).timesheet_tasks?.task_name : "-"}
                                    </TableCell>
                                    {(onEdit || onDelete) && (
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                {onEdit && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => onEdit(entry)}
                                                    >
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {onDelete && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => onDelete(entry.timesheet_entry_id!)}
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}