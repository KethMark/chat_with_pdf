import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  isMobile?: boolean;
}

const Logo = ({ isMobile }: LogoProps) => {
  return (
    <Link href={'/'}>
      <div className="flex  items-center">
        <div className="flex justify-center items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={54}
            className="sm:w-[40px] w-[21px] h-[25px] sm:h-[40px] mt-1"
          />
        </div>
        {!isMobile ? (
          <h1 className="shadows font-serif text-primary text-[30px] sm:text-[35px]">
            Chat
          </h1>
        ) : null}
      </div>
    </Link>
  )
}

export default Logo;