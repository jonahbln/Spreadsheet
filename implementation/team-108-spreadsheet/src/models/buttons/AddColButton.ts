import { BackendButton } from "../../interfaces/BackendButton";
import { Spreadsheet } from "../Spreadsheet";

export class AddColButton implements BackendButton {

    private _label: string = "Add Columns";

    private _tableModel: Spreadsheet;

    constructor (tableModel: Spreadsheet) {
        this._tableModel = tableModel;
    }

    press(): void {
        this._tableModel.addEmptyColumn();
    }

    public getLabel(): string {
        return this._label;
    }
}