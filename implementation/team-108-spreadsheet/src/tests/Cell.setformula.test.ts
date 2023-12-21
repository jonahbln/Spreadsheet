import { Cell } from '../models/Cell';
import { Spreadsheet } from '../models/Spreadsheet';

describe('tests for cell formula setting and updating', (): void => {

  let sheet1: Spreadsheet;
  let cell1: Cell;

  beforeEach((): void => {
    sheet1 = new Spreadsheet(1,1);
    cell1 = sheet1.getCells()[0][0];
  });

  it('should return a singular number value', (): void => {
      cell1.setformula("89")
      cell1.updateCell();
    expect(cell1.getValue()).toBe(89);
  });

  it('should return a singular string value', (): void => {
    cell1.setformula("=\"hi\"")
    cell1.updateCell();
    expect(cell1.getValue()).toBe("hi");
  });

  it('should return the result of one + operation', (): void => {
    cell1.setformula("=7+9")
    cell1.updateCell();
    expect(cell1.getValue()).toBe(16);
  });

  it('should return the result of one - operation', (): void => {
    cell1.setformula("=7-9")
    cell1.updateCell();
    expect(cell1.getValue()).toBe(-2);
  });

  it('should return the result of one * operation', (): void => {
    cell1.setformula("=2*3")
    cell1.updateCell();
    expect(cell1.getValue()).toBe(6);
  });

  it('should return the result of one / operation', (): void => {
    cell1.setformula("=6/2")
    cell1.updateCell();
    expect(cell1.getValue()).toBe(3);
  });

  it('should return the result of two + operations', (): void => {
    cell1.setformula("=6+2+4")
    cell1.updateCell();
    expect(cell1.getValue()).toBe(12);
  });

  it('should return the result of switched operations', (): void => {
    cell1.setformula("=6+2-4")
    cell1.updateCell();
    expect(cell1.getValue()).toBe(4);
  });

  it('should return the result of two * operations', (): void => {
    cell1.setformula("=6*2*4")
    cell1.updateCell();
    expect(cell1.getValue()).toBe(48);
  });

  it('should return the result of two / operations', (): void => {
    cell1.setformula("=12/6/2")
    cell1.updateCell();
    expect(cell1.getValue()).toBe(1);
  });

  it('should return the result of mixed operations', (): void => {
    cell1.setformula("=6*2/4")
    cell1.updateCell();
    expect(cell1.getValue()).toBe(3);
  });

  it('should respect operator precendence', (): void => {
    cell1.setformula("=6+2*3")
    cell1.updateCell();
    expect(cell1.getValue()).toBe(12);
  });

  it('should respect operator precendence * then +', (): void => {
    cell1.setformula("=6*2+3")
    cell1.updateCell();
    expect(cell1.getValue()).toBe(15);
  });

  it('should respect operator precendence / then +', (): void => {
    cell1.setformula("=6/2+3")
    cell1.updateCell();
    expect(cell1.getValue()).toBe(6);
  });

  it('should respect operator precendence + then /', (): void => {
    cell1.setformula("=6+2/4")
    cell1.updateCell();
    expect(cell1.getValue()).toBe(6.5);
  });

  it('should do power functions', (): void => {
    cell1.setformula("=2^3")
    cell1.updateCell();
    expect(cell1.getValue()).toBe(8);
  });

  it('should do stacked power functions', (): void => {
    cell1.setformula("=2^2^2")
    cell1.updateCell();
    expect(cell1.getValue()).toBe(16);
  });

  it('should respect operator precendence + then ^', (): void => {
    cell1.setformula("=6+2^2")
    cell1.updateCell();
    expect(cell1.getValue()).toBe(10);
  });

  it('should respect operator precendence * then ^', (): void => {
    cell1.setformula("=6*2^2")
    cell1.updateCell();
    expect(cell1.getValue()).toBe(24);
  });

  it('should respect operator precendence / then ^', (): void => {
    cell1.setformula("=8/2^2")
    cell1.updateCell();
    expect(cell1.getValue()).toBe(2);
  });

  it('chained operator precedence', (): void => {
    cell1.setformula("=6+3*2^2");
    cell1.updateCell();
    expect(cell1.getValue()).toBe(18);
  });

  it('long expressions', (): void => {
    cell1.setformula("=6+3*2^2+4*2/2^2+5");
    cell1.updateCell();
    expect(cell1.getValue()).toBe(25);
  });

  it('parentheses', (): void => {
    cell1.setformula("=6+(3*2)^2");
    cell1.updateCell();
    expect(cell1.getValue()).toBe(42);
  });

  it('parentheses first', (): void => {
    cell1.setformula("=(6+3)*2^2");
    cell1.updateCell(); 
    expect(cell1.getValue()).toBe(36);
  });
  
  it('parentheses last', (): void => {
    cell1.setformula("=6+3*(2+2)");
    cell1.updateCell();
    expect(cell1.getValue()).toBe(18);
  });

  it('cell reference', (): void => {
    let sheet2 = new Spreadsheet(1,2);
    sheet2.getCells()[0][0].setformula("2");
    sheet2.getCells()[0][0].updateCell();

    sheet2.getCells()[0][1].setformula("=REF(A1)");
    sheet2.getCells()[0][1].updateCell();

    expect(sheet2.getCells()[0][1].getValue()).toBe(2);
  });

  it('massive reference', (): void => {
    let sheet2 = new Spreadsheet(154,120);
    sheet2.getCells()[134][27].setformula("hallo");
    sheet2.getCells()[134][27].updateCell();

    sheet2.getCells()[0][1].setformula("=REF(AB135)");
    sheet2.getCells()[0][1].updateCell();

    expect(sheet2.getCells()[0][1].getValue()).toBe("hallo");
  });

  it('cell reference with expressions', (): void => {
    let sheet2 = new Spreadsheet(1,2);
    sheet2.getCells()[0][0].setformula("=5+2*3");
    sheet2.getCells()[0][0].updateCell();

    sheet2.getCells()[0][1].setformula("=REF(A1)");
    sheet2.getCells()[0][1].updateCell();

    expect(sheet2.getCells()[0][1].getValue()).toBe(11);
  });

  it('invalid reference', (): void => {
    let sheet2 = new Spreadsheet(1,2);
    sheet2.getCells()[0][0].setformula("2");
    sheet2.getCells()[0][0].updateCell();

    sheet2.getCells()[0][1].setformula("=REF(A3)");
    sheet2.getCells()[0][1].updateCell()
    expect(sheet2.getCells()[0][1].getValue()).toBe("!REF");
  });

  it('circular reference', (): void => {
    let sheet2 = new Spreadsheet(1,2);
    sheet2.getCells()[0][0].setformula("=REF(B1)");
    sheet2.getCells()[0][0].updateCell();
    expect(sheet2.getCells()[0][0].isDependant(sheet2.getCells()[0][1])).toBe(true);
    expect(sheet2.getCells()[0][1].isDependant(sheet2.getCells()[0][1])).toBe(true);

    sheet2.getCells()[0][1].setformula("=REF(A1)");
    sheet2.getCells()[0][1].updateCell();

    expect(sheet2.getCells()[0][1].getValue()).toBe("!REF");
  });

  it('self reference', (): void => {
    sheet1.getCells()[0][0].setformula("=REF(A1)");

    sheet1.getCells()[0][0].updateCell()
    expect(sheet1.getCells()[0][0].getValue()).toBe("!REF");
  });

  it('range sum', (): void => {
    let sheet2 = new Spreadsheet(3,3);
    sheet2.getCells()[0][0].setformula("2");
    sheet2.getCells()[0][0].updateCell();
    sheet2.getCells()[0][1].setformula("3");
    sheet2.getCells()[0][1].updateCell();
    sheet2.getCells()[0][2].setformula("5");
    sheet2.getCells()[0][2].updateCell();

    sheet2.getCells()[1][0].setformula("=SUM(A1:C1)");
    sheet2.getCells()[1][0].updateCell();

    expect(sheet2.getCells()[1][0].getValue()).toBe(10);
    expect(sheet2.getCells()[1][0].isDependant(sheet2.getCells()[0][0])).toBe(true);
    expect(sheet2.getCells()[1][0].isDependant(sheet2.getCells()[0][1])).toBe(true);
    expect(sheet2.getCells()[1][0].isDependant(sheet2.getCells()[0][2])).toBe(true);
  });

  it('range average', (): void => {
    let sheet2 = new Spreadsheet(3,3);
    sheet2.getCells()[0][0].setformula("2");
    sheet2.getCells()[0][0].updateCell();
    sheet2.getCells()[0][1].setformula("3");
    sheet2.getCells()[0][1].updateCell();
    sheet2.getCells()[0][2].setformula("5");
    sheet2.getCells()[0][2].updateCell();

    sheet2.getCells()[1][0].setformula("=AVG(A1:C1)");
    sheet2.getCells()[1][0].updateCell();

    expect(sheet2.getCells()[1][0].getValue()).toBe(10/3);
    expect(sheet2.getCells()[1][0].isDependant(sheet2.getCells()[0][0])).toBe(true);
    expect(sheet2.getCells()[1][0].isDependant(sheet2.getCells()[0][1])).toBe(true);
    expect(sheet2.getCells()[1][0].isDependant(sheet2.getCells()[0][2])).toBe(true);
  });

});