import Credits from "@/components/home/credits";
import Footer from "@/components/home/footer";
import { Header } from "@/components/home/header";
import Hero from "@/components/home/herou";
import HowItWorks from "@/components/home/information";

export default function Home() {
  return (
    <div className="h-full w-full dark:bg-black bg-white  dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex items-center justify-center">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="sm:p-7 sm:pb-0">
        <Header />
        <Hero />
        <HowItWorks />
        <Credits />
        <Footer />
      </div>
    </div>
  );
}
