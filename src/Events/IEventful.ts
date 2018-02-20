import { Event, EventType } from "./Event";

export interface IEventful {
    GetEvent(id: EventType): Event;
    SetEvent(id: EventType, event: Event);
    SetEvents(eventMap: Map<EventType, Event>);
}
