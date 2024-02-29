import React from "react";
import { applyChangeSelection, getCommentsSelection, tryCatch } from "../../office-document";
import { Button, Card, CardFooter, CardHeader, Textarea, Tooltip } from "@fluentui/react-components";
import { Comment16Regular, Delete16Regular, Save16Regular } from "@fluentui/react-icons";
import ReviewComment from "./ReviewComment";

export interface ReviewEditedTextProps {
  id: number;
  updatedText: string;
  originalText: string;
  onRemovePhraseText?: (id: number) => void;
}
const ReviewEditedText = (props: ReviewEditedTextProps) => {
  const { updatedText, originalText, id, onRemovePhraseText } = props;
  const [commentItems, setCommentItems] = React.useState<Word.Interfaces.CommentData[]>([]);

  const applySelectText = async (newText: string) => {
    await tryCatch(() => applyChangeSelection(newText));
  };

  const removePhraseText = (id: number) => {
    onRemovePhraseText(id);
  };

  const getComments = async () => {
    const data = await tryCatch(() => getCommentsSelection());
    setCommentItems(data);
  };

  return (
    <Card
      appearance="filled-alternative"
      floatingAction={
        <Tooltip content="Delete changed" relationship="label">
          <Button icon={<Delete16Regular />} onClick={() => removePhraseText(id)} />
        </Tooltip>
      }
    >
      <CardHeader title={`Edit ${originalText}`} />
      <Textarea value={originalText} appearance="filled-lighter" resize="vertical" />
      <Textarea value={updatedText} appearance="filled-darker" resize="vertical" />

      <CardFooter>
        <Button appearance="primary" icon={<Save16Regular />} onClick={() => applySelectText(updatedText)}>
          Apply
        </Button>
        {/*<Button appearance="transparent" icon={<Comment16Regular />} onClick={getComments}>*/}
        {/*  Comments*/}
        {/*</Button>*/}
      </CardFooter>

      {/*<ReviewComment comments={commentItems} />*/}
    </Card>
  );
};

export default ReviewEditedText;
