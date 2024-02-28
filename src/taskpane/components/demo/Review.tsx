import React from "react";
import { Textarea, makeStyles, shorthands, tokens, Button, Card } from "@fluentui/react-components";
import type { TextareaProps } from "@fluentui/react-components";
import {
  addCommentSelection,
  applyChangeSelection,
  getTrackedAllChanges,
  setDefaultTrackingMode,
  tryCatch,
} from "../../office-document";

import ReviewEditedText from "./ReviewEditedText";

const useStyles = makeStyles({
  reviewContainer: {
    display: "flex",
    flexDirection: "column",
    rowGap: "10px",
    width: "100%",
    ...shorthands.margin("auto"),
  },
  inputText: {
    height: "100px",
    backgroundColor: tokens.colorNeutralBackground4,
    ...shorthands.padding("5px"),
    ...shorthands.borderRadius("10px"),
  },
  fieldWrapper: {
    // ...shorthands.padding(tokens.spacingVerticalMNudge, tokens.spacingHorizontalMNudge),
  },
  buttonWrapper: {
    textAlign: "center",
  },
  editedWrapper: {
    display: "flex",
    ...shorthands.margin("auto"),
  },
  cardRephrasedText: {
    display: "flex",
    flexDirection: "column",
    rowGap: "8px;",
    ...shorthands.padding("0", "10px"),
  },
  showComment: {
    display: "block",
    flexDirection: "column",
    ...shorthands.padding("20px"),
    ...shorthands.borderRadius("10px"),
    backgroundColor: tokens.colorNeutralBackground1Hover,
  },
  collapseComment: {
    display: "flex",
    flexDirection: "column",
  },
});

const Review: React.FC = () => {
  const styles = useStyles();
  const [editTextValue, setEditTextValue] = React.useState<string>("");
  const [rephraseTextValue, setRephraseTextValue] = React.useState<string[]>([]);
  const [isShowPhrasedText, setIsShowPhrasedText] = React.useState(false);

  const onChange: TextareaProps["onChange"] = (_, data) => {
    setEditTextValue(data.value);
  };
  const handlePhraseText = async () => {
    if (!editTextValue) return;
    if (rephraseTextValue.includes(editTextValue)) return;

    const updatedArray = [...rephraseTextValue, editTextValue];
    setRephraseTextValue(updatedArray);
    setIsShowPhrasedText(true);

    await tryCatch(() => setDefaultTrackingMode());
    await tryCatch(() => applyChangeSelection(editTextValue));

    // TODO: add generic comment data
    const result: Word.Interfaces.TrackedChangeCollectionData = await tryCatch(() => getTrackedAllChanges());
    for (const item of result.items) {
      const comment = `I have  <b>${item.type === "None" ? "edited" : item.type}</b> ${item.text}`;
      await tryCatch(() => addCommentSelection(comment));
      console.log(item);
    }
  };

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.fieldWrapper}>
        <Card appearance="subtle">
          <Textarea
            value={editTextValue}
            className={styles.inputText}
            appearance="outline"
            placeholder="Enter a promt here"
            resize="none"
            onChange={onChange}
          />
        </Card>
      </div>

      <div className={styles.buttonWrapper}>
        <Button appearance="primary" onClick={handlePhraseText}>
          Review
        </Button>
      </div>

      <div className={styles.cardRephrasedText}>
        {isShowPhrasedText && rephraseTextValue.length > 0 && <ReviewEditedText editedText={rephraseTextValue} />}
      </div>
    </div>
  );
};

export default Review;
