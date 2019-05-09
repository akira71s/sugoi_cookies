/** 
 * @author Akira Sakaguchi <akira.s7171@gmail.com>
 */
"use strict";
let gacCache = [];
let gclawCache = [];
let gclidCache = [];

/** 
 * eventListener - eventListener for chrome.tabs.sendMessage(tabID, obj, function) 
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  let msg = request.message;
  let val = request.value;
  // from background js
  if(msg=='enabled'){
    start_();
    let cookies = getCookies(true);
    write_(cookies, document.domain);
    setTimeout(checkCookies_, 3000);
  
  // from background js
  } else if (msg=='CV'){
    writeCVinfo_(val);
  } else if (msg=='getCookies'){
    chrome.runtime.sendMessage({message:'sendCookie', cookieName: 'gcl_aw', cookieValue:gclawCache});
    chrome.runtime.sendMessage({message:'sendCookie', cookieName: 'gac', cookieValue:gacCache});
    chrome.runtime.sendMessage({message:'sendCookie', cookieName: 'gclid', cookieValue:gclidCache});
  }

  return true;
});

/** 
 * check if new cookies created / overriden after window loaded
 * @return {bookean}
 */
function checkCookies_(){
  let newCookies = [];
  let isChanged = false;
  let cookies = getCookies(false);
  cookies.forEach((cookie)=>{
    let name = cookie.split('=')[0];   
    let value = cookie.split('=')[1];
    if(name.includes('gac')&&!gacCache.includes(value)) {
      isChanged = true;
      newCookies.push(name+'='+value);
    }  
    if(name.includes('gcl_aw')&&!gclawCache.includes(value)) {
      isChanged = true;
      newCookies.push(name+'='+value);
    }  
    if(name.includes('gclid')&&!gclidCache.includes(value)) {
      isChanged = true;
      newCookies.push(name+'='+value);
    }
  });
  if(isChanged){
    console.log("%cCOOKIE CHANGED after windowLoaded", STYLES_BOLD_RED.join(';'));    
    newCookies.forEach((cookie)=>{
      add_(cookie);
    });
  }
};

 /** 
 * return array of cookies ('name=value')
 * @return {string[]}
 */
function getCookies(isOnload){
  let cookies = document.cookie.split(';');
  let localStorageGclid = localStorage.getItem('gclid');
  if(localStorageGclid){
    cookies.push(['gclid='+localStorageGclid]);
  }
  cookies = cookies.filter((cookie)=>{
    let name = cookie.split('=')[0];
    let value = cookie.split('=')[1];
    if(name.includes('gac')&&!gacCache.includes(value)){
      if(isOnload){
        gacCache.push(value) 
      }
      return true;
    } else if (name.includes('gcl_aw')&&!gclawCache.includes(value)){
      if(isOnload){
        gclawCache.push(value); 
      }
      return true;
    } else if (name.includes('gclid')&& !gclidCache.includes(value)){
      if(isOnload){
        gclidCache.push(value); 
      }
      return true;
    }
    return false;
  });
  return cookies;
};

/** 
 * calling console log for starter messages
 */
function start_(){
  let domain = document.domain;
  console.log("%cSUGOI!Cookies for Google Ads (`*・ω・’)" + VERSION, STYLE_BOLD);
  console.log("Current domain is : 【", domain ,"】");
};

/** 
 * calling console log for cookies
 * @private
 * @oaram {Array.<string>} cookies
 * @oaram {string} domain
 */
const write_ =(cookies, domain) =>{
  let gclAwNm ='_gcl_aw';
  let gacNm ='_gac';
  let gclid ='gclid';
  /** _gal_aw */
  writeCookies_(cookies, gclAwNm, domain);
  /** _gac */ 
  writeCookies_(cookies, gacNm, domain);
  /** gclid */ 
  writeCookies_(cookies, gclid, domain);
};

/** 
 * logging cookie info (related to Google Ads)
 */
const writeCVinfo_ =(CVinfo) =>{
  console.log('%cCONGRATULATIONS! CV FIRES!', STYLES_BOLD_WHITE_BG_ORANGE.join(';'));
  console.log('CV ID: %c'+ CVinfo.cvid, STYLE_BOLD);
  console.log('CV LABEL: %c'+ CVinfo.cvlabel, STYLE_BOLD);
  if(!CVinfo.gclaw&&!CVinfo.gac){
    console.log('%cBUT NOT COOKIES DETECTED', STYLES_BOLD_WHITE_BG_GRAY.join(';'));
  } else { 
    if (CVinfo.gclaw){
      console.log('CV COOKIE: %c'+ CVinfo.gclaw, STYLE_BOLD);
    }  
    if(CVinfo.gac){
    console.log('CV COOKIE: %c'+ CVinfo.gac, STYLE_BOLD);
    }
  }
}
/** 
 * calling console log for cookies
 * @private
 * @oaram {Array.<string>} cookies
 * @oaram {string} domain
 */
const add_ =(cookie) =>{
  let name = cookie.split('=')[0];
  let value = cookie.split('=')[1];
  console.log(STYLE_ESCAPE + name + '=' + value, STYLES_BOLD_WHITE_BG_GREEN.join(';'));
};

/** 
 * calling console log for cookies
 * @private
 * @return {Promise} 
 * @param {Array.<string>} cookies
 * @param {string} cookieNm
 * @param {string} domain
 */
function writeCookies_(cookies, cookieNm, domain){
  cookies = cookies.filter((cookie) => {
    let name = cookie.split('=')[0];
    return name.includes(cookieNm);
  });
  cookies.length > 0 ?
  console.log('【found out:', cookies.length, ' ', cookieNm + ' cookies】') :
  console.log('NO '+ cookieNm + ' detected');
  cookies.forEach(function(item){
    writeCookieInfo_(item);
  }); 
};

/** 
 * @private
 * @param {!string} cookie
 */
const writeCookieInfo_ = (cookie) =>{
  if(!cookie){
    console.error('parameter invalid');
    return;
  }
  let name = cookie.split('=')[0];
  let value = cookie.split('=')[1];
  console.log(STYLE_ESCAPE + name + '=' + value, STYLES_BOLD_WHITE_BG_GREEN.join(';'));
  chrome.runtime.sendMessage({message:'sendCookie', cookieName: name, cookieValue:value});
}; 
