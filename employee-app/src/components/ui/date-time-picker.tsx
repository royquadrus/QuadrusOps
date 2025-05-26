import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Popover, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "./calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { ScrollArea } from "./scroll-area";

interface DateTimePickerProps {
    value?: Date | null;
    onChange?: (date: Date | null) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function DateTimePicker({
    value,
    onChange,
    placeholder = "Pick a date & time",
    disabled = false,
    className
}: DateTimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [time, setTime] = useState<string>(
        value ? format(value, "HH:mm") : "09:00"
    );

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (!selectedDate) return;

        const [hours, minutes] = time.split(":");
        selectedDate.setHours(parseInt(hours), parseInt(minutes));
        onChange?.(selectedDate);
        setIsOpen(false);
    };

    const handleTimeChange = (newTime: string) => {
        setTime(newTime);
        if (value) {
            const [hours, minutes] = newTime.split(":");
            const newDate = new Date(value.getTime());
            newDate.setHours(parseInt(hours), parseInt(minutes));
            onChange?.(newDate);
        }
    };

    return (
        <div className={cn("flex gap-2", className)}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                            "flex-1 justify-start text-left font-normal",
                            !value && "text-muted-foreground"
                        )}
                    >
                        {value ? (
                            format(value, "PPP")
                        ) : (
                            <span>{placeholder}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={value || undefined}
                        onSelect={handleDateSelect}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            <Select
                value={time}
                onValueChange={handleTimeChange}
                disabled={disabled}
            >
                <SelectTrigger className="w-[120px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <ScrollArea className="h-[200px]">
                        {Array.from({ length: 96 }).map((_, i) => {
                            const hour = Math.floor(i / 4)
                                .toString()
                                .padStart(2, "0");
                            const minute = ((i % 4) * 15)
                                .toString()
                                .padStart(2, "0");
                            return (
                                <SelectItem key={i} value={`${hour}:${minute}`}>
                                    {hour}:{minute}
                                </SelectItem>
                            );
                        })}
                    </ScrollArea>
                </SelectContent>
            </Select>
        </div>
    );
}