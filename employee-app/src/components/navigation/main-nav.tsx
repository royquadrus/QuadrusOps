"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Clock, House, Menu, X } from "lucide-react";
import Link from "next/link";

const modules = [
    { name: "Dashboard", href: "/dashboard", icon: <House className="h-5 w-5" /> },
    { name: "Timeclock", href: "/timeclock", icon: <Clock className="h-5 w-5" /> },
];

export function MainNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathName = usePathname();

    return (
        <div className="bg-background border-b">
            <div className="flex items-center justify-between px-4 py-3">
                <h1 className="text-lg font-semibold">
                    Employee App
                </h1>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden"
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>

                {/* Desktop menu - hidden on mobile */}
                <nav className="hidden md:flex space-x-4">
                    {modules.map((module) => (
                        <Link
                            key={module.href}
                            href={module.href}
                            className={`flex space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
                                pathName.startsWith(module.href)
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <span>{module.icon}</span>
                            <span>{module.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Mobile dropdown menu */}
            {isOpen && (
                <div className="md:hidden border-t bg-background">
                    <nav className="px-4 py-2 space-y-1">
                        {modules.map((module) => (
                            <Link
                                key={module.href}
                                href={module.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
                                    pathName.startsWith(module.href)
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <span>{module.icon}</span>
                                <span>{module.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </div>
    );
}