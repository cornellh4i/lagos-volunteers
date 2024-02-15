import dayjs from "dayjs";
import { api } from "./api";
import { isToday, isTomorrow, isPast } from "date-fns";

/**
 * This functions performs a search in the DB based on the email of the user that
 * is currently logged in. This is used in development because of differing seeded
 * users in the database
 * @param token is the user token
 * @param email is the email of the user
 * @returns the userid
 */
export const fetchUserIdFromDatabase = async (email: string) => {
  const { data } = await api.get(`/users/search/?email=${email}`);
  return data["data"][0]["id"];
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
  const formatLocalTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const period = hours < 12 ? "AM" : "PM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  const startDateFormatted = `${
    startDate.getMonth() + 1
  }/${startDate.getDate()}/${startDate.getFullYear()}`;
  const startTimeFormatted = formatLocalTime(startDate);
  const endTimeFormatted = formatLocalTime(endDate);

  const formattedDateTimeRange = `${startDateFormatted}, ${startTimeFormatted} - ${endTimeFormatted}`;

  return formattedDateTimeRange;
};

/**
 * Formats the provided date string
 * @param dateString is the input date string
 * @returns the date formatted as dd/mm/yyyy
 */
export const formatDateString = (dateString: string) => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Converts DatePicker and TimePicker inputs to an ISO string
 * @param inputTime is the input time
 * @param inputDate is the inputDate
 * @returns the ISO string
 */
export const convertToISO = (inputTime: string, inputDate: string) => {
  var timeIndex = 0;
  var counter = 0;
  const time = String(inputTime);
  const date = String(inputDate);
  for (let i = 0; i < time.length; i++) {
    if (time[i] === " ") {
      counter += 1;
      if (counter === 4) {
        timeIndex = i;
        counter = 0;
        break;
      }
    }
  }
  var dateIndex = 0;
  for (let i = 0; i < date.length; i++) {
    if (date[i] === " ") {
      counter += 1;
      if (counter === 4) {
        dateIndex = i;
        counter = 0;
        break;
      }
    }
  }
  const rawDateTime = date.substring(0, dateIndex) + time.substring(timeIndex);
  const res = dayjs(rawDateTime).toJSON();
  return res;
};

/**
 * Calculates the hours an event lasts for
 * @param startTime is the start time
 * @param endTime is the end time
 * @returns the hours
 */
export const eventHours = (endTime: string, startTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diff = end.getTime() - start.getTime();
  const hours = diff / (1000 * 3600);
  return Math.round(hours);
};

/**
 * Formats a datetime string to a user-friendly format.
 * Format for date is : "Weekday, Month Day, Year"
 *
 * @param datetime - The datetime string to be formatted.
 * @returns An array containing the formatted date and the time range.
 */
export const formatDateTimeToUI = (datetime: string) => {
  const [date, timeRange] = datetime.split(", ");
  const formattedDate = new Date(date).toLocaleString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return [formattedDate, timeRange];
};

/**
 * Generates a string avatar for the given name
 * @param name is the name of the user
 */
export function stringAvatar(name: string) {
  function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }
  return {
    sx: {
      bgcolor: stringToColor(name),
      height: "125px",
      width: "125px",
      fontSize: "75px",
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

/**
 * Displays the date info
 * @param date is the date object
 * @returns one of ongoing, today, tomorrow, or upcoming
 */
export const displayDateInfo = (date: Date) => {
  if (isPast(date)) {
    return "Ongoing";
  } else if (isToday(date)) {
    return "Today";
  } else if (isTomorrow(date)) {
    return "Tomorrow";
  } else {
    return "Upcoming";
  }
};
