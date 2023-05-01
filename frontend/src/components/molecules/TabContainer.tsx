import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { TabPanel } from "@mui/lab";

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
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="nav tabs">
          {tabs.map((tab, i) => (
            <>
              <LinkTab label={tab} />
              <TabPanel value={i}>{panels[i]}</TabPanel>
            </>
          ))}
        </Tabs>
      </Box>
    </Box>
  );
};

export default TabContainer;
