<template >
    <div>
       <table>
        <thead>
            <tr>
                <th v-for="col in columns">
                    {{col.name}}
                </th>
                <th>
                    delete
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(entry,index) in filterFn(dataList,searchKey)">
                <td v-for="col in columns">
                    <span v-if="col.isKey"><a href="javascript:void(0)" @click="openEditItemDialog(index)">{{entry[col.name]}}</a></span>
                    <span v-else>{{entry[col.name]}}</span>
                </td>
                <td  class="text-center">
                    <button class="btn-danger" @click="deleteItem(index)">delete</button>
                </td>
            </tr>
        </tbody>
       </table>
        <div class="container">
           <button class="btn" @click="openNewItemDialog('Create new item')">Create</button>
       </div>
       <modal-dialog :mode="mode" :title="title" :fields="columns" :item="item" v-on:create-item="createItem" v-on:update-item="updateItem"></modal-dialog> 
    </div>

</template>
<style>
    table,
    td,
    th {
        border-collapse: collapse;
        border-spacing: 0
    }

    table {
        width: 100%;
    }

    td,
    th {
        border: 1px solid #bcbcbc;
        padding: 5px 10px;
    }

    th {
        padding: 10px;
        font-weight: 400;
        color: #fff;
        background: #0090d3;
        cursor: pointer;
    }

    tr:nth-of-type(odd) {
        background: #fff
    }

    tr:nth-of-type(even) {
        background: #eee
    }
    .btn-danger{
        padding: 5px 15px;
        border: 1px solid salmon;
        background: salmon;
    }
</style>

<script>
import modalDialog from './modal-dialog.vue'
    export default{
        components:{
            modalDialog
        },
        data: function() {
            return {
                mode: 0,
                item: {},
                title: ''
            }
        },
        props:["dataList","columns","searchKey"],
        methods:{
            deleteItem:function(index){
                var data = this.dataList;
                data.splice(index,1);
            },
            filterFn:function(dataList,searchKey){
                return  this.dataList.filter(function(item){
                    var searchReg = new RegExp(searchKey)
                    return searchReg.test(item.name)
                })
            },
            openNewItemDialog: function(title) {
               // 对话框的标题
               this.title = title
               // mode = 1表示新建模式
               this.mode = 1
               // 初始化this.item
               this.item = {}
               // 调用子组件的showDialog方法，显示对话框
               this.$children[0].showDialog(true);
            },
            createItem: function() {
                this.keyColumn = this.columns.filter(function(opt){
                    return opt.isKey;
                })[0].name;
                    if(!this.itemExists(this.keyColumn)){
                    this.dataList.push(this.item);
                    this.$children[0].showDialog(false);
                    // 新建完数据后，重置item对象
                    this.item = {}
                }else{
                    alert(this.keyColumn + ' "' + this.item[this.keyColumn] + '" is already exists')
                }
            },
            openEditItemDialog: function(key) {

                // 根据主键查找当前修改的数据
                // var currentItem = this.findItemByKey(key)
                var currentItem = this.dataList[key];
                    // 对话框的标题
                this.title = 'Edit Item - ' + key;
                    // mode = 2表示修改模式
                this.mode = 2
                    // 初始化this.item
                this.item = {};
                 //将原数据浅拷贝到item中，这样item随输入改变时，dataList会随之改变
                this.item = currentItem;
                // this.item = this.initItemForUpdate(currentItem);
                this.$children[0].showDialog(true);
            }, 
            updateItem: function() {
                this.$children[0].showDialog(false);
                // 修改完数据后，重置item对象
                this.item = {};
            },
            itemExists: function(keyColumn) {
                for (var i = 0; i < this.dataList.length; i++) {
                    if (this.item[keyColumn] === this.dataList[i][keyColumn])
                        return true;
                }
                return false;
            },
        }
    }
</script>