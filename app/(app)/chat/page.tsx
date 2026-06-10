import { headers } from "next/headers";
import { auth } from "@/auth";
import { ChatClient } from "./client";

export default async function ChatPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isGuest =
    (session?.user as { isAnonymous?: boolean } | undefined)?.isAnonymous ??
    false;

  return <ChatClient isGuest={isGuest} />;
}
