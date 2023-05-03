import React from "react";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import SignupForm from "@/components/molecules/SignupForm";
import EventCard from '@/components/molecules/EventCard'; 
import CardList from '@/components/atoms/CardList'; 

type Action = "rsvp" | "cancel rsvp" | "publish" | "manage attendees" | "edit";
/** A Signup page */
const Signup = () => {
  return (
    <>
      <WelcomeTemplate Form={SignupForm} />
      <CardList cards={[<EventCard eventid={"000"} mainAction={"rsvp"} dropdownActions={["cancel rsvp"]} title={"snehar"} location={"jameson"} datetime={"today lol"}/>, <EventCard eventid={"000"} mainAction={"rsvp"} dropdownActions={["cancel rsvp"]} title={"snehar"} location={"jameson"} datetime={"today lol"}/>]}/>
    </>
  );
};

export default Signup;
