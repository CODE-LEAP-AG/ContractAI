import * as React from "react";
import {
  makeStyles,
  SelectTabData,
  SelectTabEvent,
  Tab,
  TabList,
  TabValue,
  shorthands,
  tokens,
} from "@fluentui/react-components";
import type { TabListProps } from "@fluentui/react-components";

import Review from "./Review";
import Draft from "./Draft";

const useStyles = makeStyles({
  root: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    rowGap: "30px",
  },
  tabList: {
    display: "flex",
    columnGap: "1em",
    backgroundColor: tokens.colorNeutralBackground3,
    width: "100%",
    ...shorthands.borderRadius("5px"),
  },
  tabItem: {
    ...shorthands.padding("10px"),
  },
});

export const Default: React.FC = (props: Partial<TabListProps>) => {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = React.useState<TabValue>("");

  const onTabSelect = (_: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab(data.value);
  };

  return (
    <div className={styles.root}>
      <TabList {...props} className={styles.tabList} onTabSelect={onTabSelect} selectedValue={selectedTab}>
        <Tab id="Review" value="review">
          Review
        </Tab>
        <Tab id="Draft" value="draft">
          Draft
        </Tab>
      </TabList>

      <div className={styles.tabItem}>
        {selectedTab === "review" && <Review />}
        {selectedTab === "draft" && <Draft />}
      </div>
    </div>
  );
};
