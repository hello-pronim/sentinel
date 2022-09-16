import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import ShowMoreText from "react-show-more-text";
import {
  Alert as MuiAlert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider as MuiDivider,
  Grid,
  Slide,
  Snackbar,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { grey } from "@mui/material/colors";

import CommentEditor from "../../../../components/commentEditor";
import { addSellerNote, getSellerNotes } from "../../../../services/MAPService";
import { convertDateToFormattedDateString } from "../../../../utils/functions";

const CommentText = styled.div`
  > p {
    padding: 0;
    margin: 0;
  }
`;
const CommentWrapper = styled.div`
  width: 100%;
  height: 320px;
  padding: 0 20px;
  overflow-y: scroll;
`;
const Divider = styled(MuiDivider)(spacing);

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SellerNotesDlg = ({ open, selectedMAPData, handleClose }) => {
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [notes, setNotes] = useState([]);
  const [postingNotes, setPostingNotes] = useState(false);

  useEffect(() => {
    if (open && selectedMAPData !== null) {
      setLoadingNotes(true);
      getSellerNotes(selectedMAPData.sellerId).then((res) => {
        const {
          data: {
            body: { data: _notes },
          },
        } = res;

        setLoadingNotes(false);
        setNotes(_notes);
      });
    }
  }, [open, selectedMAPData]);

  const handleCommentPost = (newComment) => {
    const newNotes = [...notes];

    newNotes.push({
      comment: newComment,
      created_at: new Date(),
    });

    setPostingNotes(true);
    addSellerNote(selectedMAPData.sellerId, newComment).then((res) => {
      setPostingNotes(false);
      setNotes([...newNotes]);
    });
  };

  const handleAlertClose = () => {
    setPostingNotes(false);
  };

  const handleShowMoreClicked = (isExpanded) => {
    console.log(isExpanded);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        maxWidth="sm"
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-describedby="comment-dialog-description"
        fullWidth
        keepMounted
      >
        <DialogTitle>{selectedMAPData?.seller} Notes</DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText id="comment-dialog-description"></DialogContentText>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <CommentEditor handleCommentPost={handleCommentPost} />
            </Grid>
            <Grid item xs={12}>
              <Divider>Notes</Divider>
            </Grid>
            <Grid item xs={12}>
              {!loadingNotes ? (
                <CommentWrapper>
                  <Grid container spacing={3}>
                    {[...notes].reverse().map((item, index) => (
                      <Grid key={index} item xs={12}>
                        <Grid
                          key={index}
                          container
                          justifyContent="space-between"
                        >
                          <Grid item xs={9}>
                            <ShowMoreText
                              lines={2}
                              more="More"
                              less="Less"
                              onClick={handleShowMoreClicked}
                              expanded={false}
                              truncatedEndingComponent={"... "}
                            >
                              <CommentText
                                dangerouslySetInnerHTML={{
                                  __html: item.comment,
                                }}
                              />
                            </ShowMoreText>
                          </Grid>
                          <Grid item xs={3}>
                            <Grid container justifyContent="flex-end">
                              <Typography
                                variant="caption"
                                sx={{ color: grey[700] }}
                              >
                                {convertDateToFormattedDateString(
                                  new Date(item.created_at),
                                  false
                                )}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                </CommentWrapper>
              ) : (
                <Grid container justifyContent="center">
                  <Grid item>
                    <CircularProgress />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={postingNotes}
        onClose={handleAlertClose}
      >
        <Alert icon={<></>} onClose={handleAlertClose} severity="success">
          Posting your notes, please wait...
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default SellerNotesDlg;
