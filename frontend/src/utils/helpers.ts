import { BASE_URL } from "@/utils/constants";
import { auth } from "@/utils/firebase";

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
