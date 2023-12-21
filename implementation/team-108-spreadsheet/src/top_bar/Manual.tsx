import React from "react";
import { Dialog, Button, DialogTitle, DialogContent, DialogActions } from "@mui/material";

// import "./Manual.css";

export default function Manual() {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    }
    
    const handleClose = () => {
        setOpen(false);
    };


    // using this site:
    // https://markdowntohtml.com
    return (
        <React.Fragment>
            <Button color="inherit"
            onClick={handleOpen}>
                Manual
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
            
                <DialogTitle id="alert-dialog-title">
                Manual
                </DialogTitle>

                <DialogContent>
                    <div className="manual-text">
                        <ul>
                            <li>To enter a formula, start by typing equals. Ex. "=1+2" will resolve as 3, while "1+2" will resolve as "1+2".</li>
                            <li>Mathematical Operations:
                                <ul>
                                    <li>addition: +,</li>
                                    <li>subtraction: -, </li>
                                    <li>multiplication: *, </li>
                                    <li>division: /,</li>
                                    <li>exponent: ^</li>
                                </ul>
                            </li>

                            <li>Cell Reference: REF(A1)</li>
                            <li>Aggregation Operations: SUM(A1:A3); AVG(A1:A3); STDDEV(A1:A3); ZTEST(A1:A3, x); REG(A1:B3)</li>
                            <li>To submit a formula, press enter after typing your formula. </li>
                            <li>Import from File: Only CSV files are supported. Choose your file, then click the &quot;Upload&quot; button. The cloud indicator to the right of the Upload button will display the current file upload status – if there is an error, the cloud will be crossed out. </li>
                            <li>Row Deletion: Click on the row numbers on the left of the spreadsheet.</li>
                            <li>Column Deletion: Click on the column labels at the top of the spreadsheet. </li>
                        </ul>
                    </div>
                </DialogContent>

                <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>

        </React.Fragment>

        
    )
}