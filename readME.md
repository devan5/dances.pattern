# dances.pattern
专注于 javascript 设计模式

## 包含模块
+ dances.observe
+ dances.klass
+ dances.interface

### dances.observe

#### craft
	var evt = dances.observe();

	// 第一阶段
	evt.subscribe("eventName", eventFn);
	evt.unsubscribe("eventName", eventFn);
	evt.publish("eventName", eventFn);

	// 第二阶段
	增加, 事件名空间

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
		
	* $constructor(Fn)
	构造函数
		
	* $mix(Arr)	
	混入类

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
#### syntax
	dances.interface(interfaceName, implementMethod);
	dances.interface.implements(obj, interfaceInstance[, interfaceInstance]);

#### return
	interfaceInstance.

#### param
+ interfaceName(Str)
	用于显示__提示__, 哪一 interface 没有按需求实现. 

+ implementMethod(Arr)
	实现的方法名集群.

+ interfaceInstance
	dances.interface() 的实例

#### interfaceInstance.method
+ implements(Obj)
	返回 布尔值, 检测这个对象是否符合接口.

#### craft 
	var iCar = dances.interface("car", ["start", "break"]);
	var iSuperCar = dances.interface("superCar", ["fly"]);

	iCar.implements(obj2beCheck);

	dances.interface.implements(obj2beCheck, iCar)

	dances.interface.implements(obj2beCheck, iCar ,iSuperCar)