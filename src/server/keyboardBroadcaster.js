'use strict'
import iohook from 'iohook';
import { exec } from 'child_process';

import defineKeys from './defineKeys.json';

function convertKeyEvent(keyEvent) {
    let keyString = [];
    const key = defineKeys[keyEvent.keycode];
    if (keyEvent.shiftKey) {
        keyString.push("Shift_R")
    } else if (keyEvent.altKey) {
        keyString.push("Alt_R")
    } else if (keyEvent.ctrlKey) {
        keyString.push("Control_R")
    } else if (keyEvent.metaKey) {
        keyString.push("Meta_R")
    }
    keyString.push(key);
    return keyString.join('+')
}

export default function keyboardcaster (team, eventHub) {
    let keyBoardcaster = false
    iohook.on('keydown', function(keyEvent) {
        if (keyBoardcaster) {
            const keyString = convertKeyEvent(keyEvent);
            console.log("Broadcast keys: " + keyString)
            for (const window of team.windowTargets) {
                exec(`xdotool keydown --window ${window} ${keyString}`)
            }
        }
        if (keyEvent.keycode === 3655) {
            if (keyBoardcaster) {
                keyBoardcaster = false;
                console.log("keyboard broadcaster toggled off")
            } else {
                keyBoardcaster = true;
                console.log("keyboard broadcaster toggled on")
            }
        }
    })
    iohook.on('keyup', function(keyEvent) {
        if (keyBoardcaster) {
            const keyString = convertKeyEvent(keyEvent);
            for (const window of team.windowTargets) {
                exec(`xdotool keyup --window ${window} ${keyString}`)
            }
        }
    })
    iohook.start('keydown');
    iohook.start('keyup');
}