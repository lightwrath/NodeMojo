'use strict'
import iohook from 'iohook';

import { macros } from './macroProcessor.mjs'

export default function toggler(appConfig) {
    iohook.on('keydown', function(keyEvent) {
        if (keyEvent.keycode === 3653) {
            macros(appConfig)
        }
    });
    iohook.start('keydown');
}