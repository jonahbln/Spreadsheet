import React, {  } from "react";
import { Spreadsheet } from "../models/Spreadsheet";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";

import "./TopBar.css";

interface IExportProps {
    tableModel: Spreadsheet;
}

export default function ExportFile(props: IExportProps) {
    const [open, setOpen] = React.useState(false);

    const [filename, setFilename] = React.useState("untitled");

    const handleOpen = () => {
        setOpen(true);
    }
    
    const handleClose = () => {
        setOpen(false);
    };

    function handleExportClicked() {

        let fileData: string = props.tableModel.toString();

        // instantiates backend storage of the file data. this is limited to csv files. 
        let blob: Blob = new Blob([fileData], { type: "text/csv"});

        let url = URL.createObjectURL(blob);

        // creates an invisible link element in order to trigger the download
        let linkElement = document.createElement("a");
        linkElement.href = url;
        linkElement.download = filename;
        document.body.appendChild(linkElement);

        // triggers the download
        linkElement.click();

        handleClose();

        // resets the filename, otherwise it is stored between exports
        setFilename("untitled");
    }

    return (
        <React.Fragment>
            <Button color="inherit"
            onClick={handleOpen}>
                Export
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="export-dialog">
            
                <DialogTitle id="alert-dialog-title">
                Export
                </DialogTitle>

                <DialogContent >
                    <br></br>
                    <TextField id="outlined-basic" label="Filename" variant="outlined"
                        onChange={(e) => setFilename(e.target.value)}
                        style={{width: "40ch"}} />
                </DialogContent>

                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleExportClicked}>Export</Button>
                </DialogActions>
            </Dialog>

        </React.Fragment>

    )

}