/** 
 * @author Akira Sakaguchi <akira.s7171@gmail.com>
 */
"use strict";

 /** 
 * eventListener - eventListener for chrome.tabs.sendMessage(tabID, obj, function) 
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // background JS sends back this message agter 'start' ->  'cross domain check'
  let msg = request.message;
  let val = request.value;
  if (msg=='domainChecked'){
    start_(val).then(()=>getCookies_());
  } else if (msg=='returnCookies'){
    let cookies = val;
    write_(cookies, document.domain);
  } else if (msg=='cookiesChanged'){
    add_(val);
  } else if (msg=='CV'){
    writeCVinfo_(val);
  }
  return true;
});

/** 
 * calling console log for starter messages
 * @param{string} msg
 */
function start_(msg){
  return new Promise((resolve, reject)=>{
    let domain = document.domain;
    console.log("%cSUGOI!Cookies for Google Ads (`*・ω・’)" + VERSION, STYLE_BOLD);
    switch(msg){
      case 'noError':
      console.log("Current domain is : 【", domain ,"】");
      break;
     case 'domainChanged':
      console.log(STYLE_ESCAPE+"DOMAIN CHANGED TO : 【 "+ domain +" 】", STYLE_BOLD);
      break;
    }
    resolve();
  });
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
  /** _gal_aw */ 
  writeCookies_(cookies, gclAwNm, domain)
  .then(()=>{
  /** _gac */ 
    writeCookies_(cookies, gacNm, domain)
      .then(()=>{return true})
  });
}

/** 
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
  console.log("%cCOOKIE CHANGED after windowLoaded", STYLES_BOLD_RED.join(';'));
  console.log(STYLE_ESCAPE + cookie.name + '=' + cookie.value, STYLES_BOLD_WHITE_BG_GREEN.join(';'));
}

/** 
 * calling console log for cookies
 * @private
 * @return {Promise} 
 * @param {Array.<domainCheckedring>} cookies
 * @param {string} cookieNm
 * @param {string} domain
 */
function writeCookies_(cookies, cookieNm, domain){
  return new Promise((resolve, reject)=>{
    cookies = cookies.filter((cookie) => {
      return cookie.name.includes(cookieNm);
    });
    cookies.length > 0 ?
    console.log('【found out:', cookies.length, ' ', cookieNm + ' cookies】') :
    console.log('NO '+ cookieNm + ' detected');
    cookies.forEach(function(item){
      writeCookieInfo_(item);
    }); 
    resolve();
  })
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
  cookie.value.length === DEFAULT_COOKIE_LENGTH ?
  console.log(STYLE_ESCAPE + cookie.name + '=' + cookie.value, STYLES_BOLD_WHITE_BG_GREEN.join(';')):
  console.log(STYLE_ESCAPE + cookie.name + '=' + cookie.value, STYLES_BOLD_WHITE_BG_GREEN.join(';'));
}; 
