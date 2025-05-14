import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";

interface AuthCardProps {
    title: string,
    description: string,
    children: React.ReactNode,
};

export function AuthCard({ title, description, children }: AuthCardProps) {
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}