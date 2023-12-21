import './App.css';

import React, { useState, useEffect } from "react"
import TopBar from './top_bar/TopBar';
import Table from './table_ui/Table';
import { Spreadsheet } from './models/Spreadsheet';
import { Cell } from './models/Cell';
import { BackendButton } from './interfaces/BackendButton';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const tableModel: Spreadsheet = new Spreadsheet(26,26);

// when the buttons in the table are pressed, it connects the Cell to the formula
// editing box at the top. 


// TODO: 
// add cell indices (C1, etc) on the top bar (and next to the formula input)
// separate underlying formula from the display value


export function App() {

  const [cells, setCells] = useState(tableModel.getCells());

  const [formulaCell, setFormulaCell] = useState(tableModel.getCells()[0][0]);
  const [displayFormula, setDisplayFormula] = useState("");
  
  const [canUndo, setCanUndo] = useState(tableModel.canUndo());
  const [canRedo, setCanRedo] = useState(tableModel.canUndo());

  function setupDisplay() {
    // initializes the highlighted display and formula on the first load-in.
    tableModel.getCells()[0][0].selectCell();

    setDisplayFormula(tableModel.getCells()[0][0].getformula());
  }

  // setup methods for the initial load-in
  useEffect(
    setupDisplay,
    []
  )

  function buttonPressHandler(button: BackendButton): void {
    // this combines two functions – pressing the given button, and updating the cell dispaly afterwards.
    button.press();
    // console.log("Handling button press");

    updateCellDisplay();
  }

  function focusCell(newCell: Cell): void {
    // need to unselect the current cell, even if the same cell is selected.
    formulaCell.unselectCell();

    // then, we update the displayed formula and make sure the formula box is pointing to the newly selected cell.
    updateDisplayFormula(newCell.getformula());
    setFormulaCell(newCell);

    // now, we select the cell in its own property. This is what affects the highlighting effect. 
    newCell.selectCell();
  }

  function updateDisplayFormula(formula: string): void {
    // renders the displayed formula on each change
    setDisplayFormula(formula);
  }

  function updateCellDisplay(): void {

    // runs the formulas on all cells – necessary for changes such as row deletions or other massive reference changes.
    tableModel.evaluateCells();

    // update the "greyed-out" status of the undo and redo buttons.
    setCanUndo(tableModel.canUndo());
    setCanRedo(tableModel.canRedo());

    setDisplayFormula(formulaCell.getformula());

    // this isn't being used directly, but this is necessary for storing the old state of the spreadsheet as it is updated. 
    setCells(tableModel.getCells().slice());
  }

  // note – we pass a lot of props into the TopBar. 
  // one challenge we found was keeping track of the various states used in both TopBar and Table.
  // for example, the Formula component affects both the Table and the TopBar component. 
  // during attempts to refactor this into a single model, we found difficulties keeping track of the state of one large object. 
  // thus, it was difficult to keep these states separate during rendering.
  // also, many components across both segments require a full spreadsheet update after they're run
  // (such as row deletion, row addition, and formula editing). 

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      
      <div className="parent_container">
        <TopBar
            spreadsheetData={tableModel} 
            buttonHandler={buttonPressHandler}
            currentCell={formulaCell}
            displayFormula={displayFormula}
            setDisplayFormula={updateDisplayFormula}
            onFormulaEdit={updateCellDisplay}
            canUndo={canUndo} 
            canRedo={canRedo}/>

        <Table tableModel={tableModel}
            focusCell={focusCell}
            focusedCell={formulaCell}
            updateTable={updateCellDisplay} />
      </div>
    </ThemeProvider>
  )
}
 
export default App;