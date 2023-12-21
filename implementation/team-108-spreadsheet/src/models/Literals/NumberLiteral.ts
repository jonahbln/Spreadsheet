import { Literal } from "../../interfaces/Literal";
import { StringLiteral } from "./StringLiteral";
import { ErrorLiteral } from "./ErrorLiteral";

export class NumberLiteral implements Literal {
    private value: number;

    constructor(value: number) {
        this.value = value;
    }

    public getValue(): number {
        return this.value;
    }

    public performBinaryOperation(other: Literal, operator: string): Literal {
        if(other instanceof ErrorLiteral) {
            return other;
        }
        if(other instanceof StringLiteral) {
            if(operator === "+")
            {
                return new StringLiteral(this.getValue().toString() + other.getValue());
            }
            else
            {
                throw Error("unexpected operation performed on a string literal: " + other.getValue());
            }
        }
        other = other as NumberLiteral;
        switch(operator)
        {
            case "+":
                return new NumberLiteral(this.getValue() + other.getValue());
            case "-":
                return new NumberLiteral(this.getValue() - other.getValue());
            case "*":
                return new NumberLiteral(this.getValue() * other.getValue());
            case "/":
                return new NumberLiteral(this.getValue() / other.getValue());
            case "^":
                return new NumberLiteral(Math.pow(this.getValue(), other.getValue()));
            default:
                throw Error("operator not recognized");
        }
    }
}