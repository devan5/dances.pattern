/*_______
with dances

	called: observe

	version: 1.0

	firstDate: 2013.06.19

	lastDate: 2013.06.19

	require: [
		""
	],

	effect: [
		+. dances 实现观察者模式,
		+. {effects}
	],

	log: {
		"1.0": [
			+. {logs},
			+. {logs}
		]
	}

_______*/

(function(dances, undefined){
	"use strict";

	var
		Observe,

		create = Object.create || (function(){

			var Foo = function(){ };

			return function(){

				if(arguments.length > 1){
					throw new Error('Object.create implementation only accepts the first parameter.');
				}

				var proto = arguments[0],
					type = typeof proto
					;

				if(!proto || ("object" !== type && "function" !== type)){
					throw new TypeError('TypeError: ' + proto + ' is not an object or null');
				}

				Foo.prototype = proto;

				return new Foo();
			}
		})()

	;

	function observe(){
		var inst = create(Observe);
		inst.create();
		return inst;
	}

	dances.observe = observe;

})(window.dances);