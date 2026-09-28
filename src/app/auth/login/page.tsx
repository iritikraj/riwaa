import { Footer } from "@/app/(home)/_footer";
import Navbar from "@/components/navbar";
import LoginPageClient from "./_client";

export default function LoginPage() {
  return (
    <div className='bg-[#FCFBF8] font-jost'>
      <Navbar hideLoginButton={true} />
      <LoginPageClient />
      <Footer />
    </div>
  );
}