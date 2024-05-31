import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/actions/user.action";
import ProfileForm from "@/components/forms/profile-form";
import { cookies } from "next/headers";
import { i18n } from "../../i118n";

export const metadata: Metadata = {
  title: "Wanswers | Profile Edit",
  description: "Edit your profile on Wanswers",
};

export default async function EditProfilePage() {
  const userId = auth().userId;
  const currentUser = await getUserByClerkId(userId!);

  const getLang = async () => {
    const cookieStore = cookies();
    return cookieStore.get("lang")?.value.toLocaleLowerCase() || "en";
  };
  const lang = await getLang();
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{i18n()[lang]["editProfile"]}</h1>
      <div className="mt-9">
        <ProfileForm clerkId={userId!} user={JSON.stringify(currentUser)} />
      </div>
    </>
  );
}
