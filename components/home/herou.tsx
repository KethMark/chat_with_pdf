import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';

const Hero = () => {

  return (
    <header className="px-8 py-40">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-bold">The Chat Ai for PDF File</h1>
        <p className="mt-12 text-lg">
          Have a conversation with your papers, textbooks, with your academic
          papers and various documents by interacting with your PDF files
        </p>
        <div className="mt-14 flex justify-center space-x-4">
          <Link href="/dashboard" className={cn(buttonVariants())}>
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Learn chat
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Hero;