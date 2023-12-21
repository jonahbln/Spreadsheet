import { Literal } from "../../interfaces/Literal";
import { ErrorLiteral } from "./ErrorLiteral";

export class StringLiteral implements Literal {
    private value: string;

    constructor(value: string) {
        this.value = value;
    }

    public getValue(): string {
        return this.value;
    }

    performBinaryOperation(other: Literal, operator: string): Literal {

        if(other instanceof ErrorLiteral) {
            return other;
        }

        if(operator === "+")
        {
            return new StringLiteral(this.getValue() + other.getValue().toString());
        }
        throw Error("unexpected operation performed on a string literal: " + this.getValue());
    }
}