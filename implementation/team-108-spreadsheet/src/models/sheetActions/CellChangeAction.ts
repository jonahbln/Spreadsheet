import { ISheetAction } from "../../interfaces/ISheetAction";
import { Cell } from "../../models/Cell";

export class CellChangeAction implements ISheetAction {
    private previous:string;
    private next:string;
    private cell:Cell

    constructor(cell:Cell, next:string, previous:string) {
        this.previous = previous;
        this.next = next;
        this.cell = cell;
    }

    public flip(): ISheetAction {
        this.cell.setformula(this.previous);
        this.cell.updateCell();
        return new CellChangeAction(this.cell, this.previous, this.next);
    }
}