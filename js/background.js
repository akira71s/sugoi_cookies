/**
 * @author Akira Sakaguchi <akira.s7171@gmail.com>  
 */

 /**
 * chrome.cookies shoul be called in this file, otherwise it's gonna be undefined  
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    let message = request.message;
    if(message ==='clearCookies'){
      let subdomain = request.domain;
      let domain = request.domain.substr(request.domain.indexOf('.'));
      getCookies_(domain).then((cookies)=>{
        clearCookies_(cookies).then((result)=>{
          getCookies_(subdomain).then((otherCookies)=>{
            clearCookies_(otherCookies).then((otherResult)=>{
              sendMsg_(result || otherResult);
            });
          });
        });
      });
    } else if (message==='clearAll'){
      getCookies_().then((cookies)=>{
        clearCookies_(cookies).then((result)=>{
          sendMsg_(result || otherResult);
        });
      });
    } else if (message==='started'){
      let isTheSameDomain = isTheSameDomain_(request.domain);
      if(isTheSameDomain){
        sendMsg_('domainChecked', isTheSameDomain);
      } else {
        sendMsg_('domainChecked', isTheSameDomain);
      }
      // TODO
      //   let result = checkCookies_()
      //   if(result ==='fail'){
      //     // TODO: 
      //     // sendMsg_('cookieChecked', 'fail');
      //   } else if (result ==='success'){
      //     // TODO: 
      //     // sendMsg_('cookieChecked', 'success');
      //   }
      // }
    } else if (message==='setDomain'){
      // renew a domain name in the  local storage
      // TODO
      // window.sessionStorage.setItem("domainNm", request.domain);      
    }
});

// TODO
 // -> setItem('cookies', JSON)
 // -> parse -> cookies 
 
/**
 * @private 
 * @return {string} 'fali' || 'success'
 */
function checkCookies_(){
  // getCookies
  // getItem('cookies', JSON)
  // JSON.parse ->  

  // getCookies_('_gcl_aw')
  // getCookies_('_gac')
}


/**
 * @private 
 * @return {boolean} 
 * @param {String} domain 
 */
function isTheSameDomain_(domain){
  return domain === window.sessionStorage.getItem("domainNm");
}

/**
 * @private 
 * @return {Promise} 
 * @param {Array.<Object>} cookies - [] default 
 */
function clearCookies_(cookies=[]){
  return new Promise((resolve, reject)=>{ 
      cookies.forEach(function(cookie){
        let url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
        chrome.cookies.remove({"url": url, "name": cookie.name}, function(cookie){('deleted_cookie', cookie)});
      });
      resolve("cookieCleared");
    });
};

/**
 * @private 
 * @return {Promise} 
 * @param {?string} domaiNm - if null, get all 
 */
function getCookies_(domainNm){
  let detailObj = domainNm ? {domain:domainNm} :{};
  return new Promise((resolve, reject)=>{ 
    chrome.cookies.getAll(detailObj,((cookies)=>{
      resolve(cookies || []);
    }));
  });
};

/**
 * @private 
 * @param {string} msg 
 * @param {?Any} val
 */
function sendMsg_(msg, val){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    // found active tab
    if(!tabs[0]){
      return;
    }
    const tabID = tabs[0].id;
    val != undefined ? 
      chrome.tabs.sendMessage(tabID, {message: msg, value: val}):
      chrome.tabs.sendMessage(tabID, {message: msg});
    });
};