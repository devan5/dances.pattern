# dances.pattern
专注于 javascript 设计模式

## 包含模块
+ dances.observe
+ dances.klass
+ dances.interface

### dances.observe

#### craft
	var inst = dances.observe();

	inst.subscribe("eventName", eventFn);
	inst.unsubscribe("eventName", eventFn);
	inst.publish("eventName", eventFn);

### dances.klass

#### syntax

	dances.klass([bCallParent, ][parentClass, ]constructor);
	dances.klass([bCallParent, ][parentClass, ]opts);

`new klass()` 等同于 `dances.klass`;

#### return  
实例 newKlass.

#### parma

+ bCallParent(Bl)  
可选, 默认false, 在实例化时候调用 parent 构造函数, 初始化实例.

+ parentClass(Fn || Obj)  
可选, 需要继承的类

+ constructor(Fn)
构造函数, 用于实例化类.

+ opts(Obj)
	* $parentArgs(单列 || 数组形式)
	可选, 传入父类构造函数的参数
		
	* $constructor
		
	* $mix	

#### klass.method
新类的方法.  
`var klass = new Klass();`

+ extend 
对类静态方法进行扩展.

	newKlass.extend(name, fn);
	newKlass.extend(obj[, props]);

+ implement
对类的原型进行扩展.

	newKlass.implement(name, fn);
	newKlass.implement(obj[, props]);

+ mix
掺元

	newKlass.mix([klass, ]klass[, props]);  
	* klass(Fn || fn.prototype)  
	mix类	

	* props(Str)  
	筛选属性, 以逗号隔开  


### dances.interface 
	var iCar = dances.interface("car", ["start", "break"]);
	var iSuperCar = dances.interface("superCar", ["fly"]);

	iCar.implements(obj2beCheck);

	dances.interface.implements(obj2beCheck, iCar)

	dances.interface.implements(obj2beCheck, iCar ,iSuperCar)