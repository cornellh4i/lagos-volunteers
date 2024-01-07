import React, { ReactElement } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { FormControl, MenuItem, SelectChangeEvent } from "@mui/material";
import Select from "../atoms/Select";
import { TabPanel, TabContext, TabList } from "@mui/lab";

interface TabContainerProps {
  /** A list of tab labels and panels in order of display */
  tabs: { label: string; panel: ReactElement }[];
  /** The element to align to the right of the tab bar */
  left?: React.ReactElement;
  fullWidth?: boolean;
}

const HorizontalTabContainer = ({
  tabs,
  left,
  fullWidth,
}: TabContainerProps) => {
  const [value, setValue] = React.useState("0");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <div className="w-full">
      <TabContext value={value}>
        <Box>
          <div className="flex items-center">
            {left}
            <div className={fullWidth ? "w-full" : "ml-auto min-w-fit"}>
              <TabList
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons={false}
                className="min-h-0"
                sx={{ borderBottom: 1, borderColor: "divider" }}
              >
                {tabs.map((tab, index) => (
                  <Tab
                    key={index}
                    className="normal-case text-xl py-1 min-h-0"
                    disableRipple
                    label={tab.label}
                    value={String(index)}
                  />
                ))}
              </TabList>
            </div>
          </div>
          <div className="h-screen mt-6">
            {tabs.map((tab, index) => (
              <TabPanel key={index} className="p-0 mt-4" value={String(index)}>
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
  left: rightAlignedComponent,
}: TabContainerProps) => {
  const [value, setValue] = React.useState("0");
  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };
  return (
    <div>
      <FormControl fullWidth>
        <div className="grid grid-cols-1 space-y-4">
          {rightAlignedComponent}
          <Select value={value} onChange={handleChange}>
            {tabs.map((tab, index) => (
              <MenuItem key={index} value={String(index)}>{tab.label}</MenuItem>
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
const TabContainer = ({ tabs, left, fullWidth = false }: TabContainerProps) => {
  return (
    <>
      <div className="hidden sm:block">
        <HorizontalTabContainer tabs={tabs} left={left} fullWidth={fullWidth} />
      </div>
      <div className="block sm:hidden">
        <VerticalTabContainer tabs={tabs} left={left} />
      </div>
    </>
  );
};

export default TabContainer;
