/**
 * clear button
 */
Vue.component('custom-button', {
    template: `<input type="button"/>`,
      props:{
        btnClass: String,
        btnId :String,
        btnValue:String,
      }
});