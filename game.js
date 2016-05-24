import React from 'react';
import React3 from 'react-three-renderer';
import THREE from 'three';
import _ from 'lodash';
import keyboardJS from 'keyboardjs';

import {vec3, gen2dArr, gen2dVec} from './utils.js';

import { StageWidth, StageHeight, GameState } from './reducers.js';

const GroundPlane = ({position}) => (
    <mesh
        position={position}
    >
        <planeGeometry
            width={.95}
            height={.95}
            dynamic={false}
        />
        <meshBasicMaterial
            color={0xf6f6f6}
            />
    </mesh>
);

const Block = ({position, size = 1, color = 0x00ff00}) => (
    <mesh
    	position={position}
    >
        <boxGeometry
            width={size}
            height={size}
            depth={size}
            />
        <meshBasicMaterial
            color={color}
            />
    </mesh>
);

import { startGame, stepForward, goDirection, KeyboardDirection, togglePauseGame } from './actions.js';

class Game extends React.Component {
    constructor(props, context) {
        super(props, context);

        // construct the position vector here, because if we use 'new' within render,
        // React will think that things have changed when they have not.
        this.cameraPosition = new THREE.Vector3((StageWidth - 1) / 2, (StageHeight - 1) / 2, 7);

        this.groundPlanePoses = _.flatten(gen2dVec(StageWidth, StageHeight));

        this.gameStateDesc = ['Init', 'Playing', 'Pause', 'GameOver'];

        this.allXY = _.flatten(gen2dArr(StageWidth, StageHeight, (x, y) => [x, y]));

        this.state = {
        };
    }

    componentDidMount() {
    	this._renderTrigger();
    	alert('[R] : StartGame\nArrow Key: Directions');

    	let { dispatch } = this.props;
    	const frameInterval = 500;
    	setInterval(() => {
    		let { movedAt, gameState } = this.props;
    		if (gameState == GameState.Playing && frameInterval <= Date.now() - movedAt) {
    			dispatch(stepForward())
    		}
    	}, frameInterval / 4);

    	keyboardJS.bind('r', e => dispatch(startGame()));
    	keyboardJS.bind('up', e => dispatch(goDirection(KeyboardDirection.Up)));
    	keyboardJS.bind('right', e => dispatch(goDirection(KeyboardDirection.Right)));
    	keyboardJS.bind('down', e => dispatch(goDirection(KeyboardDirection.Down)));
    	keyboardJS.bind('left', e => dispatch(goDirection(KeyboardDirection.Left)));
    	keyboardJS.bind('p', e => dispatch(togglePauseGame()));
    }

    componentWillReceiveProps(nextProps) {
    	if (!_.isEqual(nextProps, this.props)) {
    		if (this.props.gameState != nextProps.gameState) {
    			document.title = this.gameStateDesc[nextProps.gameState];
    		}
    		this._renderTrigger();
    	}
    }

    genBlockByXY(x, y) {
    	let {foodPos: [fX, fY], snakePosSeq: [[hX, hY] = [], ...restSnake]} = this.props;
    	if (hX === x && hY === y) {
    		return <Block key={`block:${x}-${y}`} size={1} position={vec3(x, y, .5)} color={0xff0000} />
    	} else if (fX === x && fY === y) {
    		return <Block key={`block:${x}-${y}`} size={0.9} position={vec3(x, y, .5)} color={0x0000ff} />
    	} else if (_.find(restSnake, _.partial(_.isEqual, [x, y]))) {
    		return <Block key={`block:${x}-${y}`} size={0.8} position={vec3(x, y, .5)} />
    	} else {
    		return null;
    	}
    }

    render() {
        const width = window.innerWidth; // canvas width
        const height = window.innerHeight; // canvas height
        
        return (<React3
            mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
            width={width}
            height={height}
            forceManualRender={true}
            onManualRenderTriggerCreated={(renderTrigger) => this._renderTrigger = renderTrigger }
            >
            <scene>
                <perspectiveCamera
                    name="camera"
                    fov={75}
                    aspect={width / height}
                    near={0.1}
                    far={1000}
                    position={this.cameraPosition}
                    />
                {this.allXY.map(([x, y]) => this.genBlockByXY(x, y))}
                {this.groundPlanePoses.map((v3, index) => <GroundPlane key={`ground:${index}`} position={v3}/>)}
            </scene>
        </React3>);
    }
}


const mapStateToProps = (state) => {
	return {
		gameState: state.get('gameState'),
		foodPos: state.get('foodPos').toJS(),
		snakePosSeq: state.get('snakePosSeq').toJS(),
		movedAt: state.get('movedAt')
	}
};
import { connect } from 'react-redux';
export default connect(mapStateToProps)(Game);
