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
    checkHttpRequest,
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
　firedCVlabels = [];
  contentLoaded = true;
}

/**
 * check conversions that fires before window loaded
 */
function checkHttpRequest(requestDetails) {
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
    CVlabel= CVlabel.split('=')[1]; // label=VAL => [label, VAL]  -> [1] === VAL 

    let cookie = {'gclaw':gclaw, 'gac':gac, 'cvid':CVid, 'cvlabel':CVlabel};
      if(!!contentLoaded){
      if(CVs.length==0){
       CVs.push(cookie);    
      }  
      CVs.forEach((cv)=>{
      if(cv.cvlabel!==CVlabel){
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
    } else if (msg ==='toggle'){
       toggle_(request);
       stop_();
    }
    return true;
});

function stop_() {
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