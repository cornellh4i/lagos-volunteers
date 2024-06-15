// TODO: Combine this with EventData and EventDTO (THESE THREE SHOULD BE THE SAME)
export type ViewEventsEvent = {
  id: string;
  name: string;
  location: string;
  actions?: Action[];
  startDate: string;
  endDate: string;
  role: string;
  hours: number;
  ownerId?: string;
  description?: string;
  capacity?: number;
  status?: EventStatus;
  imageURL?: string;
  attendeeStatus?: string;
};

export type EventData = {
  eventid: string;
  location: string;
  datetime: string;
  supervisors: string[];
  capacity: number;
  image_src: string;
  tags: string[] | undefined;
  description: string;
  name: string;
};

export type EventDTO = {
  name: string;
  subtitle?: string;
  location: string;
  description: string;
  imageURL?: string;
  startDate: Date;
  endDate: Date;
  mode?: EventMode;
  status?: EventStatus;
  capacity: number;
};

export type EventMode = "VIRTUAL" | "IN_PERSON";

export type EventStatus = "DRAFT" | "COMPLETED" | "CANCELED";

export type UserStatus = "ACTIVE" | "INACTIVE" | "HOLD";

export type UserRole = "VOLUNTEER" | "SUPERVISOR" | "ADMIN";

export type Action =
  | "rsvp"
  | "cancel rsvp"
  | "publish"
  | "manage attendees"
  | "edit";

export type UserData = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  nickname: string;
  role?: string;
  status?: string;
  createdAt?: string;
  verified?: boolean;
  disciplinaryNotices?: number;
  imageUrl?: string;
};
