/** 
 * @author Akira Sakaguchi <akira.s7171@gmail.com>
 */
"use strict";

/**
 * input component for gclid
 */
let gclidInput = new Vue({
    el:'#gclid-input',
    methods:{
      emptyInput:function(){
        this.value = '';
      }
    }
  });
  
/**
* go button
*/
let goBtn = new Vue({
    el:'#go',
    methods:{
      go:function(){
          if(gclidInput.value){
            reload_();    
          }
      } 
    }
  });
  
/**
 * clear button
 */
  let clearBtn = new Vue({
    el:'#clear',
    methods:{
      clear:function(){
        clearCookieMsgs();
        gclidInput.emptyInput();
        sendMsgToContentJS_('clearCookies', null);
      } 
    }
  });

/**
 * clear all button
 */
let clearAllBtn = new Vue({
    el:'#clearAll',
    methods:{
      clearAll:function(){
        clearCookieMsgs();
        gclidInput.emptyInput();
        sendMsgToContentJS_('clearAll', null);    
      } 
    }
  });

/**
 * gclid cookie msg
 */
  var gclidMsg = new Vue({
    el:'#gclid-msg',
        data: {
            name: 'gclid',
            value: NO_COOKIE_MSG,
            hasValue: false
        },
        methods :{
          setValue : function(val){
            this.value = val;
            this.hasValue = this.value === ''  || this.value === NO_COOKIE_MSG ? false: true;
          }
        },
        created: function(){
          window.parent.postMessage(JSON.stringify({type:'getCookies'}), PARENT_URL);
       }
  });

/**
 * gclaw cookie msg
 */
  var gclawMsg = new Vue({
    el:'#gclaw-msg',
        data: {
          name: '_gcl_aw',
          value: NO_COOKIE_MSG,
          hasValue: false
        },
        methods :{
          setValue : function(val){
            this.value = val;
            this.hasValue = this.value === ''  || this.value === NO_COOKIE_MSG ? false: true;
          }
        },
        created: function(){
          window.parent.postMessage(JSON.stringify({type:'getCookies'}), PARENT_URL);
       }
  });
  
/**
 * gac cookie msg
 */
  var gacMsg = new Vue({
    el:'#gac-msg',
        data: {
          name: '_gac',
          value: NO_COOKIE_MSG,
          hasValue: false
        },
        methods :{
          setValue : function(val){
            this.value = val;
            this.hasValue = this.value === ''  || this.value === NO_COOKIE_MSG ? false: true;
          }
        },
        created: function(){
          window.parent.postMessage(JSON.stringify({type:'getCookies'}), PARENT_URL);
        }
  });
    
/**
 * domain msg shower 
 */
var domainMsg = new Vue({
    el:'#domain-msg',
    data: {
        enabled: false,
        msg: DOMAIN_MSG,
        domainName: DOMAIN_HERE_MSG
    },
    methods: {
      toggle: function(){
        this.enabled = !this.enabled;
        this.msg = this.enabled ? DOMAIN_MSG : INSTRUCTION;
      }
    },
    created: function(){
       window.parent.postMessage(JSON.stringify({type:'checkEnabled'}), PARENT_URL);
       window.parent.postMessage(JSON.stringify({type:'getDomainName'}), PARENT_URL);
    }
  });
  
/**
 * switch input to enable / disable
 */
  var switchInput = new Vue({
    el:'#toggle',
    methods: {
        toggle: function () {
          window.parent.postMessage(JSON.stringify({'type':'toggleEnabled'}), PARENT_URL); 
          sendMsgToContentJS_('toggle',this.$el.checked, 'reload');
          domainMsg.toggle();
        },
        check: function () {
         this.$el.checked = true;
        },
        uncheck: function () {
         this.$el.checked = false;
        }
    }
  });

/**
 * function
 */
function clearCookieMsgs(){
    gclawMsg.setValue(''); 
    gacMsg.setValue('');
    gclidMsg.setValue('');
};