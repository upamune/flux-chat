import {MessageData, RawMessage} from "../stores/MessageStore";
export default class ChatMessageUtil {
    public static convertRawMessage(rawMessage: RawMessage, currentThreadID: string): MessageData {
       let message: MessageData = {
           id: rawMessage.id,
           threadID: rawMessage.threadID,
           text: rawMessage.text,
           timestamp: rawMessage.timestamp,
           date: new Date(rawMessage.timestamp),
           authorName : rawMessage.authorName,
           isRead :rawMessage.threadID === currentThreadID
       };
        
       return message;
    }
    
    public static getCreatedMessageData(text: string, currentThreadID: string): MessageData {
       let ts: number = Date.now();

        let message: MessageData = {
            id: 'm_' + ts,
            threadID: currentThreadID,
            text: text,
            timestamp: ts,
            date: new Date(ts),
            authorName : '南みれぃ', // hard coded for example
            isRead : true
        };
        
        return message;
    }
    
}