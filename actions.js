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
    return (dispatch, getState) => {
        dispatch({ type: "SAVE_GAME_MOMENT", moment: getState().game})
        dispatch({ type: "STEP_FORWARD" })
    }
}

export const goDirection = (keyDir) => {
    return (dispatch, getState) => {
        dispatch({ type: "SAVE_GAME_MOMENT", moment: getState().game})
        dispatch({
            type: "GO_DIRECTION",
            direction: keyDir
        })
    }
}

export const rewindingTime = () => {
    return (dispatch, getState) => {
        let { timeLine } = getState();
        if (timeLine.size !== 0) {
            dispatch({ type: "REWINDING_TIME_TO", moment: timeLine.first()})
        }
    }
}