import React, { useEffect } from "react";
import { Textarea, makeStyles, shorthands, tokens, Button, Card } from "@fluentui/react-components";
import type { TextareaProps } from "@fluentui/react-components";
import { applyChangeSelection, setDefaultTrackingMode, tryCatch } from "../../office-document";

import ReviewEditedText, { ReviewEditedTextProps } from "./ReviewEditedText";

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
  const [count, setCount] = React.useState(0);
  const [editedTextValue, setEditedTextValue] = React.useState<string>("");
  const [rephraseTextValue, setRephraseTextValue] = React.useState<ReviewEditedTextProps[]>([]);
  const [isShowPhrasedText, setIsShowPhrasedText] = React.useState(false);

  const onChange: TextareaProps["onChange"] = (_, data) => {
    setEditedTextValue(data.value);
  };

  const handlePhraseText = async () => {
    if (!editedTextValue) return;

    await tryCatch(() => setDefaultTrackingMode());
    const result: ReviewEditedTextProps = await tryCatch(() => applyChangeSelection(editedTextValue));

    setCount((prevCount) => prevCount + 1);
    setIsShowPhrasedText(true);
    setRephraseTextValue((prevRephraseTextValue) => [
      ...prevRephraseTextValue,
      {
        id: count,
        originalText: result.originalText,
        updatedText: result.updatedText,
      },
    ]);
    setEditedTextValue("");
  };

  const handleRemovePhraseText = (id: number) => {
    const index = rephraseTextValue.findIndex((item) => item.id === id);
    if (index !== -1) {
      rephraseTextValue.splice(index, 1);
    }

    setRephraseTextValue([...rephraseTextValue]);
  };

  useEffect(() => {}, [rephraseTextValue]);

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.fieldWrapper}>
        <Card appearance="subtle">
          <Textarea
            value={editedTextValue}
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
        {isShowPhrasedText &&
          rephraseTextValue.length > 0 &&
          rephraseTextValue.map((item) => (
            <ReviewEditedText
              key={item.id}
              id={item.id}
              originalText={item.originalText}
              updatedText={item.updatedText}
              onRemovePhraseText={(id: number) => handleRemovePhraseText(id)}
            />
          ))}
      </div>
    </div>
  );
};

export default Review;
