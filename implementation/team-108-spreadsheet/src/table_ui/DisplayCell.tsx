import { Cell } from "../models/Cell";
import React, {  } from "react";

import "./Table.css";

interface ICellProps {
    colIndex: number;
    cell: Cell;
    focusCell(newCell: Cell): void; 
}

export default function DisplayCell(props: ICellProps) {

    function onCellClicked() {
        props.focusCell(props.cell);
    }

    let formattedID = "cell" + props.colIndex;
    
    // this is separate – adding multiple classes didn't work.
    // this checks if the cell to be displayed is currently selected at the higher-level.
    if (props.cell.getSelectedStatus()) {
        return (
            <td className="default-cell" key={props.colIndex}>
                <input className='highlighted-formulaButton' id={formattedID} type="button"
                value= {props.cell.getValue()}
                onClick={onCellClicked}>
                </input>
            </td>
        )
    } else {
        return (
            <td className="default-cell" key={props.colIndex}>
                <input className={`formulaButton`} id={formattedID} type="button"
                value= {props.cell.getValue()}
                onClick={onCellClicked}>
                </input>
            </td>
        )
    }
}