import { Item } from "../src/Models/Item";

export class Generator {
    public static RandomString(): string {
        return Math.random().toString(36).substring(7);
    }
    public static NewItem(): Item {
        let item = new Item();
        item.id = this.RandomString();
        item.name = this.RandomString();
        item.description = this.RandomString();
        item.keywords = [ item.name ];
        return item;
    }

    public static NewItemData(): any {
        let item = this.NewItem();
        return {
            id: item.id,
            name: item.name,
            description: item.description,
            keywords: item.keywords
        };
    }
}
