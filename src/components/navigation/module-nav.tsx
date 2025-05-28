"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ModuleNavItem {
    name: string;
    href: string;
    icon?: React.ReactNode;
}

interface ModuleNavProps {
    items: ModuleNavItem[];
    basePath: string;
}

export function ModuleNav({ items, basePath }: ModuleNavProps) {
    const pathname = usePathname();

    return (
        <div className="bg-muted/50 border-b">
            <div className="container mx-auto flex overflow-x-auto px-4 py-2 space-x-1">
                {items.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== basePath && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center min-w-[80px] px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap",
                                isActive
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            )}
                        >
                            {item.icon && <span className="mb-1">{item.icon}</span>}
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}