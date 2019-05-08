/**
 * clear button
 */
Vue.component('custom-button', {
    template: `<input type="button"/>`,
      props:{
        btnType: String,
        btnClass: String,
        btnId :String,
        btnValue:String,
      }
});