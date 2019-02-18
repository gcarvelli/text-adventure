import { Config } from "../Configuration/Config";
import { Condition } from "./Condition";
import { Printer } from "../Output/Printer";

export class ConditionChecker {
    constructor(private config: Config, private printer: Printer) { }

    public Check(condition: Condition) {
        let met = condition.IsMet(this.config);
        if (!met) {
            this.printer.PrintLn(condition.GetFailMessage(this.config));
        }
        return met;
    }

    public CheckAll(conditions: Condition[]) {
        let met = true;
        conditions.forEach((condition) => {
            met = met && this.Check(condition);
        });

        return met;
    }
}
