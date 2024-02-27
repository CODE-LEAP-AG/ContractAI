import React from "react";
import { makeStyles } from "@fluentui/react-components";

// interface ReviewProps {}

const useStyles = makeStyles({
  reviewContainer: {
    display: "flex",
  },
});

const Review: React.FC = () => {
  const styles = useStyles();
  return <div className={styles.reviewContainer}>Review tab</div>;
};

export default Review;
