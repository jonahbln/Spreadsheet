
export interface Literal {
    getValue(): any;
    performBinaryOperation(other:Literal, operator:string):Literal;
}