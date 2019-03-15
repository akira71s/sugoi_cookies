/**
 * @author Akira Sakaguchi <akira.s7171@gmail.com>  
 */
"use strict";
let cache_ =[];
let CVs = [];
let firedCVlabels = [];
let contentLoaded = false;

/**
 * detect Google Ads Conversion  
 */
function listenHTTPRequest(){
  chrome.webRequest.onCompleted.addListener(
    logRequestURL,
    {urls: ["<all_urls>"]}
  );
};

/**
 * check conversions that fires before window loaded
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
  let code = requestDetails.statusCode;
  if(url.startsWith('https://www.googleadservices.com/pagead/conversion/')){
    let gclawIdx = url.indexOf('&gclaw')
    let gacIdx = url.indexOf('&gac')
    let cvStrIdx = url.indexOf('conversion/');
    let labelIdx = url.indexOf('label=');
    let surl = url.substr(cvStrIdx+1, url.indexOf('/', cvStrIdx+1));

    let gclaw= gclawIdx != -1 ? url.substring(gclawIdx, url.indexOf('&', gclawIdx+1)) : '';
    let gac= gacIdx != -1? url.substring(gacIdx, url.indexOf('&', gacIdx+1)):'';
    let CVid = surl.substring(surl.indexOf('/'), surl.indexOf('/', surl.indexOf('/')+1));
    CVid = CVid.replace('/','');
    let CVlabel= url.substring(labelIdx, url.indexOf('&', labelIdx+1));
    CVlabel= CVlabel.split('=')[1]; // label=VAL => [label, VAL] 

    let cookie = {'gclaw':gclaw, 'gac':gac, 'cvid':CVid, 'cvlabel':CVlabel};
      if(!!contentLoaded){
      if(CVs.length==0){
       CVs.push(cookie);    
      }  
      CVs.forEach((cv)=>{
       if(CVs.length==1||cv.cvlabel!==CVlabel){
          sendMsg_('CV', cookie);
         CVs.push(cookie);
       }
      });
      } else {
      if(CVs.length==0){
        CVs.push(cookie);    
      }  
      CVs.forEach((cv)=>{
         if(cv.cvlabel!==CVlabel){
            CVs.push(cookie);
         }
      });
    }
  }
};

/**
 * chrome.cookies shoul be called in this file, otherwise it's gonna be undefined  
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const msg = request.message;
  const domain = request.domain;
  if(msg==='start'){
      let enabled = isEnabled_();
      updateIcon_(enabled);
      if(enabled){
        start_(request);
      }
   } else if (msg==='clearAll'){
     // from popup.js
      getDomainCookies_().then((cookies)=>{
        clearCookies_(cookies).then((result)=>{
          sendResponse(result);
        },logCookie);
      },logCookie);
    }else if (msg ==='toggle'){
       toggle_(request);
       stop_();
     } else if (msg ==='stopWatching'){
       stop_();  
     } else if (msg === 'beforeReload'){
      cache_ = [];
      stop_();
      contentLoaded = false;
     } else if (msg === 'beforeLoad'){
      listenHTTPRequest(); 
    } else if (msg=== 'cacheCookies'){
      let cookies = request.value;
      cookies.forEach(()=>{
        cache_.push({name:cookies.split('=')[0], value:cookies.split('=')[2]})
      });
    }
  return true;
});

function stop_() {
  window.sessionStorage.removeItem('domain');
  window.sessionStorage.removeItem('cookies');
  CVs = [];
  firedCVlabels = [];
};

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
 * request from content.js
 * @private  
 * @param {Object} request
 */
function start_(request){
  sendMsg_('enabled');
};

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

function logCookie(c) {
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError);
  } else {
    console.log(c);
  }
}