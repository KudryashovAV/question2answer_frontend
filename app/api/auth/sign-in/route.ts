import { NextResponse } from "next/server";
import { hash, compare } from "bcrypt";
import { createUser } from "@/actions/user.action";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const hashedPassword = await hash(password, 10);

    const payload = {
      email: email as string,
      password: hashedPassword as string,
    };

    const user = await createUser(payload);

    const passwordCorrect = await compare(password, user?.password);

    if (!passwordCorrect) {
      return NextResponse.json(
        { error: "A user with such an email address already exists" },
        { status: 500 },
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
