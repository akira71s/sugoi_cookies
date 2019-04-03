/** 
 * @author Akira Sakaguchi <akira.s7171@gmail.com>
 */
"use strict";

// start
chrome.runtime.sendMessage({message:'start'});; 

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
  const expiryDate = ';max-age=0';
  const domain = ';domain='+location.hostname;
  let cookies = document.cookie.split(';');
  if(cookies.length){
    cookies.forEach((cookie)=>{
      if(isAll){
        document.cookie = cookie+ domain + expiryDate;
      } else { // !isAll
        if(cookie.includes('gac')||cookie.includes('gclaw')||cookie.includes('gclid')){
          document.cookie = cookie +  domain + expiryDate;
        }          
      }
    });
  }
  console.log('reloading this page in a moment...');
  reload_();
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