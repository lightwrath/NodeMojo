'use strict'
import ioHook from 'iohook'
import robot from 'robotjs'
import EventEmitter from 'events'

import { initAppConfig } from './appConfig.mjs'
import keyboard from './keyboard.mjs'
import  { toggler } from './toggler.mjs'

import { launchClients, positionClients } from './clients.mjs'

console.log(process.argv)
if (process.argv[2] === "pixelcheck") {
    function getPixel(x, y) {
        x = x+1080
        return robot.getPixelColor(x, y);
    }
    ioHook.on('mousemove', event => {
        console.log("Position: X: " + (event.x + 1080) + " Y: " + event.y);
        console.log("Pixel: " + getPixel(event.x, event.y));
    });
    ioHook.start();
} 
else if (process.argv[2] === "keycheck") {
    ioHook.on('keydown', event => {
        console.log(event);
    });
    ioHook.start();
}

initAppConfig()
const eventHub = new EventEmitter
keyboard(eventHub)
launchClients()
positionClients()
toggler(eventHub)