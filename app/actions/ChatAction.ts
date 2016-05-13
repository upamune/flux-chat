import {RawMessage} from "../stores/MessageStore";

export interface ChatAction {
    type: number;
    text?: string;
    currentThreadID?: string;
    threadID?: string;
    rawMessage?: RawMessage;
    rawMessages?: RawMessage[];
}

