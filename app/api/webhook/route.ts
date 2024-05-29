import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser, updateUser } from "@/actions/user.action";
import envConfig from "@/config";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = envConfig.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local");
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  const event = JSON.parse(body);

  if (event.type === "user.created") {
    const { id, first_name, last_name, username, email_addresses, image_url } = event.data;
    const payload = {
      clerkId: id,
      name: `${first_name} ${last_name}`,
      username: username!,
      email: email_addresses[0].email_address,
      picture: image_url,
      type: "create",
    };
    const mongoUser = await createUser(payload);
    return NextResponse.json({ message: "OK", user: mongoUser });
  }
  if (event.type === "user.updated") {
    const { id, first_name, last_name, username, email_addresses, image_url } = event.data;
    const payload = {
      clerkId: id,
      name: `${first_name} ${last_name}`,
      username: username!,
      email: email_addresses[0].email_address,
      picture: image_url,
      type: "update",
    };
    const mongoUser = await createUser(payload);
    return NextResponse.json({ message: "OK", user: mongoUser });
  }
  if (event.type === "user.deleted") {
    const { id } = event.data;
    const mongoUser = await deleteUser(id!);
    return NextResponse.json({ message: "OK", user: mongoUser });
  }

  return new Response("", { status: 200 });
}
