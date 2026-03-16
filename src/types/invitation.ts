import { Timestamp } from "firebase/firestore";

export interface Slot {
  id: string;
  label: string;      // e.g. "Slot Keluarga"
  startTime: string;  // e.g. "11:00 AM"
  endTime: string;    // e.g. "1:00 PM"
}

export interface Invitation {
  id: string;
  ownerId: string;
  slug: string;
  birthdayPerson: string;
  birthdayAge?: string;
  language?: "ms" | "en";
  date: Timestamp;
  time: string;
  venue: string;
  message: string;
  coverPhotoUrl: string;
  backgroundImageUrl?: string;
  themeColor: string;
  templateId: string;
  tagline?: string;
  dressCode?: string;
  slots?: Slot[];
  locationLat?: number;
  locationLng?: number;
  photoOffsetX?: number;
  photoOffsetY?: number;
  photoRadius?: number;
  photoWidth?: number;
  photoHeight?: number;
  songId?: string;
  aiDesignStyle?: string;
  aiArtStyle?: string;
  aiColorMood?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface InvitationFormData {
  birthdayPerson: string;
  birthdayAge?: string;
  language?: "ms" | "en";
  date: string; // ISO date string for form
  time: string;
  venue: string;
  message: string;
  coverPhotoUrl: string;
  backgroundImageUrl?: string;
  themeColor: string;
  templateId: string;
  tagline?: string;
  dressCode?: string;
  slots?: Slot[];
  locationLat?: number;
  locationLng?: number;
  photoOffsetX?: number;
  photoOffsetY?: number;
  photoRadius?: number;
  photoWidth?: number;
  photoHeight?: number;
  songId?: string;
  aiDesignStyle?: string;
  aiArtStyle?: string;
  aiColorMood?: string;
  slug: string;
}

export interface Rsvp {
  id: string;
  guestName: string;
  attending: boolean;
  message: string;
  slotId?: string;
  submittedAt: Timestamp;
}

export interface SlugDoc {
  invitationId: string;
  ownerId: string;
}
