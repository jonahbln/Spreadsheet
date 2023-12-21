import { BackendButton } from "../../interfaces/BackendButton";
import { Spreadsheet } from "../Spreadsheet";

export class UndoButton implements BackendButton {
    private _label = "Undo";
    private _tableModel: Spreadsheet;


    constructor(tableModel: Spreadsheet) {
        this._tableModel = tableModel;
    }
    
    getLabel(): string {
        return this._label;
    }


    press(): void {
        this._tableModel.undo();

        this._tableModel.evaluateCells();
    }
}