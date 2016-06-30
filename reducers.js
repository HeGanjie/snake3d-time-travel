import Immutable from 'immutable';
import _ from 'lodash';
import { gen2dArr } from './utils.js'

export const StageWidth = 10, StageHeight = StageWidth;

export const GameState = {
	Init: 0,
	Playing: 1,
	Pause: 2,
	GameOver: 3
}

const SnakeHeadMoveDirection = {
	North: 0,
	East: 1,
	South: 2,
	West: 3
}

const initState = Immutable.fromJS({
	gameState: GameState.Init,
	foodPos: [],
	snakePosSeq: [],
	snakeHeadMoveDirection: SnakeHeadMoveDirection.North,
	movedAt: 0
});

const allXY = _.flatten(gen2dArr(StageWidth, StageHeight, (x, y) => [x, y]));

const dropAFood = (snakePosSeq) => _.sample(_.differenceWith(allXY, snakePosSeq, _.isEqual));

const calcNextStepXY = (currXY, direction) => {
	let [cX, cY] = currXY;
	switch (direction) {
		case SnakeHeadMoveDirection.North:
		return cY === StageHeight - 1 ? null : [cX, cY + 1];

		case SnakeHeadMoveDirection.East:
		return cX === StageWidth - 1 ? null : [cX + 1, cY];

		case SnakeHeadMoveDirection.South:
		return cY === 0 ? null : [cX, cY - 1];

		case SnakeHeadMoveDirection.West:
		return cX === 0 ? null : [cX - 1, cY];

		default:
		throw 'Direction not correct';
	}
}

const game = (state = initState, action) => {
	let currGameState = state.get('gameState');
	switch (action.type) {
		case "START_GAME":
		if (currGameState != GameState.Init && currGameState != GameState.GameOver) {
			return state;
		}
		var snakePosSeq = [[1, 1], [0, 1], [0, 0]];
		return state.set('gameState', GameState.Playing)
			.set('snakePosSeq', Immutable.fromJS(snakePosSeq))
			.set('snakeHeadMoveDirection', SnakeHeadMoveDirection.North)
			.set('foodPos', Immutable.fromJS(dropAFood(snakePosSeq)));

		case 'TOGGLE_PAUSE_GAME':
		if (currGameState == GameState.Pause) {
			return state.set('gameState', GameState.Playing);
		} else if (currGameState != GameState.Playing) {
			return state;
		}
		return state.set('gameState', GameState.Pause);

		case 'GO_DIRECTION':
		if (currGameState != GameState.Playing) {
			return state;
		}
		// 切换的方向不能是后退的方向
		let originalDirection = state.get('snakeHeadMoveDirection');
		if (originalDirection % 2 == action.direction % 2 && originalDirection != action.direction) {
			return state;
		}
		state = state.set('snakeHeadMoveDirection', action.direction);

		case 'STEP_FORWARD':
		if (currGameState != GameState.Playing) {
			return state;
		}
		if (state.get('snakePosSeq').length === StageWidth * StageHeight) {
			alert('You win.');
			return state.set('gameState', GameState.GameOver);
		}
		
		state = state.set('movedAt', Date.now());

		// 头部前进一格、若碰到食物、则尾部不需要前移
		// 如果长度达到 w * h 或无法前进，则游戏结束
		let targetPos = calcNextStepXY(state.getIn(['snakePosSeq', 0]), state.get('snakeHeadMoveDirection'));
		let foodPos = state.get('foodPos').toJS();

		if (targetPos === null) {
			alert('You loss');
			return state.set('gameState', GameState.GameOver);
		} else if (_.isEqual(foodPos, targetPos)) {
			let imTargetPos = state.get('foodPos'),
				newSnakeSeq = state.get('snakePosSeq').unshift(imTargetPos),
				newFoodPos = dropAFood(newSnakeSeq.toJS());
			return state.set('snakePosSeq', newSnakeSeq)
				.set('foodPos', Immutable.fromJS(newFoodPos));
		} else if (state.get('snakePosSeq').find(_.partial(_.isEqual, Immutable.fromJS(targetPos)))) {
			alert('You loss');
			return state.set('gameState', GameState.GameOver);
		} else {
			let imTargetPos = Immutable.fromJS(targetPos);
			return state.update('snakePosSeq', imArr => imArr.pop().unshift(imTargetPos));
		}

		case "REWINDING_TIME_TO":
		return action.moment;

		default:
		return state
	}
}

const timeLine = (state = Immutable.List(), action) => {
	switch (action.type) {
		case "SAVE_GAME_MOMENT":
		return state.unshift(action.moment);

		case "REWINDING_TIME_TO":
		return state.shift()
		
		default:
		return state;
	}
}

import { combineReducers } from 'redux';

const reducer = combineReducers({ game, timeLine });
export default reducer;