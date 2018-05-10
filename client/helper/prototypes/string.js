import { injectPrototypes } from './lib/injectPrototypes';

let newPrototypes = {};

/**
* toCapitalize, build an simple array from a given length, i.e. [0,1,2,3 ..N], e.g. (5 => [0,1,2,3,4])
* @param {Number} this
* @return {Array}
*/
newPrototypes.toCapitalize = function() {
  return this && typeof this == 'string'
  ? this.charAt(0).toUpperCase() + this.slice(1)
  : ''
}



injectPrototypes(String.prototype, newPrototypes);
