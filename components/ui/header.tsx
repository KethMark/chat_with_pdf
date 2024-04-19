import { SignedIn, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import Image from "next/image"
import { Triangle } from "lucide-react"

export default async function Header() {
    
    return (
        <header className="z-40 bg-white w-full border-b border-b-slate-200 shadow-sm">
          <div className="py-7 container mx-auto">
            <nav className="flex items-center justify-between mx-10">
                <Link 
                  href={"/"}
                  className="hover:text-slate-600 cursor-pointer flex items-center gap-2"
                >
                  <Triangle/>
                  <span className="shadows font-serif text-primary text-[30px] sm:text-[25px]">Chat</span>
                </Link>
                <div className="flex items-center gap-5">
                    <Link href={"/dashboard"}>Dashboard</Link>
                    <SignedIn>
                      <UserButton afterSignOutUrl="/"/>
                    </SignedIn>
                </div>
            </nav>
          </div>
        </header>
    )
}