/**
 * @author Akira Sakaguchi <akira.s7171@gmail.com>  
 */
"use strict";
let cache_ =[];
let CVs = [];
let contentLoaded = false;

/**
 * detect Google Ads Conversion  
 */
chrome.webRequest.onCompleted.addListener(
  logRequestURL,
  {urls: ["<all_urls>"]}
);

/**
 */
function checkCV (){
  CVs.forEach((CV)=>{
    sendMsg_('CV', CV)
  });
  CVs = [];
  contentLoaded = true;
}

// TODO refactoring this
function logRequestURL(requestDetails) {
  let url = requestDetails.url;
  if(url.startsWith('https://www.googleadservices.com/pagead/conversion/')){
    let gclawIdx = url.indexOf('&gclaw')
    let gclaw= gclawIdx != -1 ? url.substring(gclawIdx, url.indexOf('&', gclawIdx+1)) : '';
    let gacIdx = url.indexOf('&gac')
    let gac= gacIdx != -1? url.substring(gacIdx, url.indexOf('&', gacIdx+1)):'';
    let cvStrIdx = url.indexOf('conversion/');
    let surl = url.substr(cvStrIdx, url.indexOf('/', cvStrIdx+1));
    let CVid = surl.substring(surl.indexOf('/'), surl.indexOf('/', surl.indexOf('/')+1));
    CVid = CVid.replace('/','');
    let labelIdx = url.indexOf('label=');
    let CVlabel= url.substring(labelIdx, url.indexOf('&', labelIdx+1));
    CVlabel= CVlabel.split('=');
    CVlabel = CVlabel[1];
    let cookie = {'gclaw':gclaw, 'gac':gac, 'cvid':CVid, 'cvlabel':CVlabel};
    if(contentLoaded){
      sendMsg_('CV', cookie);
    } else {
      CVs.push(cookie);
    }
  }
};

/**
 * chrome.cookies shoul be called in this file, otherwise it's gonna be undefined  
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const msg = request.message;
  const domain = request.domain;
  switch(msg){      
    case 'start':
      watch();
      cache_ =[];
      let enabled = isEnabled_();
      updateIcon_(enabled);
      if(enabled){
        start_(request);
      }
      break;
       
    case 'clearCookies':
      const domains = getDomains_(domain);
          getDomainCookies_(domains[0]).then((firstCookies)=>{
          clearCookies_(firstCookies).then((firstResult)=>{
            getDomainCookies_(domains[1]).then((secondCookies)=>{
              clearCookies_(secondCookies).then((secondResult)=>{
                getDomainCookies_(domains[2]).then((thirdCookies)=>{
                  clearCookies_(thirdCookies).then((thirdResult)=>{    
                    sendResponse(firstResult || secondResult || thirdResult);
                });
              });
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
      getCookies(request).then((result)=>{
        result = filter_(result);
        cache_ = result;
        watch();
        sendMsg_('returnCookies', result);
        checkCV();
        return true;
      });              
      break;

    // TODO 
    // case 'checkCookies':
    //   getCookies(request).then((result)=>{
    //     sendMsg_('cookieChecked', checkCookies_(result)); // 'fail' or 'success'
    //     // sendResponse();
    //   });              
    //   break;

   case 'setDomainAndCookies':
     getCookies(request).then((result)=>{
       setCookies_(result);
       return true;
     });
     window.sessionStorage.setItem("domainNm", domain);
     break;

   case 'toggle':
     toggle_(request);
     stopWatching_();
     return true;

  case 'stopWatching':
    stopWatching_();  
    break;

  case 'beforeReload':
    cache_ = [];
    CVs = [];
    stopWatching_();
    contentLoaded = false;
    break;
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
 * @return{Array.<String>} domains
 * @param{String} domain 
 */
