"use client";

import { ClockInForm } from "@/components/timeclock/clock-in-form";
import { ClockedInCard } from "@/components/timeclock/clocked-in-card";
import { TodaysClockIns } from "@/components/timeclock/todays-clock-ins";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTimeclockData } from "@/hooks/use-timeclock-data";
import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { useAuthSession } from "@/lib/utils/auth-utils";
import { useEffect } from "react";

export default function TimeClockPage() {
    const { session } = useAuthSession();
    const { activeEntry } = useTimeclockStore();
    const { initializeTimeclockData, isDataLoading } = useTimeclockData();

    useEffect(() => {
        if (session?.user?.email) {
            initializeTimeclockData(session.user.email);
        }
    }, [session?.user, initializeTimeclockData]);

    if (isDataLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-8 space-y-8">
            {activeEntry ? (
                <>
                    <ClockedInCard />
                    <TodaysClockIns />
                </>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Clock In</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ClockInForm />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}