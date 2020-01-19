import Vue from 'vue';
import  Router from 'vue-router';
import Home from './components/pages/Home.vue';
import List from './components/pages/List.vue';
import Details from './components/pages/Details.vue';
import Verify from './components/pages/Verify.vue';

Vue.use(Router);
export default new Router({
    routes:[
        {
            path: "/",
            name: "home",
            component: Home,
        },
        {
            path: "/list/:category",
            name: "list",
            component: List
        },
        {
            path: "/view/:type/:id",
            name: "view",
            component: Details
        },
        {
            path: "/verify/",
            name: "verify",
            component: Verify
        }
    ],
    mode: "history"
})