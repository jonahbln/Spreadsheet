import React from "react";
import { Spreadsheet } from "../models/Spreadsheet";

import "./HTMLRow.css";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

interface IDeleteSliceButton {
    tableModel: Spreadsheet;
    label: string;
    deleteRow: boolean;
    index: number;
    updateTable(): void;
}

export default function DeleteSliceButton(props: IDeleteSliceButton) {

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    }
    
    const handleClose = () => {
        setOpen(false);
    };

    const performDelete = () => {
        // check if the label is empty – if so, it's not a valid column to delete from. 
        if (props.label !== "") {
            // deleteRow determines what we're deleting – if it's a row or a column. 
            if (props.deleteRow) {
                props.tableModel.removeRow(props.index - 1, true);
            } else {
                props.tableModel.removeColumn(props.index - 1, true);
            }

            props.updateTable();
            handleClose();
        }
    }

    let messageString: string = "Are you sure you want to delete"

    if (props.deleteRow) {
        messageString += " row "
        messageString += (props.index + 1).toString() + "?";
    } else {
        messageString += " column "
        messageString += (props.index).toString() + "?";
    }


    const basicButton = (
        <input className={`formulaButton`} type="button"
            value= {props.label}
            onClick={handleOpen}>
            </input>
    )

    return (
        <td>
            <React.Fragment>
                {basicButton}

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

            </React.Fragment>
        </td>
    )
}
