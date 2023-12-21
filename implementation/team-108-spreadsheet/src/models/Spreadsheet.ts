import { ISheetAction } from "../interfaces/ISheetAction";
import { Cell } from "./Cell";
import { RowAction } from "./sheetActions/RowAction";
import { ColumnAction } from "./sheetActions/ColumnAction";

export class Spreadsheet {
    private cells: Cell[][];
    private numRows: number;
    private numColumns: number;

    // stacks that will keep track of actions that can be undone or redone
    private actionStack: ISheetAction[];
    private reactionStack: ISheetAction[];
    

    constructor(numRows: number, numColumns: number) {
        this.cells = new Array<Array<Cell>>();
        this.actionStack = [];
        this.reactionStack = [];
        this.numRows = 0;
        this.numColumns = 0;

        for(let i: number = 0; i < numRows; i++) {
            this.addEmptyRow();
        }
        for(let j: number = 0; j < numColumns; j++) {
            this.addEmptyColumn();
        }
        this.actionStack = [];
        this.reactionStack = [];
    }

    // return the index'th row in the spreadsheet
    public getRow(index: number): Cell[] {
        return this.cells[index];
    }

    // return the index'th column in the spreadsheet by pulling the index'th element from every row
    public getColumn(index: number): Cell[] {
        let col: Array<Cell> = new Array<Cell>();
        for(let i: number = 0; i < this.cells.length; i++) {
            col.push(this.cells[i][index]);
        }
        return col;
    }

    // return the underlying 2d array of cells
    public getCells(): Cell[][] {
        return this.cells;
    }

    // return the number of rows, or length, of the spreadsheet
    public getNumRows(): number {
        return this.numRows;
    }

    // return the number of columns, or width, of the spreadsheet
    public getNumColumns(): number {
        return this.numColumns;
    }

    // add an empty row to the spreadsheet
    public addEmptyRow(): void {
        let emptyRow: Array<Cell> = new Array<Cell>();
        for (let i: number = 0; i < this.getNumColumns(); i++) {
            emptyRow.push(new Cell("", this));
        }
        this.addRow(emptyRow, this.getNumRows(), true);
    }

    // add an empty column to the spreadsheet
    public addEmptyColumn(): void {
        let emptyCol: Array<Cell> = new Array<Cell>();
        for (let i: number = 0; i < this.getNumRows(); i++) {
            emptyCol.push(new Cell("", this));
        }
        this.addColumn(emptyCol, this.getNumColumns(), true);
    }

    // add a supplied row to the spreadsheet
    public addRow(newRow: Array<Cell>, index:number, direct:boolean): void {
        // add empty columns to make sure that the exisitng rows are resized to fit the length of the new row
        while(newRow.length > this.numColumns) {
            this.addEmptyColumn();
        }

        // add one to the number of rows
        this.numRows++;
        // push the new row
        this.cells.splice(index, 0, newRow);
        if(direct) {
            this.pushAction(new RowAction(this, newRow, false, index));
        }
    }

    // add a supplied column to the spreadsheet
    public addColumn(newColumn: Array<Cell>, index:number, direct:boolean): void {
        // add empty rows to make sure that the exisitng columns are resized to fit the length of the new columns
        while(newColumn.length > this.numRows) {
            this.addEmptyRow();
        }

        for(let i: number = 0; i < this.cells.length; i++) {
            // for each row, appen the next cell fom the given newColumn
            this.cells[i].splice(index, 0, newColumn[i]);

        }

        // add one to the number of columns
        this.numColumns++;
        if(direct) {
            this.pushAction(new ColumnAction(this, newColumn, false, index));
        }
    }

    // remove the row at the given rowIndex (zero-indexed) from this spreadsheet
    public removeRow(rowIndex: number, direct:boolean): Cell[] {
        //remove the row at row index and store it in the action buffer
        let slice: Cell[] = this.cells.splice(rowIndex, 1)[0];
        this.numRows--;
        if(direct){
            this.pushAction(new RowAction(this, slice, true, rowIndex));
        }
        // return the removed row
        return slice;
    }

