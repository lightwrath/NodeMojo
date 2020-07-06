'use strict'

import robot from 'robotjs';
import iohook from 'iohook';

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
                    eventHub.emit('trigger', triggerData);
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
                    eventHub.emit('trigger', triggerData);
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

const defineKeys = {
    0: "<",
    1: "Escape",
    2: "1",
    3: "2",
    4: "3",
    5: "4",
    6: "5",
    7: "6",
    8: "7",
    9: "8",
    10: "9",
    11: "0",
    12: "+",
    13: "´",
    14: "BackSpace",
    15: "TAB",
    16: "q",
    17: "w",
    18: "e",
    19: "r",
    20: "t",
    21: "y",
    22: "u",
    23: "i",
    24: "o",
    25: "p",
    28: "Return",
    29: "Control_L",
    30: "a",
    31: "s",
    32: "d",
    33: "f",
    34: "g",
    35: "h",
    36: "j",
    37: "k",
    38: "l",
    41: "section",
    44: "z",
    45: "x",
    46: "c",
    47: "v",
    48: "b",
    49: "n",
    50: "m",
    55: "KP_Multiply",
    56: "Alt_L",
    57: "space",
    71: "KP_7",
    72: "KP_8",
    73: "KP_9",
    74: "KP_Subtract",
    75: "KP_4",
    76: "KP_5",
    77: "KP_6",
    78: "KP_Add",
    79: "KP_1",
    80: "KP_2",
    81: "KP_3",
    82: "KP_0",
    3637: "KP_Divide",
    3653: "Pause",
    3655: "Home",
    3663: "End",
    3665: "Page_Down",
    3667: "Delete",
    57416: "Up",
    57424: "Down",
    57419: "Left",
    57421: "Right"
}