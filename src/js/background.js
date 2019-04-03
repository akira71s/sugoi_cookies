/**
 * @author Akira Sakaguchi <akira.s7171@gmail.com>  
 */
"use strict";
let cache_ =[];

/**
 * detect Google Ads Conversion  
 */
function listenHTTPRequest(){
  chrome.webRequest.onCompleted.addListener(
    checkHttpRequest,
    {urls: ["<all_urls>"]}
  );
};

/**
 * TODO: add this to ts file
 * check conversions that fires before window loaded
 */
function checkHttpRequest(requestDetails) {
  let isDuplicated = false;
  let url = requestDetails.url;
  let code = requestDetails.statusCode;
  if(url.startsWith('https://www.googleadservices.com/pagead/conversion/')){
    let gclawIdx = url.indexOf('&gclaw')
    let gacIdx = url.indexOf('&gac')
    let cvStrIdx = url.indexOf('conversion/');
    let labelIdx = url.indexOf('label=');
    let surl = url.substr(cvStrIdx+1, url.indexOf('/', cvStrIdx+1));
    let surlIdx = surl.indexOf('/');

    let gclaw= gclawIdx != -1 ? url.substring(gclawIdx, url.indexOf('&', gclawIdx+1)) : '';
    let gac= gacIdx != -1? url.substring(gacIdx, url.indexOf('&', gacIdx+1)):'';
    let CVid = surl.substring(surlIdx, surl.indexOf('/', surlIdx+1));
    CVid = CVid.replace('/','');
    let CVlabel= url.substring(labelIdx, url.indexOf('&', labelIdx+1));
    let CVlabelVal= CVlabel.split('=')[1]; // label=VAL => [label, VAL]  -> [1] === VAL 

    let cookie = {'gclaw':gclaw, 'gac':gac, 'cvid':CVid, 'cvlabel':CVlabelVal};
    let timer = setTimeout(sendMsg_, 100,'CV',cookie);
    cache_.forEach((label)=>{
      if(label==CVlabelVal){
        isDuplicated=true;
        clearTimeout(timer);
      }
    });
    if(!isDuplicated){
      cache_.push(CVlabelVal);
    }
  }
};

/**
 * chrome.cookies shoul be called in this file, otherwise it's gonna be undefined  
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const msg = request.message;
  if(msg==='start'){
     listenHTTPRequest()
     let enabled = isEnabled_();
     updateIcon_(enabled);
     if(enabled){
       start_(request);
     }
  } else if (msg ==='toggle'){
    toggle_(request);
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
 * @param {string} msg 
 * @param {?Any} val
 */
function sendMsg_(msg, val){
  cache_ = [];
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