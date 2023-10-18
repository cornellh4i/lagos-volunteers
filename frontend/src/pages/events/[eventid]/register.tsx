// to test go to http://localhost:3000/events/cln80ae520006pcc77ri0t8rs/register

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import EventRegisterForm from "@/components/organisms/EventRegisterForm";

import { BASE_URL } from "@/utils/constants";
// import { useAuth } from "@/utils/AuthContext";
import { auth } from "@/utils/firebase";

type eventData = {
  eventid: string;
  location: string;
  datetime: string;
  supervisors: string[];
  capacity: number;
  image_src: string;

  // do I need to change to tags? : string[] | undefined
  tags: string[] | undefined;
};

/** An EventRegistration page */
const EventRegistration = () => {
  const router = useRouter();
  const { eventid } = router.query;

  // what is this for?
  const [eventDetails, setEventDetails] = useState<
    eventData | null | undefined
  >(null);

  // do we need auth and user
  // const { user } = useAuth();

  const fetchEventDetails = async () => {
    try {
      const url = BASE_URL as string;
      const fetchUrl = `${url}/${eventid}`;
      const userToken = await auth.currentUser?.getIdToken();

      console.log("hello 1")
      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const data = await response.json();
      console.log(data);
      console.log("hello 2")

      if (response.ok) {
        console.log(data);
        console.log("success");

        setEventDetails({
          // What should this be?
          eventid: data["data"][0],
          location: data["data"][0],
          datetime: data["data"][0],
          supervisors: data["data"][0],
          capacity: data["data"][0],
          image_src: data["data"][0],
          tags: data["data"][0] || "", // is this needed? the || ""
        });
      }
      
    } catch (error) {
      console.log(error);
    }

    //   // What should this be?
    //   setEventDetails({
    //     eventid: data["data"][0],
    //     location: data["data"][0],
    //     datetime: data["data"][0],
    //     supervisors: data["data"][0],
    //     capacity: data["data"][0],
    //     image_src: data["data"][0],
    //     tags: data["data"][0] || "", // is this needed? the || ""
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  };

  useEffect(() => {
    fetchEventDetails();
  }, []);

  return (
    <CenteredTemplate>
      {eventDetails ? (
        <EventRegisterForm eventDetails={eventDetails} />
      ) : (
        <div>Getting your data...</div>
      )}

      {/* 
      <EventRegisterForm
        eventid={eventid as string}
        location="Address, Building Name"
        datetime="02/15/2023, 9:00AM-11:00AM"
        supervisors={["Jane Doe", "Jess Lee"]}
        capacity={20}
        image_src="https://i0.wp.com/roadmap-tech.com/wp-content/uploads/2019/04/placeholder-image.jpg?resize=800%2C800&ssl=1"
        tags={["In-person", "EDUFOOD"]}
      /> */}
    </CenteredTemplate>
  );
};

export default EventRegistration;
