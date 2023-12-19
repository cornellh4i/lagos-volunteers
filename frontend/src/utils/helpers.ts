import { BASE_URL } from "@/utils/constants";
import { auth } from "@/utils/firebase";
import { EventDTO } from "./types";

/**
 * Retrieves the Firebase token of the current user session
 * @returns the user token as a string
 */
export const retrieveToken = async () => {
  return (await auth.currentUser?.getIdToken()) as string;
};

/**
 * This functions performs a search in the DB based on the email of the user that
 * is currently logged in. This is used in development because of differing seeded
 * users in the database
 * @param token is the user token
 * @param email is the email of the user
 * @returns the userid
 */
export const fetchUserIdFromDatabase = async (token: string, email: string) => {
  try {
    const fetchUrl = `${BASE_URL}/users/search/?email=${email}`;
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data["data"][0]["id"];
    } else {
      console.error("User Retrieval failed with status:", response.status);
    }
  } catch (error) {
    console.error("Error in User Info Retrieval.");
  }
};

/**
 * This functions formats 2 date strings in the format: 00:00 AM - 00:00 PM
 * @param startDateString: string
 * @param endDateString: string
 * @returns the formatted datestring
 */
export const formatDateTimeRange = (
  startDateString: string,
  endDateString: string
) => {
  const formatUTCTime = (date: Date) => {
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    const period = hours < 12 ? "AM" : "PM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  const startDateFormatted = `${
    startDate.getUTCMonth() + 1
  }/${startDate.getUTCDate()}/${startDate.getUTCFullYear()}`;
  const startTimeFormatted = formatUTCTime(startDate);
  const endTimeFormatted = formatUTCTime(endDate);

  const formattedDateTimeRange = `${startDateFormatted}, ${startTimeFormatted} - ${endTimeFormatted}`;

  return formattedDateTimeRange;
};

/**
 * Registers the current user for the specified event
 * @param token is the user token
 * @param eventid is the id of the event
 * @param userid is the id of the user
 * @returns the response data
 */
export const registerUserForEvent = async (
  token: string,
  eventid: string,
  userid: string
) => {
  try {
    const fetchUrl = `${BASE_URL}/events/${eventid}/attendees`;
    const body = { attendeeid: userid };
    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Response management
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {}
};

/**
 * Cancels the registration of the current user for the specified event
 * @param token is the user token
 * @param eventid is the id of the event
 * @param userid is the id of the user
 * @param cancelationMessage is the cancelation message
 * @returns the response data
 */
export const cancelUserRegistrationForEvent = async (
  token: string,
  eventid: string,
  userid: string,
  cancelationMessage: string
) => {
  try {
    const fetchUrl = `${BASE_URL}/events/${eventid}/attendees`;
    const cancellationData = {
      attendeeid: userid,
      cancelationMessage: cancelationMessage,
    };
    const response = await fetch(fetchUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cancellationData),
    });

    // Response management
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {}
};

/**
 * Fetches all details for the specified event only if the user is registered
 * for the event. If the user is not registered, nothing is returned
 * @param token is the user token
 * @param eventid is the id of the event
 * @param userid is the id of the user
 * @returns the response data
 */
export const fetchEventDetailsForRegisteredUser = async (
  token: string,
  eventid: string,
  userid: string
) => {
  try {
    const fetchUrl = `${BASE_URL}/users/${userid}/registered?eventid=${eventid}`;
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Response management
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {}
};

/**
 * Fetches all events that the user is registered for
 * @param token is the user token
 * @param userid is the id of the user
 * @returns the response data
 */
export const fetchUserRegisteredEvents = async (
  token: string,
  userid: string
) => {
  try {
    const fetchUrl = `${BASE_URL}/users/${userid}/registered`;
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {}
};

/**
 * Creates a new event with userid as the owner
 * @param token is the user token
 * @param userid is the id of the event owner
 * @param event is the event data
 * @returns the response
 */
export const createEvent = async (
  token: string,
  userid: string,
  event: EventDTO
) => {
  const url = `${BASE_URL}/events`;
  const body = JSON.stringify({
    userID: `${userid}`,
    event: event,
  });
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body,
  });
  const data = await response.json();
  return { response: response, data: data };
};

/**
 * Edits an event
 * @param token is the user token
 * @param eventid is the id of the event
 * @param event is the event data
 * @returns the response
 */
export const editEvent = async (
  token: string,
  eventid: string,
  event: EventDTO
) => {
  const url = `${BASE_URL}/events/${eventid}`;
  const body = JSON.stringify(event);
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body,
  });
  const data = await response.json();
  return { response: response, data: data };
};
