'use strict'
import { exec, execSync, spawn } from 'child_process';

import config from './config.json';

async function keyDownEvent(keys, windowTarget) {
    keys = keys.join(' ')
    exec(`xdotool keydown --window ${windowTarget} ${keys}`)
}

async function keyUpEvent(keys, windowTarget) {
    keys = keys.join(' ')
    exec(`xdotool keyup --window ${windowTarget} ${keys}`)
}

function eventProcessor(eventData) {
    let team = config.teams.LightWrath5
    let characters = config.characters
    let idIndex = team.characters.indexOf(eventData.character);
    let windowTarget = team.windowTargets[idIndex];
    let keys = characters[eventData.character].hotKeys[eventData.hotkey].events.key;
    console.log(`Event - Character: ${eventData.character}, Hotkey: ${eventData.hotkey}, Key(s): ${keys}, Active: ${eventData.active}`)
    if (eventData.active === true) {
        keyDownEvent(keys, windowTarget);
    } else {
        keyUpEvent(keys, windowTarget);
    }
}

function macrosOn(eventHub) {
    console.log("Macros toggled on")
    eventHub.on('macroEvent', eventProcessor);
}
function macrosOff(eventHub) {
    console.log("Macros toggled off")
    eventHub.off('macroEvent', eventProcessor);
}

module.exports = {
    macrosOn,
    macrosOff
}