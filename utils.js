import THREE from 'three';
import _ from 'lodash';

export const vec3 = (x, y, z) => new THREE.Vector3(x, y, z);


export const gen2dArr = (w, h = w, iteratee = _.constant(0)) => {
    let rW = _.range(w),
    	rH = _.range(h);
	return rH.map(y => rW.map(x => iteratee(x, y)));
}

export const gen2dVec = (w, h = w, z = 0) => gen2dArr(w, h, (x, y) => vec3(x, y, z));