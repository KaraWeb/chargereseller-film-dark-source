import Vue from 'vue'
import Default from './components/layouts/Default'
import VueCryptojs from 'vue-cryptojs'
Vue.use(VueCryptojs);
Vue.config.productionTip = false;
import router from './router';
import store from './store';
import 'sweetalert2/dist/sweetalert2.min.css';
import swal from 'vue-sweetalert2';
Vue.use(swal,{confirmButtonText: 'باشه.'});
new Vue({
    router,
    store,
    VueCryptojs,
    render: h => h(Default),
    mounted:function () {
        this.$forceUpdate();
    }
}).$mount('#app');
