"use client";

import { MainNav } from "@/components/navigation/main-nav";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { Loader } from "lucide-react";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoading } = useProtectedRoute();

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <Loader className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <MainNav />
            <main>{children}</main>
        </div>
    );
}