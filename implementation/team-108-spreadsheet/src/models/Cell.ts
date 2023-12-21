import { Literal } from "../interfaces/Literal";
import { NumberLiteral } from "./Literals/NumberLiteral";
import { StringLiteral } from "./Literals/StringLiteral";
import { Spreadsheet } from "./Spreadsheet";
import { ErrorLiteral } from "./Literals/ErrorLiteral";

export class Cell {
    private formula: string;
    private value:Literal;
    private sheet:Spreadsheet;
    private selected: boolean;

    private downstream:Set<Cell>
    private upstream:Set<Cell>

    private errorMessage: string;

    public constructor(formula: string, sheet: Spreadsheet) {
        this.formula = formula;
        this.sheet = sheet;
        this.downstream = new Set<Cell>();
        this.upstream = new Set<Cell>();
        this.value = new StringLiteral("");
        this.updateCell();

        this.errorMessage = "";
        this.selected = false;
    }

    //Evalute this cell's expression into a string literal or number literal and display it in the cell's value
    public updateCell(): void{
        this.errorMessage = "";

        //reset all of this cell's dependencies, they will be determined when the cell's formula is evaluated
        this.upstream.forEach((x) => {x.downstream.delete(this)});
        this.upstream = new Set<Cell>();
        //try catch to catch potential cell errors
        try {
            //if no formula entered, return black string literal
            if(this.formula.length === 0) {
                this.value = new StringLiteral("");
            } else if(Cell.removeSpaces(this.formula).length === 0
            || Cell.removeSpaces(this.formula).charAt(0) !== "=") {
                //if cell formula does not start with an =, treat it as a raw string
                this.value = Cell.stringToLiteral(this.formula);
            } else {
                //otherwise, evaluate the cell's value from it's formula
                this.value = this.evaluate(Cell.removeSpaces(this.formula).substring(1));
            }
        } catch(e) {
            //ensure the error message is cast to a string
            if (typeof e === "string") {
                this.errorMessage = e.toUpperCase()
            } else if (e instanceof Error) {
                this.errorMessage = e.message.toUpperCase();
            }
             
            //console.log(this.errorMessage.toUpperCase());

            switch(true) {
                case this.errorMessage === "EXPRESSION HAS UNCLOSED PARENTHESES":
                case this.errorMessage === "PARENTHESES IN UNEXPECTED LOCATION":
                case /UNEXPECTED .*/.test(this.errorMessage):
                case this.errorMessage === "BUFFER IS UNEXPECTEDLY EMPTY":
                case this.errorMessage === "OPERATOR NOT RECOGNIZED":
                case this.errorMessage === "INCORRECT NUMBER OF FUNCTION ARGUMENTS":
                    this.value = new ErrorLiteral("Expression");
                    break;
                case this.errorMessage === "INVALID CELL REFERENCE":
                case this.errorMessage === "CIRCULAR REFERENCE":
                case this.errorMessage === "INVALID RANGE FORMAT":
                case this.errorMessage === "RANGE OUT OF SHEET":
                    this.value = new ErrorLiteral("Reference");
                    break;
                case /UNEXPECTED OPERATION PERFORMED ON A STRING LITERAL: .*/.test(this.errorMessage):
                    this.value = new ErrorLiteral("Value");
                    break;
                default:
                    this.value = new ErrorLiteral("Error");
                    break;
            }
        }
        //reassign to array to prevent modification of the iterator mid-iteration
        let down = Array.from(this.downstream);
        //update all cells dependant on this one
        down.forEach(x => { x.updateCell() });
    }

    public setformula(newFormula: string): void {
        this.formula = newFormula;
    }

    public getformula(): string {
        return this.formula;
    }

    public getValue(): string {
        return this.value.getValue();
    }

    public getErrorMessage(): string {
        return this.errorMessage;
    }

    public selectCell(): void {
        this.selected = true;
    }

    public unselectCell(): void {
        this.selected = false;
    }

    public getSelectedStatus(): boolean {
        return this.selected;
    }

