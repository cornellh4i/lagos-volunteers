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

export type Action =
  | "rsvp"
  | "cancel rsvp"
  | "publish"
  | "manage attendees"
  | "edit";
