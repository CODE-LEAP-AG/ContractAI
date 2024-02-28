import React, { useEffect } from "react";
import { applyChangeSelection, getCommentsSelection, tryCatch } from "../../office-document";
import { Button, Card, CardFooter, Textarea } from "@fluentui/react-components";
import { Comment16Regular, Delete16Filled, Save16Regular } from "@fluentui/react-icons";
import ReviewComment from "./ReviewComment";

interface ReviewEditedTextProps {
  editedText: string[];
  originalText?: string;
}
const ReviewEditedText = (props: ReviewEditedTextProps) => {
  const { editedText } = props;

  const [listText, setListText] = React.useState<string[]>(editedText);
  const [commentItems, setCommentItems] = React.useState<Word.Interfaces.CommentData[]>([]);
  const applySelectText = async (newText: string) => {
    await tryCatch(() => applyChangeSelection(newText));
  };

  const removeRephraseItem = (index: number): void => {
    const indexItem = editedText.findIndex((_, idx) => index === idx);
    if (indexItem !== -1) {
      editedText.splice(index, 1);
      setListText([...editedText]);
    }
  };

  const getComments = async () => {
    const data = await tryCatch(() => getCommentsSelection());
    setCommentItems(data);
  };

  useEffect(() => {
    if (JSON.stringify(listText) !== JSON.stringify(editedText)) {
      setListText([...editedText]);
    }
  }, [editedText]);

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

          <ReviewComment comments={commentItems} />
        </Card>
      ))}
    </>
  );
};

export default ReviewEditedText;
