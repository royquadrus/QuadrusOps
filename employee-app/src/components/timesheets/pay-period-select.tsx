"use client";

import { PayPeriod } from "@/lib/validation/timesheet";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "../ui/select";
import { SelectItem } from "@radix-ui/react-select";
import { format } from "date-fns";

interface PayPeriodSelectProps {
    payPeriods: PayPeriod[];
    selectedPayPeriodId: string | null;
    onSelect: (periodId: string) => void;
    isLoading?: boolean;
}

export function PayPeriodSelect({
    payPeriods,
    selectedPayPeriodId,
    onSelect,
    isLoading = false,
}: PayPeriodSelectProps) {
    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium">Pay Period</Label>
            <Select
                disabled={isLoading || payPeriods.length === 0}
                value={selectedPayPeriodId || undefined}
                onValueChange={onSelect}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select a pay period" />
                </SelectTrigger>
                <SelectContent>
                    {payPeriods.map((period) => (
                        <SelectItem key={period.pay_period_id} value={period.pay_period_id}>
                            {format(new Date(period.start_date), "MMM d, yyyy")} - 
                            {format(new Date(period.end_date), " MMM d, yyyy")}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}