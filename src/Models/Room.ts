import { Item } from "./Item";
import { MoveMap } from "./Maps";

export class Room {
    id: string;
    name: string;
    description: string;
    moves: MoveMap;
    items: Item[];

    constructor() {
        this.moves = { };
        this.items = new Array<Item>();
    }

    public GetDescription(): string[] {
        let desc = new Array<string>();
        desc.push(this.description);
        this.items.forEach(item => {
            desc[0] += item.GetDescriptionAddition();
            item.GetDescriptionAdditionLines().forEach((line) => {
                desc.push(line);
            });
        });

        return desc;
    }
}
