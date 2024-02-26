import * as React from "react";
import { getComments, tryCatch } from "../office-document";
import useEffectDataFetcher from "../hooks/useEffectDataFetcher";
import { makeStyles, Button } from "@fluentui/react-components";
import { Comment16Regular } from "@fluentui/react-icons";

interface CommentListProps {
  comments: Word.Interfaces.CommentData[];
}

const useStyles = makeStyles({
  commentList: {
    paddingTop: "10px",
    paddingBottom: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
  innerWrapper: {
    alignItems: "center",
    columnGap: "15px",
    display: "flex",
  },
});

const CommentList: React.FC = () => {
  const styles = useStyles();
  const data = useEffectDataFetcher(getComments) as Word.Interfaces.CommentCollectionData;

  const handleGetComments = async () => {
    console.log(await tryCatch(getComments));
  };

  return (
    <div className={styles.commentList}>
      <div className={styles.innerWrapper}>
        <Button size="large" icon={<Comment16Regular />} onClick={handleGetComments}>
          Get comment
        </Button>
      </div>
      {data.items ? <Comments comments={data.items} /> : []}
    </div>
  );
};

const Comments = (props: CommentListProps) => {
  const { comments } = props;
  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment.id}>
          <span>{comment?.content}</span>
          <p>{comment?.authorName}</p>
          <div>
            {comment.replies.map((reply) => (
              <div key={reply.id}>{reply.content}</div>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
