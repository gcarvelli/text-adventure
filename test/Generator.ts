import { Item } from "../src/Models/Models";

export class Generator {
    public static NewItem() {
        let item = new Item();
        item.id = "itemid";
        item.name = "item_name";
        item.keywords = [ item.name ];
        return item;
    }
}
