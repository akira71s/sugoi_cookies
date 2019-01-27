/**
 *@author <Akira Sakaguchi> akira.s7171@gmail.com  
 */

/**
 * chrome.cookies shoulbe called in this file, otherwise it's gonna be undefined  
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    let message = request.message;
    let currentDomain = request.domain;
    if(message ==='clearCookies'){
      clearCookies_(currentDomain).then((result)=>{
        sendMsg_(result)
      });
    }
});

/**
 * @private 
 */
function sendMsg_(msg){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    // found active tab
    const tabID = tabs[0].id;
    chrome.tabs.sendMessage(tabID, {greeting: msg});
  });
};

/**
 * @private 
 * @return {Promise} 
 * @param {string} currentDomain - a domain clear Cookies from  
 */
function clearCookies_(currentDomain){
  return new Promise((resolve, reject)=>{ 
    chrome.cookies.getAll({domain: currentDomain}, function(cookies) {
      cookies.forEach(function(cookie){
        console.log(cookie);
        let url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
        chrome.cookies.remove({"url": url, "name": cookie.name}, function(cookie){('deleted_cookie', cookie)});
      });
    });
    resolve("cookieCleared");
  })
};