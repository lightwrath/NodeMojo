'use strict'

import robot from 'robotjs'

/*
const templateObj = {
    color: "00ff00",
    x: "600",
    y: "100",
    slotName: ["lightwrath"],
    macro: ["macroName"]
}*/

let registeredPixels = [

]

export function addPixel(newPixel) {
    const searchResults = registeredPixels.find(pixelObj => {
        if (pixelObj.color === newPixel.color &&
            pixelObj.x === newPixel.x &&
            pixelObj.y === newPixel.y)
        {
            pixelObj.slotName.push(newPixel.slotName)
            pixelObj.macro.push(newPixel.macro)
        }
    })
    if (!searchResults) {
        registeredPixels.push(newPixel)
    }
    registeredPixels.forEach(pixel => pixel.state = false) //reset states
}

export function clearPixels() {
    registeredPixels = []
}

export function pixels(eventHub) {
    setInterval(() => {
        checkPixels(eventHub)
    }, 250)
}

function checkPixels(eventHub) {
    for (const pixel of registeredPixels) {
        if (matchPixel(pixel.color, pixel.x, pixel. y) && !pixel.state) {
            pixel.state = true
            eventHub.emit('pixel', pixel)
        } else if (!matchPixel(pixel.color, pixel.x, pixel. y) && pixel.state) {
            pixel.state = false
            eventHub.emit('pixel', pixel)
        }
    }
}

async function matchPixel(colour, x, y) { 
    if (robot.getPixelColor(x, y) === colour) {
       return true;
    } else {
       return false;
    }
}