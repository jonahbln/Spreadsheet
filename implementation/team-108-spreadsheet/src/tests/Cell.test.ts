import { Cell } from '../models/Cell';
import { Spreadsheet } from '../models/Spreadsheet';

describe('tests for cell evalutaion', (): void => {

  let sheet1: Spreadsheet;
  let cell1: Cell;
  beforeEach((): void => {
    sheet1 = new Spreadsheet(1,1);
    cell1 = sheet1.getCells()[0][0];
  });

  test('should return a singular number value', (): void => {
    expect(cell1.evaluate("89").getValue()).toBe(89);
  });

  it('should return a singular string value', (): void => {
    expect(cell1.evaluate("\"hi\"").getValue()).toBe("hi");
  });

  it('should return the result of one + operation', (): void => {
    expect(cell1.evaluate("7+9").getValue()).toBe(16);
  });

  it('should return the result of one - operation', (): void => {
    expect(cell1.evaluate("7-9").getValue()).toBe(-2);
  });

  it('should return the result of one * operation', (): void => {
    expect(cell1.evaluate("2*3").getValue()).toBe(6);
  });

  it('should return the result of one / operation', (): void => {
    expect(cell1.evaluate("6/2").getValue()).toBe(3);
  });

  it('should return the result of two + operations', (): void => {
    expect(cell1.evaluate("6+2+4").getValue()).toBe(12);
  });

  it('should return the result of switched operations', (): void => {
    expect(cell1.evaluate("6+2-4").getValue()).toBe(4);
  });

  it('should return the result of two * operations', (): void => {
    expect(cell1.evaluate("6*2*4").getValue()).toBe(48);
  });

  it('should return the result of two / operations', (): void => {
    expect(cell1.evaluate("12/6/2").getValue()).toBe(1);
  });

  it('should return the result of mixed operations', (): void => {
    expect(cell1.evaluate("6*2/4").getValue()).toBe(3);
  });

  it('should respect operator precendence', (): void => {
    expect(cell1.evaluate("6+2*3").getValue()).toBe(12);
  });

  it('should respect operator precendence * then +', (): void => {
    expect(cell1.evaluate("6*2+3").getValue()).toBe(15);
  });

  it('should respect operator precendence / then +', (): void => {
    expect(cell1.evaluate("6/2+3").getValue()).toBe(6);
  });

  it('should respect operator precendence + then /', (): void => {
    expect(cell1.evaluate("6+2/4").getValue()).toBe(6.5);
  });

  it('should do power functions', (): void => {
    expect(cell1.evaluate("2^3").getValue()).toBe(8);
  });

  it('should do stacked power functions', (): void => {
    expect(cell1.evaluate("2^2^2").getValue()).toBe(16);
  });

  it('should respect operator precendence + then ^', (): void => {
    expect(cell1.evaluate("6+2^2").getValue()).toBe(10);
  });

  it('should respect operator precendence * then ^', (): void => {
    expect(cell1.evaluate("6*2^2").getValue()).toBe(24);
  });

  it('should respect operator precendence / then ^', (): void => {
    expect(cell1.evaluate("8/2^2").getValue()).toBe(2);
  });

  it('chained operator precedence', (): void => {
    expect(cell1.evaluate("6+3*2^2").getValue()).toBe(18);
  });

  it('long expressions', (): void => {
    expect(cell1.evaluate("6+3*2^2+4*2/2^2+5").getValue()).toBe(25);
  });

  it('parentheses', (): void => {
    expect(cell1.evaluate("6+3*2^2").getValue()).toBe(18);
    expect(cell1.evaluate("6+(3*2)^2").getValue()).toBe(42);
  });

  it('parentheses first', (): void => {
    expect(cell1.evaluate("(6+3)*2^2").getValue()).toBe(36);
  });
  
  it('parentheses last', (): void => {
    expect(cell1.evaluate("6+3*2+2").getValue()).toBe(14);
    expect(cell1.evaluate("6+3*(2+2)").getValue()).toBe(18);
  });

  it('cell reference', (): void => {
    let sheet2 = new Spreadsheet(1,2);
    sheet2.getCells()[0][0].setformula("2");
    sheet2.getCells()[0][0].updateCell();
    expect(sheet2.getCells()[0][1].evaluate("REF(A1)").getValue()).toBe(2);
  });

  it('massive reference', (): void => {
    let sheet2 = new Spreadsheet(154,120);
    sheet2.getCells()[134][27].setformula("hallo");
    sheet2.getCells()[134][27].updateCell();
    expect(sheet2.getCells()[0][1].evaluate("REF(AB135)").getValue()).toBe("hallo");
  });

  it('cell reference with expressions', (): void => {
    let sheet2 = new Spreadsheet(1,2);
    sheet2.getCells()[0][0].setformula("=5+2*3");
    sheet2.getCells()[0][0].updateCell();
    expect(sheet2.getCells()[0][1].evaluate("REF(A1)").getValue()).toBe(11);
  });

  it('invalid reference', (): void => {
    let sheet2 = new Spreadsheet(1,2);
    sheet2.getCells()[0][0].setformula("2");
    sheet2.getCells()[0][0].updateCell();
    expect(() => {sheet2.getCells()[0][1].evaluate("REF(A3)")}).toThrow("Invalid cell reference")
  });

  it('circular reference', (): void => {
    let sheet2 = new Spreadsheet(1,2);
    sheet2.getCells()[0][0].setformula("=REF(B1)");
    sheet2.getCells()[0][0].updateCell();
    expect(sheet2.getCells()[0][0].isDependant(sheet2.getCells()[0][1])).toBe(true);
    expect(sheet2.getCells()[0][1].isDependant(sheet2.getCells()[0][1])).toBe(true);
    expect(() => {sheet2.getCells()[0][1].evaluate("REF(A1)")}).toThrow("Circular reference")
  });

  it('self reference', (): void => {
    expect(() => {sheet1.getCells()[0][0].evaluate("REF(A1)")}).toThrow("Circular reference")
  });

  it('range sum', (): void => {
    let sheet2 = new Spreadsheet(3,3);
    sheet2.getCells()[0][0].setformula("2");
    sheet2.getCells()[0][0].updateCell();
    sheet2.getCells()[0][1].setformula("3");
    sheet2.getCells()[0][1].updateCell();
    sheet2.getCells()[0][2].setformula("5");
    sheet2.getCells()[0][2].updateCell();
    expect(sheet2.getCells()[1][0].evaluate("SUM(A1:C1)").getValue()).toBe(10);
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
    expect(sheet2.getCells()[1][0].evaluate("AVG(A1:C1)").getValue()).toBe(10/3);
    expect(sheet2.getCells()[1][0].isDependant(sheet2.getCells()[0][0])).toBe(true);
    expect(sheet2.getCells()[1][0].isDependant(sheet2.getCells()[0][1])).toBe(true);
    expect(sheet2.getCells()[1][0].isDependant(sheet2.getCells()[0][2])).toBe(true);
  });

  it('range standard deviation', (): void => {
    let sheet2 = new Spreadsheet(3,3);
    sheet2.getCells()[0][0].setformula("10");
    sheet2.getCells()[0][0].updateCell();
    sheet2.getCells()[0][1].setformula("5");
    sheet2.getCells()[0][1].updateCell();
    sheet2.getCells()[1][0].setformula("5");
    sheet2.getCells()[1][0].updateCell();
    sheet2.getCells()[1][1].setformula("10");
    sheet2.getCells()[1][1].updateCell();
    expect(sheet2.getCells()[2][0].evaluate("STDDEV(A1:B2)").getValue()).toBe(2.5);
    expect(sheet2.getCells()[2][0].isDependant(sheet2.getCells()[0][0])).toBe(true);
    expect(sheet2.getCells()[2][0].isDependant(sheet2.getCells()[0][1])).toBe(true);
    expect(sheet2.getCells()[2][0].isDependant(sheet2.getCells()[1][0])).toBe(true);
    expect(sheet2.getCells()[2][0].isDependant(sheet2.getCells()[1][1])).toBe(true);
  });

  it('range ztest', (): void => {
    let sheet2 = new Spreadsheet(3,3);
    sheet2.getCells()[0][0].setformula("10");
    sheet2.getCells()[0][0].updateCell();
    sheet2.getCells()[0][1].setformula("5");
    sheet2.getCells()[0][1].updateCell();
    sheet2.getCells()[1][0].setformula("5");
    sheet2.getCells()[1][0].updateCell();
    sheet2.getCells()[1][1].setformula("10");
    sheet2.getCells()[1][1].updateCell();
    expect(sheet2.getCells()[2][0].evaluate("ZTEST(A1:B2, 10)").getValue()).toBe(1);
    expect(sheet2.getCells()[2][0].isDependant(sheet2.getCells()[0][0])).toBe(true);
    expect(sheet2.getCells()[2][0].isDependant(sheet2.getCells()[0][1])).toBe(true);
    expect(sheet2.getCells()[2][0].isDependant(sheet2.getCells()[1][0])).toBe(true);
    expect(sheet2.getCells()[2][0].isDependant(sheet2.getCells()[1][1])).toBe(true);
  });

  it('range regression', (): void => {
    let sheet2 = new Spreadsheet(3,3);
    sheet2.getCells()[0][0].setformula("0");
    sheet2.getCells()[0][0].updateCell();
    sheet2.getCells()[0][1].setformula("1");
    sheet2.getCells()[0][1].updateCell();
    sheet2.getCells()[1][0].setformula("1");
    sheet2.getCells()[1][0].updateCell();
    sheet2.getCells()[1][1].setformula("6");
    sheet2.getCells()[1][1].updateCell();
    sheet2.getCells()[2][0].setformula("2");
    sheet2.getCells()[2][0].updateCell();
    sheet2.getCells()[2][1].setformula("11");
    sheet2.getCells()[2][1].updateCell();
    expect(sheet2.getCells()[0][2].evaluate("REG(A1:B3)").getValue()).toBe("5x + 1");
    expect(sheet2.getCells()[0][2].isDependant(sheet2.getCells()[0][0])).toBe(true);
    expect(sheet2.getCells()[0][2].isDependant(sheet2.getCells()[0][1])).toBe(true);
    expect(sheet2.getCells()[0][2].isDependant(sheet2.getCells()[1][0])).toBe(true);
    expect(sheet2.getCells()[0][2].isDependant(sheet2.getCells()[1][1])).toBe(true);
    expect(sheet2.getCells()[0][2].isDependant(sheet2.getCells()[2][0])).toBe(true);
    expect(sheet2.getCells()[0][2].isDependant(sheet2.getCells()[2][1])).toBe(true);
  });

  // adding expressions to references
  it('adding numbers to cell references', (): void => {
    let sheet2 = new Spreadsheet(1,2);
    sheet2.getCells()[0][0].setformula("2");
    sheet2.getCells()[0][0].updateCell();
    expect(sheet2.getCells()[0][1].evaluate("REF(A1)+2").getValue()).toBe(4);
  });

  // instatiate strings with minus signs
  it ('Should interpret string literals (such as strings with dashes) not as equations.', (): void => {
    cell1.setformula("dog-cat");
    cell1.updateCell();
    expect(cell1.getValue()).toBe("dog-cat");
  });
  
});
