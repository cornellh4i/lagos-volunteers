import dayjs from "dayjs";
import { api } from "./api";

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
 * @returns the date formatted as mm/dd/yyyy
 */
export const formatDateString = (dateString: string) => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
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
  return hours;
};
