'use client';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function DeleteFlashcardDialog({ open, onClose, onConfirm, collectionName }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Delete Flashcard Collection</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the collection "{collectionName}"? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}