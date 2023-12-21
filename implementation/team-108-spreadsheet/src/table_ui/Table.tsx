import React from "react";
import { Spreadsheet } from "../models/Spreadsheet";
import { Cell } from "../models/Cell";
import {HTMLRow} from "./HTMLRow";

import "./Table.css";
import DeleteSliceButton from "./DeleteSliceButton";

interface ITableProps {
    tableModel: Spreadsheet;
    focusCell(newCell: Cell): void;
    focusedCell: Cell;
    updateTable(): void;
}

export function Table(props: ITableProps) {

    let rows = props.tableModel.getCells();

    // from here: https://hasnode.byrayray.dev/how-to-generate-an-alphabet-array-with-javascript
    // generates an array of the alphabet
    let alphabet = [...Array(26)].map((_, i) => String.fromCharCode(i + 65)); 

    // construct row / column labels:
    let rowLabels: Array<number> = [];
    
    for (let i = 1; i < rows.length+1; i++) {
        rowLabels.push(i);
    }

    let colLabels: Array<string> = [""];

    let numCols = rows[0].length;

    for (let k = 0; k < numCols; k++) {
        let currentColLabel = "";

        let digit = k;

        // this recursively adds digits, moving "up" a decimal place each time. 
        while (digit >= 0) {
            currentColLabel = alphabet[digit % 26] + currentColLabel;
            // gets the letter corresponding to the current digit value, then adds it to the current column label.
            // note: this must be added before the current label, 
            // because digits are calculated starting with the most-significant place. 
            digit = Math.floor(digit / 26) - 1;
            // moves down to the next digit of 26 (i.e. the 26's place to the 1's place).
        }

        colLabels.push(currentColLabel);
    }


    const finalColLabels = colLabels.map((label, index) => (
        // here, we set deleteRow to false, since this is for columns.
        
        <DeleteSliceButton 
            deleteRow={false} 
            label={label} 
            index={index} 
            tableModel={props.tableModel}
            updateTable = {props.updateTable}/>
    ))

    const HTMLRows = rows.map((row, index) => (
        <HTMLRow 
            tableModel={props.tableModel}
            rowIndex = {index}
            rowCells={row} 
            focusCell={props.focusCell}
            updateTable={props.updateTable} />
    ));

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        {finalColLabels}
                    </tr>
                </thead>
                <tbody>
                    {HTMLRows}
                </tbody>
            </table>
        </div>
    )
}

export default Table;