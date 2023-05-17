import React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { TabPanel, TabContext, TabList } from "@mui/lab";
import { Righteous } from "@next/font/google";

type TabContainerProps = {
  /** A list of tab labels in order */
  labels: string[];
  /** A list of tab panels in order */
  panels: React.ReactElement[];
  /** The element to align to the right of the tab bar */
  rightAlignedComponent?: React.ReactElement;
};

const HorizontalTabContainer = ({
  labels,
  panels,
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
              {labels.map((label, index) => (
                <Tab
                  className="mr-6 p-0 min-w-0 min-h-0 capitalize text-xl"
                  disableRipple
                  label={label}
                  value={String(index)}
                />
              ))}
            </TabList>
            <div className="ml-auto min-w-fit">{rightAlignedComponent}</div>
          </div>
          <div className="h-screen">
            {panels.map((panel, index) => (
              <TabPanel className="p-0 mt-4" value={String(index)}>
                {panel}
              </TabPanel>
            ))}
          </div>
        </Box>
      </TabContext>
    </div>
  );
};

const VerticalTabContainer = ({
  labels,
  panels,
  rightAlignedComponent,
}: TabContainerProps) => {
  const [value, setValue] = React.useState("0");
  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };
  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: "100%" }}>
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
            {labels.map((label, index) => (
              <MenuItem value={String(index)}>{label}</MenuItem>
            ))}
          </Select>
        </div>
      </FormControl>
      <div className="grid h-screen justify-center">
        {" "}
        {panels[Number(value)]}{" "}
      </div>
    </div>
  );
};

/**
 * A TabContainer component appears as a horizontal bar of Tabs in desktop view,
 * and an element can be aligned to the right of the tab bar. The component
 * contains both the tabs and the panels associated with each tab
 */
const TabContainer = ({
  labels,
  panels,
  rightAlignedComponent,
}: TabContainerProps) => {
  const [width, setWidth] = React.useState(window.innerWidth);
  const breakpoint = 420;
  React.useEffect(() => {
    /* Inside of a "useEffect" hook add an event listener that updates
       the "width" state variable when the window size changes */
    window.addEventListener("resize", () => setWidth(window.innerWidth));

    /* passing an empty array as the dependencies of the effect will cause this
       effect to only run when the component mounts, and not each time it updates.
       We only want the listener to be added once */
  }, []);
  const [value, setValue] = React.useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return width > breakpoint ? (
    <HorizontalTabContainer
      labels={labels}
      panels={panels}
      rightAlignedComponent={rightAlignedComponent}
    />
  ) : (
    <VerticalTabContainer
      labels={labels}
      panels={panels}
      rightAlignedComponent={rightAlignedComponent}
    />
  );
};

export default TabContainer;
