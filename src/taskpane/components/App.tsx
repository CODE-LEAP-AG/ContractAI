import * as React from "react";
import { makeStyles, tokens, shorthands } from "@fluentui/react-components";
import { Default as TabList } from "./demo/TabList";

interface AppProps {
  title: string;
}

const useStyles = makeStyles({
  root: {
    ...shorthands.padding("0", "0.5em"),
    minHeight: "100vh",
  },
  title: {
    ...shorthands.padding("5px"),
    textAlign: "start",
    fontWeight: "Bold",
    color: tokens.colorNeutralForeground2BrandPressed,
  },
  tab: {
    ...shorthands.padding("0", "0", "3px", "0"),
  },
});

const App = (props: AppProps) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <h2>{props.title}</h2>
      </div>

      <div className={styles.tab}>
        <TabList />
      </div>
    </div>
  );
};

export default App;
