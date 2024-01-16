import React from "react";
import Card from "../molecules/Card";
import IconText from "../atoms/IconText";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import Button from "../atoms/Button";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

interface EventCardNewProps {}

const EventCardContent = () => {
  return (
    <div>
      <div className="flex flex-row gap-4">
        <div className="text-orange-500 font-semibold">
          <IconText icon={<FiberManualRecordIcon className="text-xs" />}>
            TODAY
          </IconText>
        </div>
        <div>9:00 AM - 12:00 PM</div>
      </div>
      <div className="font-semibold text-2xl my-3">
        Food Bank Network Northeast region
      </div>
      <IconText icon={<FmdGoodIcon className="text-gray-500" />}>
        Plot 2, Lagos Food Bank Building
      </IconText>
      <div className="mt-3" />
      <Button>View Event Details</Button>
    </div>
  );
};

const EventCardNew = () => {
  return (
    <div>
      {/* Mobile view */}
      <div className="block sm:hidden">
        {/* Header */}
        <div className="grid grid-cols-2">
          <div className="font-semibold text-xl">November 15</div>
          <div className="flex items-center justify-end">Wednesday</div>
        </div>

        {/* Divider */}
        <div className="w-full h-0.5 bg-orange-300" />
        <div className="my-5" />

        {/* Event card */}
        <Card>
          <EventCardContent />
        </Card>
      </div>

      {/* Desktop view */}
      <div className="hidden sm:grid grid-cols-12">
        {/* Left header */}
        <div className="col-span-3">
          <div className="font-semibold text-xl">November 15</div>
          <p>Wednesday</p>
        </div>

        {/* Middle divider */}
        <div className="col-span-1 flex justify-center">
          <div className="h-full w-0.5 bg-orange-300" />
        </div>

        {/* Event card */}
        <div className="col-span-8">
          <Card>
            <div className="flex">
              {/* Card left content */}
              <div className="md:max-w-xs">
                <EventCardContent />
              </div>

              {/* Card right image */}
              <div className="flex-1 hidden md:block md:pl-6">
                <div className="relative h-full w-full overflow-auto rounded-2xl">
                  <img
                    className="absolute right-0 h-full rounded-2xl"
                    src="/lfbi_sample_event.jpg"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventCardNew;
