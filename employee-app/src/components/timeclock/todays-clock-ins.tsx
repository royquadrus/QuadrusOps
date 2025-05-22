"use client";

import { useTimeclockStore } from "@/lib/stores/use-timeclock-store";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { useEffect } from "react";

export function TodaysClockIns() {
    const { } = useTimeclockStore();

    //const now = new Date().toISOString().split('T')[0];

    useEffect(() => {
        // Get todays clockins to display below
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>Today's Clock Ins</CardTitle>
            </CardHeader>
        </Card>
    )
}