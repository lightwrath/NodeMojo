'use strict'
import { exec, execSync, spawn } from 'child_process';

function initClients(teamConfig, clientConfig) {
    let PIDs = {
        oldState: "",
        newState: "",
        final: []
    }
    for (let clientName of teamConfig.clients) {
        PIDs.oldState = PIDs.newState;
        execSync(`cp "${clientConfig[clientName].copyClientConfig[0]}" "${clientConfig[clientName].copyClientConfig[1]}"`)
        exec(clientConfig[clientName].executable);
        while(PIDs.oldState === PIDs.newState) {
            try {
                PIDs.newState = execSync(`pidof ${clientConfig[clientName].processName}`).toString();
            } catch {
                sleep(1000);
            }
        }
        PIDs.final.push(PIDs.newState.replace(PIDs.oldState, ""));
    }
    sleep(10000);
    teamConfig.windowTargets = [];
    for (let clientIndex = 0; clientIndex < teamConfig.clients.length; clientIndex++) {
        let windowIDs = execSync("xdotool search --pid " + PIDs.final[clientIndex]).toString();
        teamConfig.windowTargets.push(windowIDs.split('\n')[0])
    }
    return teamConfig;
}

function positionClients(teamConfig, clientConfig) {
    for (let clientIndex = 0; clientIndex < teamConfig.clients.length; clientIndex++) {
        let winPosX = clientConfig[teamConfig.clients[clientIndex]].xPosition
        let winPoxY = clientConfig[teamConfig.clients[clientIndex]].yPosition
        execSync(`xdotool windowmove $(xdotool selectwindow) ${winPosX} ${winPoxY}`);
    }
    console.log("test")
}

function sleep(ms) {
    var start = new Date().getTime(), expire = start + ms;
    while (new Date().getTime() < expire) { }
    return;
  }

module.exports = {
    initClients,
    positionClients
}