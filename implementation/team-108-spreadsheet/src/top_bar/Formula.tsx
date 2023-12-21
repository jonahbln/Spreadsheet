import React from "react";

import { styled, alpha } from '@mui/material/styles';

import InputBase from '@mui/material/InputBase';
import FormulaAlert from "./FormulaAlert";
import { Cell } from "../models/Cell";
import { Spreadsheet } from "../models/Spreadsheet";
import { CellChangeAction } from "../models/sheetActions/CellChangeAction";


const FormulaEntry = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 1),
      // small left padding 
      paddingLeft: '12px',
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '30ch',
        '&:focus': {
          width: '30ch',
        },
      },
    },
  }));

  interface IFormulaProps {
      spreadsheetData: Spreadsheet;
      currentCell: Cell;
      displayFormula: string;
      setDisplayFormula(newFormula: string): void;
      onFormulaEdit(): void;
  }

export default function Formula(props: IFormulaProps) {
    
    function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>):void {
        if(e.key === 'Enter') {
            submitFormula();
        }
    }

    function submitFormula(): void {
        // console.log("Submitting text box");

        props.spreadsheetData.pushAction(new CellChangeAction(props.currentCell, props.displayFormula, props.currentCell.getformula()));
        props.currentCell.setformula(props.displayFormula);
        props.currentCell.updateCell();
        
        props.onFormulaEdit();
    }

    return (
        <div className="formula-entry-wrapper">
            <FormulaEntry className="formulaEntry">
                <StyledInputBase
                placeholder="Search…"
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyPress(e)}
                value={props.displayFormula}
                type="text"
                onChange={(e) => props.setDisplayFormula(e.target.value)}
                />
            </FormulaEntry>
            
            <FormulaAlert currentCell={props.currentCell} />
        </div>
    )
}