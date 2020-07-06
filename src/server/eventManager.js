'use strict'

import { exec, execSync, spawn } from 'child_process';

async function keyDownEvent(keys, windowTarget) {
    keys = keys.join(' ')
    exec(`xdotool keydown --window ${windowTarget} ${keys}`)
}

async function keyUpEvent(keys, windowTarget) {
    keys = keys.join(' ')
    exec(`xdotool keyup --window ${windowTarget} ${keys}`)
}

function eventProcessor(team, characters, eventHub) {
    eventHub.on('event', eventData => {
        let idIndex = team.characters.indexOf(eventData.character);
        let windowTarget = team.windowTargets[idIndex];
        let keys = characters[eventData.character].hotKeys[eventData.hotkey].events.key;
        console.log(`Event - Character: ${eventData.character}, Hotkey: ${eventData.hotkey}, Key(s): ${keys}, Active: ${eventData.active}`)
        if (eventData.active === true) {
            keyDownEvent(keys, windowTarget);
        } else {
            keyUpEvent(keys, windowTarget);
        }
    })
}

export default function main(team, characters, eventHub) {
    eventProcessor(team, characters, eventHub)
}