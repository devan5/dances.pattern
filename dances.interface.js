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
				sName = this.$getName(),
				arr = this.$getMethods(),

				len = arr.length - 1,
				sMethod
			;

			do{
				sMethod = arr[len];
				if(!checked.hasOwnProperty(sMethod)){
					throw new Error("Interface Error: instance does not implement the [" + sName + "] interface. Method [" + sMethod + "] was not found.");
				}
			}while(len--);

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

			itemI,
			len = args.length - 1
		;

		do{
			itemI = args[len];
			itemI.implements(checked);
		}while(len--);

		return true;

	};

	"function" === typeof window.define && define.amd && define.amd.dancesInterface && define(function(){
		return face;
	});

})(window.dances);

 (function(){
	 return;

	Interface = dances.klass(null, {
		_init: function(sInterNme, arrM){
			var len = arrM.length,
				item
			;

			this.name = sInterNme;
			this.method = [];

			while(len--){
				item = arrM[len];
				if("string" !== typeof item){
					throw "Interface constructor expects method names to be passed in as a string";
				}
				this.method.push(item);
			}

			// gc
			item = null;
		},

		implements: function(inst){
			if(inst === null){
				throw "Interface.prototype.implements expects instance object";
			}
			var aMethod = this.method,
				len = aMethod.length,
				method
			;

			while(len--){
				method = aMethod[len];
				if(!inst[method] || "function" !== typeof inst[method]){
					throw "instance does not implement the [" + this.name + "] interface. Method [" + method + "] was not found.";
				}
			}

			return this;
		}

	});

	exports = function(sName, aM){
		if(!sName || !aM || "string" !== typeof sName || !dances.type.isArrLike(aM)){
			throw "Interface constructor called with 2 arguments: a string and a array";
		}
		return new Interface(sName, aM);
	};

	exports.implements = function(){
		var arg = Array.prototype.slice.call(arguments,0),
			inst,

			iNum,
			iFace,

			num,
			method
		;
		inst = arg.shift();

		if(inst === null || "object" !== typeof inst){
			throw new SyntaxError("Interface.implements expect instance object");
		}

		if(0 === arg.length){
			throw new SyntaxError("Interface.implements expect Interface instance at last one");
		}

		iNum = arg.length;
		while(iNum--){
			iFace = arg[iNum];
			if(iFace instanceof Interface){
				num = iFace.method.length;
				while(num--){
					method = iFace.method[num];
					if(!inst[method] || "function" !== typeof inst[method]){
						throw new Error("Interface Error: instance does not implement the [" + iFace.name + "] interface. Method [" + method + "] was not found.");
					}
				}
			}else{
				throw "Interface.implements expect Interface instance";
			}
		}

	};

	return exports;
 })();