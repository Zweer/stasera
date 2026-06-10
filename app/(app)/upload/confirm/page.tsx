import { headers } from "next/headers";
import { auth } from "@/auth";
import { SignUpBanner } from "@/components/features/sign-up-banner";
import { ConfirmClient } from "./client";

export default async function ConfirmPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isGuest =
    (session?.user as { isAnonymous?: boolean } | undefined)?.isAnonymous ??
    false;

  return (
    <>
      {isGuest && (
        <div className="px-5 pt-6">
          <SignUpBanner message="Accedi per salvare i tuoi contributi nel tuo profilo" />
        </div>
      )}
      <ConfirmClient />
    </>
  );
}
