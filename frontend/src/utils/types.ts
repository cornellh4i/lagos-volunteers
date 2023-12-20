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

export type EventStatus = "ACTIVE" | "COMPLETED" | "CANCELED";

export type UserStatus = "ACTIVE" | "INACTIVE" | "HOLD";

export type UserRole = "VOLUNTEER" | "SUPERVISOR" | "ADMIN";

export type Action =
  | "rsvp"
  | "cancel rsvp"
  | "publish"
  | "manage attendees"
  | "edit";
