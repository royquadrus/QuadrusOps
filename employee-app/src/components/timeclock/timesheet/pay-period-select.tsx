"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTimeclockData } from "@/hooks/use-timeclock-data";
import { PayPeriod } from "@/lib/stores/use-timeclock-store";

interface PayPeriodSelectProps {
    className?: string;
}

export function PayPeriodSelect({ className }: PayPeriodSelectProps) {
    const {
        payPeriods,
        selectedPayPeriod,
        currentPayPeriod,
        setSelectedPayPeriod,
        isLoading
    } = useTimeclockData();

    const formatPayPeriod = (payPeriod: PayPeriod) => {
        const startDate = new Date(payPeriod.start_date).toLocaleDateString();
        const endDate = new Date(payPeriod.end_date).toLocaleDateString();
        return `${startDate} - ${endDate}`;
    };

    const handlePayPeriodChange = (value: string) => {
        const payPeriod = payPeriods.find(pp => pp.pay_period_id === value);
        if (payPeriod) {
            setSelectedPayPeriod(payPeriod);
        }
    };

    const getCurrentValue = () => {
        return selectedPayPeriod?.pay_period_id || currentPayPeriod?.pay_period_id || '';
    };

    const getDisplayText = (payPeriod: PayPeriod) => {
        const formatted = formatPayPeriod(payPeriod);
        const isCurrent = payPeriod.pay_period_id === currentPayPeriod?.pay_period_id;
        return isCurrent ? `${formatted} (Current)` : formatted;
    };

    return (
        <div className={className}>
            <Label htmlFor="pay-period-select" className="block text-sm font-medium mb-2">
                Pay Period
            </Label>
            <Select
                value={getCurrentValue()}
                onValueChange={handlePayPeriodChange}
                disabled={isLoading || payPeriods.length === 0}
            >
                <SelectTrigger className="w-full">
                    <SelectValue
                        placeholder={
                            isLoading
                                ? "Loading pay periods..."
                                : payPeriods.length === 0
                                    ? "No pay periods available"
                                    : "Select pay period"
                        }
                    />
                </SelectTrigger>
                <SelectContent>
                    {payPeriods.map((payPeriod) => (
                        <SelectItem
                            key={payPeriod.pay_period_id}
                            value={payPeriod.pay_period_id}
                        >
                            {getDisplayText(payPeriod)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}