/** 
 * @author Akira Sakaguchi <akira.s7171@gmail.com>
 */
"use strict";

/**
 * input component for gclid
*/
let gclidInput = new Vue({
    el:'#gclid-input',
    data:{
      inivalue: 'test_'+ (new Date().getMonth()+1).toString()+ new Date().getDate().toString(),
    },  
    methods:{
      emptyInput: function(){
        this.value = '';
      },
      handleKeydown: function(e){
        if(e.key==='Enter'&&this.value!=''&& switchInput.isChekced()){
          reload();    
        }
      }
    }
 });

/**
 * go button
 */
let goBtn = new Vue({
    el:'#go-parent',
    data:{
      btnClass: "btn-primary",
      btnId: "go",
      btnValue: "Go!",
    },  
    methods:{
      go:function(){
          if(gclidInput.value && switchInput.isChekced()){
            reload();    
          }
      } 
    }
});

/**
 * clear button
 */
let clearBtn = new Vue({
    el:'#clear-parent',
    data:{
      btnClass: "btn-warning",
      btnId: "clear",
      btnValue: "Clear GoogleAds-related Cookies",
    },  
    methods:{
      clearCookieMsgs_:function(){
        gclawMsg.setValue(''); 
        gacMsg.setValue('');
        gclidMsg.setValue('');
      },
      clear:function(){
        this.clearCookieMsgs_();
       gclidInput.emptyInput();
        sendMsgToContentJS_('clearCookies', null);
      }
    }
 });

 /**
 * clearAll button
 */
let clearAllBtn = new Vue({
    el:'#clear-all-parent',
    data:{
      btnClass: "btn-danger",
      btnId: "clear-all",
      btnValue: "Clear ALL Cookies of the domain",
    },  
    methods:{
      clearCookieMsgs_:function(){
        gclawMsg.setValue(''); 
        gacMsg.setValue('');
        gclidMsg.setValue('');
      },
      clearAll:function(){
        this.clearCookieMsgs_();
        gclidInput.emptyInput();
        sendMsgToContentJS_('clearAll', null);
      }
    }
  });
  
 /**
  * gclid cookie msg
  */
let  gclidMsg = new Vue({
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
  let gclawMsg = new Vue({
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
  let gacMsg = new Vue({
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
  let domainMsg = new Vue({
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
  let switchInput = new Vue({
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
          },
          isChekced: function(){
            return this.$el.checked;
          }
      }
    });
