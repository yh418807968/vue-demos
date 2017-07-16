function observe(data) {
  if (!data || typeof data !== 'object') {
    return;
  }
  // 取出所有属性遍历
  Object.keys(data).forEach(function(key) {
      defineReactive(data, key, data[key]);
    });
}
function defineReactive(data, key, val) {
  var dep = new Dep();//告知每个属性，它对应的订阅者数组
  observe(val);  
  Object.defineProperty(data, key, {
  get: function() {
    // Dep.target为全局属性，作为中介保存着当前订阅者信息
    Dep.target && dep.addSub(Dep.target);
    return val;
  },
  set: function(newVal) {
   if (val === newVal) return;
   val = newVal;
   dep.notify(); // 通知所有订阅者这个变化
  }
 });
}
function Dep() {
  this.subs = [];//保存着订阅者信息
}
Dep.prototype = {
  //添加订阅者
  addSub: function(sub) {
    this.subs.push(sub);
  },
  //给每一个订阅者发布通知
  notify: function() {
    this.subs.forEach(function(sub) {
     sub.update();
    });
  }
}
//定义订阅者
function Watcher(vm,node,name){
  Dep.target = this;//使Dep.target指向当前新建的订阅者
  this.vm = vm;
  this.node = node;
  this.name = name;
  this.update();//这样每次新建订阅者时初始化，从而触发属性getter，将此订阅者加入属性中
  Dep.target = null;
}
Watcher.prototype={
  update:function(){
    //获得属性最新值,并赋给节点
    var value = this.vm.data[this.name];//触发属性的getter
    if(this.node.nodeType===1){
      this.node.value = value;
    }
    if(this.node.nodeType===3){
      this.node.nodeValue = value;
    }
  }
}



function complie(node,vm){
    //节点类型为元素
    if(node.nodeType ===1){
      var attr = node.attributes;
      //解析属性，寻找是否有v-model属性
      for(var i=0;i<attr.length;i++){
        if(attr[i].nodeName == "v-model"){
          node.addEventListener("input",function(){
            vm.data[name] = node.value;
          })
          var name =attr[i].nodeValue;//获得v-mode对应的属性名
          new Watcher(vm,node,name);//添加订阅者
        };
      };
      var childNodes = node.childNodes;
      [].slice.call(childNodes).forEach(function(node) {
        var text = node.textContent;
        var reg = /\{\{(.*)\}\}/;
        if (node.nodeType ===1) {
            compile(node);
        } else if (node.nodeType ===3 && reg.test(text)) {
            var name = RegExp.$1;
            name = name.trim();
            new Watcher(vm,node,name);//添加订阅者
        }
      });
    }
}
function nodeToFragment(node,vm){
  var fragment = document.createDocumentFragment();
  var child;
  while(child = node.firstChild){
    complie(child,vm);//解析节点
    fragment.append(child);//将节点劫持到fragment
  }
  return fragment ;
}
function Vue(options){
  this.data = options.data;
  observe(this.data,this);
  var dom =nodeToFragment(document.getElementById(options.el),this);
  document.getElementById(options.el).appendChild(dom);
}