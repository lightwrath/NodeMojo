'use strict'

import robot from 'robotjs';

async function updatePixels() {
    for (const characterName in appConfig) {
        for (const hotkeyName in appConfig[characterName].hotKeys) {
            if (appConfig[characterName].hotKeys[hotkeyName].triggers.pixel) {
                appConfig[characterName].hotKeys[hotkeyName].triggers.pixel.active = matchPixel(
                    appConfig[characterName].hotKeys[hotkeyName].triggers.pixel.colour,
                    appConfig[characterName].hotKeys[hotkeyName].triggers.pixel.xPosition,
                    appConfig[characterName].hotKeys[hotkeyName].triggers.pixel.yPosition)
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

export default async function main() {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    while (true) {
        await updatePixels();
        await sleep(250);
    }
}