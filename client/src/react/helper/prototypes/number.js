import { injectPrototypes } from './lib/injectPrototypes';

let newPrototypes = {};

/**
* toArray, build an simple array from a given length, i.e. [0,1,2,3 ..N], e.g. (5 => [0,1,2,3,4])
* @param {Number} this
* @return {Array}
*/

newPrototypes.toArray = function(k=0, arr=[]) {
  if(typeof this !== 'number') return [];
  while(k < this) arr.push(k++);
  return arr
}



injectPrototypes(Number.prototype, newPrototypes);
