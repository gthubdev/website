import Vue from 'vue';

// have to import the datepicker this way
// will get 'window is not defined'-error otherwise
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
if (process.client) {
	const VueCtkDateTimePicker = require('vue-ctk-date-time-picker');
	Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker);
}
