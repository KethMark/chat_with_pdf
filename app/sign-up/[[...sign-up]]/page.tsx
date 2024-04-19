import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat | Sign-in",
  description: "Chat automated system",
}

export default function Page() {
  return (
    <div className="">
      <div className="flex mx-auto justify-center items-center ">
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                'bg-black hover:bg-gray-700 transition text-sm normal-case',
            },
          }}
          afterSignInUrl="/dashboard"
        />
      </div>
    </div>
  );
}
