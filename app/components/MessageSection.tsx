import * as React from 'react';
import {MessageData, MessageStore} from "../stores/MessageStore";
import {ThreadData, ThreadStore} from "../stores/ThreadStore";
import * as ReactDOM from 'react-dom';
import {MessageListItem} from "./MessageListItem";
import {MessageComposer} from "./MessageComposer";

interface MessageSectionState {
    messages : MessageData[],
    thread : ThreadData
}

export class MessageSection extends React.Component<{}, MessageSectionState> {

    public constructor(props) {
        super(props);
        this.state = this.getStateFromStores();
    }

    public componentDidMount() {
        this.scrollToBottom();
        MessageStore.addChangeListener(this.onChange.bind(this));
        ThreadStore.addChangeListener(this.onChange.bind(this));
    }
    
    public componentWillMount() {
        MessageStore.removeChangeListener(this.onChange.bind(this));
        ThreadStore.removeChangeListener(this.onChange.bind(this));
    }
    
    public render() : React.ReactElement<{}> {
        const messageListItems = this.state.messages.map(this.getMessageListItem);
        return (
            <div className="message-section">
                <h3 className="message-thread-heading">{this.state.thread.name}</h3>
                <ul className="message-list" ref={this.messageListRef}>
                    {messageListItems}
                </ul>
                <MessageComposer
                    threadID={this.state.thread.id} />
            </div>
        );
    }

    private getStateFromStores() : MessageSectionState {
        return {
            messages : MessageStore.getAllForCurrentThread(),
            thread : ThreadStore.getCurrent()
        };
    }

    private getMessageListItem(message : MessageData) : React.ReactElement<{}> {
        return (
            <MessageListItem
                key={message.id}
                message={message}
            />
        );
    }
    
    private scrollToBottom() {
        const ul = ReactDOM.findDOMNode(this.refs[this.messageListRef]);
        ul.scrollTop = ul.scrollHeight;
    }
    
    private messageListRef: string = "messageList";
    
    private onChange() {
        this.setState(this.getStateFromStores());
    }
    
}
