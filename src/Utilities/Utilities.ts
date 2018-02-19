import { Item } from "../Models/Models";

export function FindItemInList(items: Item[], name: string) {
    let filtered = items.filter(i => i.HasKeyword(name));
    if (filtered.length > 0) {
        return filtered[0];
    }
    return null;
}

export function FindItemInSubitemsAndContents(items: Item[], name: string) {
    let matches = new Array<Item>();
    items.forEach(item => {
        if (item.open.contents && item.open.isOpen && item.open.contents.length > 0) {
            matches.push.apply(matches, item.open.contents.filter(con => con.HasKeyword(name)));
        }
        if (item.subItems && item.subItems.length > 0) {
            matches.push.apply(matches, item.subItems.filter(con => con.HasKeyword(name)));
        }
    });
    if (matches.length > 0) {
        return matches[0];
    }
    return null;
}

export function FindItemByName(items: Item[], name: string) {
    // look at items in list
    let item = this.FindItemInList(items, name);
    if (item) {
        return item;
    }

    // Look at contents of items in list
    item = this.FindItemInSubitemsAndContents(items, name);
    if (item) {
        return item;
    }

    return null;
}
