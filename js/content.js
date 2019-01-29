/** 
 * @author Akira Saaguchi <akira.s7171@gmail.com> 
 */

/** 
 * eventListener - eventListener for chrome.tabs.sendMessage(tabID, obj, function) 
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message == "clearCookies"){   
      clearCookies_(document.domain);
    } else if (request.message == "clearAll"){   
      clearCookies_(document.domain, true);
    } else if (request.message=='cookieCleared'){
      reload_();
    } else if (request.message=='reload' && request.value){
      reload_(request.value);
    } else if (request.message=='coockieChecked'){
      if(request.value==='success'){
        // TODO consoleInGreen 
      } else if (request.value==='fail'){
        // TODO consoleInRed
      }
    } else if (request.message=='toggle'){
      toggle_(request.value);
    } else if (request.message=='getCookies'){
      getCookies_(request.value);
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
 * immediate function
 * @private
 */
!function start_(enabled){
  chrome.runtime.sendMessage({message:'start', domain:document.domain},(()=>{}));
}();

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