    // remove the column at the given columnIndex (zero-indexed) from this spreadsheet
    public removeColumn(columnIndex: number, direct:boolean): Cell[] {

        let slice: Cell[] = [];
        // repeat for each row in this.cells
        for(let i: number = 0; i < this.cells.length; i++) {
            //remove the value at column index
            slice.push(this.cells[i].splice(columnIndex, 1)[0]);
        }

        // subtract from the number of columns
        this.numColumns--;
        if(direct){
            this.pushAction(new ColumnAction(this, slice, true, columnIndex));
        }
        return slice;
    }

    public loadFromString(inputString: string): void {
        // reset the spreadsheet so new data can be written
        this.cells = new Array<Array<Cell>>();
        this.numColumns = 0;
        this.numRows = 0;

        // initialize temporary variables that will be used to iteratively build the spreadsheet
        let currentRow: Array<Cell> = new Array<Cell>();
        let currentChunk: string = '';
        let currentChar: string = '';

        // for debugging purposes
        // console.log("loading from string: string lengh:", inputString.length);

        // iterate through the filedata and parse the data into cells within this spreadsheet
        for(let i: number = 0; i < inputString.length; i++) {
            currentChar = inputString.charAt(i); // pull the next character from the file data
            
            if(currentChar === ',') { // if the character is a comma, then push the previous chunk into the current row
                currentRow.push(new Cell(currentChunk, this));
                currentChunk = '';

            } else if(currentChar === '\n') { // if the character is a newline, then push the current row into this spreadsheet
                currentRow.push(new Cell(currentChunk, this));
                currentChunk = '';

                this.addRow(currentRow, this.cells.length, true);
                currentRow = new Array<Cell>();

            } else {  // if the character is anything else, push it to the current chunk
                if (currentChar === "-") {
                    // for some reason, we need to include this for input sanitization
                    //console.log("sanitizing minus signs");
                }

                currentChunk += currentChar; 
            }
        }

        // this is vestigial – only used for test
        // console.log("done iterating through file! spreadsheet rows: ", this.getNumRows, " spreadsheet columns: ", this.getNumColumns());

        // make sure to push the final row into this spreadsheet
        currentRow.push(new Cell(currentChunk, this)); 
        this.addRow(currentRow, this.cells.length, true);
    }

    // get the data from all cells and return it as a comma delimited string
    public toString(): string {
        let str: string = '';

        // for each cell in this spreadsheet
        for(let i: number = 0; i < this.numRows; i++) {
            for(let j: number = 0; j < this.numColumns; j++) {
                if(this.getRow(i).at(j) !== undefined) { // assert that no cells are undefined
                    str += this.getRow(i).at(j)?.getformula(); // concat the contents of the cell at this row/col to the string
                    if(j !== this.numColumns - 1) {
                        str += ',';  // add a comma as long as it is not the last cell in the row (no trailing commas)
                    }
                }
            }
            if(i !== this.numRows - 1 && str !== '') {
                str += '\n';  // create a newline as long as it is not the last row (no trailing line break)
            }
        }
        return str;
    }

    public pushAction(action: ISheetAction): void {
        this.actionStack.push(action);
        this.clearReactions();
    }

    public popAction(): ISheetAction | undefined {
        return this.actionStack.pop();
    }

    // Flip last action and add it's inverse to reaction stack
    public undo(): void {
        let action = this.actionStack.pop();
        if(action) {
            this.reactionStack.push(action.flip());
        } else {
            throw Error("Action stack unexpectedly empty");
        }
    }

    // Flip last undid action and add it's inverse to action stack
    public redo(): void {
        let reaction = this.reactionStack.pop();
        if(reaction) {
            this.actionStack.push(reaction.flip());
        } else {
            throw Error("Reaction stack unexpectedly empty");
        }
    }

    public canUndo(): boolean {
        return this.actionStack.length > 0;
    }

    public canRedo(): boolean {
        return this.reactionStack.length > 0;
    }

    public clearActions(): void {
        this.actionStack = [];
    }

    public clearReactions(): void {
        this.reactionStack = [];
    }

    public evaluateCells(): void {
        // evaluate all cells here
        for (let i: number = 0; i < this.cells.length; i++) {
            for (let j: number = 0; j < this.cells[i].length; j++) {
                this.cells[i][j].updateCell();
            }
        }
    }
}