import React, {  } from "react";

import {UploadStates} from "./UploadStates";
import BackupIcon from '@mui/icons-material/Backup';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudOffIcon from '@mui/icons-material/CloudOff';

import "../TopBar.css";

interface IUploadIcon {
    uploadState: UploadStates;
}

export default function UploadIcon(props: IUploadIcon) {
    switch (props.uploadState) {
        case UploadStates.notStarted: 
            return (
                <div></div>
            );
        case UploadStates.Started:
            return (
                <BackupIcon className="upload-icon" />
            )
        case UploadStates.Finished:
            return (
                <CloudDoneIcon className="upload-icon" />
            )
        case UploadStates.Error:
            return (
                <CloudOffIcon className="upload-icon" />
            )
        default:
            return (
                <div></div>
            );
    }
}