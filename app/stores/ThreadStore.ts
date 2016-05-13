/// <reference path="../../typings/tsd.d.ts" />

import ChatMessageUtil from "../utils/ChatMessageUtil";
import {ChatAction} from "../actions/ChatAction";
import {MessageData, RawMessage} from "./MessageStore";
import {ChatActionID} from "../actions/ChatActionID";
import {ChatAppDispatcher} from "../dispatcher/ChatDispatcher";
import EventEmitter = require('eventemitter3');

const CHANGE_EVENT = 'change';

interface MapStringTo<T> {
    [key:string] : T;
}

export interface ThreadData {
    id : string,
    lastMessage : MessageData,
    name : string,
}

type ThreadMap = MapStringTo<ThreadData>

let _threads: ThreadMap = {};
let _currentID : string;

class ThreadStoreStatic extends EventEmitter {
    private dispatchToken : string;
    
    constructor() {
        super();
    }

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
    
    public init(rawMessages : RawMessage[]) {
        rawMessages.forEach((message : RawMessage) => {
            const threadID = message.threadID;
            const thread = _threads[threadID];
            
            if (thread && thread.lastMessage.timestamp > message.timestamp) {
                return;
            }
            _threads[threadID] = {
                id : threadID,
                name : message.threadName,
                lastMessage : ChatMessageUtil.convertRawMessage(message, _currentID)
            }
            
        });
        
        if (!_currentID) {
            let allChrono = this.getAllChrono();
            _currentID = allChrono[allChrono.length - 1].id;
        }
        
        _threads[_currentID].lastMessage.isRead = true;
    }
    
    public get(id : string): ThreadData {
        return _threads[id];
    }
    
    public getAll(): ThreadMap {
        return _threads;
    }
    
    public getAllChrono(): ThreadData[] {
        let orderedThreads : ThreadData[] = [];
        
        for (let id in _threads) {
            let thread = _threads[id];
            orderedThreads.push(thread);
        }
        
        orderedThreads.sort((a : ThreadData,b : ThreadData) => {
            if (a.lastMessage.date < b.lastMessage.date) {
                return -1;
            } else if (a.lastMessage.date > b.lastMessage.date) {
                return 1;
            }
            return 0;
        });
        
        return orderedThreads;
    }
    
    public getCurrentID() : string {
        return _currentID;
    }
    
    public getCurrent() : ThreadData {
        return this.get(this.getCurrentID());
    }

}

export var ThreadStore: ThreadStoreStatic = new ThreadStoreStatic();

ThreadStore.setDispatchToken(ChatAppDispatcher.register((action: ChatAction) => {
    switch (action.type) {
        case ChatActionID.CLICK_THREAD:
            _currentID = action.threadID;
            _threads[_currentID].lastMessage.isRead = true;
            ThreadStore.emitChange();
            break;
        case ChatActionID.RECEIVE_RAW_MESSAGES:
            ThreadStore.init(action.rawMessages);
            ThreadStore.emitChange();
            break;
        default:
            // do nothing
    }
}));

