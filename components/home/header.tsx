import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu, TriangleIcon } from "lucide-react";

export function Header() {

  return (
    <>
      <div className="container hidden bg-white w-full px-5 py-6 sm:flex justify-between items-center border shadow-lg rounded-[30px] border-solid mx-auto mt-6 sticky top-4">
        <div className="container flex justify-between items-center mx-auto">
          <Link href="/dashboard">
            <div className="flex items-center gap-2">
              <TriangleIcon className="w-6 h-6 text-black" />
              <h1 className="text-lg font-medium hover:text-gray-700">Chat</h1>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href='/dashboard' className={cn(buttonVariants())}>Login</Link>
            <Button className="border border-gray-300 text-black px-4 py-2 rounded-md text-sm" variant="outline">
              Learn
            </Button>
          </div>
        </div>
      </div>
      <div className="sm:hidden bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border-b-[0.5px] h-[54px] container w-full border-b-white border-solid">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <TriangleIcon className="w-6 h-6 text-black" />
            <Link className="text-sm font-medium hover:text-gray-700" href="/">
              Chat
            </Link>
            <Link className="text-sm font-medium hover:text-gray-700" href="#">
              About
            </Link>
            <Link className="text-sm font-medium hover:text-gray-700" href="#">
              Blog
            </Link>
            <Link className="text-sm font-medium hover:text-gray-700" href="#">
              Analytics
            </Link>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost"><Menu/></Button>
            </SheetTrigger>
            <SheetContent>
            <div className="flex items-center space-x-4">
              <Link href='/dashboard' className={cn(buttonVariants())}>Login</Link>
              <Button className="border border-gray-300 text-black px-4 py-2 rounded-md text-sm" variant="outline">
                Learn
              </Button>
            </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}
