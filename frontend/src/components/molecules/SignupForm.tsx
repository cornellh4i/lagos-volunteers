import React, {useEffect, useState} from "react";
import Button from "../atoms/Button";
import TextField from "../atoms/TextField";
import Link from "next/link";
import { useAuth } from "@/utils/AuthContext";
import { BASE_URL } from "@/utils/constants";
import { useNavigate } from "react-router-dom";


const SignupForm = () => {
  const { createFirebaseUser } = useAuth();
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [emailError, setEmailError] = useState("")
  const navigate = useNavigate();

  const handleCreateUser = async () => {
      console.log(email)
      console.log(password)
    if (password != confirmPassword){
      setConfirmPasswordError("Passwords do not match.")
      setPasswordError("")
      setEmailError("")
    }
    else if(password == ""){
      setPasswordError("Password cannot be empty.")
      setEmailError("")
      setConfirmPasswordError("")
    }
    else if(!(email.includes("@") || email.includes("."))){
      setEmailError("Please enter a valid email.")
      setPasswordError("")
      setConfirmPasswordError("")
    }
    else {
      const url = `${BASE_URL}/users/`;
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email: email, profile: {firstName: firstName, lastName: lastName }})
    };

    Promise.all([fetch(url,requestOptions).then((response) => response.json()).then((data) => fetch(`${url}/users/search/?email=${data.user.email}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    }).then((userDetails) => console.log(userDetails.json()))),createFirebaseUser(email,password)])
    navigate("/login")
    }
  };

  return (
    <div className="space-y-4">
      <div className="font-bold text-3xl">Sign Up</div>
      <div>
        <TextField
          label="Email*"
          required={true}
          status=""
          incorrectEntryText={emailError}
          setTextInput={setEmail}
        />
      </div>
      <div className="flex md:space-x-4 grid sm:grid-cols-1 md:grid-cols-2 ">
        <div className="sm:pb-4 md:pb-0">
          <TextField
            label="First Name*"
            required={true}
            status=""
            incorrectEntryText=""
            setTextInput={setFirstName}
          />
        </div>
        <div>
          <TextField
            label="Last Name*"
            required={true}
            status=""
            incorrectEntryText=""
            setTextInput={setLastName}
          />
        </div>
      </div>
      <div>
        <TextField
          label="Password*"
          status=""
          required={true}
          incorrectEntryText={passwordError}
          setTextInput={setPassword}
        />
      </div>
      <div>
        <TextField
          label="Confirm Password*"
          status=""
          required={true}
          incorrectEntryText={confirmPasswordError}
          setTextInput={setConfirmPassword}
        />
      </div>
      <div>
        <Button
          buttonText="Continue"
          buttonTextColor="#000000"
          buttonColor="#808080"
          onClick={handleCreateUser}
        />
      </div>
      <div>
        <Button
          buttonText="Continue with Google"
          buttonTextColor="#000000"
          buttonColor="#D3D3D3"
        />
      </div>
      <div className="justify-center flex flex-row">
        <div className="">Have an account?&nbsp;</div>
        <Link href="/login"> Log in</Link>
      </div>
    </div>
  );
};

export default SignupForm;
