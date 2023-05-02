import React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import DropdownSelect from "../atoms/DropdownSelect";
import { TabPanel, TabContext, TabList } from "@mui/lab";

type TabContainerProps = {
  /** A list of tab labels in order */
  tabs: string[];
  /** A list of tab panels in order */
  panels: React.ReactElement[];
  /** The element to align to the right of the tab bar */
  rightAlignedComponent?: React.ReactElement;
};

/**
 * A TabContainer component appears as a horizontal bar of Tabs in desktop view,
 * and an element can be aligned to the right of the tab bar. The component
 * contains both the tabs and the panels associated with each tab
 */
const TabContainer = ({
  tabs,
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
    <Box sx={{ width: "100%", height: "100%", gap: 2, margin: 2 }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <div className="grid grid-cols-5">
            <div className="col-start-1 col-end-5">
              <TabList
                value={value}
                onChange={handleChange}
                aria-label="nav tabs"
              >
                <Tab label={tabs[0]} value="1" />
                <Tab label={tabs[1]} value="2" />
                <Tab label={tabs[2]} value="3" />
              </TabList>
            </div>

            <div className="col-start-5">{rightAlignedComponent}</div>
          </div>
          <div className="grid h-screen justify-center">
            <TabPanel value="1">{panels[0]}</TabPanel>
            <TabPanel value="2">{panels[1]}</TabPanel>
            <TabPanel value="3">{panels[2]}</TabPanel>
          </div>
        </Box>
      </TabContext>
    </Box>
  ) : (
    <DropdownSelect
      tabs={tabs}
      panels={panels}
      topAlignedComponent={rightAlignedComponent}
    />
  );
};

export default TabContainer;
