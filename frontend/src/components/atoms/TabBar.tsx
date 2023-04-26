import React from "react";

type TabBarProps = {
  /** A list of nav buttons to display in order from left to right */
  navs: { label: string; link: string }[];

  /** The element to align to the right of the tab bar */
  RightAlignedComponent: React.ComponentType;
};

/**
 * A TabBar component appears as a horizontal bar of Tabs in desktop view, and
 * an element can be aligned to the right of the tab bar. In mobile view, the
 * component appears as a navigation dropdown, and there can be an element
 * aligned above the navigation dropdown.
 */
const TabBar = ({ navs, RightAlignedComponent }: TabBarProps) => {
  return <>Hello there</>;
};

export default TabBar;
