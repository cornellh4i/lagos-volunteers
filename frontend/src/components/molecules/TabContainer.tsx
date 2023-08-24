import React, { ReactElement } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { TabPanel, TabContext, TabList } from "@mui/lab";

interface TabContainerProps {
  /** A list of tab labels and panels in order of display */
  tabs: { label: string; panel: ReactElement }[];
  /** The element to align to the right of the tab bar */
  rightAlignedComponent?: React.ReactElement;
}

const HorizontalTabContainer = ({
  tabs,
  rightAlignedComponent,
}: TabContainerProps) => {
  const [value, setValue] = React.useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <div className="w-full">
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <div className="flex items-center">
            <TabList
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons={false}
              aria-label="nav tabs"
              className="min-h-0"
            >
              {tabs.map((tab, index) => (
                <Tab
                  className="mr-6 p-0 min-w-0 min-h-0 capitalize text-xl"
                  disableRipple
                  label={tab.label}
                  value={String(index)}
                />
              ))}
            </TabList>
            <div className="ml-auto min-w-fit">{rightAlignedComponent}</div>
          </div>
          <div className="h-screen">
            {tabs.map((tab, index) => (
              <TabPanel className="p-0 mt-4" value={String(index)}>
                {tab.panel}
              </TabPanel>
            ))}
          </div>
        </Box>
      </TabContext>
    </div>
  );
};

const VerticalTabContainer = ({
  tabs,
  rightAlignedComponent,
}: TabContainerProps) => {
  const [value, setValue] = React.useState("0");
  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };
  return (
    <div>
      <FormControl variant="standard" sx={{ minWidth: "100%" }}>
        <div className="grid grid-cols-1 space-y-4">
          {rightAlignedComponent}
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={value}
            onChange={handleChange}
            label="Select"
            autoWidth
            MenuProps={{
              MenuListProps: {
                sx: {
                  padding: 0,
                  borderRadius: 2,
                },
              },
              PaperProps: {
                elevation: 4,
                sx: {
                  borderRadius: 2,
                },
              },
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "right",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            }}
          >
            {tabs.map((tab, index) => (
              <MenuItem value={String(index)}>{tab.label}</MenuItem>
            ))}
          </Select>
        </div>
      </FormControl>
      <div className="mt-4">{tabs[Number(value)].panel}</div>
    </div>
  );
};

/**
 * A TabContainer component appears as a horizontal bar of Tabs in desktop view,
 * and an element can be aligned to the right of the tab bar. The component
 * contains both the tabs and the panels associated with each tab
 */
const TabContainer = ({ tabs, rightAlignedComponent }: TabContainerProps) => {
  return (
    <>
      <div className="hidden sm:block">
        <HorizontalTabContainer
          tabs={tabs}
          rightAlignedComponent={rightAlignedComponent}
        />
      </div>
      <div className="block sm:hidden">
        <VerticalTabContainer
          tabs={tabs}
          rightAlignedComponent={rightAlignedComponent}
        />
      </div>
    </>
  );
};

export default TabContainer;
