import * as React from 'react';
import {ThreadData} from '../stores/ThreadStore';
import {ChatActions} from "../actions/ChatActions";

interface ThreadListItemProps {
    key? : string,
    thread : ThreadData,
    currentThreadID : string
}

export class ThreadListItem extends React.Component<ThreadListItemProps, {}> {
    
    constructor(props: ThreadListItemProps) {
        super(props);
    }
    
    public render(): React.ReactElement<{}> {
        const thread : ThreadData = this.props.thread;
        const lastMessage = thread.lastMessage;
        let classNames : string[] = ['thread-list-item'];
        if (thread.id === this.props.currentThreadID) {
            classNames.push('active');
        }
        let classname = classNames.join(' ');
        return (
            <li
                className={classname}
                onClick={this.onClick}>
                <h5 className="thread-name">{thread.name}</h5>
                <div className="thread-time">
                    {lastMessage.date.toLocaleDateString()}
                </div>
                <div className="thread-last-message">
                    {lastMessage.text}
                </div>
            </li>
        );
    }
    
    private onClick = () => {
        ChatActions.clickThread(this.props.thread.id)
    }
}