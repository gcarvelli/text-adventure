import { Item } from "../Models/Models";

export class Utilities {
    public static FindItemByName(items: Item[], name: string) {
        let matches = items.filter(function(item) {
            return item.name == name;
        });
        if (matches.length > 0) {
            return matches[0];
        } else {
            return null;
        }
    }
}