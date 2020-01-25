import Vue from 'vue';

// Need to load the ToastService first
import ToastService from 'primevue/toastservice';
Vue.use(ToastService);

// Button
import Button from 'primevue/button';
Vue.component('Button', Button);
// Toast
import Toast from 'primevue/toast';
Vue.component('Toast', Toast);