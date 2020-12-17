import {Message} from './types';
import {AbstractActions} from '../AbstractActions';
import {singleton} from 'tsyringe';
import { ReactNode } from 'react';

export class MessageState {
    messages: Message[] = [];
}


@singleton()
export class MessageActions extends AbstractActions<MessageState> {
    showMessage = this.createAction('SHOW_MESSAGE', (m: ReactNode)=> m).build.on(
        (state, action) => {
            return {...state, messages: [...state.messages, action.payload]} as MessageState;
        });

    clear = this.createAction('MESSAGES_CLEAR').build.on(state => {
        return {...state, messages: []} as MessageState;
    });

    constructor() {
        super(new MessageState());
    }

    get prefix(): string {
        return 'MESSAGE';
    }
}

