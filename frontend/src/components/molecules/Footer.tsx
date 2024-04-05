import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="border-solid border-0 border-t border-gray-300 text-sm">
      <div className="max-w-screen-xl mx-auto p-6 sm:py-6">
        <div className="flex flex-col gap-4 text-center sm:flex-row sm:justify-between sm:gap-0 sm:text-start">
          <div>&copy; 2024 Hack4Impact Cornell</div>
          <div>
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
