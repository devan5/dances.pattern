/*_______
with dances

	called: klass

	version: 1.0

	firstDate: 2013.06.19

	lastDate: 2013.06.19

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

(function(dances, undefined){
	
	var
		Klass,

		fExtend,
		fMix,

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

	Klass = {
		pseudo: function(){},

		create: function(){
			var
				klass,

				// !gc
				parent,
				constructor,

				args = slice(arguments),
				props,
				bCallInParent
			;

			constructor = args.pop();
			parent = args.pop();

			// 支持 父类的原型对象
			if("[object Object]" === toSting(parent) && "function" === typeof parent.constructor){
				parent = parent.constructor;
			}

			bCallInParent = "function" === typeof parent && args.pop();

			if("[object Object]" === toSting(constructor) && "function" === typeof constructor.constructor){
				props = constructor;
				constructor = props.$constructor;
				delete props.$constructor;

			}else if("function" !== typeof constructor){
				$$log("expect constructor as least", "error");
				return "";
			}

			"function" === typeof parent || (parent = null);

			(!parent || !bCallInParent) && (klass = function(){
				constructor.apply(this, arguments);

			});

			if(parent){

				bCallInParent && (klass = function(){
					parent.apply(this, arguments);
					constructor.apply(this, arguments);
				});

				this.inherit(klass, parent);
			}

			// 扩展原型对象
			if(props){
				for(var prop in props){
					if(props.hasOwnProperty(prop) && this.filters.indexOf(prop + ",") === -1){
						klass.prototype[prop] = props[prop];
					}
				}
			}

			this.extend(klass);

			// gc
			args = props = null;

			return klass;

		},

		filters: "$constructor,$mix,",

		// 继承
		inherit: function(klass, parent){

			this.pseudo.prototype = parent.prototype;
			klass.prototype = new this.pseudo();
			klass.prototype.constructor = klass;

		},

		// 装配方法
		extend : function(klass){

			klass.extend = function(){
				var args = slice(arguments);

				args[0] && fExtend.apply(this, args);

				// gc
				args = null;

				return this;

			};

			klass.implement = function(){
				var args = slice(arguments);

				args[0] && fExtend.apply(this.prototype, args);

				// gc
				args = null;

				return this;

			};

			klass.mix = function(){
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

					for(var prop in item){
						"function" === typeof item && (item = item.prototype);
						if(item.hasOwnProperty(prop) && (!props || props.indexOf(prop + ",") > -1) && !proto.hasOwnProperty(prop)){
							proto[prop] = item[prop];
						}
					}

				}

				// gc
				item = proto = args = null;

				return this;
			};

			klass = null;

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
	
})(window.dances);