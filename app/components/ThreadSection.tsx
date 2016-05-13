/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import {ThreadData, ThreadStore} from '../stores/ThreadStore';
import {UnreadThreadStore} from "../stores/UnreadThreadStore";
import {ThreadListItem} from "./ThreadListItem";

interface ThreadSectionState {
    threads : ThreadData[],
    currentThreadID : string,
    unreadCount : number
}

export class ThreadSection extends React.Component<{}, ThreadSectionState> {
    public constructor(props) {
        super(props);
        this.state = this.getStateFromStores();
    }
    
    public componentDidMount() {
        ThreadStore.addChangeListener(this.onChange.bind(this));
        UnreadThreadStore.addChangeListener(this.onChange.bind(this));
    }
    
    public componentWillUnmount() {
        ThreadStore.removeChangeListener(this.onChange.bind(this));
        UnreadThreadStore.removeChangeListener(this.onChange.bind(this));
    }
    
    private getStateFromStores() : ThreadSectionState {
        return {
            threads : ThreadStore.getAllChrono(),
            currentThreadID : ThreadStore.getCurrentID(),
            unreadCount : UnreadThreadStore.getCount()
        }
    }
    
    public render() : React.ReactElement<{}> {
        const threadListItems = this.state.threads.map((thread : ThreadData) => {
            return (
                <ThreadListItem
                    key={thread.id}
                    thread={thread}
                    currentThreadID={this.state.currentThreadID}
                />
            );
        });
        
        const unread = this.state.unreadCount === 0 ? null : <span>Unread threads: {this.state.unreadCount}</span>;
        
        return (
            <div className="thread-section">
                <div className="thread-count">
                    {unread}
                </div>
                <ul className="thread-list">
                    {threadListItems}
                </ul>
            </div>
        );
    }
    
    private onChange() {
        this.setState(this.getStateFromStores());
    }
    
}
