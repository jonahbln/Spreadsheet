import React, {  } from "react"
import { Spreadsheet } from "../models/Spreadsheet";
import { BackendButton } from "../interfaces/BackendButton";
import { Cell } from "../models/Cell";

import "./TopBar.css";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

// button imports:
import { MenuButton } from "./MenuButton";
import { UndoButton } from "../models/buttons/UndoButton";
import { RedoButton } from "../models/buttons/RedoButton";
import { AddRowButton } from "../models/buttons/AddRowButton";
import { AddColButton } from "../models/buttons/AddColButton";
import { NewSpreadsheetButton } from "../models/buttons/NewSpreadsheetButton";

import Formula from "./Formula";
import Manual from "./Manual";
import ExportFile from "./ExportFile";
import ImportFile from "./import_file/ImportFile";


interface ITopBar {
    spreadsheetData: Spreadsheet;
    buttonHandler: (button: BackendButton) => void;
    currentCell: Cell;
    displayFormula: string;
    setDisplayFormula: (formula: string) => void;
    onFormulaEdit: () => void;
    canUndo:boolean;
    canRedo:boolean;
}


export default function ButtonAppBar(props: ITopBar) {

    // using this tutorial:
    // https://stackoverflow.com/questions/37457128/react-open-file-browser-on-click-a-div

    var tableModel = props.spreadsheetData;

    var newSpreadsheetButton = new NewSpreadsheetButton(tableModel);
    var addRow = new AddRowButton(tableModel);
    var addColumn = new AddColButton(tableModel);
    var undoButton = new UndoButton(tableModel);
    var redoButton = new RedoButton(tableModel);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>

            <MenuButton button={newSpreadsheetButton} onPress={props.buttonHandler} disabled={false}/>

            <ImportFile tableModel={props.spreadsheetData} updateSheet={props.onFormulaEdit}/>

            <ExportFile tableModel={props.spreadsheetData} />
            
            <MenuButton button={addRow} onPress={props.buttonHandler} disabled={false} />
            <MenuButton button={addColumn} onPress={props.buttonHandler} disabled={false} />
            <MenuButton button={undoButton} onPress={props.buttonHandler} disabled={!props.canUndo} />
            <MenuButton button={redoButton} onPress={props.buttonHandler} disabled={!props.canRedo} />

            <Manual />

            <Typography className="formula-indicator" component="div" align="right">
                Formula:
            </Typography>

            <Formula 
              spreadsheetData = {props.spreadsheetData}
              currentCell = {props.currentCell}
              displayFormula = {props.displayFormula}
              setDisplayFormula = {props.setDisplayFormula}
              onFormulaEdit = {props.onFormulaEdit}
            />

        </Toolbar>
        
      </AppBar>
    </Box>
  );

  // TODO: indicate which cell you're editing in the formula box. this is a little harder lol

  // Things we can containerize here: the menu buttons, the formula entry. The formula entry logic shouldn't be here.
}