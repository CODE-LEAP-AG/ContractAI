/* global Word */

/**
 * insert new paragraph
 * @param text
 */
export async function insertText(text: string) {
  await Word.run(async (context) => {
    let body = context.document.body;
    body.insertParagraph(text, Word.InsertLocation.end);

    await context.sync();
  });
}

/**
 * get comments, replies word
 */
export async function getComments(): Promise<Word.Interfaces.CommentCollectionData> {
  let commentList: Word.Interfaces.CommentCollectionData;
  await Word.run(async (context) => {
    const comments = context.document.body.getComments();
    comments.load();
    await context.sync();

    // get replies from comment
    for (const comment of comments.items) {
      const replies = comment.replies;
      replies.load();
    }
    await context.sync();

    return (commentList = comments.toJSON());
  });

  return commentList;
}

/**
 * apply change from selected text
 * @param newText
 */
export async function applyChangeSelection(newText: string) {
  await Word.run(async (context) => {
    const document = context.document;
    const selectedRange = document.getSelection();
    context.load(selectedRange, "text");
    await context.sync();

    selectedRange.insertText(newText, Word.InsertLocation.replace);
  });
}

export async function getCommentsSelection() {
  return await Word.run(async (context) => {
    const selectedComments = context.document.getSelection().getComments();
    selectedComments.load();
    await context.sync();

    return selectedComments.items;
  });
}

export async function addCommentSelection(newComment: string) {
  return await Word.run(async (context) => {
    const comment = context.document.getSelection().insertComment(newComment);
    comment.load("text");
    await context.sync();

    return comment;
  });
}

export async function tryCatch(callback: () => Promise<any>) {
  try {
    return await callback();
  } catch (error) {
    throw new Error(error);
  }
}
