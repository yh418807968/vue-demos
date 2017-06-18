<template>
	<div>
		<div class="container">
			<div class="form-group">
				<label >search</label>
				<input type="text" class="search-input" v-model="searchStr">
			</div>
		</div>	
		<div class="container">
			<simple-grid :data-list="people" :columns="columns" :search-key="searchStr" >
			</simple-grid>
		</div>
	</div>

</template>

<style scoped>


	.search-input {
		width: 80%;
	}

	.form-group {
		margin: 10px;
	}

	.form-group > label {
		display: inline-block;
		padding-right: 1rem;
		width: 5rem;
		text-align: right;
	}
	.form-group > input{
		display: inline-block;
		height: 1.8rem;
		line-height: 1.8rem;
	}
</style>

<script>
import SimpleGrid from './simple-grid.vue'
	export default{
		components:{
			SimpleGrid
		},
		data:function(){
			return {
				searchStr: '',
				columns:[
				    {
				    	name:"name",
				    	isKey: true	
				    },{
				    	name:"age"

				    },{
				    	name:"sex",
				    	dataSource: ['Male', 'Female']
				    }
				],
				people:[
	                {
	                	name:"Jack",
	                	age:22,
	                	sex:"male"
	                },
	                {
	                	name:"Linda",
	                	age:24,
	                	sex:"female"
	                },
	                {
	                	name:"Mary",
	                	age:33,
	                	sex:"female"
	                },
	                {
	                	name:"Bob",
	                	age:13,
	                	sex:"male"
	                }

				]

			}
		}
	}
</script>