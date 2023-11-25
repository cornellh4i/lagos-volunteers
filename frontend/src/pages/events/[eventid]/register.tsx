import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CenteredTemplate from "@/components/templates/CenteredTemplate";
import EventRegisterForm from "@/components/organisms/EventRegisterForm";
import EventConfirmation from "@/components/organisms/EventConfirmation";
import { BASE_URL } from "@/utils/constants";
import { auth } from "@/utils/firebase";
import { useAuth } from "@/utils/AuthContext";
import { fetchUserIdFromDatabase, formatDateTimeRange } from "@/utils/helpers";
import Loading from "@/components/molecules/Loading";

type eventData = {
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

/** An EventRegistration page */
const EventRegistration = () => {
	const router = useRouter();
	const { eventid } = router.query;
	const [eventDetails, setEventDetails] = useState<eventData | null>(null);
	const [isRegistered, setIsRegistered] = useState<boolean>(false);

	const { user } = useAuth();
	const url = BASE_URL as string;

	// This can be fetched from the server to prevent flashing of unregister form
	useEffect(() => {
		fetchEventDetails();
	}, []);

	const fetchEventDetails = async () => {
		const userToken = await auth.currentUser?.getIdToken();
		try {
			const userId = await fetchUserIdFromDatabase(
				user?.email as string,
				userToken as string
			);
			const fetchUrl = `${url}/users/${userId}/registered?eventid=${eventid}`;
			const response = await fetch(fetchUrl, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${userToken}`,
				},
			});

			const data = await response.json();

			const event = data["data"]["eventDetails"];
			setEventDetails({
				eventid: event["id"],
				location: event["location"],
				datetime: formatDateTimeRange(event["startDate"], event["endDate"]),
				capacity: event["capacity"],
				image_src: event["imageURL"],
				tags: event["tags"],
				supervisors: [
					event["owner"]["profile"]["firstName"] +
						" " +
						event["owner"]["profile"]["lastName"],
				],
				description: event["description"],
				name: event["name"],
			});

			if (
				data["data"]["attendance"] &&
				data["data"]["attendance"]["canceled"]
			) {
				router.push(`/events/${eventid}/cancel`);
			} else if (data["data"]["attendance"]) {
				setIsRegistered(true);
			} else {
				setIsRegistered(false);
			}
		} catch (error) {}
	};

	return (
		<CenteredTemplate>
			{eventDetails ? (
				!isRegistered ? (
					<EventRegisterForm eventDetails={eventDetails} />
				) : (
					<EventConfirmation
						eventDetails={eventDetails}
						confirmation="register"
					/>
				)
			) : (
				<Loading />
			)}
		</CenteredTemplate>
	);
};

export default EventRegistration;
