/** 
 * @author Akira Sakaguchi <akira.s7171@gmail.com>
 */
"use strict";

/** 
* eventListener
* clear cache of background.js
*/
window.addEventListener('beforeunload', ()=>{
  console('RELOAD');
  chrome.runtime.sendMessage({message:'beforeReload'},(()=>{})); 
});

/** 
* eventListener
* when window loaded, renew thedomain to the background.js
*/
window.addEventListener('load',()=>{
  chrome.runtime.sendMessage({message:'start', domain:document.domain, referrer:document.referrer},(()=>{
    chrome.runtime.sendMessage({message:'setDomainAndCookies', domain:document.domain});
   }));
});

/** 
 * eventListener - eventListener for chrome.tabs.sendMessage(tabID, obj, function) 
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
   let msg = request.message;
   switch(msg){
     case "clearCookies":
       // request from popup.js to background.js
       clearCookies_(document.domain);
       break;

     case "clearAll": 
       // request from popup.js to background.js
       clearCookies_(document.domain, true);
       break;

     case 'reload':
       // request from popup.js
       reload_(request.value);
       break;

     case request.message=='coockieChecked':
       // msg from background.js 
       if(request.value==='success'){
         // TODO consoleInGreen 
        } else if (request.value==='fail'){
          // TODO consoleInRed
        }
        break;

      case 'toggle':
        // request from popup.js
        toggle_(request.value);
        break;

      case 'getCookies':
        // request from popup.js to background.js
        getCookies_(request.value);
        break;

      case 'getUrl':
        // request from popup.js, sending response back
        sendResponse(window.location.href);
        break;
  }
  return true;
});

/** 
 * from popup.js to background.js
 * @private
 * @param {boolean} enabled
 */
function toggle_(enabled){
  chrome.runtime.sendMessage({message:'toggle', shouldEnabled: enabled},(()=>{}));
 };

/** 
 * to background.js
 * @private
 * @param {boolean} enabled
 */
function getCookies_(enabled){
  chrome.runtime.sendMessage({message:'getCookies', domain:document.domain},(()=>{})); 
};

/** 
 * to background.js
 * @private
 */
function stopWatching_(){
  chrome.runtime.sendMessage({message:'stopWatching'},(()=>{})); 
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

// TODO
// /**
//  * @private 
//  */
// function startCheckingCookies_() {  
//   return new Promise ((resolve,reject)=>{
//     console.log('checkcookies');
//     chrome.runtime.sendMessage({message:'checkCookies', domain:document.domain},function(){
//       resolve();
//     }); 
//   });
// }