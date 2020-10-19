'use strict'
import iohook from 'iohook'

import defineKeys from './defineKeys.json'

export default function keyboard(eventHub) {
    keyboardMonitor(eventHub)

}

function keyboardMonitor(eventHub) {
    iohook.on('keydown', function(keyEvent) {
        const definedKey = defineKeys[keyEvent.keycode]
        eventHub.emit('key', parseKeyObject(keyEvent, definedKey))
    })
    iohook.on('keyup', function(keyEvent) {
        const definedKey = defineKeys[keyEvent.keycode]
        eventHub.emit('key', parseKeyObject(keyEvent, definedKey))
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