import * as React from "react";
import { DismissRegular } from "@fluentui/react-icons";
import { MessageBar, MessageBarActions, MessageBarTitle, MessageBarBody, Button } from "@fluentui/react-components";

export const Introduction = () => (
  <MessageBar>
    <MessageBarBody>
      <MessageBarTitle>Please you enable markup view setting</MessageBarTitle>
      <div>
        Go to <b>Review</b>. In <i>Markup view</i>, choose <b>All markup</b>
      </div>
    </MessageBarBody>
    <MessageBarActions
      containerAction={<Button aria-label="dismiss" appearance="transparent" icon={<DismissRegular />} />}
    ></MessageBarActions>
  </MessageBar>
);
