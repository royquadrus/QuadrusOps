"use client";

import { useAuthReset } from "@/hooks/use-auth-reset";
import { ResetPasswordFormData, resetPasswordSchema } from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";

export function PasswordResetForm() {
    const { isLoading, resetPassword } = useAuthReset();

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(resetPassword)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="you@example.com" type="email" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending reset link..." : "Send reset link"}
                </Button>
                <div className="text-sm text-center space-x-1 text-muted-foreground">
                    <Link href="/auth/login" className="text-primary hover:underline">
                        Back to login
                    </Link>
                </div>
            </form>
        </Form>
    );
}