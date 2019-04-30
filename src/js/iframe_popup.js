/** 
 * @author Akira Sakaguchi <akira.s7171@gmail.com>
 */
"use strict";
const DOMAIN_MSG = "Your Current Domain is :";
const DOMAIN_HERE_MSG = 'domain will be shown here'; 
const INSTRUCTION = "To Enable It & Get Started, Click =>";
const PARENT_URL = 'chrome-extension://knohbnpbdehneiegeneeeajikikaehag/';
const NO_COOKIE_MSG = 'NO COOKIE FOUND';

let gclidInput = new Vue({
  el:'#gclid-input',
  methods:{
    emptyInput:function(){
      this.value = '';
    }
  }
});

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

function clearCookieMsgs(){
  gclawMsg.setValue(''); 
  gacMsg.setValue('');
  gclidMsg.setValue('');
}

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
* check if the extension is enabled or not 
*/
window.addEventListener('message', (e)=>{
  if(!IsJsonString(e.data)){
    return;
  }
  const data = JSON.parse(e.data);
  if(data.type && data.type==='isEnabled'){
    domainMsg.enabled = data.isEnabled ? true:false;
    data.isEnabled ? switchInput.check() : switchInput.uncheck();
  
  } else if(data.type && data.type==='reload'){
    reload_();

  } else if(data.type && data.type==='emptyInput'){
    gclidInput.emptyInput();

  } else if(data.type && data.type==='sendDomainName'){
    domainMsg.domainName = data.domainName;

  } else if(data.type && data.type==='sendCookie'){
    const cookieName = data.cookieName;
    const cookieValue = data.cookieValue;
    if(cookieName.includes('gcl_aw')){
      gclawMsg.setValue(cookieValue);
    } else if (cookieName.includes('gac')){
      gacMsg.setValue(cookieValue);
    } else if (cookieName.includes('gclid')){
      gclidMsg.setValue(cookieValue);
    }
  }
});

/** 
* @private
*/
function reload_(){
const obj = {'type':'reload','gclidVal':gclidInput.value};
window.parent.postMessage(JSON.stringify(obj), PARENT_URL);
};

/** 
 * eventListener
 */
window.addEventListener('load', function(){
  let inputEl = document.getElementById('gclid-input');
  inputEl.onkeydown = (e) => {if(e.key==='Enter'&&e.target.value!=''){reload_()}};
});

/** 
 * @private
 */
function reload_(){
  const obj = {'type':'reload','gclidVal':document.getElementById('gclid-input').value};
  window.parent.postMessage(JSON.stringify(obj), PARENT_URL);
};

/** 
 * @param {!string} msg
 * @param {?string} val
 * @param {function} callback
 */
function sendMsgToContentJS_(msg,val,callback){
  const obj = {'type':'sendMsg','msg':msg, 'val':val, 'callback':callback};
  window.parent.postMessage(JSON.stringify(obj), PARENT_URL);
};

/**
 * check if the string is JSON parsable
 * @return {boolean}  
 */
function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};