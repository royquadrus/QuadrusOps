import { differenceInMinutes, format, isValid, parseISO } from "date-fns";
import { useEffect, useState } from "react";

const DEFAULT_TIMEZONE = 'America/Toronto';

export interface DateTimeConfig {
    timezone?: string;
    includeTime?: boolean;
    format?: string;
}

export class DateTimeManager {
    private static instance: DateTimeManager;
    private defaultTimezone: string = DEFAULT_TIMEZONE;

    static getInstance(): DateTimeManager {
        if (!DateTimeManager.instance) {
            DateTimeManager.instance = new DateTimeManager();
        }
        return DateTimeManager.instance;
    }

    // Set user's timezone (for future multi-timezone support)
    setUserTimezone(timezone: string): void {
        this.defaultTimezone = timezone;
    }

    getUserTimeZone(): string {
        return this.defaultTimezone;
    }

    /**
     * Convert local datetime to UTC for database storage
     */
    toUTC(date: Date | string, timezone?: string): Date {
        const tz = timezone || this.defaultTimezone;

        if (typeof date === 'string') {
            // If it's a string without timzone info, treat it as being in the specified timezone
            const parsedDate = parseISO(date);
            if (!isValid(parsedDate)) {
                throw new Error('Invalid date string provided');
            }

            // Create a new date that represents the same moment in the specified timezone
            const offsetMs = this.getTimezoneOffset(parsedDate, tz);
            return new Date(parsedDate.getTime() - offsetMs);
        }

        if (!isValid(date)) {
            throw new Error('Invalid date provided');
        }

        return date;
    }

    /**
     * Convert UTC datetime from database to user's timzeon for display
     */
    fromUTC(utcDate: Date | string, timezone?: string): Date {
        const tz = timezone || this.defaultTimezone;
        const dateObj = typeof utcDate === 'string' ? parseISO(utcDate) : utcDate;

        if (!isValid(dateObj)) {
            throw new Error('Invalid date provided');
        }

        return dateObj;
    }

    /**
     * Get timezone offset in milliseconds for a specific date and timezone
     */
    private getTimezoneOffset(date: Date, timezone: string): number {
        const utcTime = date.getTime();
        const localTime = new Date(date.toLocaleString('en-US', { timeZone: timezone })).getTime();
        return utcTime - localTime;
    }

    /**
     * Format datetime for display using Intl.DateTimeFormat
     */
    formatForDisplay(
        date: Date | string,
        options: DateTimeConfig = {}
    ): string {
        const {
            timezone = this.defaultTimezone,
            includeTime = true,
            format: formatString
        } = options;

        const dateObj = typeof date === 'string' ? parseISO(date) : date;

        if (!isValid(dateObj)) {
            return 'Invalid date';
        }

        // Use custom format string with date-fns if provided
        if (formatString) {
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });

            const parts = formatter.formatToParts(dateObj);
            const tzDate = new Date(
                parseInt(parts.find(p => p.type === 'year')?.value || '0'),
                parseInt(parts.find(p => p.type === 'month')?.value || '1') - 1,
                parseInt(parts.find(p => p.type === 'day')?.value || '1'),
                parseInt(parts.find(p => p.type === 'hour')?.value || '0'),
                parseInt(parts.find(p => p.type === 'minute')?.value || '0'),
                parseInt(parts.find(p => p.type === 'second')?.value || '0'),
            );

