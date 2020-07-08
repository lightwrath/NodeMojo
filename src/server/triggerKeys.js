'use strict'
import iohook from 'iohook';

import defineKeys from './defineKeys.json';

let keyState = {}

function initKeyState(team, characters) {
    function addToKeyState(hotKeyName, key) {
        let keyName = key
        if(keyState[keyName]) {
            keyState[keyName].hotKey = [hotKeyName, ...keyState[keyName].hotKey]
        } else {
            keyState[keyName] = {}
            keyState[keyName].key = key;
            keyState[keyName].state = false;
            keyState[keyName].hotKey = [hotKeyName]
        }
    }
    for (let character of team.characters) {
        for (let hotKeyName in characters[character].hotKeys) {
            let hotKey = characters[character].hotKeys[hotKeyName]
            if (hotKey.triggers.key) {
                addToKeyState(hotKeyName, hotKey.triggers.key)
            }
        }
    }
}

function keyboardMonitor(eventHub) {
    iohook.on('keydown', function(keyEvent) {
        const keyIndex = defineKeys[keyEvent.keycode]
        if (keyState[keyIndex]) {
            if (keyState[keyIndex].state === false) {
                keyState[keyIndex].state = true;
                for (let hotKeyName of keyState[keyIndex].hotKey) {
                    let triggerData = {
                        triggerType: "key",
                        state: true,
                        hotkey: hotKeyName
                    }
                    eventHub.emit('macroTrigger', triggerData);
                }
            }
        }
    })
    iohook.on('keyup', function(keyEvent) {
        const keyIndex = defineKeys[keyEvent.keycode]
        if (keyState[keyIndex]) {
            if (keyState[keyIndex].state === true) {
                keyState[keyIndex].state = false;
                for (let hotKeyName of keyState[keyIndex].hotKey) {
                    let triggerData = {
                        triggerType: "key",
                        state: false,
                        hotkey: hotKeyName
                    }
                    eventHub.emit('macroTrigger', triggerData);
                }
            }
        }
    })
    iohook.start('keydown');
    iohook.start('keyup');
}

export default function main(team, characters, eventHub) {
    if (Object.keys(keyState).length === 0) {
        initKeyState(team, characters);
        console.log(keyState);
    }
    keyboardMonitor(eventHub)
}