    //evalute the value of this cell from it's formula
    public evaluate(formula:string): Literal {
        //this buffer will contain low-priority operators and the literals they are being applied to, in order to maintain operator precesence
        let buffer: [Literal, string][] = [];

        //expression so far is a running tally of string characters that have not yet been resolved into a literal or operator
        let expressionSoFar:string = "";
        for(let i = 0; i < formula.length; i++)
        {
            //decide what to do based on the next character in formula
            switch(formula.charAt(i)) {
                case "+":
                case "-":
                case "*":
                case "/":
                case "^":
                    //if operator appears without any characters before it, throw an error
                    if(expressionSoFar === "")
                    {
                        throw Error("unexpected " + formula.charAt(i));
                    }
                    else
                    {
                        //place the new operator and the literal which preceeds it into the buffer, and collapse the buffer as far as is allowed by operator precedense
                        buffer = Cell.evaluateBuffer(buffer, [Cell.stringToLiteral(expressionSoFar), formula.charAt(i)]);
                        expressionSoFar = "";
                    }
                    break;
                case "(":
                    //if there is a parenthesis, evaluate everything within the parenthesis as a seperate formula and place the resulting literal in the buffer
                    let exp:string = Cell.toCloseParen(formula.substring(i + 1));
                    i += exp.length + 2;
                    let expLiteral;
                    //if these parenthesis are preceeded by a specific function, excecute that function on the provided arguments
                    switch(expressionSoFar.toUpperCase()) {
                        case "REF": expLiteral = this.makeCellReference(Cell.referenceToIndicies(exp)); break;
                        case "SUM": expLiteral = this.sumCellRange(this.getCellRange(exp)); break;
                        case "AVG": expLiteral = this.averageCellRange(this.getCellRange(exp)); break;
                        case "STDDEV": expLiteral = this.standardDeviation(this.getCellRange(exp)); break;
                        case "ZTEST": expLiteral = this.zTest(exp.split(',')); break;
                        case "REG": expLiteral = this.linearRegression(this.getCellRange(exp)); break;
                        case "": expLiteral = this.evaluate(exp); break;
                        default: throw Error("parentheses in unexpected location");
                    }
                    //place the literal resulting from the parenthesis in the buffer along with the operator which follows it
                    buffer = Cell.evaluateBuffer(buffer, [expLiteral, i < formula.length ? formula.charAt(i) : " "]);
                    expressionSoFar = "";
                    break;
                case "\"":
                    //if there is a quote ("), read until the next quote as a string literal
                    let val:string = formula.substring(i + 1).split("\"")[0];
                    i += val.length + 2;
                    if(expressionSoFar !== "") {
                        throw Error("UNEXPECTED OPERATION PERFORMED ON A STRING LITERAL: " + val);
                    }
                    //enter the recieved string literal into the buffer along with the operator that follows
                    buffer = Cell.evaluateBuffer(buffer, [new StringLiteral(val), i < formula.length ? formula.charAt(i) : " "])
                    break;
                default:
                    expressionSoFar += formula.charAt(i);
                    break;
            }
        }

        //if there are unprocessed characters at the end of the formula, enter them into the buffer and collapse it
        if(expressionSoFar !== "") {
            buffer = Cell.evaluateBuffer(buffer, [Cell.stringToLiteral(expressionSoFar), " "]);
        }
        //return the resulting literal from the collapsed buffer
        return buffer[0][0];
    }

    //remove all spaces except those found within string literals (between quotes)
    private static removeSpaces(formula: string): string {
        let inputSlices = formula.split("\"");
        for(let i:number = 0; i < inputSlices.length; i += 2) {
            inputSlices[i] = inputSlices[i].replace(" ", "");
        }
        return inputSlices.join("\"");
    }

    //make a refernce to a specific cell within the spreadsheet, input: row and column of cell reference, returns: value found at that cell
    private makeCellReference(cords:[number, number]):Literal {
        if(cords[1] > this.sheet.getNumRows() || cords[0] > this.sheet.getNumColumns()) {
            throw Error("Invalid cell reference");
        }
        let ref = this.sheet.getCells()[cords[1]][cords[0]];

        //check if the referenced cell is dependant on this cell
        if(ref.isDependant(this)) {
            throw Error("Circular reference");
        }

        //add this cell to the downstream of the referenced cell
        ref.downstream.add(this);
        //add the referenced cell to the upstream of this cell
        this.upstream.add(ref);
        //return the value resulting from the reference
        return ref.value;
    }

