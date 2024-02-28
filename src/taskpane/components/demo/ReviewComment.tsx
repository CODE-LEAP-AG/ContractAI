import React from "react";
import { addCommentSelection, tryCatch } from "../../office-document";
import { Button, Card, CardFooter, makeStyles, shorthands, Textarea, tokens } from "@fluentui/react-components";
import useCommonStyles from "../../../CommonStyle";

interface ReviewCommentProps {
  comments: Word.Interfaces.CommentData[];
}

const useStyles = makeStyles({
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

const ReviewComment = (props: ReviewCommentProps) => {
  const styles = useStyles();
  const commonStyles = useCommonStyles();
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
        className={commonStyles.inputText}
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

export default ReviewComment;
