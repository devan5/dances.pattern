/*_______
with dances.pattern

	called: klass

	version: 1.0

	firstDate: 2013.06.19

	lastDate: 2013.06.21

	require: [
		""
	],

	effect: [
		+. dances 实现类,
		+. {effects}
	],

	log: {
		"1.0": [
			+. {logs},
			+. {logs}
		]
	}

_______*/

/*
	// 所谓的 圣杯模式
	var inherit = (function(){
		var Foo = function(){};
		return function(Child, Parent){
			Foo.prototype = Parent.prototype;
			Child.prototype = new F();
			Child.$parent = Parent.prototype;
			Child.prototype.constructor = Child;
		};
	})();
*/

(function(dances, undefined){
	
	var
		Klass,

		fExtend,

		extend,
		implement,
		mix,

		uc = function(fn){
			return function(){
				return Function.prototype.call.apply(fn, arguments);
			}
		},

		slice = uc(Array.prototype.slice),

		toSting = uc(Object.prototype.toString)
	;

	fExtend = function(){
		var
			args = slice(arguments),

			sType
		;

		sType = typeof args[0];

		if("string" === sType){
			this[args[0]] = args[1];

		}else if("object" === sType){
			args = args[0];

			for(var prop in args){
				if(args.hasOwnProperty(prop) && args[prop]){
					this[prop] = args[prop];
				}
			}
		}

	};

	extend = function(){
		var args = slice(arguments);

		args[0] && fExtend.apply(this, args);

		// gc
		args = null;

		return this;

	};

	mix = function(){
		var
			args = slice(arguments),
			props,
			proto,

			i,
			len = args.length,
			item
		;

		"string" === typeof args[args.length - 1] && (props = args.pop() + ",");

		proto = this.prototype;

		for(i = 0; i < len; i++){
			item = args[i];
			"function" === typeof item && (item = item.prototype);

			for(var prop in item){
				if(item.hasOwnProperty(prop) && (!props || props.indexOf(prop + ",") > -1) && !proto.hasOwnProperty(prop)){
					proto[prop] = item[prop];
				}
			}

		}

		// gc
		item = proto = args = null;

		return this;

	};

	implement = function(){
		var args = slice(arguments);

		args[0] && fExtend.apply(this.prototype, args);

		// gc
		args = null;

		return this;

	};

	Klass = {
		pseudo: function(){},

		create: function(){
			var
				Klass,

				Parent,
				constructor,

				args = slice(arguments),
				props,
				bCallInParent
			;

			constructor = args.pop();
			Parent = args.pop();

			// 支持 父类的原型对象
			if(Parent && "[object Object]" === toSting(Parent) && "function" === typeof Parent.constructor){
				Parent = Parent.constructor;
			}

			bCallInParent = "function" === typeof Parent && args.pop();

			// 重载
			if(constructor && "[object Object]" === toSting(constructor) && "function" === typeof constructor.constructor){
				props = constructor;
				constructor = props.$constructor;
				delete props.$constructor;
			}

			"function" === typeof Parent || (Parent = null);
			"function" === typeof constructor || (constructor = null);

			// 装配构造函数
			Klass = constructor ?
				Parent && bCallInParent ?
					(function(Parent, constructor){
						return function(){
							Parent.apply(this, arguments);
							constructor.apply(this, arguments);
						};
					})(Parent, constructor)
					:
					(function(constructor){
						return function(){
							constructor.apply(this, arguments);
						}
					})(constructor)
				:
				function(){}
			;

			// 继承
			Parent && this.inherit(Klass, Parent);

			// 扩展原型对象
			if(props){
				for(var prop in props){
					if(props.hasOwnProperty(prop) && this.filters.indexOf(prop + ",") === -1){
						Klass.prototype[prop] = props[prop];
					}
				}
			}

			// 装配
			Klass.extend = extend;
			Klass.implement = implement;
			Klass.mix = mix;
			Klass.getParent = (function(Parent){
				return function(){ return Parent };
			})(Parent || null);

			// mix?
			props && props.$mix && Klass.mix.apply(Klass, props.$mix);

			// gc
			Parent = constructor = args = props = null;

			return Klass;

		},

		filters: "$constructor,$mix,",

		// 继承
		inherit: function(Klass, Parent){

			this.pseudo.prototype = Parent.prototype;
			Klass.prototype = new this.pseudo();
			Klass.prototype.constructor = Klass;

			Klass.$parent = Parent.prototype;

			Klass = Parent = null;

		}

	};
	
	function klass(){
		return Klass.create.apply(Klass, arguments);
	}
	
	dances.klass = klass;
	
	// 支持 new Klass
	window.Klass = function(){
		return klass.apply(null, arguments);
	};

	"function" === typeof window.define && define.amd && define.amd.dancesKlass && define(function(){
		return klass;
	});

})(window.dances);