import { Condition } from "./Condition";
import { Effect } from "./Effects";
import { Config } from "../Configuration/Config";

export enum EventType {
    Take
}

export class Event {
    private conditions: Condition[];
    private effects: Effect[];

    public GetConditions(): Condition[] {
        return this.conditions;
    }

    public SetConditions(conditions: Condition[]) {
        this.conditions = conditions;
    }

    public GetEffects(): Effect[] {
        return this.effects;
    }

    public SetEffects(effects: Effect[]) {
        this.effects = effects;
    }
}