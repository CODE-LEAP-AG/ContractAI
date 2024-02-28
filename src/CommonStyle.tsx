import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

const useCommonStyles = makeStyles({
  inputText: {
    height: "100px",
    backgroundColor: tokens.colorNeutralBackground4,
    ...shorthands.padding("5px"),
    ...shorthands.borderRadius("10px"),
  },
});

export default useCommonStyles;
