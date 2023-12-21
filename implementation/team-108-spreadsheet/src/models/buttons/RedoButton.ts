import { BackendButton } from "../../interfaces/BackendButton";
import { Spreadsheet } from "../Spreadsheet";

export class RedoButton implements BackendButton {
    private _label = "Redo";
    private _tableModel: Spreadsheet;


    constructor(tableModel: Spreadsheet) {
        this._tableModel = tableModel;
    }
    
    getLabel(): string {
        return this._label;
    }

    press(): void {
        this._tableModel.redo();
    }
}