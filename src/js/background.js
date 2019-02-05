/**
 * @author Akira Sakaguchi <akira.s7171@gmail.com>  
 */

 "use strict";

 /**
 * chrome.cookies shoul be called in this file, otherwise it's gonna be undefined  
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  let msg = request.message;
  // receive start message on load 
  switch(msg){
    // content.js
    case 'start':
      let enabled = isEnabled_();
      updateIcon_(enabled);
      if(enabled){
        start_(request);
      }
      break;
       
    case 'clearCookies':
     // from popup.js
     var subdomain = request.domain;
      var domain = subdomain.split('.').length > 2 ? 
        request.domain.substr(request.domain.indexOf('.')):'';
        getDomainCookies_(domain).then((cookies)=>{
          clearCookies_(cookies).then((result)=>{
            getDomainCookies_(subdomain).then((otherCookies)=>{
              clearCookies_(otherCookies).then((otherResult)=>{
                sendResponse(result || otherResult);
                // TODO remove below
                // sendMsg_(result || otherResult);
                // return true;                
            });
          });
        });
      });
      // TODO 
      // celarStoage_();
      break;
    
    case 'clearAll':
     // from popup.js
      getDomainCookies_().then((cookies)=>{
        clearCookies_(cookies).then((result)=>{
          sendResponse(result);
          // TODO remove below
          // sendMsg_(result || otherResult);
          // return true;                
        });
      });
      // TODO 
      // celarStoage_();
      break;
    
    case 'getCookies':
     // from writer.js
      getCookies(request).then((result)=>{
        sendMsg_('returnCookies', result);
        return true;
      });              
      break;

    case 'checkCookies':
      // TODO: call this and send msg to writer.js
      // from & to writer.js
      getCookies(request).then((result)=>{
        sendMsg_('cookieChecked', checkCookies_(result)); // 'fail' or 'success'
        // sendResponse();
      });              
      break;

   case 'setDomainAndCookies':
     // renew a domain name in the  local storage
     getCookies(request).then((result)=>{
       setCookies_(result);
       return true;
     });
     window.sessionStorage.setItem("domainNm", request.domain);
     watch_();  
     break;

   case 'toggle':
     // to & from pupup.js
     toggle_(request)
     return true;
  } 
  return true;
});

/**
 * to & from pupup.js
 * @private 
 * @param{Object} request 
 */
function toggle_(request){
  let shouldEnabled = request.shouldEnabled;
  updateIcon_(shouldEnabled);
  let booleanStr = shouldEnabled ? 'true' : 'false';
  window.localStorage.setItem('enabled', booleanStr);
};

/**
 * @private 
 * @return{Promise}
 * @param{Array} array 
 * @param{Array} cookies 
 */
function push_(array, cookies){
  return new Promise((resolve, reject)=>{
    resolve(array.concat(cookies));
  });
};


/**
 * @private 
 * @return{boolean}
 */
function isEnabled_(){
 return window.localStorage.getItem('enabled') == 'true' ? true : false;
}

/**
 * request from pupup.js
 * @private 
 * @param{boolean} shouldEnabled 
 */
function updateIcon_(shouldEnabled) {
  let suffix = shouldEnabled ? '-on' : '';
  chrome.browserAction.setIcon({path:"../../icon/cookie128" + suffix + ".png"});
};

/**
 * request from content.js
 * @private  
 * @param {Object} request
 */
function start_(request){
    let domain = request.domain;
    let referrer = request.referrer;
    let isTheSameDomain = isTheSameDomain_(domain);
    // TODO
    // let result = checkCookies_()
    if(isTheSameDomain || referrer==''){
      sendMsg_('domainChecked', 'noError');
    } else if(!isTheSameDomain){
      sendMsg_('domainChecked', 'domainChanged');
    } else if (result ==='fail'){
      // sendMsg_('cookieChecked', 'fail');
    } else if (result ==='success'){
      // sendMsg_('cookieChecked', 'success');

    }
};
 

/**
 * request from writers.js
 * @private 
 * @return {string} success / fail
 */
function checkCookies_(cookies){
  let JSONcookies = window.sessionStorage.getItem('cookies');
  if(!JSONcookies){
    return 'success';
  }
  let cookiesSaved = JSON.parse(JSONcookies);
  cookiesSaved =cookiesSaved.filter((cookie)=>{
    return cookie.name.includes('_gac') ||cookie.name.includes('_gcl_aw');
  });
  cookies = cookies.filter((cookie)=>{
    return cookie.name.includes('_gac') ||cookie.name.includes('_gcl_aw');
  });
  cookiesSaved.forEach((cookie)=>{
    // console.log(cookie);
  });    
  cookies.forEach((cookie)=>{
    // console.log(cookie);
  });    
  
  return cookies == cookiesSaved ? 'success' : 'fail';
};

/**
 * @private 
 * @return {Array.<Object>} cookies
 */
function setCookies_(cookies){
  let JSONcookies = JSON.stringify(cookies);
  window.sessionStorage.setItem('cookies', JSONcookies);
};

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
function getDomainCookies_(domainNm){
  let detailObj = domainNm ? {domain:domainNm} :{};
  return new Promise((resolve, reject)=>{ 
    // '' is a flag to return empty array
    if(domainNm===''){
      resolve([]);
    }  
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

/**
 * @param {Object} request
 */
function getCookies(request){
  let array = [];
  var subdomain = request.domain;
  var domain = subdomain.split('.').length > 2 ? 
    request.domain.substr(request.domain.indexOf('.')):'';
  return new Promise((resolve, reject)=>{
    getDomainCookies_(domain).then((cookies)=>{
      push_(array, cookies).then((result)=>{
        getDomainCookies_(subdomain).then((otherCookies)=>{
          cookies = cookies.filter((cookie)=>{
           return  cookie.name && (cookie.name.startsWith('_gac') || cookie.name.startsWith('_gcl_aw'));
          });
          if(cookies.length>0){
            otherCookies =[];  
          }
          push_(result, otherCookies).then((finalCookies)=>{
            resolve(finalCookies);
          });
        });
      });
    });
  });
};

/**
 * @private
 */
function clearStorage_(){
  window.sessionStorage.removeItem('domain');
  window.sessionStorage.removeItem('cookies');
};

function watch_(){
  chrome.cookies.onChanged.addListener((e)=>{
    let name = e.cookie.name;
    if(name.includes('_gac') || name.includes('_gcl_aw')){
      if(isEnabled_()){
        // cookie changed after window loaded;
       sendMsg_('domainChecked', 'noError');
      }
    }
  })
};
    // TODO -> conversion linker checker 
   // check cookies changed 
   // search GTM or gtag -> 
   // if no GTM, it would be gtag that generating the cookies