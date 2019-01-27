/** 
 * @author <Akira Saaguchi> akira.s7171@gmail.com 
 */

/** 
 * eventListener - eventListener for chrome.tabs.sendMessage(tabID, obj, function) 
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // console.log(sender.tab ? "message from a content script:" + sender.tab.url : "message from the extension");
    if (request.greeting == "clearCookies"){   
      clearCookies_();
    }
});

/** 
 * @private
 */
function clearCookies_(){
    chrome.runtime.sendMessage({message:'clearCookies', domain:document.domain}, function(response){
    console.log(STYLE_ESCAPE + response.message, STYLE_BOLD);
    console.log('reloading this page in a moment...');
    reload_();
  });
};

/** 
 * @private
 */
function reload_(){
  window.location = getNewUrl(window.location.href);
};

/** 
 * @return {string} url - url without gclid
 * @param {string} url - url with or without gclid
 */
function getNewUrl (url) {
  if(url.includes('?gclid')){
    url = url.substring(url.indexOf('?gclid'),0);
  } else if(url.includes('&gclid')) {
    url = url.substring(url.indexOf('&gclid'),0);
  }
  return url;
};