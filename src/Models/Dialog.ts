import { IEventful } from "../Events/IEventful";
import { Event, EventType } from "../Events/Event";

export class NPCDialog {
    greeting: string;
    startTree: string;
}

export class DialogTree {
    id: string;
    options: DialogOption[];

    constructor() {
        this.options = new Array<DialogOption>();
    }
}

export class DialogOption implements IEventful {
    id: string;
    choice: string;
    response: string;
    events: Map<EventType, Event>;

    hasBeenChosen: boolean;

    public constructor() {
        this.events = new Map<EventType, Event>();
    }

    public GetEvent(id: EventType): Event {
        if (this.events) {
            return this.events[id];
        }
        return null;
    }

    public SetEvent(id: EventType, event: Event) {
        this.events[id] = event;
    }

    public SetEvents(eventMap: Map<EventType, Event>) {
        this.events = eventMap;
    }
}
