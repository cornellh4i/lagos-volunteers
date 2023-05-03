import React from "react";
import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import SignupForm from "@/components/molecules/SignupForm";
import IconText from '@/components/atoms/IconText'; 
import AcUnitIcon from '@mui/icons-material/AcUnit';

/** A Signup page */
const Signup = () => {
  return (
    <>
      <WelcomeTemplate Form={SignupForm} />
      <IconText icon={<div>"hello"</div>} text={"hello"}/>
    </>
  );
};

export default Signup;
