/// <reference path="../../typings/tsd.d.ts" />

import {ThreadStore} from './ThreadStore';
import {ChatAction} from "../actions/ChatAction";
import {MessageStore} from "./MessageStore";
import {ChatActionID} from "../actions/ChatActionID";
import {ChatAppDispatcher} from "../dispatcher/ChatDispatcher";
import EventEmitter = require('eventemitter3');

const CHANGE_EVENT = 'change';

class UnreadThreadStoreStatic extends EventEmitter {
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
    
    public getCount() : number {
        const threads = ThreadStore.getAll();
        let unreadCount = 0;
        for (let id in threads) {
            if (!threads[id].lastMessage.isRead) {
                unreadCount++;
            }
        }
        return unreadCount;
    }

}

export let UnreadThreadStore = new UnreadThreadStoreStatic();

UnreadThreadStore.setDispatchToken(ChatAppDispatcher.register((action: ChatAction) => {
    ChatAppDispatcher.waitFor([
        ThreadStore.getDispatchToken(),
        MessageStore.getDispatchToken()
    ]);
    switch (action.type) {
        case ChatActionID.CLICK_THREAD:
            UnreadThreadStore.emitChange();
            break;
        case ChatActionID.RECEIVE_RAW_MESSAGES:
            UnreadThreadStore.emitChange();
            break;
        default:
            // do nothing
    }
}));
