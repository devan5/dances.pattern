/*_______
with dances

	called: observe

	version: 1.0

	firstDate: 2013.06.19

	lastDate: 2013.06.23

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
		repoHandle = {},

		repo,

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
		})(),

		uc = function(fn){
			return function(){
				return Function.prototype.call.apply(fn, arguments);
			}
		},

		slice = uc(Array.prototype.slice),

		toString = uc(Object.prototype.toString),

		indexOf = "function" === typeof Array.prototype.indexOf ?
			uc(Array.prototype.indexOf) :
			function(arr, item/*, fromIndex*/){
				
				var
					len,
					i,
					index = -1
				;

				if(arr && (len = arr.length) && len > 0){
					if(arguments.length > 2){
						i = arguments[2];

						if("number" !== typeof i || isNaN(i)){
							i = 0;

						}else if(i < 0){
							i = len + i;
						}

					}else{
						i = 0;
					}

					while(i < len){
						if(item === arr[i]){
							index = i;
							break;
						}
						i++;
					}
				}

				// gc
				item = null;

				return index;

			}

		,

		forEach = "function" === typeof Array.prototype.forEach ?
			uc(Array.prototype.forEach) :
			function(arr, fn , scope){
				var
					len,
					i,
					fHas
				;

				if(null == typeof arr){
					throw new TypeError("arr is null or not defined");
				}

				if("function" !== typeof fn){
					throw Error("TypeError : " + fn + " is not a function");
				}

				fHas = Object.prototype.hasOwnProperty;

				if(arr && (len = arr.length) && len > 0){
					i = 0;

					do{
						fHas.call(arr, i) && fn.call(scope, arr[i], i, arr);

					}while(++i < len);
				}

			}
		
	;

	repoHandle = {
		isSubscribed: function(name){
			var _i;
			name = (_i = name.indexOf(".")) > 0 ?
				name.substring(0, _i) :
				name
			;

			return "[object Array]" === toString(repo[name]);
		},

		subscribe: function(name, fn){
			var
				ns,
				_i,
				repoItem
			;

			if((_i = name.indexOf(".")) > 0){
				ns = name.substring(_i + 1);
				name = name.substring(0, _i);
			}

			this.isSubscribed(name) || (repo[name] = []);
			repoItem = repo[name];
			repoItem.push(fn);

			if(ns){
				"[object Array]" === toString(repoItem[ns]) || (repoItem[ns] = []);
				repoItem[ns].push(fn);
			}

		},

		// TODO 针对特别 fn 取消订阅
		unSubscribe: function(name, fn){
			var
				base = repo[name],
				_i,

				ns
			;

			if((_i = name.indexOf("."))){
				ns = name.substring(_i + 1);
				name = name.substring(0, _i);
			}

			if(ns){
				if("[object Array]" === toString(base[ns])){
					forEach(base[ns], function(fn){
						base.splice(indexOf(base, fn), 1);
					});

					base[ns].length = 0;
					delete base[ns];
				}

			}else{
				delete repo[name];
				base.length = 0;
				for(var prop in base){
					if(base.hasOwnProperty(prop)){
						"[object Array]" === toString(base[prop]) && (base[prop].length = 0);
						delete base[prop];
					}
				}
			}

			// gc
			base = null;
		},

		publish: function(name){
			forEach(repo[name], function(f){
				f();
			});
		}

	};

	Observe = {

		create: function(){
			var _repo = [];

			this.switchRepo = function(){
				repo = _repo;
			};

			this.create = function(){
				return this;
			};

			return this;
		},

		add: function(name, fn){
			if("string" === typeof name && "function" === typeof fn){
				this.switchRepo();
				repoHandle.subscribe(name, fn);
			}

			return this;
		},

		erase: function(name){
			this.switchRepo();
			repoHandle.isSubscribed(name) && repoHandle.unSubscribe(name);
			return this;
		},

		fire: function(name){
			this.switchRepo();
			repoHandle.isSubscribed(name) && repoHandle.publish(name);
			return this;
		}
	};

	function observe(){
		return create(Observe).create();
	}

	dances.observe = observe;

	"function" === typeof window.define && define.amd && define.amd.dancesObserve && define(function(){
		return observe;
	});

})(window.dances);