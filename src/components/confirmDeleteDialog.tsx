import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Silme İşlemi</DialogTitle>
      <DialogContent>
        <p>Bu seyahati silmek istediğinizden emin misiniz?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hayır</Button>
        <Button onClick={onConfirm} color="error">
          Evet
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
