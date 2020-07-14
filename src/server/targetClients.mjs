'use strict'
import { exec, execSync, spawn } from 'child_process';

export function initClients(appConfig) {
    let PIDs = {
        oldState: "",
        newState: "",
        final: []
    }
    for (const characterName in appConfig) {
        PIDs.oldState = PIDs.newState;
        if (appConfig[characterName].client.copyClientConfig) {
            execSync(`yes | cp -rf "${appConfig[characterName].client.copyClientConfig[0]}" "${appConfig[characterName].client.copyClientConfig[1]}"`)
        }        
        exec(appConfig[characterName].client.executable);
        while(PIDs.oldState === PIDs.newState) {
            try {
                PIDs.newState = execSync(`pidof ${appConfig[characterName].client.processName}`).toString();
            } catch {
                sleep(1000);
            }
        }
        PIDs.final.push(PIDs.newState.replace(PIDs.oldState, ""));
    }
    sleep(10000);
    let clientIndex = 0;
    for (const characterName in appConfig) {
        let returnedWindowIDs = execSync("xdotool search --pid " + PIDs.final[clientIndex]).toString();
        appConfig[characterName].client.windowID = returnedWindowIDs.split('\n')[0]
        clientIndex++
    }
}

export function positionClients(appConfig) {
    for (const characterName in appConfig) {
        let winPosX = appConfig[characterName].client.xPosition;
        let winPoxY = appConfig[characterName].client.yPosition;
        execSync(`xdotool windowmove $(xdotool selectwindow) ${winPosX} ${winPoxY}`);
    }
}

function sleep(ms) {
    var start = new Date().getTime(), expire = start + ms;
    while (new Date().getTime() < expire) { }
    return;
  }

/*module.exports = {
    initClients,
    positionClients
}*/