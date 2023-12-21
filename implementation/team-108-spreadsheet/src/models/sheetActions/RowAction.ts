import { ISheetAction } from "../../interfaces/ISheetAction";
import { Cell } from "../../models/Cell";
import { Spreadsheet } from "../Spreadsheet";

export class RowAction implements ISheetAction {
    private sheet:Spreadsheet;
    private row:Cell[];
    private del:boolean;
    private index:number;

    constructor(sheet:Spreadsheet, row:Cell[], del:boolean, index:number) {
        this.sheet = sheet;
        this.row = row;
        this.del = del;
        this.index = index;
    }

    public flip(): ISheetAction {
        if(this.del) {
            this.sheet.addRow(this.row, this.index, false);
        } else {
            this.row = this.sheet.removeRow(this.index, false);
        }
        return new RowAction(this.sheet, this.row, !this.del, this.index);
    }
}