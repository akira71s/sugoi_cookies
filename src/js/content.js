/** 
 * @author Akira Sakaguchi <akira.s7171@gmail.com>
 */

/** 
 * immediate function, sending message to background.js
 * start and check if the plugin is enabled or not 
 * @private
 */
!function start_(enabled){
  chrome.runtime.sendMessage({message:'start', domain:document.domain},(()=>{}));
}();

/** 
 * eventListener - eventListener for chrome.tabs.sendMessage(tabID, obj, function) 
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
   let msg = request.message; 
   switch(msg){
     case "clearCookies":   
       clearCookies_(document.domain);
       break;

     case "clearAll":   
       clearCookies_(document.domain, true);
       break;

     case 'cookieCleared':
       reload_();
       break;

     case 'reload':
       reload_(request.value);
       break;

     case request.message=='coockieChecked':
      if(request.value==='success'){
        // TODO consoleInGreen 
      } else if (request.value==='fail'){
        // TODO consoleInRed
      }
      break;
      
      case 'toggle':
      toggle_(request.value);
      break;

      case 'getCookies':
      getCookies_(request.value);
      break;

      case 'getUrl':
      sendResponse(window.location.href);
      break;
  }
});

/** 
 * @private
 * @param {boolean} enabled
 */
function toggle_(enabled){
  chrome.runtime.sendMessage({message:'toggle', shouldEnabled: enabled},(()=>{}));
 };

/** 
 * @private
 * @param {boolean} enabled
 */
function getCookies_(enabled){
  chrome.runtime.sendMessage({message:'getCookies', domain:document.domain},(()=>{})); 
};

/** 
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
 * @private
 * @param {?string} gclidVal
 */
function reload_(gclidVal){
  let newUrl = getUrlWithourGclid(window.location.href)
   gclidVal ?
     window.location = newUrl + gclidVal : 
     window.location = newUrl;
};

/** 
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