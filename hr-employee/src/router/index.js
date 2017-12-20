import Vue from 'vue'
import Router from 'vue-router'
import employeeList from '~/employeeList'
import employee from '~/index'

Vue.use(Router)

export default new Router({
	mode: 'hash',
  	routes: [
    	{
	      	path: '/',
	      	component: employee,
	      	children: [
  			 	{path: '/', redirect: 'employeeList'}, 
		        {
		          path: '/employeeList',
		          name: 'employeeList',
		          component: employeeList
		        },
	    	]
    	}
  	]
})
