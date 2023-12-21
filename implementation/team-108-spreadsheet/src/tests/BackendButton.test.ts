import { Spreadsheet } from "../models/Spreadsheet";
import { AddColButton } from "../models/buttons/AddColButton";
import { AddRowButton } from "../models/buttons/AddRowButton";
import { NewSpreadsheetButton } from "../models/buttons/NewSpreadsheetButton";
import { RedoButton } from "../models/buttons/RedoButton";
import { UndoButton } from "../models/buttons/UndoButton";

describe('Backend Button Tests', (): void => {
    let testControlSpreadsheet: Spreadsheet;
    let buttonControlSpreadsheet: Spreadsheet;
    beforeEach((): void => {
        testControlSpreadsheet = new Spreadsheet(26,26);
        buttonControlSpreadsheet = new Spreadsheet(26,26);
    });

    it('adding columns with a button should be the same as adding an empty column manually on a spreadsheet model', (): void => {
        // create an "addRowButton" with a test spreadsheet and call the press method on it
        let addColumnButton: AddColButton = new AddColButton(buttonControlSpreadsheet);
        addColumnButton.press();

        // manually call the addEmptyRow method on a different test spreadsheet
        testControlSpreadsheet.addEmptyColumn();

        expect(buttonControlSpreadsheet).toEqual(testControlSpreadsheet);
    });

    it('adding rows with a button should be the same as adding an empty row manually on a spreadsheet model', (): void => {
        // create an "addRowButton" with a test spreadsheet and call the press method on it
        let addRowButton: AddRowButton = new AddRowButton(buttonControlSpreadsheet);
        addRowButton.press();

        // manually call the addEmptyRow method on a different test spreadsheet
        testControlSpreadsheet.addEmptyRow();

        expect(buttonControlSpreadsheet).toEqual(testControlSpreadsheet);
    });

    it('creating a new spreadsheet with a button should be the same as manually creating a 26x26 spreadsheet using the spreadsheet model constructor', (): void => {
        // create an "NewSpreadsheetButton" with a test spreadsheet and call the press method on it
        let newSpreadsheetButton: NewSpreadsheetButton = new NewSpreadsheetButton(buttonControlSpreadsheet);
        newSpreadsheetButton.press();

        // manually call the constructor of a different test spreadsheet and pass in 1x1 for the dimension
        testControlSpreadsheet = new Spreadsheet(26,26);

        expect(buttonControlSpreadsheet.toString()).toEqual(testControlSpreadsheet.toString());
    });

    it('undoing an action with a button should be the same as manually calling undo on a spreadsheet model', (): void => {
        // create an "UndoButton" with a test spreadsheet, make some changes to the spreadsheet and then call the press method on the undo button
        let undoButton: UndoButton = new UndoButton(buttonControlSpreadsheet);
        buttonControlSpreadsheet.addEmptyColumn();
        buttonControlSpreadsheet.addEmptyRow();
        undoButton.press();

        // manually call the undo method on a different test spreadsheet after making the same changes to
        testControlSpreadsheet.addEmptyColumn();
        testControlSpreadsheet.addEmptyRow();
        testControlSpreadsheet.undo();

        expect(buttonControlSpreadsheet).toEqual(testControlSpreadsheet);
    });

    it('redoing an action with a button should be the same as manually calling redo on a spreadsheet model', (): void => {
        // create an "RedoButton" with a test spreadsheet, undo a change to the spreadsheet and then call the press method on the redo button
        let redoButton: RedoButton = new RedoButton(buttonControlSpreadsheet);
        buttonControlSpreadsheet.addEmptyRow();
        buttonControlSpreadsheet.undo();
        redoButton.press();

        // manually call the redo method on a different test spreadsheet after undoing the same change to it
        testControlSpreadsheet.addEmptyRow();
        testControlSpreadsheet.undo();
        testControlSpreadsheet.redo();

        expect(buttonControlSpreadsheet).toEqual(testControlSpreadsheet);
    });
});