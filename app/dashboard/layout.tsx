import Footer from "@/components/home/footer";
import Header from "@/components/ui/header";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chat | Dashboard",
    description: "Chat automated system",
}

export default function RootLayout({
    children,
  } : {
    children: React.ReactNode;
  }) {
  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <div className="flex-grow">{children}</div>
    </div>
  )
}