export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getInvitationBySlug } from "@/lib/firestore";
import { TemplateCustomAI } from "@/components/public-invite/templates/TemplateCustomAI";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);
  if (!invitation) return { title: "Jemputan Tidak Dijumpai" };

  const ageSuffix = invitation.birthdayAge ? ` — ${invitation.birthdayAge}` : "";
  return {
    title: `Jemputan Hari Lahir ${invitation.birthdayPerson}${ageSuffix} | KadHariLahir`,
    description: invitation.message || `Anda dijemput ke majlis hari lahir ${invitation.birthdayPerson}`,
    openGraph: {
      images: invitation.backgroundImageUrl
        ? [invitation.backgroundImageUrl]
        : invitation.coverPhotoUrl
        ? [invitation.coverPhotoUrl]
        : [],
    },
  };
}

export default async function InvitePage({ params }: Props) {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);

  if (!invitation) notFound();

  // Serialize Firestore Timestamps to plain numbers before passing to Client Component
  const serialized = {
    ...invitation,
    date: { seconds: invitation.date.seconds, nanoseconds: invitation.date.nanoseconds },
    createdAt: { seconds: invitation.createdAt.seconds, nanoseconds: invitation.createdAt.nanoseconds },
    updatedAt: { seconds: invitation.updatedAt.seconds, nanoseconds: invitation.updatedAt.nanoseconds },
    songId: invitation.songId,
  };

  return <TemplateCustomAI invitation={serialized} />;
}
