import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { checkSubscription } from "@/lib/subscription";
import { SignedOut, SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {


  const { userId } = auth();

  const isPro = await checkSubscription();

  if(!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <SignedOut>
          <SignIn routing="hash" />
        </SignedOut>
      </div>
    );
  }

  return (
    <div className="h-full">
        <Navbar isPro={isPro} />
        <div className="hidden md:flex mt-16 w-20 flex-col fixed inset-y-0">
          <Sidebar isPro={isPro} />
        </div>
      <main className="md:pl-20 pt-16 h-full">{children}</main>
    </div>
  );
};

export default RootLayout;
