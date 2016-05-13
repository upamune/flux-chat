import * as React from 'react';
import {ThreadSection} from './ThreadSection';
import {MessageSection} from './MessageSection';

export class ChatApp extends React.Component<{},{}> {
    
    public render() : React.ReactElement<{}> {
        return(
            <div className="chatapp">
                <ThreadSection/>
                <MessageSection/>
            </div>
        );
    }
}