import { Item } from "../Models/Models";

export class Utilities {
    public static FindItemByName(items: Item[], name: string) {
        // look at items in list
        let matches = items.filter(item => {
            return item.HasName(name);
        });
        if (matches.length > 0) {
            return matches[0];
        }

        // Look at contents of items in list
        items.forEach(item => {
            if (item.contents && item.contents.length > 0) {
                matches.push.apply(matches, item.contents.filter(con => {
                    return con.HasName(name);
                }));
            }
        });
        if (matches.length > 0) {
            return matches[0];
        }

        return null;
    }
}