import { BackendButton } from "../../interfaces/BackendButton";
import { Spreadsheet } from "../Spreadsheet";

export class AddRowButton implements BackendButton {

    private _label: string = "Add Row";
    private _tableModel: Spreadsheet;

    constructor (tableModel: Spreadsheet) {
        this._tableModel = tableModel;
    }

    press(): void {
        //console.log("Adding Row");
        this._tableModel.addEmptyRow();
    }

    public getLabel(): string {
        return this._label;
    }
}