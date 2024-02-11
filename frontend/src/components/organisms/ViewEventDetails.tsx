import React from "react";
import EventTemplate from "../templates/EventTemplate";
import EventRegisterCard from "./EventRegisterCard";
import Divider from "@mui/material/Divider";
import IconTextHeader from "../atoms/IconTextHeader";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import GroupsIcon from "@mui/icons-material/Groups";
import { useRouter } from "next/router";
import { useAuth } from "@/utils/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { fetchUserIdFromDatabase } from "@/utils/helpers";
import { formatDateTimeRange } from "@/utils/helpers";
import { EventData } from "@/utils/types";
import Loading from "@/components/molecules/Loading";

interface ViewEventDetailsProps {}

const ViewEventDetails = () => {
  const router = useRouter();
  const id = router.query.eventid as string;
  const { user } = useAuth();
  const [userid, setUserid] = React.useState("");

  /** Tanstack query to fetch and update the event details */
  const { data, isLoading, isError } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const userid = await fetchUserIdFromDatabase(user?.email as string);
      setUserid(userid);
      const { data } = await api.get(
        `/users/${userid}/registered?eventid=${id}`
      );
      return data["data"];
    },
  });

  let eventData = data?.eventDetails || {};
  let eventAttendance = data?.attendance;

  /** If the user canceled their event registration */
  const userHasCanceledAttendance =
    eventAttendance && eventAttendance["canceled"];

  /** Set event details */
  const {
    eventid,
    location,
    datetime,
    capacity,
    image_src,
    tags,
    supervisors,
    description,
    name,
  }: EventData = {
    eventid: eventData.id,
    location: eventData.location,
    datetime: formatDateTimeRange(eventData.startDate, eventData.endDate),
    capacity: eventData.capacity,
    image_src: eventData.imageURL,
    tags: eventData.tags,
    supervisors: [
      `${eventData.owner?.profile?.firstName} ${eventData.owner?.profile?.lastName}`,
    ],
    description: eventData.description,
    name: eventData.name,
  };

  if (isLoading) return <Loading />;

  const formatDateTimeToUI = (datetime: string) => {
    const [date, timeRange] = datetime.split(", ");
    const formattedDate = new Date(date).toLocaleString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return [formattedDate, timeRange];
  };
  const dateHeader = formatDateTimeToUI(datetime);

  return (
    <EventTemplate
      header={
        <div>
          <div className="font-semibold text-3xl">{name}</div>
          <div className="mt-5" />
          <div className="grid gap-2 xl:gap-6 xl:grid-cols-2">
            <IconTextHeader
              icon={<CalendarTodayIcon />}
              header={<>{dateHeader[0]}</>}
              body={<>{dateHeader[1]}</>}
            />
            <IconTextHeader icon={<FmdGoodIcon />} header={<>{location}</>} />
            <IconTextHeader
              icon={<PersonIcon />}
              header={<>{supervisors[0]}</>}
              body={<>Supervisor</>}
            />
            <IconTextHeader
              icon={<GroupsIcon />}
              header={<>{capacity} volunteers needed</>}
            />
          </div>
          <div className="mt-5" />
        </div>
      }
      body={
        <div>
          <div className="font-semibold text-xl">About the event</div>
          <Divider />
          <div className="mt-5"></div>

          <div>{name}</div>
          <div>{description}</div>
          {/* TODO: Format description */}
          <div>Kindly find below the details of the outreach:</div>
          <div className="mt-5"></div>
          <div>
            PROGRAM: TEFAP outreach at the food bank warehouse to commemorate
            the birthday celebration of Mrs Durojaiye Oluwadara.
          </div>
          <div>
            TARGET BENEFICIARIES: Beneficiaries of Dopemu and Agege Community.
          </div>
          <div>VENUE: Food Bank Warehouse</div>
          <div className="mt-5"></div>
          <div>Timing:</div>
          <div>9:00 am: Arrival of volunteers at the food bank.</div>
          <div>11:00 am Outreach starts.</div>
          <div>Please note: Registration closes at the Food Bank for 9:30</div>
          <div className="mt-5"></div>
          <div>
            Direction To The Foodbank WarehouseIf you are using the Google map,
            click here to get to the food bank warehouse
          </div>
          <div className="mt-5"></div>
          <div>
            OR Ask anyone how to get to Mangoro Bus-Stop (Mangoro B/S is two bus
            stops after Ikeja-Along). There is a Petcosters filling station by
            Mangoro Bus stop, enter the filling station and drive or walk
            through the red gate on the left-hand side (Olu Aboderin street).
            Walk straight down to Punch Industrial Estate. The warehouse is the
            green building by the left as you enter the estate.{" "}
          </div>
          <div className="mt-5"></div>
          <div>
            OR Find your way to Punch Industrial Estate, Olu Aboderin Street,
            Mangoro Bus stop, Ikeja, Lagos.Major Landmarks: Mangoro Bus stop,
            Kinston-Jo Restaurant, Petcosters Filling station.
          </div>
          <div className="mt-5"></div>
          <div>FOOD BANK COMMUNITY OUTREACH</div>
          <div>Kindly find below the details of the outreach:</div>
          <div className="mt-5"></div>
          <div>
            PROGRAM: TEFAP outreach at the food bank warehouse to commemorate
            the birthday celebration of Mrs Durojaiye Oluwadara.
          </div>
          <div>
            TARGET BENEFICIARIES: Beneficiaries of Dopemu and Agege Community.
          </div>
          <div>VENUE: Food Bank Warehouse</div>
          <div className="mt-5"></div>
          <div>Timing:</div>
          <div>9:00 am: Arrival of volunteers at the food bank.</div>
          <div>11:00 am Outreach starts.</div>
          <div>Please note: Registration closes at the Food Bank for 9:30</div>
          <div className="mt-5"></div>
          <div>
            Direction To The Foodbank WarehouseIf you are using the Google map,
            click here to get to the food bank warehouse
          </div>
          <div className="mt-5"></div>
          <div>
            OR Ask anyone how to get to Mangoro Bus-Stop (Mangoro B/S is two bus
            stops after Ikeja-Along). There is a Petcosters filling station by
            Mangoro Bus stop, enter the filling station and drive or walk
            through the red gate on the left-hand side (Olu Aboderin street).
            Walk straight down to Punch Industrial Estate. The warehouse is the
            green building by the left as you enter the estate.{" "}
          </div>
          <div className="mt-5"></div>
          <div>
            OR Find your way to Punch Industrial Estate, Olu Aboderin Street,
            Mangoro Bus stop, Ikeja, Lagos.Major Landmarks: Mangoro Bus stop,
            Kinston-Jo Restaurant, Petcosters Filling station.FOOD BANK
            COMMUNITY OUTREACH
          </div>
          <div>Kindly find below the details of the outreach:</div>

          <div className="mt-5"></div>
          <div className="font-semibold text-xl">Location</div>
          <Divider />
          <div className="mt-5"></div>

          <div className="font-semibold">{location}</div>
          <div className="bg-red-300 mt-5">Future location widget here</div>
        </div>
      }
      img={<img className="w-full rounded-2xl" src={image_src} />}
      card={
        <EventRegisterCard
          action={
            userHasCanceledAttendance
              ? "cancel confirmation"
              : eventAttendance
              ? "cancel"
              : "register"
          }
          eventId={eventid}
          attendeeId={userid}
        />
      }
    />
  );
};

export default ViewEventDetails;
