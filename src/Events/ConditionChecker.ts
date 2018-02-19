import { Config } from "../Configuration/Config";
import { Condition } from "./Condition";
import { Output } from "../Engine/Engine";

export class ConditionChecker {
    constructor(private config: Config, private out: Output) { }

    public Check(condition: Condition) {
        let met = condition.IsMet(this.config);
        if (!met) {
            this.out.Print(condition.GetFailMessage(this.config));
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
