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
 * from popup.js to background.js 
 * @private
 * @param {string} domainStr
 * @param {?boolean} isAll
 */
function clearCookies_(domainStr, isAll){
  const domains = getDomains(document.domain);
  let msgObj = isAll ? 
    {message:'clearAll', domain:domains} :
    {message:'clearCookies', domain:domains}; 
  chrome.runtime.sendMessage(msgObj, function(response){
    console.log(STYLE_ESCAPE + response, STYLE_BOLD);
    console.log('reloading this page in a moment...');
    reload_();
    return true;
  });
};

/** 
 * @return {string{}}
 * @param {string} domain;
 */
function getDomains(domain){
  let domains = [];
  domains.push(domain);
  while(domain.indexOf('.')!=-1){
    domain = domain.slice(domain.indexOf('.'));
    domain = domain.replace('.','');
    domains.push(domain);
  }
  return domains;
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
  } else if (url.includes('?_gl')){
    url = url.substring(url.indexOf('?_gl'),0);
  } else if (url.includes('&_gl')){
    url = url.substring(url.indexOf('&_gl'),0);
  }
  return url;
};