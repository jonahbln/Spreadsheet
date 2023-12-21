import { Cell } from "../models/Cell";
import { Spreadsheet } from "../models/Spreadsheet";
  
  describe('Spreadsheet Tests', (): void => {
    let sheet1: Spreadsheet;
    let sheet2: Spreadsheet;

    beforeEach((): void => {
      // an empty spreadhseet that can be used for testing
      sheet1 = new Spreadsheet(0,0);

      // create a simple 3x3 spreadsheet with numbers 1-9 in subsequent cells for testing
      sheet2 = new Spreadsheet(0,0);
      let row1: Cell[] = [new Cell('1', sheet1), new Cell('2', sheet1), new Cell('3', sheet1)];
      let row2: Cell[] = [new Cell('4', sheet1), new Cell('5', sheet1), new Cell('6', sheet1)];
      let row3: Cell[] = [new Cell('7', sheet1), new Cell('8', sheet1), new Cell('9', sheet1)];
      sheet2.addRow(row1, 0, true);
      sheet2.addRow(row2, 1, true);
      sheet2.addRow(row3, 2, true);
    });

    // making an empty spreadsheet of size 0x0 and checking if the size and toString are properly set
    it('should be able to handle constructing a 0x0 spreadsheet', (): void => {
      sheet1 = new Spreadsheet(0,0);

      expect(sheet1.getNumRows()).toEqual(0);
      expect(sheet1.getNumColumns()).toEqual(0);
      expect(sheet1.toString()).toEqual('');
    });

    // making an empty spreadsheet of size 3x3 and checking if the size and toString are properly set
    it('should be able to handle constructing a spreadsheet of very large size', (): void => {
      sheet1 = new Spreadsheet(999,999); // we dont need to support a size this big, but it's nice to know it won't break

      expect(sheet1.getNumRows()).toEqual(999);
      expect(sheet1.getNumColumns()).toEqual(999);
    });

    // (next 2) making empty spreadsheets of size 10x3 and 3x10 and checking if the sizes and toStrings are properly retrieved
    it('should support having an uneven number of rows/columns where rows > cols', (): void => {
      sheet1 = new Spreadsheet(10,3);

      expect(sheet1.getNumRows()).toEqual(10);
      expect(sheet1.getNumColumns()).toEqual(3);
      expect(sheet1.toString()).toEqual(',,\n,,\n,,\n,,\n,,\n,,\n,,\n,,\n,,\n,,');
    });
    it('should support having an uneven number of rows/columns where rows < cols', (): void => {
      sheet1 = new Spreadsheet(3,10);

      expect(sheet1.getNumRows()).toEqual(3);
      expect(sheet1.getNumColumns()).toEqual(10);
      expect(sheet1.toString()).toEqual(',,,,,,,,,\n,,,,,,,,,\n,,,,,,,,,');
    });

    // add 3 empty rows to an empty spreadsheet, then test that the # of rows and cols are acurately stored and no data is present
    it('should be able to handle adding empty rows', (): void => {
      sheet1.addEmptyRow();
      sheet1.addEmptyRow();      
      sheet1.addEmptyRow();

      expect(sheet1.getNumColumns()).toEqual(0);
      expect(sheet1.getNumRows()).toEqual(3);
      expect(sheet1.toString()).toEqual('');
    });

    // add 3 empty columns to an empty spreadsheet, then test that the # of rows and cols are acurately stored and no data is present
    it('should be able to handle adding empty columns', (): void => {
      sheet1.addEmptyColumn();
      sheet1.addEmptyColumn();      
      sheet1.addEmptyColumn();

      expect(sheet1.getNumColumns()).toEqual(3);
      expect(sheet1.getNumRows()).toEqual(0);
      expect(sheet1.toString()).toEqual('');
    });

    
    // create 3 small rows and add them one-by-one to the spreadsheet, then test that the # of rows and cols and the data are accurately returned
    it('should be able to handle adding rows of data', (): void => {
      let row1: Cell[] = [new Cell('1', sheet1), new Cell('2', sheet1), new Cell('3', sheet1)];
      let row2: Cell[] = [new Cell('4', sheet1), new Cell('5', sheet1), new Cell('6', sheet1)];
      let row3: Cell[] = [new Cell('7', sheet1), new Cell('8', sheet1), new Cell('9', sheet1)];
      sheet1.addRow(row1, 0, true);
      sheet1.addRow(row2, 1, true);
      sheet1.addRow(row3, 2, true);

      expect(sheet1.getNumColumns()).toEqual(3);
      expect(sheet1.getNumRows()).toEqual(3);
      expect(sheet1.toString()).toEqual('1,2,3\n4,5,6\n7,8,9');
    });

    // create 3 small columns and add them one-by-one to the spreadsheet, then test that the # of rows and cols and the data are accurately returned
    it('should be able to handle adding columns of data', (): void => {

      let column1: Cell[] = [new Cell('1', sheet1), new Cell('4', sheet1), new Cell('7', sheet1)];
      let column2: Cell[] = [new Cell('2', sheet1), new Cell('5', sheet1), new Cell('8', sheet1)];
      let column3: Cell[] = [new Cell('3', sheet1), new Cell('6', sheet1), new Cell('9', sheet1)];
      sheet1.addColumn(column1, 0, true);
      sheet1.addColumn(column2, 1, true);
      sheet1.addColumn(column3, 2, true);

      expect(sheet1.getNumColumns()).toEqual(3);
      expect(sheet1.getNumRows()).toEqual(3);
      expect(sheet1.toString()).toEqual('1,2,3\n4,5,6\n7,8,9');
    });

    // after adding an empty row to the spreadsheet, remove it and test that the size and data are updated properly
    it('should be able to handle removing empty rows', (): void => {
      sheet1.addEmptyRow();

      sheet1.removeRow(0, true);

      expect(sheet1.getNumColumns()).toEqual(0);
      expect(sheet1.getNumRows()).toEqual(0);
      expect(sheet1.toString()).toEqual('');
    });
    
    // after adding an empty columns to the spreadsheet, remove it and test that the size and data are updated properly
    it('should be able to handle removing empty columns', (): void => {
      sheet1.addEmptyColumn();

      sheet1.removeColumn(0, true);

      expect(sheet1.getNumColumns()).toEqual(0);
      expect(sheet1.getNumRows()).toEqual(0);
      expect(sheet1.toString()).toEqual('');
    });

    // after adding 3 rows to a spreadsheet, remove the middle row and see if the size and data are updated properly
    it('should be able to handle removing rows of data', (): void => {
      // removing the 1st row (zero-indexed)
      sheet2.removeRow(1, true);

      expect(sheet2.getNumColumns()).toEqual(3);
      expect(sheet2.getNumRows()).toEqual(2);
      expect(sheet2.toString()).toEqual('1,2,3\n7,8,9');
    });

    // after adding 3 rows to a spreadsheet, remove the middle column and see if the size and data are updated properly
    it('should be able to handle removing columns of data', (): void => {
      // removing the 1st column (zero-indexed)
      sheet2.removeColumn(1, true);

      expect(sheet2.getNumColumns()).toEqual(2);
      expect(sheet2.getNumRows()).toEqual(3);
      expect(sheet2.toString()).toEqual('1,3\n4,6\n7,9');
    });

    // add a row of data to the spreadsheet and then call the undo method
    it('should be able to undo adding a row to a spreadsheet', (): void => {
      let row1: Cell[] = [new Cell('1', sheet1), new Cell('2', sheet1), new Cell('3', sheet1)];
      sheet2.addRow(row1, 0, true);

      expect(sheet2.getNumColumns()).toEqual(3);
      expect(sheet2.getNumRows()).toEqual(4);
      expect(sheet2.toString()).toEqual('1,2,3\n1,2,3\n4,5,6\n7,8,9');

      sheet2.undo();

      expect(sheet2.getNumColumns()).toEqual(3);
      expect(sheet2.getNumRows()).toEqual(3);
      expect(sheet2.toString()).toEqual('1,2,3\n4,5,6\n7,8,9');
    });

    // add a row of data to the spreadsheet, then call undo, then redo the change
    it('should be able to redo adding a row to a spreadsheet', (): void => {
      let row1: Cell[] = [new Cell('1', sheet1), new Cell('2', sheet1), new Cell('3', sheet1)];
      sheet2.addRow(row1, 0, true);
      sheet2.undo();

      sheet2.redo();

      expect(sheet2.getNumColumns()).toEqual(3);
      expect(sheet2.getNumRows()).toEqual(4);
      expect(sheet2.toString()).toEqual('1,2,3\n1,2,3\n4,5,6\n7,8,9');
    });

    // add a column of data to the spreadsheet and then call the undo method
    it('should be able to undo adding a column to a spreadsheet', (): void => {
      let column1: Cell[] = [new Cell('1', sheet1), new Cell('2', sheet1), new Cell('3', sheet1)];
      sheet2.addColumn(column1, 0, true);
      
      expect(sheet2.getNumColumns()).toEqual(4);
      expect(sheet2.getNumRows()).toEqual(3);
      expect(sheet2.toString()).toEqual('1,1,2,3\n2,4,5,6\n3,7,8,9');

      sheet2.undo();

      expect(sheet2.getNumColumns()).toEqual(3);
      expect(sheet2.getNumRows()).toEqual(3);
      expect(sheet2.toString()).toEqual('1,2,3\n4,5,6\n7,8,9');
    });

    // add a column of data to the spreadsheet, then call undo, then redo the change
    it('should be able to redo adding a column to a spreadsheet', (): void => {
      let column1: Cell[] = [new Cell('1', sheet1), new Cell('2', sheet1), new Cell('3', sheet1)];
      sheet2.addColumn(column1, 0, true);
      sheet2.undo();

      sheet2.redo();

      expect(sheet2.getNumColumns()).toEqual(4);
      expect(sheet2.getNumRows()).toEqual(3);
      expect(sheet2.toString()).toEqual('1,1,2,3\n2,4,5,6\n3,7,8,9');
    });
    
    // remove a row of data to the spreadsheet and then call the undo method
    it('should be able to undo removing a row to a spreadsheet', (): void => {
      sheet2.removeRow(1,true);
      
      expect(sheet2.getNumColumns()).toEqual(3);
      expect(sheet2.getNumRows()).toEqual(2);
      expect(sheet2.toString()).toEqual('1,2,3\n7,8,9');

      sheet2.undo();

      expect(sheet2.getNumColumns()).toEqual(3);
      expect(sheet2.getNumRows()).toEqual(3);
      expect(sheet2.toString()).toEqual('1,2,3\n4,5,6\n7,8,9');
    });

    // remove a row of data to the spreadsheet, then call undo, then redo the change
    it('should be able to redo removing a row to a spreadsheet', (): void => {
      sheet2.removeRow(1,true);
      sheet2.undo();

      sheet2.redo();

      expect(sheet2.getNumColumns()).toEqual(3);
      expect(sheet2.getNumRows()).toEqual(2);
      expect(sheet2.toString()).toEqual('1,2,3\n7,8,9');
    });

    // remove a column of data to the spreadsheet and then call the undo method
    it('should be able to undo removing a column to a spreadsheet', (): void => {
      sheet2.removeColumn(1,true);

      expect(sheet2.getNumColumns()).toEqual(2);
      expect(sheet2.getNumRows()).toEqual(3);
      expect(sheet2.toString()).toEqual('1,3\n4,6\n7,9');

      sheet2.undo();

      expect(sheet2.getNumColumns()).toEqual(3);
      expect(sheet2.getNumRows()).toEqual(3);
      expect(sheet2.toString()).toEqual('1,2,3\n4,5,6\n7,8,9');
    });

    // remove a column of data to the spreadsheet, then call undo, then redo the change
    it('should be able to redo removing a column to a spreadsheet', (): void => {
      sheet2.removeColumn(1,true);
      sheet2.undo();

      sheet2.redo();

      expect(sheet2.getNumColumns()).toEqual(2);
      expect(sheet2.getNumRows()).toEqual(3);
      expect(sheet2.toString()).toEqual('1,3\n4,6\n7,9');
    });

    // make multiple actions on a spreadsheet and subsequently undo all of them
    it('should be able to undo multiple changes in a row', (): void => {
      sheet2.removeColumn(1,true);
      sheet2.removeRow(1,true);
      sheet2.removeColumn(0,true);
      
      expect(sheet2.getNumColumns()).toEqual(1);
      expect(sheet2.getNumRows()).toEqual(2);
      expect(sheet2.toString()).toEqual('3\n9');

      sheet2.undo();
      sheet2.undo();
      sheet2.undo();

      expect(sheet2.getNumColumns()).toEqual(3);
      expect(sheet2.getNumRows()).toEqual(3);
      expect(sheet2.toString()).toEqual('1,2,3\n4,5,6\n7,8,9');
    });

    // make multiple actions on a spreadsheet and subsequently undo all of them, then redo all of them
    it('should be able to redo multiple changes in a row', (): void => {
      sheet2.removeColumn(1,true);
      sheet2.removeRow(1,true);
      sheet2.removeColumn(0,true);
      
      sheet2.undo();
      sheet2.undo();
      sheet2.undo();

      sheet2.redo();
      sheet2.redo();
      sheet2.redo();

      expect(sheet2.getNumColumns()).toEqual(1);
      expect(sheet2.getNumRows()).toEqual(2);
      expect(sheet2.toString()).toEqual('3\n9');
    });

    // make multiple actions on a spreadsheet and subsequently undo 2/3 of them
    it('should be able to undo multiple changes in a row, with changes remaining in the stack', (): void => {
      sheet2.removeColumn(1,true);
      sheet2.removeRow(1,true);
      sheet2.removeColumn(0,true);
      
      expect(sheet2.getNumColumns()).toEqual(1);
      expect(sheet2.getNumRows()).toEqual(2);
      expect(sheet2.toString()).toEqual('3\n9');

      sheet2.undo();
      sheet2.undo();

      // the first action (remove column 1) should stil be in effect, but the others undone
      expect(sheet2.getNumColumns()).toEqual(2);
      expect(sheet2.getNumRows()).toEqual(3);
      expect(sheet2.toString()).toEqual('1,3\n4,6\n7,9');
    });

    // make multiple actions on a spreadsheet and subsequently undo 2/3 of them, then redo 1 of them
    it('should be able to redo changes in a spreadsheet, with changes remaining in the stack', (): void => {
      sheet2.removeColumn(1,true);
      sheet2.removeRow(1,true);
      sheet2.removeColumn(0,true);
      
      sheet2.undo();
      sheet2.undo();

      sheet2.redo();

      expect(sheet2.getNumColumns()).toEqual(2);
      expect(sheet2.getNumRows()).toEqual(2);
      expect(sheet2.toString()).toEqual('1,3\n7,9');
    });

    // make a spreadsheet with rows/cols of data and use it's toString method to load into a second spreadsheet, then check that the two spreadsheets are now identical
    it('should be able to load in data from a string', (): void => {
      sheet1.loadFromString(sheet2.toString());

      expect(sheet1).toEqual(sheet2);
    });
  });