    //get the values from a range of cells, input ranges must be formatted A1:A1
    private getCellRange(range:string): Literal[][] {
        range = range.replace(" ", "").toUpperCase();
        //uses regex to make sure the cell range expression is formatted properly
        if(!/^[A-Z]+[0-9]+:[A-Z]+[0-9]+$/.test(range)) {
            throw Error("Invalid range format");
        }
        let startCoords:[number, number] = Cell.referenceToIndicies(range.split(":")[0]);
        let endCoords:[number, number] = Cell.referenceToIndicies(range.split(":")[1]);
        //make sure both ends are in the spreadsheet and proper order
        if(startCoords[1] < 0 || startCoords[1] > this.sheet.getNumRows() - 1
        || startCoords[0] < 0 || startCoords[0] > this.sheet.getNumColumns() - 1
        || endCoords[1] < 0 || endCoords[1] > this.sheet.getNumRows() - 1
        || endCoords[0] < 0 || endCoords[0] > this.sheet.getNumColumns() - 1
        || startCoords[1] > endCoords[1] || startCoords[0] > endCoords[0]) {
            throw Error("Range out of sheet");
        }

        let outputRange: Literal[][] = [];

        //get all the values from the referenced cells, and make referenced to these cells
        for(let x = startCoords[0]; x < endCoords[0] + 1; x++) {
            let currentRow: Literal[] = [];
            for(let y = startCoords[1]; y < endCoords[1] + 1; y++) {
                currentRow.push(this.makeCellReference([x, y]));
            }
            outputRange.push(currentRow);
        }
        return outputRange;
    }

    //sum up all values in the array of literals
    private sumCellRange(values:Literal[][]):Literal {
        
        let sum:Literal = new NumberLiteral(0);

        for(let x = 0; x < values.length; x++) {
            for(let y = 0; y < values[x].length; y++) {
                sum = sum.performBinaryOperation(values[x][y], '+');
            }
        }
        return sum;
    }

    //get the average of all the values in the array of literals
    private averageCellRange(values:Literal[][]):Literal {
        let count:number = 0;
        for(let x:number = 0; x < values.length; x++) {
            count += values[x].length;
        }

        return this.sumCellRange(values).performBinaryOperation(new NumberLiteral(count), '/');
    }

    //calculate the standard deviation of all the values in the array of literals
    private standardDeviation(values:Literal[][]):NumberLiteral {
        let mean:number = this.averageCellRange(values).getValue();
        let allVals:number[] = values.reduce((x, y) => x.concat(y)).map((x) => x.getValue());
        return new NumberLiteral(Math.pow(allVals.map(x => x - mean).map(x => x * x).reduce((x, y) => x + y, 0) / allVals.length, 0.5));
    }

    //compute a z-test of a given value (args[1]) on an array of literals (args[0])
    private zTest(args: string[]):NumberLiteral {
        if(args.length !== 2) {
            throw Error("Incorrect number of function arguments");
        }
        args.map(x => x.replace(" ", ""));
        let values:Literal[][] = this.getCellRange(args[0]);
        let testValue:number = this.evaluate(args[1]).getValue();
        return new NumberLiteral((testValue - this.averageCellRange(values).getValue()) / this.standardDeviation(values).getValue());
    }    

