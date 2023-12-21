
# CS4530 Course Project

Please push the project deliverables to appropriate directories:
 - `implementation`: Any and all code you write should go here (both server and client).
 - `project-presentation`: Slides for the final project presentation and the project demo (if required).
 - `project-report`: The final project report PDF and any other supporting files.
 - `phase-B-design`: The UML design and classes/interfaces and any other phase B deliverables.
 - `weekly-progress-reports`: All weekly progress reports.

# Installation and Running

To install the necessary pacakges, run `npm install`. To run the application, run `npm start`. To test the application, run `npm test`. 

# Usage

This can also be accessed from inside the application by pressing the "Manual" button. 

*   To enter a formula, start by typing equals. Ex. "=1+2" will resolve as 3, while "1+2" will resolve as "1+2".
*   Mathematical Operations:
    *   addition: +,
    *   subtraction: -,
    *   multiplication: \*,
    *   division: /,
    *   exponent: ^
*   Cell Reference: REF(A1), where A is the column and 1 is the row. Rows are 1-indexed. 
*   Aggregation Operations: SUM(A1:A3); AVG(A1:A3); where A1:A3 is the range of cells to be included in the aggregation.
*   Statistics Operations:
    *   STDDEV(A1:A3); where A1:A3 is the range of cells which we want to know the standard deviation of
    *   ZTEST(A1:A3, x) where A1:A3 is the range of cells we want to use as a population sample, and x is the value we want to find the z-value of
    *   REG(A1:B3) where A1:A3 are the independant variables and B1:B3 are the corresponding variables we want a linear regression for
*   To submit a formula, press enter after typing your formula.
*   Import from File: Only CSV files are supported. Choose your file, then click the "Upload" button. The cloud indicator to the right of the Upload button will display the current file upload status – if there is an error, the cloud will be crossed out.
*   Export to file: After pressing export, enter your desired filename in the prompt. Files without a name will be named "untitled", and filenames without extensions will end in ".csv".  
*   Row Deletion: Click on the row numbers on the left of the spreadsheet, then follow the on-screen prompt.
*   Column Deletion: Click on the column labels at the top of the spreadsheet, then follow the on-screen prompt. 

## Notes

- Any errors arising as a result of a formula will be displayed to the right of the formula entry box, along with the accompanying error message. 
- Performance can be an issue with very large spreadsheets. When importing a file, there will be a warning if you try to upload a file greater than 8MB, but you can still continue the upload if you wish. This warning threshold of 8MB can be altered in `src/top_bar/import_file/ImportFile.tsx`.
- When making a new spreadsheet, we default to a 26 x 26 spreadsheet. This allows for sufficient room for most standard work. In the future, creating a new spreadsheet could be set manually with dimensions. 
