import React from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import CustomCheckbox from "../atoms/Checkbox";
import ProfileTemplate from "../templates/ProfileTemplate";

const ProfileForm = () => {
  return (
    <div>
      <div>
        <ProfileTemplate />
      </div>
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
            />
          </div>
          <div>
            <Button
              buttonText="Cancel"
              buttonTextColor="#000000"
              buttonColor="#808080"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