            return format(tzDate, formatString);
        }

        // Use native Intl formatting for default formats
        const formatOptions: Intl.DateTimeFormatOptions = {
            timeZone: timezone,
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };

        if (includeTime) {
            formatOptions.hour = 'numeric',
            formatOptions.minute = '2-digit',
            formatOptions.hour12 = true;
        }

        return new Intl.DateTimeFormat('en-US', formatOptions).format(dateObj);
    }

    /**
     * Format for form inputs (datetime-local)
     * Returns local time in the user's timezone
     */
    formatForInput(date: Date | string, timezone?: string): string {
        const tz = timezone || this.defaultTimezone;
        const dateObj = typeof date === 'string' ? parseISO(date) : date;

        if (!isValid(dateObj)) {
            return '';
        }

        // Format the date as it appears in the specified timezone
        const formatter = new Intl.DateTimeFormat('sv-SE', {
            timeZone: tz,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });

        const formatted = formatter.format(dateObj);
        return formatted.replace(' ', 'T').substring(0, 16);
    }

    /**
     * Format for date-only inputs (YYYY-MM-DD)
     */
    formatDateForInput(date: Date | string, timezone?: string): string {
        const tz = timezone || this.defaultTimezone;
        const dateObj = typeof date === 'string' ? parseISO(date) : date;

        if (!isValid(dateObj)) {
            return '';
        }

        return new Intl.DateTimeFormat('sv-SE', {
            timeZone: tz,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(dateObj);
    }

    /**
     * Get current date/time in user's timezone
     */
    now(timezone?: string): Date {
        return new Date();
    }

    /**
     * Get today's date string in user's timezone (for date-only fields)
     */
    today(timezone?: string): string {
        const tz = timezone || this.defaultTimezone;
        return new Intl.DateTimeFormat('sv-SE', {
            timeZone: tz,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(new Date());
    }

    /**
     * Parse date input and convert to UTC for storage
     */
    parseForStorage(
        dateInput: string,
        timezone?: string,
        isDateOnly: boolean = false
    ): Date {
        const tz = timezone || this.defaultTimezone;

        if (isDateOnly) {
            const [year, month, day] = dateInput.split('-').map(Number);

            // Create date in the specified timezone
            const tempDate = new Date();
            const utcDate = new Date(tempDate.toLocaleDateString('en-US', { timeZone: 'UTC' }));
            const tzDate = new Date(tempDate.toLocaleString('en-US', { timeZone: tz }));
            const offset = utcDate.getTime() - tzDate.getTime();

            const localDate = new Date(year, month - 1, day);
            return new Date(localDate.getTime() + offset);
        }

        // For datetime inputs, parse as local time in the specified timezone
        const parsedDate = parseISO(dateInput);
        if (!isValid(parsedDate)) {
            throw new Error('Invalid date input');
        }

        return this.toUTC(parsedDate, tz);
    }

    /**
     * Parse datetime-local input (assume it's in the users timezone)
     */
    parseDateTimeLocal(dateTimeInput: string, timezone?: string): Date {
        console.log("From DateTime. Input:", dateTimeInput);
        const tz = timezone || this.defaultTimezone;
        const parsedDate = parseISO(dateTimeInput);

        if (!isValid(parsedDate)) {
            throw new Error('Invalid datetime input');
        }

        // The input is treated as being in the user's timezone
        // We need to convert it to UTC for storage
        const offsetMs = this.getTimezoneOffset(parsedDate, tz);
        return new Date(parsedDate.getTime() - offsetMs);
    }

    /**
     * Validate timezone
     */
    isValidTimezone(timezone: string): boolean {
        try {
            Intl.DateTimeFormat(undefined, { timeZone: timezone });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get browser's detected timezone
     */
    getBrowserTimezone(): string {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    /**
     * Format duration in minutes to readable format
     */
    formatDuration(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours === 0) {
            return `${mins}m`;
        }

        return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
    }

    /**
     * Calculate duration between two dates in minutes
     */
    getDurationInMinutes(startDate: Date | string, endDate: Date | string): number {
        const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
        const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

        if (!isValid(start) || !isValid(end)) {
            throw new Error('Invalid dates provided for duration calculation');
        }

        return differenceInMinutes(end, start);
    }

    /**
     * Get list of common timezones for user selection
     */
    getCommonTimezones(): Array<{ value: string; label: string }> {
        return [
            { value: 'America/Toronto', label: 'Eastern Time (ET)' },
            { value: 'America/New_York', label: 'Eastern Time (ET) '},
            { value: 'UTC', label: 'UTC' }
        ];
    }
}

export const dateTime = DateTimeManager.getInstance();

export const formatDate = (date: Date | string, options?: DateTimeConfig) =>
    dateTime.formatForDisplay(date, options);

export const formatDateTime = (date: Date | string, options?: DateTimeConfig) =>
    dateTime.formatForDisplay(date, { includeTime: true, ...options });

export const formatDateOnly = (date: Date | string, options?: DateTimeConfig) =>
    dateTime.formatForDisplay(date, { includeTime: false, ...options });

export const toUTC = (date: Date | string, timezone?: string) =>
    dateTime.toUTC(date, timezone);

export const fromUTC = (date: Date | string, timezone?: string) =>
    dateTime.fromUTC(date, timezone);

export function useDateTime() {
    const [userTimezone, setUserTimezone] = useState(DEFAULT_TIMEZONE);

    useEffect(() => {
        // Auto detect user's timezone on first load
        const detectedTimezone = dateTime.getBrowserTimezone();
        if (dateTime.isValidTimezone(detectedTimezone)) {
            setUserTimezone(detectedTimezone);
            dateTime.setUserTimezone(detectedTimezone);
        }
    }, []);

    return {
        timezone: userTimezone,
        setTimezone: (tz: string) => {
            if (dateTime.isValidTimezone(tz)) {
                setUserTimezone(tz);
                dateTime.setUserTimezone(tz);
            }
        },
        formatDate: (date: Date | string, options?: DateTimeConfig) =>
            dateTime.formatForDisplay(date, { timezone: userTimezone, ...options }),
        formatDateTime: (date: Date | string, options?: DateTimeConfig) =>
            dateTime.formatForDisplay(date, { timezone: userTimezone, includeTime: true, ...options }),
        formatDateOnly: (date: Date | string, options?: DateTimeConfig) =>
            dateTime.formatForDisplay(date, { timezone: userTimezone, includeTime: false, ...options }),
        formatForInput: (date: Date | string) =>
            dateTime.formatForInput(date, userTimezone),
        formatDateForInput: (date: Date | string) =>
            dateTime.formatDateForInput(date, userTimezone),
        parseForStorage: (dateInput: string, isDateOnly?: boolean) =>
            dateTime.parseForStorage(dateInput, userTimezone, isDateOnly),
        parseDateTimeLocal: (dateTimeInput: string) =>
            dateTime.parseDateTimeLocal(dateTimeInput, userTimezone),
        now: () => dateTime.now(userTimezone),
        today: () => dateTime.today(userTimezone),
        getDurationInMinutes: (start: Date | string, end: Date | string) =>
            dateTime.getDurationInMinutes(start, end),
        formatDuration: (minutes: number)  => dateTime.formatDuration(minutes)
    };
}