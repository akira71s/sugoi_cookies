/** 
 * @author Akira Sakaguchi <akira.s7171@gmail.com>
 */
"use strict";
chrome.runtime.sendMessage({message:'beforeLoad'}, ()=>{}); 

/** 
* eventListener
* clear cache of background.js
*/
window.addEventListener('beforeunload', ()=>{
  // TODO: remove this, 
  // prepare for reload thing chrome.runtime.sendMessage({message:'beforeReload'},(e)=>{}); 
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
* eventListener
* when window loaded, renew thedomain to the background.js
*/
window.addEventListener('load',()=>{
  chrome.runtime.sendMessage({message:'start', domain:document.domain, referrer:document.referrer},(()=>{
    chrome.runtime.sendMessage({message:'setDomainAndCookies', domain:document.domain},()=>{});
  }));
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
   } else if(msg==='getCookies'){
     getCookies_(request.value);
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
 * to background.js
 * @private
 * @param {boolean} enabled
 */
function getCookies_(enabled){
  chrome.runtime.sendMessage({message:'getCookies', domain:document.domain},()=>{}); 
};

/** 
 * to background.js
 * @private
 */
function stopWatching_(){
  chrome.runtime.sendMessage({message:'stopWatching'},()=>{}); 
};

/**
 * from popup.js to background.js 
 * @private
 * @param {string} newDomain
 * @param {?boolean} isAll
 */
function clearCookies_(newDomain, isAll){
  let msgObj = isAll ? 
    {message:'clearAll', domain:newDomain} :
    {message:'clearCookies', domain:newDomain}; 
  chrome.runtime.sendMessage(msgObj, function(response){
    console.log(STYLE_ESCAPE + response, STYLE_BOLD);
    console.log('reloading this page in a moment...');
    reload_();
    return true;
  });
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