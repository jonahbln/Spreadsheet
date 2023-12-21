import React, { useRef, useState } from "react";
import { MenuButton } from "../MenuButton";
import { BackendButton } from "../../interfaces/BackendButton";
import { Spreadsheet } from "../../models/Spreadsheet";
import { Button, Dialog, DialogTitle, DialogActions } from "@mui/material";

import { UploadStates } from './UploadStates';
import UploadIcon from "./UploadIcon";
import "../TopBar.css";

interface IImportProps {
    tableModel: Spreadsheet;
    updateSheet(): void;
}

const maxFileSizeInMB = 8;
const maxFileSizeInBytes: number = (maxFileSizeInMB * 1024);
// 8 MB

export default function ImportFile(props: IImportProps) { 

    // these lines here are so that we can format the import button well. 
    // basically, the import button is actually an HTML input under the hood.
    const fileInput = useRef<HTMLInputElement | null>(null);

    function importFileButtonclick() {
        // need assertion here to prevent error
        fileInput.current!.click();
    }

    // the file might not exist (hasn't been chosen yet), in which case it's null
    const [file, setFile] = useState<File | null>(null);

    // keeps track of our upload state
    const [uploadState, setUploadState] = useState(UploadStates.notStarted);

    const [alertOpen, setAlertOpen] = useState(false);

    function handleClose() {
        setAlertOpen(false);
    }

    function handleUploadClicked() {
        if (file) {
            if (file.size >= maxFileSizeInBytes) {
                setAlertOpen(true);
            } else {
                setAlertOpen(false);

                finishUpload();
            }
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            // tests if the file exists first, then assigns it to the file state variable
            setFile(event.target.files[0]);
        }
    };

    const finishUpload = () => {
        setAlertOpen(false);

        setUploadState(UploadStates.Started)

        if (file) {
            try {
                // console.log("uploading file locally");

                const reader = new FileReader();

                reader.onload = function(progressEvent: ProgressEvent<FileReader>) {
                    
                    // this stores the 
                    const text = progressEvent.target!.result;
        
                    props.tableModel.loadFromString(String(text));

                    props.updateSheet();

                    setUploadState(UploadStates.Finished);
                }

                reader.readAsText(file);   

            } catch(error) {
                setUploadState(UploadStates.Error);

                console.error(error);
            }
        }
    }

    return (
        <React.Fragment>
            <div className="import-bar">
                <Button
                    color="inherit"
                    onClick={importFileButtonclick}>
                    Import
                </Button>
                
                <input 
                type="file" 
                ref={fileInput} 
                accept="text/csv"
                onChange={handleFileChange}
                style={{display: "none"}}/>

                {file && (
                    <div className="disappearing-upload">

                        <Button color="secondary"
                        onClick={handleUploadClicked}>
                            Upload
                        </Button>

                        <UploadIcon uploadState={uploadState}/>

                    </div>
                )}
            </div>

            <Dialog
                open={alertOpen}
                onClose={handleClose}
                maxWidth="sm"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="export-dialog">
            
                <DialogTitle id="alert-dialog-title">
                Warning: File Exceeds {maxFileSizeInMB} MB. Do you want to continue?
                </DialogTitle>

                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={finishUpload}>Continue</Button>
                </DialogActions>
            </Dialog>
            
        </React.Fragment>
    )
}