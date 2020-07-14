'use strict';
import EventEmitter from 'events';
import ioHook from 'iohook';

import triggerKeys from './triggerKeys.mjs';
import triggerPixels from './triggerPixels.mjs'
import triggerManager from './triggerManager.mjs';
import { initClients, positionClients } from './targetClients.mjs';
import keyboardBroadcaster from './keyboardBroadcaster.mjs'
import toggler from './toggler.mjs'
import config from './config.json';


let team = config.teams.LightWrath5

function init(appConfig) {
    if (process.argv[2] === "pixelcheck") {
        console.log(wowAssistProcesses.getPixel(process.argv[3], process.argv[4]));
    } 
    else if (process.argv[2] === "mousecheck") {
        ioHook.on('mousemove', event => {
            console.log("Position: X: " + (event.x + 1080) + " Y: " + event.y);
            console.log("Pixel: " + wowAssistProcesses.getPixel(event.x, event.y));
        });
        ioHook.start();
    } 
    else if (process.argv[2] === "keycheck") {
        ioHook.on('keydown', event => {
            console.log(event);
        });
        ioHook.start();
    } else {
    initClients(appConfig);
    positionClients(appConfig);
    }
}

function generateAppConfig (team, clients, characters) {
    let appConfig = {};
    let arrayIndex = 0
    for (const characterName of team.characters) {
        appConfig[characterName] = characters[characterName];
        appConfig[characterName].client = clients[team.clients[arrayIndex]]
        appConfig[characterName].client.windowID = "";
        for (const hotkeyName in appConfig[characterName].hotKeys) {
            if (appConfig[characterName].hotKeys[hotkeyName].triggers) {
                appConfig[characterName].hotKeys[hotkeyName].triggers.active = false;
            }
            if (appConfig[characterName].hotKeys[hotkeyName].triggers.key) {
                appConfig[characterName].hotKeys[hotkeyName].triggers.key.active = false;
            }
            if (appConfig[characterName].hotKeys[hotkeyName].triggers.pixel) {
                appConfig[characterName].hotKeys[hotkeyName].triggers.pixel.active = false;
            }
            if (appConfig[characterName].hotKeys[hotkeyName].events) {
                appConfig[characterName].hotKeys[hotkeyName].events.active = false;
            }
        }
        arrayIndex++
    }
    return appConfig;
}

const eventHub = new EventEmitter();
global.appConfig = generateAppConfig(team, config.clients, config.characters);
init(appConfig);
console.info(JSON.stringify(appConfig, null, 4));
triggerPixels()
triggerKeys()
triggerManager(eventHub)
keyboardBroadcaster(eventHub)
toggler(eventHub)