export class State {
    toggles: Map<string, boolean>;

    public constructor() {
        this.toggles = new Map<string, boolean>();
    }
}
