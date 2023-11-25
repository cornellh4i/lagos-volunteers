import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import EventForm from "@/components/organisms/EventForm";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import { auth } from "@/utils/firebase";
import { BASE_URL } from "@/utils/constants";
import Loading from "@/components/molecules/Loading";

type eventData = {
	eventName: string;
	location: string;
	volunteerSignUpCap: string;
	eventDescription: string;
	eventImage: string;
	rsvpLinkImage: string;
	startDate: string;
	endDate: string;
	startTime: string;
	endTime: string;
	mode: string;
};

/** An EditEvent page */
const EditEvent = () => {
	const router = useRouter();
	const { eventid } = router.query;
	const [eventDetails, setEventDetails] = useState<
		eventData | null | undefined
	>(null);

	const fetchEventDetails = async () => {
		try {
			const url = BASE_URL as string;
			const fetchUrl = `${url}/events/${eventid}`;
			const userToken = await auth.currentUser?.getIdToken();
			const response = await fetch(fetchUrl, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${userToken}`,
				},
			});
			const data = await response.json();
			setEventDetails({
				eventName: data["data"]["name"],
				location: data["data"]["location"],
				volunteerSignUpCap: data["data"]["capacity"],
				eventDescription: data["data"]["description"],
				eventImage: data["data"]["eventImage"] || "",
				rsvpLinkImage: data["data"]["rsvpLinkImage"] || "",
				startDate: data["data"]["startDate"],
				endDate: data["data"]["endDate"],
				startTime: data["data"]["startDate"],
				endTime: data["data"]["endDate"],
				mode: data["data"]["mode"],
			});
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchEventDetails();
	}, []);

	return (
		<CenteredTemplate>
			{eventDetails ? (
				<EventForm
					eventId={eventid}
					eventType="edit"
					eventDetails={eventDetails}
				/>
			) : (
				<Loading />
			)}
		</CenteredTemplate>
	);
};

export default EditEvent;
