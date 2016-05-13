/**
 * Created by upamune on 16/05/13.
 */

/// <reference path="../../typings/tsd.d.ts" />

import * as flux from "flux";
import {ChatAction} from "../actions/ChatAction";

export let ChatAppDispatcher: flux.Dispatcher<ChatAction> = new flux.Dispatcher();

