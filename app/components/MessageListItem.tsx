import * as React from 'react';
import {MessageData} from "../stores/MessageStore";

interface MessageListItemProps {
    key? : string,
    message : MessageData
}

export class MessageListItem extends React.Component<MessageListItemProps,{}> {
    public render() : React.ReactElement<{}> {
        const message = this.props.message;
        return (
            <li className="message-list-item">
                <h5 className="message-author-name">{message.authorName}</h5>
                <div className="message-time">
                    {message.date.toLocaleDateString()}
                </div>
                <div className="message-text">
                    {message.text}
                </div>
            </li>
        );
    }
}
