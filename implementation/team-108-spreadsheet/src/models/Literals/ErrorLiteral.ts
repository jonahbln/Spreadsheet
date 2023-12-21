import { Literal } from "../../interfaces/Literal";

export class ErrorLiteral implements Literal {
    private type: string;

    constructor(type: string) {
        this.type = type;
    }

    public getValue(): string {
        switch(this.type) {
            case "Reference":
                return "!REF";
            case "Value":
                return "!VAL";
            case "Expression":
                return "!EXP";
            case "Division":
                return "!DIV"
            default:
                return "!ERR"
        }
    }

    public performBinaryOperation(other: Literal, operator: string): Literal {
        return new ErrorLiteral("Reference");
    }
}