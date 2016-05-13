import {MessageData, RawMessage} from "../stores/MessageStore";
import {ChatActions} from "../actions/ChatActions";

export class ChatWebAPIUtils {
    public static getAllMessages() {
        const rawMessages : RawMessage[] = JSON.parse(localStorage.getItem('messages'));
        ChatActions.receiveAll(rawMessages);
    }
    
    public static createMessage(message : MessageData) {
        const rawMessages : RawMessage[] = JSON.parse(localStorage.getItem('messages'));
        const ts = Date.now();
        const id = 'm_' + ts;
        const tID = message.threadID || ('t_' + Date.now());
        const createdMessage : RawMessage = {
            id : id,
            threadID : tID,
            threadName : message.threadName,
            authorName : message.authorName,
            text : message.text,
            timestamp : ts
        };
        rawMessages.push(createdMessage);
        localStorage.setItem('messags', JSON.stringify(rawMessages));
        
        // simulate success callback
        setTimeout(() => {
            ChatActions.receiveCreatedMessage(createdMessage);
        }, 0);
    }
}