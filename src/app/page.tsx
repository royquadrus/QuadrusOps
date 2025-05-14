import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CodeIcon, LockIcon, UsersIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 md:px-20 space-y-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Modern Authentication for{" "}
            <span className="text-primary">Next.js Applications</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A secure, fast, and developer-friendly authentication solution built with Next.js, Supabase, and modern web technologies.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-20 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need
          </h2>
          <div className="grd md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-lg bg-background shadow-sm"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 px-6 md:px-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of developers building secure applications
          </p>
          <Button size="lg" asChild>
            <Link href="/register">Create Your Account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Secure Authentication",
    description:
      "Enterprise-grade security with Supabase Auth, including JWT tokens and secure password hashing.",
    icon: LockIcon,
  },
  {
    title: "Modern Stack",
    description:
      "Built with Next.js 15, TypeScript, and Tailwind CSS for a modern development experience.",
    icon: CodeIcon,
  },
  {
    title: "User Management",
    description:
      "Complete user management system with profile updates, password reset, and more.",
    icon: UsersIcon,
  },
];