import React, {  } from "react";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { Spreadsheet } from "../models/Spreadsheet";

interface IDeletePopupProps {
    defaultOpen: boolean;
    index: number;
    deleteRow: boolean;
    tableModel: Spreadsheet;
}

export default function DeletePopup(props: IDeletePopupProps) {
    const [open, setOpen] = React.useState(props.defaultOpen);
    
    const handleClose = () => {
        setOpen(false);
    };

    const performDelete = () => {
        // deleteRow determines what we're deleting – if it's a row or a column. 
        if (props.deleteRow) {
            props.tableModel.removeRow(props.index, true);
        } else {
            props.tableModel.removeColumn(props.index, true);
        }

        handleClose();
    }

    let messageString: string = "Are you sure you want to delete"

    if (props.deleteRow) {
        messageString += " row "
    } else {
        messageString += " column "
    }

    messageString += props.index.toString() + "?";

    return (
        <div>
            <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            {messageString}
            </DialogTitle>
            <DialogActions>
            <Button onClick={handleClose}>No</Button>
            <Button onClick={performDelete} autoFocus>
                Yes
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    )
}

