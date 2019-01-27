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
      clearCookies_(currentDomain);
    };
    // TODO: call this async
    sendResponse({message: 'now Cookies cleared away!'})
});

/**
 */
/**
 * @private 
 * @return {string} 
 * @param {string} currentDomain - a domain clear Cookies from  
 */
function clearCookies_(currentDomain){
  chrome.cookies.getAll({domain: currentDomain}, function(cookies) {
    cookies.forEach(function(cookie){
      console.log(cookie);
      let url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
      chrome.cookies.remove({"url": url, "name": cookie.name}, function(cookie){('deleted_cookie', cookie)});
    });
  });
};