function getDomains_(domain){
  let domains = [];
  domains.push(domain);
  domain.split('.').length > 2? 
    domains.push(domain.substr(domain.indexOf('.'))):
    domains.push('');
  domain.split('.').length > 3? 
    domains.push(domain.substr(domain.indexOf('.', domain.indexOf('.')+1))):
    domains.push('');
  return domains;
};

/**
 * @private 
 * @return{boolean}
 */
function isEnabled_(){
 return window.localStorage.getItem('enabled') == 'true' ? true : false;
};

/**
 * request from pupup.js
 * @private 
 * @param{boolean} shouldEnabled 
 */
function updateIcon_(shouldEnabled) {
  let suffix = shouldEnabled ? '-on' : '';
  chrome.browserAction.setIcon({path:"../../icon/s128" + suffix + ".png"});
};

/** 
 * @private
 * @param {Array.<Object>} cookies
 * @return {Array.<Object>} filtered cookies
 */
function filter_(cookies){
  let gclAwNm ='_gcl_aw';
  let gacNm ='_gac';
  cookies = cookies.filter((cookie) => {
    return cookie.name.includes(gclAwNm)||cookie.name.includes(gacNm);
  });
  return cookies;
}

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
    if(!tabs[0]){
      window.alert('please reload the page');
      return;
    }
    // found active tab
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
  let domains = getDomains_(request.domain);
  return new Promise((resolve, reject)=>{
    getDomainCookies_(domains[0]).then((firstCookies)=>{
      push_(array, firstCookies).then((firstResult)=>{
        getDomainCookies_(domains[1]).then((secondCookies)=>{
           firstResult = firstResult.filter((cookie)=>{
            return  cookie.name && (cookie.name.startsWith('_gac') || cookie.name.startsWith('_gcl_aw'));
           });
            secondCookies = secondCookies.filter((cookie)=>{
              return  cookie.name && (cookie.name.startsWith('_gac') || cookie.name.startsWith('_gcl_aw'));
             });
            push_(firstResult, secondCookies).then((secondResult)=>{
             getDomainCookies_(domains[2]).then((thirdCookies)=>{
               thirdCookies = thirdCookies.filter((cookie)=>{
                 return  cookie.name && (cookie.name.startsWith('_gac') || cookie.name.startsWith('_gcl_aw'));
               });
               push_(secondResult, thirdCookies).then((finalCookies)=>{
                 resolve(finalCookies);
               }); 
            }); 
          });
        });
      });
    });
  });
};

/**
 * @private
 */
function watch(){
  chrome.cookies.onChanged.addListener(watch_);
};

/**
 * @private
 * @param {Event} e 
 */
 function watch_(e){
  let cookie = e.cookie;
  let name = cookie.name;
  let val = cookie.value;
  let cause = e.cause;
  let isRemoved = e.removed;
  let isChanged = false;
  if(name.includes('_gac') || name.includes('_gcl_aw')){
    if(isEnabled_()){
      if(cause=='explicit' && !isRemoved){
        let filteredCache_ = fileterByName_(name, cache_);
        if(filteredCache_.length === 0){
          isChanged = true;
        } else {
          filteredCache_.forEach((cache)=>{
            isChanged = cache.value.split('.')[2] != val.split('.')[2] ? true:false;
          });
        }
        if(isChanged){
          cache_ = cache_.concat([cookie]);
          sendMsg_('cookiesChanged', cookie);
        }
      }
    }
  }
};

/**
 * @private
 * @param {string} name
 * @param {Array.<string>} cache_
 */
function fileterByName_(name, cache_){
  return cache_ = cache_.filter((cache)=>{
    return cache.name.includes(name);
  });
};

/**
 * @private
 */
function stopWatching_(){
  window.sessionStorage.removeItem('domain');
  window.sessionStorage.removeItem('cookies');
  CVs = [];
  chrome.cookies.onChanged.removeListener(watch_);
};

// TODO -> conversion linker checker 
// check cookies changed 
// search GTM or gtag -> 
// if no GTM, it would be gtag that generating the cookies