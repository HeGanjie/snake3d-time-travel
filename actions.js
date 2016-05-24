export const KeyboardDirection = {
	Up: 0,
    Right: 1,
	Down: 2,
	Left: 3
}

export const startGame = () => {
    return {
        type: "START_GAME"
    }
}

export const togglePauseGame = () => {
    return {
        type: "TOGGLE_PAUSE_GAME"
    }
}

export const stepForward = () => {
    return {
        type: "STEP_FORWARD"
    }
}

export const goDirection = (keyDir) => {
    return {
        type: "GO_DIRECTION",
        direction: keyDir
    }
}