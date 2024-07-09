import { Metadata } from "next";
import { fetchUserById } from "@/actions/user.action";
import ProfileForm from "@/components/forms/profile-form";
import { cookies } from "next/headers";
import { i18n } from "../../i118n";

export const metadata: Metadata = {
  title: "Wanswers | Profile Edit",
  description: "Edit your profile on Wanswers",
};

export default async function EditProfilePage() {
  const getCurrentUser = async () => {
    const cookieStore = cookies();
    return JSON.parse(cookieStore.get("currentUser")?.value);
  };

  const currentUser = await getCurrentUser();
  const fetchedCurrentUser = await fetchUserById(currentUser.id);

  const getLang = async () => {
    const cookieStore = cookies();
    return cookieStore.get("lang")?.value.toLocaleLowerCase() || "en";
  };
  const lang = await getLang();
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{i18n()[lang]["editProfile"]}</h1>
      <div className="mt-9">
        <ProfileForm user={JSON.stringify(fetchedCurrentUser)} />
      </div>
    </>
  );
}
