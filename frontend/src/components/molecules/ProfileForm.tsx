import React from "react";
import {useState, useEffect} from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import CustomCheckbox from "../atoms/Checkbox";
import { useAuth } from '@/utils/AuthContext';
import { BASE_URL } from '@/utils/constants';
import { auth } from '@/utils/firebase';

const ProfileForm = () => {
  const { user, loading, error, signOutUser } = useAuth();
	const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(()=>{
    fetchUserDetails();
  }, [])

	const fetchUserDetails = async () => {
		try {
			const url = BASE_URL as string;
			const fetchUrl = `${url}/users/search/?email=${user?.email}`; // Note that this is bound to change based on a fix we are making to the backend

			// Get the user's token. Notice that auth is imported from firebase file
			const userToken = await auth.currentUser?.getIdToken();
			const response = await fetch(fetchUrl, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${userToken}`,
				},
			});
			const data = await response.json();
			setUserDetails(data);
		} catch (error) {
			console.log(error);
		}
	};

  const handleCancel = () => {
    location.replace("/events");
  };

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
    console.log(value)
	}

  return (
    <div>
      <div className="space-y-4">
        {userDetails === null ? (
        <div></div>
				):(
        <>
        <div>
          <TextField
            label="Email"
            required={true}
            status=""
            handleChange = {handleChange}
            incorrectEntryText=""
            inputText= {userDetails['data'][0]['email']}
          />
        </div>
        {/* <div>
          <TextField
            label="First name"
            required={true}
            status=""
            incorrectEntryText=""
            inputText = {userDetails['data'][0]['profile']['firstName']}
          />
        </div>
        <div>
          <TextField
            label="Last name"
            required={true}
            status=""
            incorrectEntryText=""
            inputText= {userDetails['data'][0]['profile']['lastName']}
          />
        </div>
        <div>
          <TextField
            label="Preferred name"
            required={true}
            status=""
            incorrectEntryText=""
            inputText={userDetails['data'][0]['profile']['nickname']}
          />
        </div>
        <div>
          <TextField
            label="Old password"
            required={true}
            status=""
            incorrectEntryText=""
            inputText=""
          />
        </div>
        <div>
          <TextField
            label="New password"
            required={true}
            status=""
            incorrectEntryText=""
            inputText=""
          />
        </div>
        <div>
          <TextField
            label="Confirm new password"
            required={true}
            status=""
            incorrectEntryText=""
            inputText=""
          /> 
        </div> */}
        <div>
          <CustomCheckbox label="Email notifications" />
        </div>
        <div className="flex md:space-x-4 grid sm:grid-cols-1 md:grid-cols-2">
          <div className="sm:pb-4 md:pb-0">
            <Button
              buttonText="Save Changes"
              buttonTextColor="#000000"
              buttonColor="#D3D3D3"
              buttonAction={()=>{alert("clicked save")}}
            />
          </div>
          <div>
            <Button
              buttonText="Cancel"
              buttonTextColor="#000000"
              buttonColor="#808080"
              buttonAction={(handleCancel)}
            />
          </div>
        </div>
        </>
        )}
        
      </div>
    </div>
  );
};


export default ProfileForm;
