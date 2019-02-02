/** 
 * @author Akira Sakaguchi <akira.s7171@gmail.com>
 */

/** 
 * immediate function, sending message to background.js
 * start and check if the plugin is enabled or not 
 * @private
 */
!function start_(enabled){
  chrome.runtime.sendMessage({message:'start', domain:document.domain, referrer:document.referrer},(()=>{}));
}();

/** 
 * eventListener - eventListener for chrome.tabs.sendMessage(tabID, obj, function) 
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
   let msg = request.message; 
   switch(msg){
     case "clearCookies":   
       // request from popup.js to background.js
       clearCookies_(document.domain);
       return true;

     case "clearAll":   
       // request from popup.js to background.js
       clearCookies_(document.domain, true);
       return true;

     case 'cookieCleared':
       // msg from background.js
       reload_();
       return true;

     case 'reload':
       // request from popup.js
       reload_(request.value);
       return true;

     case request.message=='coockieChecked':
       // msg from background.js 
       if(request.value==='success'){
         // TODO consoleInGreen 
        } else if (request.value==='fail'){
          // TODO consoleInRed
        }
        return true;

      case 'toggle':
      // request from popup.js
        toggle_(request.value);
        return true;

      case 'getCookies':
        // request from popup.js to background.js
        getCookies_(request.value);
        return true;

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
    console.log(STYLE_ESCAPE + response.message, STYLE_BOLD);
    console.log('reloading this page in a moment...');
    setTimeout(reload_(), 1000);
  });
};

/** 
 * from popup.js 
 * @private
 * @param {?string} url;
 */
function reload_(url){
  console.log(url);
  url?
   window.location.href = url:
   window.location.href = getUrlWithourGclid (window.location.href);
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