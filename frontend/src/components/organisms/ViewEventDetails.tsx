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

interface ViewEventDetailsProps {}

const ViewEventDetails = () => {
  return (
    <EventTemplate
      header={
        <div>
          <div className="font-semibold text-3xl">TEFAP Outreach</div>
          <div className="mt-5" />
          <div className="grid gap-2 xl:gap-6 xl:grid-cols-2">
            <IconTextHeader
              icon={<CalendarTodayIcon />}
              header={<>Wednesday, November 8</>}
              body={<>9:00-11:00 AM WAT</>}
            />
            <IconTextHeader
              icon={<PersonIcon />}
              header={<>Jason Zheng</>}
              body={<>Supervisor</>}
            />
            <IconTextHeader
              icon={<FmdGoodIcon />}
              header={<>Plot 2, Lagos Food Bank Building</>}
            />
            <IconTextHeader
              icon={<GroupsIcon />}
              header={<>30 volunteers needed</>}
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
        </div>
      }
      img={<img className="w-full rounded-2xl" src="/lfbi_splash.png" />}
      card={<EventRegisterCard action="register" />}
    />
  );
};

export default ViewEventDetails;
