import { ISheetAction } from "../../interfaces/ISheetAction";
import { Cell } from "../../models/Cell";
import { Spreadsheet } from "../Spreadsheet";

export class ColumnAction implements ISheetAction {
    private sheet:Spreadsheet;
    private column:Cell[];
    private deletion:boolean;
    private index:number;

    constructor(sheet:Spreadsheet, column:Cell[], deletion:boolean, index:number) {
        this.sheet = sheet;
        this.column = column;
        this.deletion = deletion;
        this.index = index;
    }

    public flip(): ISheetAction {
        if(this.deletion) {
            this.sheet.addColumn(this.column, this.index, false);
        } else {
            this.column = this.sheet.removeColumn(this.index, false);
        }
        return new ColumnAction(this.sheet, this.column, !this.deletion, this.index);
    }
}