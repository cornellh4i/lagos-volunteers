import { BASE_URL } from "@/utils/constants";

const url = BASE_URL as string;

/* This functions performs a search in the DB based on the email of the user that
is currently logged in. This is used in development because of differing seeded users
in the database
@param email: string
@param token: string
*/
export const fetchUserIdFromDatabase = async (email: string, token: string) => {
	try {
		const fetchUrl = `${url}/users/search/?email=${email}`;
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
