import { BackendButton } from "../../interfaces/BackendButton";
import { Spreadsheet } from "../Spreadsheet";
import { Cell } from "../Cell";

export class NewSpreadsheetButton implements BackendButton {

    private _label: string = "New Spreadsheet";

    private _tableModel: Spreadsheet;

    constructor (tableModel: Spreadsheet) {
        this._tableModel = tableModel;
    }

    press(): void {
        
        // these both remove the 0-th row and column, since it will basically shift it all down. 
        // note – we leave one cell remaining, because otherwise, it would break the formula referencing. 
        let numRows: number = this._tableModel.getNumRows();
        let numCols: number = this._tableModel.getNumColumns();


        if (numRows > 0) {
            for (let r: number = 1; r < numRows; r++) {
                this._tableModel.removeRow(0, true);
            }
        }

        if (numCols > 0) {
            for (let c: number = 1; c < numCols; c++) {
                this._tableModel.removeColumn(0, true);
            }
        }

        this._tableModel.getCells()[0][0] = new Cell("", this._tableModel);

        // add new empty rows/columns to return it to the intial size of 26x26
        for(let i: number = 0; i < 25; i++) {
            this._tableModel.addEmptyColumn();
            this._tableModel.addEmptyRow();
        }

        this._tableModel.clearActions();
        this._tableModel.clearReactions();
    }

    public getLabel(): string {
        return this._label;
    }
}