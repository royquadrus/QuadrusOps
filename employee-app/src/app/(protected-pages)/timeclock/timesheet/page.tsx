"use client";

import { PayPeriodEntryList } from "@/components/timeclock/timesheet/pay-period-entry-list";
import { PayPeriodSelect } from "@/components/timeclock/timesheet/pay-period-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTimeclockData } from "@/hooks/use-timeclock-data";

export default function TimesheetPage() {
    const { error, isLoading, refetchPayPeriods, refetchTimesheetDays } = useTimeclockData();

    const handleRefresh = () => {
        refetchPayPeriods();
        refetchTimesheetDays();
    }

    return (
        <div className="container mx-auto py-8 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Timesheets</CardTitle>
                </CardHeader>
                <CardContent>
                    <PayPeriodSelect />
                </CardContent>
            </Card>
            <PayPeriodEntryList />
        </div>
    )
}