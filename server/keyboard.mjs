'use strict'
import iohook from 'iohook'

import { toggler } from './toggler.mjs'
import keyBroadcaster from './keyBroadcaster.mjs'
import defineKeys from './defineKeys.json'

export default function keyboard() {
    keyboardMonitor()

}

function keyboardMonitor() {
    iohook.on('keydown', function(keyEvent) {
        const definedKey = defineKeys[keyEvent.keycode]
        toggler(definedKey)
        keyBroadcaster(parseKeyObject(keyEvent, definedKey))
    })
    iohook.on('keyup', function(keyEvent) {
        const definedKey = defineKeys[keyEvent.keycode]
        keyBroadcaster(parseKeyObject(keyEvent, definedKey))
    })
    iohook.start('keydown');
    iohook.start('keyup');
}

function parseKeyObject(keyEvent, definedKey) {
    return {
        shiftKey: keyEvent.shiftKey,
        altKey: keyEvent.altKey,
        ctrlKey: keyEvent.ctrlKey,
        key: definedKey,
        state: keyEvent.type === "keydown" ? true : false
    }
}