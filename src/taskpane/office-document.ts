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
  return await Word.run(async (context) => {
    const document = context.document;
    const selectedRange = document.getSelection();
    context.load(selectedRange, "text");
    await context.sync();

    // Insert Revised text with format
    selectedRange.insertText(newText, Word.InsertLocation.replace);
    selectedRange.font.set({
      underline: "Single",
      color: "green",
      highlightColor: "lightGrey",
    });

    const trackedList = selectedRange.getTrackedChanges();
    trackedList.load();
    await context.sync();

    trackedList.toJSON().items.forEach((item) => {
      const strText = `I have  ${item.type === "None" ? "edited" : item.type} ${item.text}`;
      selectedRange.insertComment(strText);
    });

    return {
      originalText: selectedRange.text,
      updatedText: newText,
    };
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

export async function setDefaultTrackingMode() {
  await Word.run(async (context) => {
    context.document.changeTrackingMode = Word.ChangeTrackingMode.trackMineOnly;

    await context.sync();

    getChangeTrackingMode();
  });
}

export async function getTrackedAllChanges() {
  return await Word.run(async (context) => {
    const body = context.document.body;
    const trackedChanges = body.getTrackedChanges();
    trackedChanges.load();
    await context.sync();

    return trackedChanges.toJSON();
  });
}

async function getChangeTrackingMode() {
  // Gets the current change tracking mode.
  await Word.run(async (context) => {
    const document = context.document;
    document.load("changeTrackingMode");
    await context.sync();

    if (document.changeTrackingMode === Word.ChangeTrackingMode.trackMineOnly) {
      console.log("Only my changes are being tracked.");
    } else if (document.changeTrackingMode === Word.ChangeTrackingMode.trackAll) {
      console.log("Everyone's changes are being tracked.");
    } else {
      console.log("No changes are being tracked.");
    }
  });
}

export async function tryCatch(callback: () => Promise<any>) {
  try {
    return await callback();
  } catch (error) {
    throw new Error(error);
  }
}
