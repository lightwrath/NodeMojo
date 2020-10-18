'use strict'

import { launchClients, positionClients } from './clients.mjs'
//import keyboardBroadcaster from './keyboardBroadcaster.mjs'
import keyboard from './keyboard.mjs'
import { initConfig } from './configManager.mjs'

import ioHook from 'iohook'
import robot from 'robotjs'


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
} else { //Main App
    let appConfig = initConfig()
    appConfig = launchClients(appConfig)
    positionClients(appConfig)
    console.log(appConfig)
}

export default appConfig

if (appConfig) {
    keyboard()
}