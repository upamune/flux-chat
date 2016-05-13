/**
 * Created by upamune on 16/05/13.
 */

import {ChatActionID} from "./ChatActionID";
import {RawMessage} from "../stores/MessageStore";
import ChatMessageUtil from "../utils/ChatMessageUtil";
import {ChatWebAPIUtils} from "../utils/ChatWebAPIUtils";
import {ChatAppDispatcher} from "../dispatcher/ChatDispatcher";

class ChatActionStatic {

    public createMessage(text: string, currentThreadID: string) {
        ChatAppDispatcher.dispatch({
            type: ChatActionID.CREATE_MESSAGE,
            text: text,
            currentThreadID: currentThreadID
        });
        const message = ChatMessageUtil.getCreatedMessageData(text, currentThreadID);
        ChatWebAPIUtils.createMessage(message);
    }
    
    public receiveAll(rawMessages: RawMessage[]) {
        ChatAppDispatcher.dispatch({
            type: ChatActionID.RECEIVE_RAW_MESSAGES,
            rawMessages: rawMessages
        });
    }
    
    public receiveCreatedMessage(createdMessage : RawMessage) {
        ChatAppDispatcher.dispatch({
            type: ChatActionID.RECEIVE_RAW_CREATED_MESSAGE,
            rawMessage: createdMessage
        });
    }
    
    public clickThread(threadID: string) {
        ChatAppDispatcher.dispatch({
            type: ChatActionID.CLICK_THREAD,
            threadID: threadID
        });
    }
}

export var ChatActions: ChatActionStatic = new ChatActionStatic();

