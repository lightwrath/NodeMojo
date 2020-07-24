'use strict'

import robot from 'robotjs';

async function updatePixels(eventHub) {
    for (const characterName in appConfig) {
        for (const hotkeyName in appConfig[characterName].hotKeys) {
            if (appConfig[characterName].hotKeys[hotkeyName].triggers.pixel) {
                let pixelObject = appConfig[characterName].hotKeys[hotkeyName].triggers.pixel;
                const pixelState = matchPixel(pixelObject.colour, pixelObject.xPosition, pixelObject.yPosition);
                if (pixelObject.active != pixelState) {
                    pixelObject.active = pixelState;
                    eventHub.emit('trigger', {
                        type: "pixel",
                        character: characterName,
                        hotkey: hotkeyName,
                        active: pixelState
                    });
                }
            }
        }
    }
}

function matchPixel(colour, x, y) { 
    if (robot.getPixelColor(x, y) === colour) {
       return true;
    } else {
       return false;
    }
}

export default async function main(eventHub) {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    while (true) {
        await updatePixels(eventHub);
        await sleep(250);
    }
}