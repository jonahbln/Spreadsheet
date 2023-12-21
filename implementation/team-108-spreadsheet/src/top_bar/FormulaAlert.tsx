import React from "react";

import Alert from '@mui/material/Alert';
import { Cell } from "../models/Cell";

import "./TopBar.css";

interface IFormulaAlert {
    currentCell: Cell;
}

export default function FormulaAlert(props: IFormulaAlert) {
    if (props.currentCell.getErrorMessage() === "") {
        return <div>

        </div>
    } else {
        return (
            <div>
                <Alert className="formula-alert" severity="error">{props.currentCell.getErrorMessage()}</Alert>
            </div>
        )
    }
}