    private linearRegression(values:Literal[][]): StringLiteral {
        if(values.length != 2) {
            //transpose the array
            values = values[0].map((_, col) => values.map(row => row[col]));
            if(values.length != 2) {
                //if there are more than 2 columns of data, throw error
                throw "Incorrect number of function arguments";
            }
        }
        let numValues:number[][] = values.map(x => x.map(y => y.getValue()));
        //sum of all x values
        let xSum:number = numValues[0].reduce((x, y) => x + y, 0);
        //console.log(xSum);
        //sum of all y values
        let ySum:number = numValues[1].reduce((x, y) => x + y, 0);
        //console.log(ySum);
        //sum of all x * y values
        let xySum:number = numValues[0].map((x, i) => x * numValues[1][i]).reduce((x, y) => x + y, 0);
        //sum of all x^2 values
        let sumx2:number = numValues[0].map(x => x * x).reduce((x, y) => x + y, 0);
        //sum of all y^2 values
        let sumy2:number = numValues[1].map(x => x * x).reduce((x, y) => x + y, 0);
        //sample size
        let n = values[0].length;

        //slope of regression
        let a = (n * xySum - xSum * ySum) / (n * sumx2 - (xSum * xSum));
        //y-intercept of regression
        let b = (ySum * sumx2 - xSum * xySum) / (n * sumx2 - (xSum * xSum));

        //form string
        return new StringLiteral(a + "x + " + b);
    }

    //check if this cell's value depends on the given cell or anything upstream from the given cell
    public isDependant(cell:Cell):boolean {
        return this === cell || this.upstream.has(cell) || Array.from(this.upstream).map(x => x.isDependant(cell)).reduce((x, y) => x || y, false);
    }

    //interpret a string as a literal, either number or string
    private static stringToLiteral(input:string):Literal
    {
        if(Number(input) || parseInt(input) === 0)
        {
            return new NumberLiteral(Number(input));
        }
        else
        {
            return new StringLiteral(input);
        }
    }

    //take a string value and turn it into a row and column for references
    private static referenceToIndicies(input:string):[number, number] {
        input = input.replace(" ", "");
        input = input.toUpperCase();
        //uses regex to check the formating of the cell reference
        if(!/^[A-Z]+[0-9]+$/.test(input)) {
            throw Error("Invalid cell reference");
        }
        //seperate the letter component (column) and the number component (row)
        let temp1 = input.match(/^[A-Z]+/);
        let temp2 = input.match(/[0-9]+$/);
        if(temp1 && temp2) {
            let colLetters:string = temp1[0];
            let column:number = 0;
            for(let i = 0; i < colLetters.length; i++) {
                //use base 26 to interepret letters as a column value
                column += (colLetters.charCodeAt(colLetters.length - 1 - i) - 64) * Math.pow(26, i);
            }
            return [column - 1, Number(temp2[0]) - 1];
        } else {
            throw Error("Invalid cell reference");
        }

    }

    //add a literal and operator to the literal buffer and collapse it as far as possible
    private static evaluateBuffer(buffer:[Literal, string][], input:[Literal, string]):[Literal, string][]
    {
        //while the inputted operator is lower priority than the prior one, do the last operation
        while(buffer.length > 0 && this.operatorPriority(buffer[buffer.length - 1][1]) >= this.operatorPriority(input[1]))
        {
            let operationToPerform = buffer.pop();
            if(operationToPerform)
            {
                //preform the binary operation on the inputted literal and the prior
                input = [operationToPerform[0].performBinaryOperation(input[0], operationToPerform[1]), input[1]];
            }
            else
            {
                throw Error("buffer is unexpectedly empty");
            }
        }
        //add the new literal
        buffer.push(input);
        return buffer;
    }

    //return an int representing the priority of a given operator, higher value means higher priority
    private static operatorPriority(operator:string):number
    {
        switch(operator.charAt(0))
        {
            case " ":
            case "+":
            case "-":
                return 0;
            case "*":
            case "/":
                return 1;
            case "^":
                return 2;
            default:
                throw Error("operator not recognized");
        }
    }

    //read the formula to the closing parenthesis
    private static toCloseParen(input:string):string
    {
        let numOpenParens:number = 1;
        for(let i = 0; i < input.length; i++)
        {
            switch(input.charAt(i))
            {
                case "(":
                    numOpenParens++;
                    break;
                case ")":
                    numOpenParens--;
                    break;
                default:
                    break;
            }
            if(numOpenParens === 0)
            {
                return input.substring(0, i);
            }
        }
        throw Error("Expression has unclosed parentheses");
    }
}