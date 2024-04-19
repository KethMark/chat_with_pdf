import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';
import { ArrowTopRightIcon} from '@radix-ui/react-icons'

const data = [
  {
    title: 'Sign up',
    description: 'Start by signing up for a free CHAT account',
    image: '/sign-ins.png',
    link: '/sign-in',
  },
  {
    title: 'Upload a PDF',
    description: 'After login, upload your PDF and let the AI tool analyze it',
    image: '/uploads.png',
    link: '/dashboard',
  },
  {
    title: 'Begin Chatting',
    description: 'Simply start asking the AI any question about the PDF!',
    image: '/begin-chattings.png',
    link: '/dashboard',
  },
];

const HowItWorks = () => {
  return (
    <div className="w-full pt-[20px] md:pt-[100px] pb-[215px] sm:pb-[290px] px-[22px] sm:px-0 mx-auto text-center">
      <a
        href="https://groq.com"
        target="_blank"
        rel="noreferrer"
        className="border rounded-2xl border-slate-400 py-1 px-4 text-slate-600 transition duration-300 ease-in-out sm:text-base text-sm cursor-pointer hover:text-slate-700 "
      >
        Powered by <span className="font-bold">Groq </span>and{' '}
        <span className="font-bold">Mixtral</span>
      </a>
      <div className='flex flex-col mx-auto'>
        <h2 className='font-serif font-bold text-7xl mt-10'>How it works?</h2>
        <div className='grid grid-cols-3 mt-28 container gap-6'>
        {data.map((item, index) => (
            <Card key={index}>
              <CardContent>
                <div className='flex flex-col items-center justify-center w-full py-5 px-5'>
                  <Image
                    src={item.image}
                    alt="Step 1"
                    width={62}
                    height={62}
                    className="w-6 sm:w-[62px] h-6 sm:h-[62px]"
                  />
                  <div className="flex flex-col items-center gap-2 sm:gap-9 mt-3">
                    <h3 className="text-center text-primary text-2xl sm:text-5xl leading-[34.5px] tracking-[-1.2px]">
                      {item.title}
                    </h3>
                    <p className="text-primary text-center text-[17px] sm:text-2xl leading-[20px] sm:leading-[34.5px] tracking-[-0.34px] sm:tracking-[-0.6px] pb-5 sm:pb-0 max-w-sm">
                      {item.description}
                    </p>
                  </div>
                  <div className='mt-10'>
                    <Link href={item.link} className={cn(buttonVariants(),'gap-1')}>Get started<ArrowTopRightIcon/></Link>
                  </div>
                </div>
              </CardContent>
            </Card>
        ))}</div>
      </div>
    </div>
  );
};

export default HowItWorks;