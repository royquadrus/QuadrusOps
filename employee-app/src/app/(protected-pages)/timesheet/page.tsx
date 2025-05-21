"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthSession } from "@/lib/utils/auth-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectContent } from "@radix-ui/react-select";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface PayPeriod {
    pay_period_id: string;
    start_date: string;
    end_date: string;
};

interface TimesheetData {
    date: string;
    timesheet_id: number;
    status: string;
    pay_period_id: string;
    start_date: string;
    end_date: string;
    total_punches: number;
    total_hours: number;
};

export default function TimesheetPage() {
    const { session } = useAuthSession();
    //const { payPeriod, isLoading: isLoadingPayPeriod } = usePayPeriod();
    const [payPeriods, setPayPeriods] = useState<PayPeriod[]>([]);
    const [isLoadingPayPeriods, setIsLoadingPayPeriods] = useState(true);

    const [selectedPayPeriodId, setSelectedPayPeriodId] = useState<string | null>(null);

    const [timesheet, setTimesheet] = useState<TimesheetData[]>([]);
    const [isLoadingTimesheet, setIsLoadingTimesheet] = useState(true);

    useEffect(() => {
        async function fetchPayPeriods() {
            try {
                const response = await fetch("/api/timesheets/last-52-pay-periods");
                if (!response.ok) {
                    throw new Error("Failed to fetch last 52 pay periods");
                }
                const { data } = await response.json();
                setPayPeriods(data);
            } catch (error) {
                toast.error("Failed to load pay periods");
                console.error(error);
            } finally {
                setIsLoadingPayPeriods(false);
            }
        }

        fetchPayPeriods();
    }, []);

    const handlePeriodSelect = async (payPeriodId: string) => {
        setSelectedPayPeriodId(payPeriodId);
    }

    useEffect(() => {
        async function fetchTimesheet() {
            if (!selectedPayPeriodId) {
                return;
            }

            try {
                const response = await fetch(`/api/timesheets/pay-period-timesheet?payPeriodId=${selectedPayPeriodId}`);
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error);
                }

                const responseData = await response.json();
                console.log(responseData);

                setTimesheet(responseData.timesheet);
            } catch (error) {
                toast.error("Failed to fetch timesheet");
                console.error(error);
            } finally {
                setIsLoadingTimesheet(false);
            }
        }

        fetchTimesheet();
    }, [selectedPayPeriodId]);

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Select Pay Period</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Pay Period</Label>
                        <Select
                            onValueChange={handlePeriodSelect}
                            value={selectedPayPeriodId || undefined}
                            disabled={isLoadingPayPeriods || payPeriods.length === 0}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a pay period" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                {payPeriods.map((period) => (
                                    <SelectItem key={period.pay_period_id} value={period.pay_period_id}>
                                        {format(new Date(period.start_date), "MM/dd ")} -
                                        {format(new Date(period.end_date), " MM/dd    yyyy")}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
            <Button className="w-full">Submit for Approval</Button>
            {timesheet.map((day) => (
                <div key={day.date}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{day.date}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 flex">
                                <p className="font-bold">Total Hours</p>
                                <p>{day.total_hours}</p>
                            </div>
                            <div className="space-y-2 flex">
                                <p className="font-bold">Total Clock In's</p>
                                <p>{day.total_punches}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    );
}