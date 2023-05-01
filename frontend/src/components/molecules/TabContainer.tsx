import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { TabPanel, TabContext, TabList } from "@mui/lab";

type TabContainerProps = {
  /** A list of tab labels in order */
  tabs: string[];
  /** A list of tab panels in order */
  panels: React.ReactElement[];
  /** The element to align to the right of the tab bar */
  rightAlignedComponent?: React.ReactElement;
};

interface LinkTabProps {
  label?: string;
  href?: string;
}

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}
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
  // return <>Hello {panels[0]}</>;
  const [value, setValue] = React.useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList value={value} onChange={handleChange} aria-label="nav tabs">
            <Tab label={tabs[0]} value="1" />
            <Tab label={tabs[1]} value="2" />
            <Tab label={tabs[2]} value="3" />
            {/* {tabs.map((tab, i) => (
              <>
                <Tab label={tab} value={i.toString()} />
              </>
            ))} */}
          </TabList>
          <TabPanel value="1">{panels[0]}</TabPanel>
          <TabPanel value="2">{panels[1]}</TabPanel>
          <TabPanel value="3">{panels[2]}</TabPanel>
        </Box>
        {/* {panels.map((panel, i) => (
          <>
            <TabPanel value={i.toString()}>{panel}</TabPanel>
          </>
        ))} */}
      </TabContext>
    </Box>
  );
};

export default TabContainer;
