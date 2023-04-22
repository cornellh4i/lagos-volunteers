import React from "react";
import {useState} from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import CustomCheckbox from "../atoms/Checkbox";


const ProfileForm = () => {
  // useEffect(() => {
  //   (async function () {
  //     if (authenticated) {
  //       setLoading(true)
  //       const response = await fetch(`/api/getQuestions/${sheetID}/${data.docID}`)
  //       const json = await response.json()
  //     }
  //   })()
  // }, [authenticated]);

  // usertoken in the header
  // fetch("localhost:8000/users/")

  const handleCancel = () => {
    location.replace("/");
  };
  
  return (
    <div>
      <div className="space-y-4">
        <div>
          <TextField
            label="Email"
            required={true}
            status=""
            incorrectEntryText=""
          />
        </div>
        <div>
          <TextField
            label="First name"
            required={true}
            status=""
            incorrectEntryText=""
          />
        </div>
        <div>
          <TextField
            label="Last name"
            required={true}
            status=""
            incorrectEntryText=""
          />
        </div>
        <div>
          <TextField
            label="Preferred name"
            required={true}
            status=""
            incorrectEntryText=""
          />
        </div>
        <div>
          <TextField
            label="Old password"
            required={true}
            status=""
            incorrectEntryText=""
          />
        </div>
        <div>
          <TextField
            label="New password"
            required={true}
            status=""
            incorrectEntryText=""
          />
        </div>
        <div>
          <TextField
            label="Confirm new password"
            required={true}
            status=""
            incorrectEntryText=""
          />
        </div>
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
      </div>
    </div>
  );
};


export default ProfileForm;
