/** 
 * @author Akira Sakaguchi <akira.s7171@gmail.com>
 */
"use strict";
/** 
* eventListener
* clear cache of background.js
*/
window.addEventListener('load', ()=>{
   chrome.runtime.sendMessage({message:'start'});; 
});

/** 
* don't call beforeunload event when tel: clicked
*/
window.addEventListener('click', (e)=>{
  if(e.target && e.target.href && e.target.href.includes('tel:')){
    e.preventDefault();
  }
});

/** 
 * eventListener - eventListener for chrome.tabs.sendMessage(tabID, obj, function) 
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
   let msg = request.message;
   if(msg==="clearCookies"){
     clearCookies_(document.domain);
   } else if (msg==="clearAll") {
     clearCookies_(document.domain, true);
   } else if (msg==='reload'){
     reload_(request.value);
   } else if (msg==='toggle'){
     toggle_(request.value);
   } else if('getUrl'){
    sendResponse(window.location.href);
   }
  return true;
});

/** 
 * from popup.js to background.js
 * @private
 * @param {boolean} enabled
 */
function toggle_(enabled){
  chrome.runtime.sendMessage({message:'toggle', shouldEnabled: enabled},()=>{});
 };

/**
 * @private
 * @param {string} newDomain
 * @param {?boolean} isAll
 */
function clearCookies_(newDomain, isAll){
  if(!isAll){
    document.cookie = '_gac; max-age=0';
    document.cookie = '_gcl_aw; max-age=0';
    document.cookie = 'gclid; max-age=0';
    reload_();
  } else { // isAll
    let cookies = document.cookie.split(';');
    if(cookies.length){
      cookies.forEach((cookie)=>{
        let name = cookie.split('=')[0];  
        document.cookie = name+'; max-age=0';
      });
    }
    console.log('reloading this page in a moment...');
    reload_();
  };
};

/** 
 * from popup.js 
 * @private
 * @param {?string} url;
 */
function reload_(url){
  url?
   window.location.href = url:
   window.location.href = getUrlWithourGclid(window.location.href);
};

/** 
 * from popup.js and send the value back to it
 * @return {string} url - url without gclid
 * @param {string} url - url with or without gclid
 */
function getUrlWithourGclid (url) {
  if(url.includes('?gclid')){
    url = url.substring(url.indexOf('?gclid'),0);
  } else if(url.includes('&gclid')) {
    url = url.substring(url.indexOf('&gclid'),0);
  }
  return url;
};