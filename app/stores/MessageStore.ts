/// <reference path="../../typings/tsd.d.ts" />

import {ChatAppDispatcher} from"../dispatcher/ChatDispatcher";
import {ChatAction} from "../actions/ChatAction";
import {ChatActionID} from "../actions/ChatActionID";
import {ThreadStore} from "./ThreadStore";
import ChatMessageUtil from "../utils/ChatMessageUtil";
import EventEmitter = require('eventemitter3');

const CHANGE_EVENT = 'change';

interface MapStringTo<T> {
    [key:string] : T;
}

export interface RawMessage {
    id : string,
    threadID : string,
    authorName : string,
    timestamp : number,
    text : string,
    threadName : string,
}

export interface MessageData {
    id: string,
    threadID: string,
    text: string,
    date: Date,
    timestamp: number,
    authorName : string,
    threadName? : string,
    isRead : boolean
}

type MessageMap = MapStringTo<MessageData>

let _messages: MessageMap = {};

class MessageStoreStatic extends EventEmitter {
    
    constructor(){
        super();
    } 
    
    private dispatchToken : string;
    
    public  setDispatchToken(dispatchToken : string) : void {
        this.dispatchToken = dispatchToken;
    }
    
    public  getDispatchToken() : string {
        return this.dispatchToken;
    }
    
    public emitChange() : void {
        this.emit(CHANGE_EVENT);
    }

    public addChangeListener(callback: () => void): void {
        this.on(CHANGE_EVENT, callback);
    }
    
    public removeChangeListener(callback: () => void): void {
        this.removeListener(CHANGE_EVENT, callback);
    }
    
    public get(id: string): MessageData{
        return _messages[id];
    }
    
    public getAll() : MessageMap {
        return _messages;
    }
    
    public getAllForThread(threadID : string): MessageData[] {
        let threadMessages : MessageData[] = [];
        for (let id in _messages) {
            if (_messages[id].threadID === threadID) {
                threadMessages.push(_messages[id]);
            }
        }
        threadMessages.sort((a,b) => {
            if (a.date < b.date) {
                return -1;
            } else if (a.date > b.date) {
                return 1;
            }
            return 0;
        });
        return threadMessages;
    }

    public getAllForCurrentThread() : MessageData[] {
        return this.getAllForThread(ThreadStore.getCurrentID());
    }
    
}

export var MessageStore: MessageStoreStatic = new MessageStoreStatic();

function _addMessages(rawMessages: RawMessage[]) {
    rawMessages.forEach((message) => {
        if (!_messages[message.id]) {
            _messages[message.id] = ChatMessageUtil.convertRawMessage(
                message,
                ThreadStore.getCurrentID()
            )
        }
    });
}

function _markAllInThreadRead(threadID: string) {
    for (let id in _messages) {
        if (_messages[id].threadID === threadID) {
            _messages[id].isRead = true;
        }
    }
}

MessageStore.setDispatchToken(ChatAppDispatcher.register((action: ChatAction): void => {
    switch (action.type) {
        case ChatActionID.CLICK_THREAD:
            ChatAppDispatcher.waitFor([ThreadStore.getDispatchToken()]);
            _markAllInThreadRead(ThreadStore.getCurrentID());
            MessageStore.emitChange();
            break;
        case ChatActionID.CREATE_MESSAGE:
            const message = ChatMessageUtil.getCreatedMessageData(
                action.text,
                action.currentThreadID
            );
            _messages[message.id] = message;
            MessageStore.emitChange();
            break;
        case ChatActionID.RECEIVE_RAW_MESSAGES:
            _addMessages(action.rawMessages);
            ChatAppDispatcher.waitFor([ThreadStore.getDispatchToken()]);
            _markAllInThreadRead(ThreadStore.getCurrentID());
            MessageStore.emitChange();
            break;
        default:
            // do nothing
    }
}));

