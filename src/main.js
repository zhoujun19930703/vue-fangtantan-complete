import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "lib-flexible";
import "./style/index.scss";
import { ajax } from "./http";
import echarts from "echarts";
Vue.prototype.$echarts = echarts;
Vue.prototype.$ajax = ajax;

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");
