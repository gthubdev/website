import Vue from 'vue';

// Need to load the ToastService first
import ToastService from 'primevue/toastservice';
Vue.use(ToastService);

// AutoComplete
import AutoComplete from 'primevue/autocomplete';
Vue.component('AutoComplete', AutoComplete);
// Button
import Button from 'primevue/button';
Vue.component('Button', Button);
// Card
import Card from 'primevue/card';
Vue.component('Card', Card);
// DataView
import DataView from 'primevue/dataview';
Vue.component('DataView', DataView);
// Dialog
import Dialog from 'primevue/dialog';
Vue.component('Dialog', Dialog);
// Dropdown
import Dropdown from 'primevue/dropdown';
Vue.component('Dropdown', Dropdown);
// InputText
import InputText from 'primevue/inputtext';
Vue.component('InputText', InputText);
// MultiSelect
import MultiSelect from 'primevue/multiselect';
Vue.component('MultiSelect', MultiSelect);
// Tabs
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
Vue.component('TabView', TabView);
Vue.component('TabPanel', TabPanel);
// Toast
import Toast from 'primevue/toast';
Vue.component('Toast', Toast);
// ValidationMessage
import ValidationMessage from 'primevue/validationmessage';
Vue.component('ValidationMessage', ValidationMessage);
