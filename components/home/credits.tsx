import Image from 'next/image';

const Credits = () => {
  return (
    <div className="container mx-auto pb-[53px] sm:pb-[174px] px-8 sm:px-0">
      <h2 className="text-center text-3xl sm:text-[60px] font-normal leading-[72px] tracking-[-0.6px] sm:tracking-[-1.2px] bg-clip-text text_bg pb-3 sm:pb-[30px]">
        Proudly present 
      </h2>
      <p className="text-primary  text-center text-[17px] sm:text-3xl font-light sm:leading-[34.5px] sm:tracking-[-0.6px] leading-[22px] tracking-[-0.34px] max-w-[728px] mx-auto pb-[18px] sm:pb-11">
        Our Chat Ai system created by bachelor of science in computer science 3A.
      </p>
    </div>
  )
}

export default Credits;