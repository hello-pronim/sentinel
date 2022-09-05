import React, { useState, useRef } from "react";
import MUIRichTextEditor from "mui-rte";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import Picker from "emoji-picker-react";
import { draftToMarkdown } from "markdown-draft-js";
import styled from "styled-components/macro";
import { Button, Grid } from "@mui/material";
import {
  createTheme as createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";

const RichTextEditorWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const defaultTheme = createMuiTheme();

Object.assign(defaultTheme, {
  overrides: {
    MUIRichTextEditor: {
      root: {
        width: "100%",
        border: "1px solid grey",
        borderRadius: 4,
      },
      editor: {
        display: "block",
        maxHeight: 96,
        padding: "0 13px",
        marginTop: 2,
        marginBottom: 15,
        overflow: "auto",
      },
      container: {
        display: "flex",
        flexDirection: "column",
        margin: 0,
      },
      toolbar: {
        display: "block",
        order: 2,
        position: "relative",
        borderTop: "1px solid lightgrey",
      },
      placeHolder: {
        position: "relative",
        padding: 13,
      },
      editorContainer: {
        padding: "13px 0",
        margin: 0,
        fontSize: 13,
      },
    },
  },
});

const emptyContent = JSON.stringify(
  convertToRaw(EditorState.createEmpty().getCurrentContent())
);

const CommentEditor = ({ handleCommentPost }) => {
  const [comment, setComment] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [tempEditor, setTempEditor] = useState(emptyContent);
  const [initial, setInitial] = useState(emptyContent);
  const [cursorPosition, setCursorPosition] = useState(0);
  const commentEditorRef = useRef(null);

  const handleCommentChanged = (data) => {
    setInitial(data);
    setCursorPosition(data.getSelection().getAnchorOffset());

    let cmt = draftToMarkdown(convertToRaw(data.getCurrentContent()));
    setComment(cmt);
  };

  const onEmojiClick = (event, emojiObject) => {
    const prev = initial;
    const prevText = draftToMarkdown(convertToRaw(prev.getCurrentContent()));
    const arrayText1 = prevText.slice(0, cursorPosition);
    const arrayText2 = prevText.slice(cursorPosition);

    const newText = arrayText1 + emojiObject.emoji + arrayText2;
    const newContent = ContentState.createFromText(newText);
    const newEditor = EditorState.createWithContent(newContent);

    setInitial(newEditor);
    setTempEditor(JSON.stringify(convertToRaw(newContent)));
    setComment((prevInput) => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };

  const handleCommentSave = () => {
    handleCommentPost(stateToHTML(initial.getCurrentContent()));

    //reset the editor to be empty
    const emptyContent = ContentState.createFromText("");
    const emptyEditor = EditorState.createWithContent(emptyContent);

    setComment("");
    setCursorPosition(0);
    setInitial(emptyEditor);
    setTempEditor(JSON.stringify(convertToRaw(emptyContent)));
  };

  return (
    <MuiThemeProvider theme={defaultTheme}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <RichTextEditorWrapper>
            <MUIRichTextEditor
              label="Leave a comment..."
              inlineToolbar={true}
              ref={commentEditorRef}
              controls={[
                "bold",
                "italic",
                "underline",
                "strikethrough",
                "link",
                "emoji",
              ]}
              customControls={[
                {
                  name: "emoji",
                  icon: <InsertEmoticonIcon />,
                  type: "callback",
                  onClick: (editorState, name, anchor) => {
                    setShowPicker((val) => !val);
                  },
                },
              ]}
              value={tempEditor}
              onChange={(data) => handleCommentChanged(data)}
            />
            {showPicker && (
              <Picker
                pickerStyle={{
                  width: "100%",
                  position: "absolute",
                  zIndex: 10,
                }}
                onEmojiClick={onEmojiClick}
              />
            )}
          </RichTextEditorWrapper>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCommentSave}
                disabled={!comment.length}
              >
                POST
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MuiThemeProvider>
  );
};

export default CommentEditor;
