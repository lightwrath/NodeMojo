'use strict'
import { exec, execSync, spawn } from 'child_process';

import { appConfig, postConfig } from './appConfig.mjs'

export function launchClients() {
    let initalPIDs = [], currentPIDs = []
    for (let client of appConfig.slots) {
        console.log(`Launching client ${client.clientName} for ${client.slotName}`)
        exec(client.executable);
        while(initalPIDs.length === currentPIDs.length) {
            try {
                currentPIDs = execSync(`pidof ${client.processName}`).toString().replace('\n', '').split(' ')
            } catch {}
            sleep(1000)
        }
        const pid = currentPIDs.find(nextPID => !initalPIDs.find(prevPID => nextPID === prevPID))
        initalPIDs = [...currentPIDs]
        let returnedWindowIDs = null
        while (returnedWindowIDs === null) {
            try {
                returnedWindowIDs = execSync("xdotool search --pid " + pid).toString();
            } catch {}
            sleep(1000)
        }
        client.windowID = returnedWindowIDs.split('\n')[0]
        client.clientPID = pid
    }
    postConfig(appConfig)
}

export function positionClients() {
    for (const client of appConfig.slots) {
        execSync(`xdotool windowmove $(xdotool selectwindow) ${client.windowXPosition} ${client.windowYPosition}`);
    }
}

function sleep(ms) {
    var start = new Date().getTime(), expire = start + ms;
    while (new Date().getTime() < expire) { }
    return;
  }