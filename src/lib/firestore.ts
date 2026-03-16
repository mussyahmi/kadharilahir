import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Invitation, InvitationFormData, Rsvp } from "@/types/invitation";

// ── Invitations ────────────────────────────────────────────────────────────────

export async function createInvitation(
  data: InvitationFormData,
  uid: string
): Promise<string> {
  const batch = writeBatch(db);

  const invRef = doc(collection(db, "invitations"));
  const now = Timestamp.now();
  batch.set(invRef, {
    ownerId: uid,
    slug: data.slug,
    birthdayPerson: data.birthdayPerson,
    birthdayAge: data.birthdayAge ?? null,
    language: data.language ?? "ms",
    date: Timestamp.fromDate(new Date(data.date)),
    time: data.time,
    venue: data.venue,
    message: data.message,
    coverPhotoUrl: data.coverPhotoUrl,
    backgroundImageUrl: data.backgroundImageUrl ?? "",
    themeColor: data.themeColor,
    templateId: data.templateId ?? "comel",
    tagline: data.tagline ?? "",
    dressCode: data.dressCode ?? "",
    slots: data.slots ?? [],
    locationLat: data.locationLat ?? null,
    locationLng: data.locationLng ?? null,
    photoOffsetX: data.photoOffsetX ?? 0,
    photoOffsetY: data.photoOffsetY ?? 0,
    photoRadius: data.photoRadius ?? 8,
    photoWidth: data.photoWidth ?? 75,
    photoHeight: data.photoHeight ?? 50,
    songId: data.songId ?? "none",
    aiDesignStyle: data.aiDesignStyle ?? "meriah",
    aiArtStyle: data.aiArtStyle ?? "ilustrasi",
    aiColorMood: data.aiColorMood ?? "vibrant",
    createdAt: now,
    updatedAt: now,
  });

  const slugRef = doc(db, "slugs", data.slug);
  batch.set(slugRef, { invitationId: invRef.id, ownerId: uid });

  await batch.commit();
  return invRef.id;
}

export async function updateInvitation(
  id: string,
  data: InvitationFormData,
  oldSlug: string
): Promise<void> {
  const batch = writeBatch(db);

  const invRef = doc(db, "invitations", id);
  batch.update(invRef, {
    slug: data.slug,
    birthdayPerson: data.birthdayPerson,
    birthdayAge: data.birthdayAge ?? null,
    language: data.language ?? "ms",
    date: Timestamp.fromDate(new Date(data.date)),
    time: data.time,
    venue: data.venue,
    message: data.message,
    coverPhotoUrl: data.coverPhotoUrl,
    backgroundImageUrl: data.backgroundImageUrl ?? "",
    themeColor: data.themeColor,
    templateId: data.templateId ?? "comel",
    tagline: data.tagline ?? "",
    dressCode: data.dressCode ?? "",
    slots: data.slots ?? [],
    locationLat: data.locationLat ?? null,
    locationLng: data.locationLng ?? null,
    photoOffsetX: data.photoOffsetX ?? 0,
    photoOffsetY: data.photoOffsetY ?? 0,
    photoRadius: data.photoRadius ?? 8,
    photoWidth: data.photoWidth ?? 75,
    photoHeight: data.photoHeight ?? 50,
    songId: data.songId ?? "none",
    aiDesignStyle: data.aiDesignStyle ?? "meriah",
    aiArtStyle: data.aiArtStyle ?? "ilustrasi",
    aiColorMood: data.aiColorMood ?? "vibrant",
    updatedAt: Timestamp.now(),
  });

  if (oldSlug !== data.slug) {
    const oldSlugRef = doc(db, "slugs", oldSlug);
    batch.delete(oldSlugRef);
    const newSlugRef = doc(db, "slugs", data.slug);
    batch.set(newSlugRef, {
      invitationId: id,
      ownerId: (await getDoc(invRef)).data()?.ownerId,
    });
  }

  await batch.commit();
}

export async function deleteInvitation(id: string, slug: string): Promise<void> {
  const batch = writeBatch(db);
  batch.delete(doc(db, "invitations", id));
  batch.delete(doc(db, "slugs", slug));
  await batch.commit();
}

export async function getInvitationBySlug(slug: string): Promise<Invitation | null> {
  const slugDoc = await getDoc(doc(db, "slugs", slug));
  if (!slugDoc.exists()) return null;

  const { invitationId } = slugDoc.data();
  const invDoc = await getDoc(doc(db, "invitations", invitationId));
  if (!invDoc.exists()) return null;

  return { id: invDoc.id, ...invDoc.data() } as Invitation;
}

export async function checkSlugAvailable(slug: string): Promise<boolean> {
  const slugDoc = await getDoc(doc(db, "slugs", slug));
  return !slugDoc.exists();
}

export function subscribeToInvitations(
  uid: string,
  callback: (invitations: Invitation[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "invitations"),
    where("ownerId", "==", uid),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Invitation));
    callback(items);
  });
}

export function subscribeToInvitation(
  id: string,
  callback: (invitation: Invitation | null) => void
): Unsubscribe {
  return onSnapshot(doc(db, "invitations", id), (snap) => {
    if (!snap.exists()) { callback(null); return; }
    callback({ id: snap.id, ...snap.data() } as Invitation);
  });
}

// ── RSVPs ──────────────────────────────────────────────────────────────────────

export async function addRsvp(
  invitationId: string,
  data: { guestName: string; attending: boolean; message: string; slotId?: string }
): Promise<void> {
  await addDoc(collection(db, "invitations", invitationId, "rsvps"), {
    ...data,
    submittedAt: Timestamp.now(),
  });
}

export function subscribeToRsvps(
  invitationId: string,
  callback: (rsvps: Rsvp[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "invitations", invitationId, "rsvps"),
    orderBy("submittedAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Rsvp));
    callback(items);
  });
}
