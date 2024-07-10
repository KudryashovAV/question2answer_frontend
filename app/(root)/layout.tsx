import { Toaster } from "sonner";
import Header from "./_components/header";
import Footer from "./_components/footer";
import LeftSidebar from "./_components/left-sidebar";
import RightSidebar from "./_components/right-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { createUser } from "@/actions/user.action";
import { cookies } from "next/headers";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session: any = await getServerSession(authOptions as any);

  let user: any = null;

  if (session) {
    const payload = {
      name: session.user?.name,
      email: session.user?.email,
      picture: session.user?.image,
      type: "create",
    };

    user = await createUser(payload);

    const setUserToCookies = async () => {
      cookies().set(
        "currentUser",
        "value",
        JSON.stringify({
          name: user.name,
          email: user.email,
          id: user.id,
          picture: user.picture,
        }) as Partial<ResponseCookie>,
      );
    };

    setUserToCookies();
  }

  return (
    <>
      <Header currentUser={user} />
      <div className="flex">
        <LeftSidebar />
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
