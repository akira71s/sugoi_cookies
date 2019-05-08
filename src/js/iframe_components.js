/** 
 * @author Akira Sakaguchi <akira.s7171@gmail.com>
 */
"use strict";

function decorateComponents(parentUrl){
  /**
   * input component for gclid
   */
  window.gclidInput = new Vue({
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
 window.goBtn = new Vue({
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
  window.clearBtn = new Vue({
      el:'#clear-parent',
      data:{
        btnClass: "btn-warning",
        btnId: "clear",
        spanId: "clear",
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
  window.clearAllBtn = new Vue({
    el:'#clear-all-parent',
    data:{
      btnClass: "btn-danger",
      btnId: "clear-all",
      spanId: "clear-all",
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
  window.gclidMsg = new Vue({
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
            window.parent.postMessage(JSON.stringify({type:'getCookies'}), parentUrl);
         }
    });
  
  /**
   * gclaw cookie msg
   */
  window.gclawMsg = new Vue({
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
            window.parent.postMessage(JSON.stringify({type:'getCookies'}), parentUrl);
         }
    });
    
  /**
   * gac cookie msg
   */
  window.gacMsg = new Vue({
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
            window.parent.postMessage(JSON.stringify({type:'getCookies'}), parentUrl);
          }
    });
      
  /**
   * domain msg shower 
   */
  window.domainMsg = new Vue({
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
         window.parent.postMessage(JSON.stringify({type:'checkEnabled'}), parentUrl);
         window.parent.postMessage(JSON.stringify({type:'getDomainName'}), parentUrl);
      }
    });
    
  /**
   * switch input to enable / disable
   */
  window.switchInput = new Vue({
      el:'#toggle',
      methods: {
          toggle: function () {
            window.parent.postMessage(JSON.stringify({'type':'toggleEnabled'}), parentUrl); 
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
  };