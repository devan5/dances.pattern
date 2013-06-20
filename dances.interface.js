 /*_______
with dances.pattern

	called: interface

	version: 1.0

	firstDate: 2013.06.20

	lastDate: 2013.06.20

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

(function(dances){
	"use strict";
	var Interface,

		exports
	;

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
})(window.dances);