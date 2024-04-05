import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="border-solid border-0 border-t border-gray-300 ">
      <div className="max-w-screen-xl mx-auto p-6 sm:py-6">
        <div className="flex justify-between">
          <div className="text-left">
            &copy; 2024 Hack4Impact Cornell. All rights reserved.
          </div>
          <div className="text-right">
            <Link className="text-black no-underline hover:underline" href="/">
              Terms of Service
            </Link>{" "}
            &#x2022;{" "}
            <Link className="text-black no-underline hover:underline" href="/">
              Privacy Policy
            </Link>{" "}
            &#x2022;{" "}
            <Link className="text-black no-underline hover:underline" href="/">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
