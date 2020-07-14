'use strict'
import iohook from 'iohook';

import {macrosOn, macrosOff} from './eventManager.mjs';

let macrosEnabled = true;

export default function toggler(eventHub) {
    iohook.on('keydown', function(keyEvent) {
        if (keyEvent.keycode === 3653) {
            if (macrosEnabled) {
                macrosOn(eventHub);
                macrosEnabled = false;
            } else {
                macrosOff(eventHub);
                macrosEnabled = true;
            }
        }
    });
    iohook.start('keydown');
}