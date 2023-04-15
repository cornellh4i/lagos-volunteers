import React  from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import CustomCheckbox from "../atoms/Checkbox";
import ProfileTemplate from "../templates/ProfileTemplate";

const ProfileForm = () => {
  return (
    <div>
      <div>
        <ProfileTemplate/>
      </div>
      <div>
        <TextField 
          label="Email"
          status=""
          incorrectEntryText=""/>
      </div>
      <div>
        <TextField 
          label="First Name"
          status=""
          incorrectEntryText=""/>
      </div>
      <div>
        <TextField 
          label="Last Name"
          status=""
          incorrectEntryText=""/>
      </div>
      <div>
        <TextField 
          label="Preferred Name"
          status=""
          incorrectEntryText=""/>
      </div>
      <div>
        <TextField 
          label="Old Password"
          status=""
          incorrectEntryText=""/>
      </div>
      <div>
        <TextField 
          label="New Password"
          status=""
          incorrectEntryText=""/>
      </div>
      <div>
        <TextField 
          label="Confirm New Password"
          status=""
          incorrectEntryText=""/>
      </div>
      <div>
        <CustomCheckbox 
          label="Email Notifications"/>
      </div>
      <div>
        <Button 
          buttonText="Cancel"
          buttonTextColor="#000000"
          buttonColor="#808080"/>
        <Button 
          buttonText="Save Cahgnes"
          buttonTextColor="#000000"
          buttonColor="#D3D3D3"/>
      </div>
    </div>
  );
};

export default ProfileForm;
