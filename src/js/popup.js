/** 
 * @author Akira Sakaguchi <akira.s7171@gmail.com>
 */
"use strict";

/** 
 * eventListener
 */
window.addEventListener('load', function(){
  let goBtnEl = document.getElementById("go");
  goBtnEl.onclick = () =>beforeReload_();

  let inputEl = document.getElementById('input');
  inputEl.onkeydown = (e) => {if(e.key==='Enter'&&e.target.value!=''){reload_()}};

  // event lisner for clicking 'clear' to clear cache 
  let clearBtnEl = document.getElementById("clear");
  clearBtnEl.onclick = () =>{
    sendMsgToContentJS_('clearCookies', null, emptyInput_());
  };

  // event lisner for clicking 'clear' to clear cache 
  let clearAllBtnEl = document.getElementById("clear-all");
  clearAllBtnEl.onclick = () =>{sendMsgToContentJS_('clearAll', null, emptyInput_());};

  // event lisner for clicking 'clear' to clear cache 
  let toggleEl = document.getElementById("toggle");
  let isChecked = window.localStorage.getItem('enabled');
  toggleEl.checked = isChecked && isChecked=='true'? true : false;
  toggleEl.onchange = () =>{sendMsgToContentJS_('toggle', toggleEl.checked, reload_());};
});

/** 
 * empty input box in the popup
 * @private
 */
function emptyInput_(){
  let inputEl =document.getElementById('input');
  inputEl.value = '';
}

/** 
 * get gclid val according to the value in the input box
 * @return {!string};
 * @param {string} url
 */
function getGclid_(url) {
  let inputEl =document.getElementById('input');
  let val = inputEl && inputEl.value ? inputEl.value : '';
  if(!val){
    return '';
  }
  return url.includes('?') ? '&gclid='+val : '?gclid='+val; 
};
 
/** 
 * @return {string} url - url without gclid
 * @param {string} url - url with or without gclid
 */
function getUrlWithourGclid (url) {
  if(!url){
    return;
  }
  if(url.includes('?gclid')){
    url = url.substring(url.indexOf('?gclid'),0);
  } else if(url.includes('&gclid')) {
    url = url.substring(url.indexOf('&gclid'),0);
  } else if (url.includes('?_gl')){
    url = url.substring(url.indexOf('?_gl'),0);
  } else if (url.includes('&_gl')){
    url = url.substring(url.indexOf('&_gl'),0);
  }
  return url;
};

/** 
 * @private
 */
function beforeReload_(){
  let inputEl =document.getElementById('input');
  if(inputEl && inputEl.value!=''){
    reload_();
  }
};

/** 
 * @private
 */
function reload_(){
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabID = tabs[0].id;
    if (tabID) {
      chrome.tabs.sendMessage(tabID, {message: 'getUrl'}, ((response)=>{
        let url = getUrlWithourGclid(response);    
        if(url){
          let gclid = getGclid_(url);
          chrome.tabs.sendMessage(tabID, {message: 'reload', value:url+gclid});
        }
        return true; 
      }));
    }
    return true; 
  })
};

/** 
 * @param {!string} msg
 * @param {?string} val
 * @param {function} callback
 */
function sendMsgToContentJS_(msg,val,callback){
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabID = tabs[0].id;
    if (!tabID) {
      return null;
    }
    callback = callback ? callback : (()=>{});
    val = val ? val : '';
    chrome.tabs.sendMessage(tabID, {message: msg, value:val}, callback);
  });
};