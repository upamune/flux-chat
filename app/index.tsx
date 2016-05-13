/// <reference path="../typings/tsd.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ChatExampleData} from "./ChatExampleData";
import {ChatApp} from "./components/ChatApp";
import {ChatWebAPIUtils} from "./utils/ChatWebAPIUtils";

ChatExampleData.init();

ChatWebAPIUtils.getAllMessages();

ReactDOM.render(<ChatApp />, document.getElementById('react'));
