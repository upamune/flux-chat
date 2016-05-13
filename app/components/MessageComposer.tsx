import * as React from 'react';
import {ChatActions} from "../actions/ChatActions";
import Props = __React.Props;
import EventHandler = __React.EventHandler;

interface MessageComposerProps {
    threadID : string
}

interface MessageComposerState {
    text : string
}

const ENTER_KEY_CODE = 13;

export class MessageComposer extends React.Component<MessageComposerProps, MessageComposerState> {
    constructor(props: MessageComposerProps) {
        super(props);
        this.state = {
            text : ""
        };
    }
    
    public render() : React.ReactElement<{}> {
        return (
            <textarea
                className="message-composer"
                name="message"
                value={this.state.text}
                onChange={e => this.onChange(e)}
                onKeyDown={e => this.onKeyDown(e)}
            />
        );
    }

    private onChange(event) {
        this.setState({
            text : event.target.value
        });
    }
    
    private onKeyDown(event) {
        if (event.keyCode === ENTER_KEY_CODE) {
            event.preventDefault();
            const txt = this.state.text.trim();
            if (txt) {
                ChatActions.createMessage(txt, this.props.threadID);
            }
            this.setState({
                text : ''
            });
        }
    }
    
}


