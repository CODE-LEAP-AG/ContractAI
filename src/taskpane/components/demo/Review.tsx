import React, { useEffect } from "react";
import { Textarea, makeStyles, shorthands, tokens, Button, Card, CardFooter } from "@fluentui/react-components";
import type { TextareaProps } from "@fluentui/react-components";
import { addCommentSelection, applyChangeSelection, getCommentsSelection, tryCatch } from "../../office-document";
import { Comment16Regular, Save16Regular, Delete16Filled } from "@fluentui/react-icons";

interface PhrasedProps {
  rephraseText: string[];
  originalText?: string;
}

interface ReviewCommentProps {
  comments: Word.Interfaces.CommentData[];
}

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
  const handlePhraseText = () => {
    if (!editTextValue) return;
    if (rephraseTextValue.includes(editTextValue)) return;

    const updatedArray = [...rephraseTextValue, editTextValue];
    setRephraseTextValue(updatedArray);
    setIsShowPhrasedText(true);
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
        {isShowPhrasedText && rephraseTextValue.length > 0 && <PhrasedListText rephraseText={rephraseTextValue} />}
      </div>
    </div>
  );
};

const PhrasedListText = (props: PhrasedProps) => {
  const { rephraseText } = props;

  const [listText, setListText] = React.useState<string[]>(rephraseText);
  const [commentItems, setCommentItems] = React.useState<Word.Interfaces.CommentData[]>([]);
  const applySelectText = async (newText: string) => {
    await tryCatch(() => applyChangeSelection(newText));
  };

  const removeRephraseItem = (index: number): void => {
    const indexItem = rephraseText.findIndex((_, idx) => index === idx);
    if (indexItem !== -1) {
      rephraseText.splice(index, 1);
      setListText([...rephraseText]);
    }
  };

  const getComments = async () => {
    const data = await tryCatch(() => getCommentsSelection());
    setCommentItems(data);
  };

  useEffect(() => {
    if (JSON.stringify(listText) !== JSON.stringify(rephraseText)) {
      setListText([...rephraseText]);
    }
  }, [rephraseText]);

  return (
    <>
      {listText.map((rephrase: string, i: number) => (
        <Card key={i} appearance="filled-alternative">
          <Textarea value={rephrase} appearance="filled-lighter-shadow" resize="vertical" />
          <CardFooter>
            <Button appearance="primary" icon={<Save16Regular />} onClick={() => applySelectText(rephrase)}>
              Apply
            </Button>
            <Button appearance="subtle" icon={<Delete16Filled />} onClick={() => removeRephraseItem(i)}>
              Cancel
            </Button>
            <Button appearance="transparent" icon={<Comment16Regular />} onClick={getComments}>
              Comments
            </Button>
          </CardFooter>
          <ShowComments comments={commentItems} />
        </Card>
      ))}
    </>
  );
};

const ShowComments = (props: ReviewCommentProps) => {
  const styles = useStyles();
  const { comments } = props;
  const [commentValue, setCommentValue] = React.useState<string>("");

  const handleAddComment = async () => {
    const data = await tryCatch(() => addCommentSelection(commentValue));
    comments.push(data);
  };

  return (
    <Card>
      {comments.length > 0 ? (
        <ul className={styles.showComment}>
          {comments.map((item) => (
            <li key={item.id}>{item.content}</li>
          ))}
        </ul>
      ) : (
        <></>
      )}

      <Textarea
        value={commentValue}
        className={styles.inputText}
        appearance="outline"
        placeholder="Add comment here"
        resize="none"
        onChange={(_, data) => setCommentValue(data.value)}
      />
      <CardFooter>
        <Button type="button" onClick={handleAddComment}>
          Add
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Review;
