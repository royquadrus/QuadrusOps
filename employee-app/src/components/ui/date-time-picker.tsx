import { format } from "date-fns";
import { forwardRef } from "react";
import { Popover, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "./calendar";
import { ScrollArea, ScrollBar } from "./scroll-area";

interface DateTimePickerProps {
    value?: Date | null;
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    format12Hour?: boolean;
}

export const DateTimePicker = forwardRef<HTMLButtonElement, DateTimePickerProps>(
    ({
        value,
        onChange,
        placeholder = "MM/DD/YYYY hh:mm aa",
        disabled=false,
        className,
        format12Hour = true
    }, ref) => {

        function handleDateSelect(date: Date | undefined) {
            if (date && onChange) {
                // If we're selecting a new date but we already have a time preserve the time
                if (value) {
                    const newDate = new Date(date);
                    newDate.setHours(value.getHours());
                    newDate.setMinutes(value.getMinutes());
                    newDate.setSeconds(value.getSeconds());
                    onChange(newDate);
                } else {
                    // If no existing time, set to current date
                    const now = new Date();
                    date.setHours(now.getHours());
                    date.setMinutes(now.getMinutes());
                    onChange(date);
                }
            }
        }

        function handleTimeChange(type: "hour" | "minute" | "ampm", timeValue: string) {
            if (!onChange) return;

            const currentDate = value || new Date();
            let newDate = new Date(currentDate);

            if (type === "hour") {
                const hour = parseInt(timeValue, 10);
                if (format12Hour) {
                    const currentHours = newDate.getHours();
                    const isPm = currentHours >= 12;
                    newDate.setHours(isPm ? hour + 12 : hour);
                } else {
                    newDate.setHours(hour);
                }
            } else if ( type === "minute") {
                newDate.setMinutes(parseInt(timeValue, 10));
            } else if (type === "ampm" && format12Hour) {
                const hours = newDate.getHours();
                if (timeValue === "AM" && hours >= 12) {
                    newDate.setHours(hours - 12);
                } else if (timeValue === "PM" && hours < 12) {
                    newDate.setHours(hours + 12);
                }
            }

            onChange(newDate);
        }

        const formatDisplayValue = (date: Date) => {
            if (format12Hour) {
                return format(date, "MM/dd/yyyy hh:mm aa");
            } else {
                return format(date, "MM/dd/yyyy HH:mm");
            }
        };

        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !value && "text-muted-foreground",
                            className
                        )}
                    >
                        {value ? formatDisplayValue(value) : <span>{placeholder}</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent 
                    className="w-auto p-0 z-[9999] bg-popover border shadow-md" 
                    align="start"
                >
                    <div className="sm:flex">
                        <Calendar
                            mode="single"
                            selected={value || undefined}
                            onSelect={handleDateSelect}
                            initialFocus
                        />
                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                            <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex sm:flex-col p-2">
                                    {Array.from({ length: format12Hour ? 12 : 24 }, (_, i) =>
                                        format12Hour ? i + 1 : i
                                    )
                                        .map((hour) => (
                                            <Button
                                                key={hour}
                                                type="button"
                                                size="icon"
                                                variant={
                                                    value &&
                                                    (format12Hour
                                                        ? value.getHours() % 12 === hour % 12
                                                        : value.getHours() === hour
                                                    )
                                                        ? "default"
                                                        : "ghost"
                                                }
                                                className="sm:w-full shrink-0 aspect-square"
                                                onClick={() =>
                                                    handleTimeChange("hour", hour.toString())
                                                }
                                            >
                                                {format12Hour ? hour : hour.toString().padStart(2, "0")}
                                            </Button>
                                        ))}
                                </div>
                                <ScrollBar orientation="horizontal" className="sm:hidden" />
                            </ScrollArea>

                            <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex sm:flex-col p-2">
                                    {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                                        <Button
                                            key={minute}
                                            size="icon"
                                            type="button"
                                            variant={
                                                value && value.getMinutes() === minute
                                                    ? "default"
                                                    : "ghost"   
                                            }
                                            className="sm:w-full shrink-0 aspect-square"
                                            onClick={() =>
                                                handleTimeChange("minute", minute.toString())
                                            }
                                        >
                                            {minute.toString().padStart(2, "0")}
                                        </Button>
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal" className="sm:hidden" />
                            </ScrollArea>

                            {format12Hour && (
                                <ScrollArea className="">
                                    <div className="flex sm:flex-col p-2">
                                        {["AM", "PM"].map((ampm) => (
                                            <Button
                                                key={ampm}
                                                size="icon"
                                                type="button"
                                                variant={
                                                    value &&
                                                    ((ampm === "AM" && value.getHours() < 12) ||
                                                        (ampm === "PM" && value.getHours() >= 12))
                                                        ? "default"
                                                        : "ghost"
                                                }
                                                className="sm:w-full shrink-0 aspect-square"
                                                onClick={() => handleTimeChange("ampm", ampm)}
                                            >
                                                {ampm}
                                            </Button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            )}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        );
    });

    DateTimePicker.displayName = "DateTimePicker";