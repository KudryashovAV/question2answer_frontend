import { Toaster } from "sonner";
import Header from "./_components/header";
import Footer from "./_components/footer";
import LeftSidebar from "./_components/left-sidebar";
import RightSidebar from "./_components/right-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getUserById } from "@/actions/user.action";
import { auth } from "@clerk/nextjs/server";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const userId = auth().userId;
  const user = await getUserById(userId!);

  return (
    <>
      <Header />
      <div className="flex">
        <LeftSidebar loggedInUserId={user?.id} />
        <ScrollArea className="h-[calc(100vh-5rem)] flex-1 sm:p-4">
          <main className="flex flex-col px-6 pb-14 pt-5 sm:px-10">{children}</main>
        </ScrollArea>
        <RightSidebar />
      </div>
      <Toaster richColors position="top-center" />
      <Footer />
    </>
  );
}
