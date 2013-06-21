 /*_______
with dances.pattern

	called: interface

	version: 1.0

	firstDate: 2013.06.21

	lastDate: 2013.06.21

	require: [
		"dances.klass"
	],

	effect: [
		+. 实现接口的存在,
		+. {effects}
	],

	log: {
		"v1.0": [
			+. {logs},
			+. {logs}
		]
	}

_______*/


(function(dances, undefined){
	"use strict";
	var
		Face,
		face,

		uc = function(fn){
			return function(){
				return Function.prototype.call.apply(fn, arguments);
			}
		},

		slice = uc(Array.prototype.slice),

		toString = uc(Object.prototype.toString),

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

	Face = {
		init: function(){
			var
				args = slice(arguments),
				sName,
				arrMethod
			;

			arrMethod = args.pop();
			sName = args.pop();

			if("string" !== typeof sName){
				throw new Error("expect interface name");
			}

			if("[array Object]" === toString(arrMethod) || 0 === arrMethod.length){
				throw new Error("expect method");
			}
			arrMethod = arrMethod.concat();

			this.$getName = function(){
				return sName
			};

			this.$getMethods = function(){
				return arrMethod
			};

			// overwrite
			this.init = null;
		},

		implements: function(checked){
			var
				arr = this.$getMethods(),

				len = arr.length - 1,
				sMethod
			;

			do{
				sMethod = arr[len];
				if(!checked.hasOwnProperty(sMethod) || "function" !== typeof checked[sMethod]){
					throw new Error("Interface Error: instance does not implement the [" + this.$getName() + "] interface. Method [" + sMethod + "] was not found.");
				}
			}while(len--);

			// gc
			sMethod = arr = null;

			return true;

		}

	};

	face = function(){
		var inst = create(Face);
		inst.init.apply(inst, arguments);
		return inst;
	};

	face.implements = function(){
		var
			args = slice(arguments),
			checked = args.shift(),

			face,
			len = args.length - 1
		;

		do{
			face = args[len];

			if(Face.isPrototypeOf(face)){
				face.implements(checked);
			}else{
				throw new Error("Interface.implements expect Interface instance");
			}

		}while(len--);

		// gc
		checked = face = args = null;

		return true;
	};

	"function" === typeof window.define && define.amd && define.amd.dancesInterface && define(function(){
		return face;
	});

})(window.dances);