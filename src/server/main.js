'use strict';
import EventEmitter from 'events';
import ioHook from 'iohook';

import triggerKeys from './triggerKeys';
import triggerPixels from './triggerPixels.js'
import triggerManager from './triggerManager.js';
import eventManager from './eventManager.js';
import targetClients from './targetClients.js';
import config from './config.json';


let team = config.teams.LightWrath5

function init() {
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
    team = targetClients.initClients(team, config.clients);
    console.log(team);
    targetClients.positionClients(team, config.clients);
    }
}
const eventHub = new EventEmitter();
init();
console.log(team)
triggerPixels(team, config.characters, eventHub)
triggerKeys(team, config.characters, eventHub)
triggerManager(team, config.characters, eventHub)
eventManager(team, config.characters, eventHub)