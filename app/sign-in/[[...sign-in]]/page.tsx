import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SignIn } from "@clerk/nextjs";
import { ChevronLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chat | Sign-in",
  description: "Chat automated system",
};

export default function Page() {
  return (
    <div className="mt-16 space-y-4">
      <div className="container">
        <Link href="/" className={cn(buttonVariants(({variant: "outline"})))}>
          <ChevronLeft className="h-4"/>
          Back
        </Link>
      </div>
      <div className="flex mx-auto justify-center items-center mt-10">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-black hover:bg-gray-700 transition text-sm normal-case",
            },
          }}
          afterSignInUrl="/dashboard"
        />
      </div>
    </div>
  );
}
