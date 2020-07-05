'use strict'

import robot from 'robotjs';

let pixelState = {}

function initPixelState(team, characters) {
    function addToPixelState(hotKeyName, pixel) {
        let pixelName = `${pixel.colour}-${pixel.xPosition}x${pixel.yPosition}`
        if(pixelState[pixelName]) {
            pixelState[pixelName].hotKey = [hotKeyName, ...pixelState[pixelName].hotKey]
        } else {
            pixelState[pixelName] = pixel;
            pixelState[pixelName].state = false;
            pixelState[pixelName].hotKey = [hotKeyName]
        }
    }
    for (let character of team.characters) {
        for (let hotKeyName in characters[character].hotKeys) {
            let hotKey = characters[character].hotKeys[hotKeyName]
            if (hotKey.triggers.pixel) {
                addToPixelState(hotKeyName, hotKey.triggers.pixel)
            }
        }
    }
}

async function sendPixelEvents(eventHub) {
    for (let pixelName in pixelState) {
        let displayPixelState = matchPixel(pixelState[pixelName].colour, pixelState[pixelName].xPosition, pixelState[pixelName].yPosition)
        if(displayPixelState !== pixelState[pixelName].state) {
            pixelState[pixelName].state = displayPixelState;
            for (let hotKeyName of pixelState[pixelName].hotKey) {
                let eventData = {
                    triggerType: "pixel",
                    state: displayPixelState,
                    hotkey: hotKeyName
                }
                eventHub.emit('trigger', eventData);
                console.log(eventData)
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

export default async function main(team, characters, eventHub) {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    if (Object.keys(pixelState).length === 0) {
        initPixelState(team, characters);
        console.log(pixelState);
    }
    while (true) {
        await sendPixelEvents(eventHub);
        await sleep(250);
    }
}