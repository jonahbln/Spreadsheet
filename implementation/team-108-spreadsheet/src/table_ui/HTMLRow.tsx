import React from "react"
import { Spreadsheet } from "../models/Spreadsheet";
import { Cell } from "../models/Cell";

import "./HTMLRow.css";
import DisplayCell from "./DisplayCell";
import DeleteSliceButton from "./DeleteSliceButton";

interface IRowProps {
    tableModel: Spreadsheet;
    updateTable: () => void;
    rowIndex: number;
    rowCells: Array<Cell>;
    focusCell(newCell: Cell): void;
}

export function HTMLRow(props: IRowProps) {

    const cellArray = props.rowCells.map((cell, colIndex) => (
                
        <DisplayCell colIndex={colIndex} cell={cell} focusCell={props.focusCell}/>
    )); 

    return (
        <tr key={props.rowIndex}>
            <DeleteSliceButton 
                deleteRow={true} 
                label={(props.rowIndex + 1).toString()} 
                index={props.rowIndex} 
                tableModel={props.tableModel}
                updateTable = {props.updateTable}/>
            {cellArray}
        </tr>
    )
}