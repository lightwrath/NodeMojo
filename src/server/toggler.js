'use strict'
import iohook from 'iohook';

import eventManager from './eventManager.js';

let macrosEnabled = true;

export default function toggler(eventHub) {
    iohook.on('keydown', function(keyEvent) {
        if (keyEvent.keycode === 3653) {
            if (macrosEnabled) {
                eventManager.macrosOn(eventHub);
                macrosEnabled = false;
            } else {
                eventManager.macrosOff(eventHub);
                macrosEnabled = true;
            }
        }
    });
    iohook.start('keydown');
}