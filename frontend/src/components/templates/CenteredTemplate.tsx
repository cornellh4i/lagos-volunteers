import React, { ReactNode } from "react";
import NavBar from "@/components/organisms/NavBar";
import { useAuth } from "@/utils/AuthContext";
import Loading from "../molecules/Loading";
import Footer from "../molecules/Footer";

/** A CenteredTemplate page */
interface CenteredTemplateProps {
  children: ReactNode;
}

const CenteredTemplate = ({ children }: CenteredTemplateProps) => {
  const { loading, isAuthenticated } = useAuth();
  const hideContent = loading || !isAuthenticated;

  return (
    <div className="bg-gradient-to-b from-[#F7F7F2] to-[#EAEFE8]">
      <div className="min-h-screen">
        <NavBar />
        <div className="max-w-2xl mx-auto p-6 sm:py-12">
          {hideContent ? <Loading /> : children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CenteredTemplate;
