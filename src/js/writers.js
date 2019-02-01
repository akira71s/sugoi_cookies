/** 
 * @author Akira Sakaguchi <akira.s7171@gmail.com>
 */

/** 
 * eventListener - eventListener for chrome.tabs.sendMessage(tabID, obj, function) 
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // background JS sends back this message agter 'start' ->  'cross domain check'
  if (request.message=='domainChecked'){
    start_(request.value);
    // TODO listen Google Ads & Analytics Cookies Events instead of calling setTimeout
    setTimeout(getCookies_, 2000); // => returnCookies
  } else if (request.message=='returnCookies'){
    let cookies = request.value;
    write_(cookies, document.domain);
  }
});

/** 
 * calling console log for starter messages
 * @param{string} msg
 */
function start_(msg){
  let domain = document.domain;
  console.log("%cSUGOI!Cookies for Google Ads (`*・ω・’)" + VERSION, STYLES_BOLD_BULE.join(';'));
  switch(msg){
    case 'noError':
      console.log("Current domain is : 【", domain ,"】");
      break;
 
    case 'domainChanged':
      console.log(STYLE_ESCAPE+"DOMAIN CHANGED TO : 【 "+ domain +" 】", STYLES_BOLD_RED.join(';'));
      break;

    case 'fail':
      // TODO
      break;

    case 'success':
      // TODO
      break;
  }
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
      .then(()=>{
        console.log("%cDONE!", STYLES_BOLD_BULE.join(';'));
    })
 })
}

/** 
 * calling console log for cookies
 * @private
 * @return {Promise} 
 * @param {Array.<string>} cookies
 * @param {string} cookieNm
 * @param {string} domain
 */
function writeCookies_(cookies, cookieNm, domain){
   let mainDomain = domain.slice(domain.indexOf('.'));
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
  let values = cookie.value.split('.');
  values.length === DEFAULT_COOKIE_LENGTH ?
  console.log(STYLE_ESCAPE + cookie.name + '=' + values[0] +'.'+ values[1] +'.'+ STYLE_ESCAPE + values[2], STYLE_BOLD, STYLES_BOLD_WHITE_BG_GREEN.join(';')):
  console.log(STYLE_ESCAPE + cookie.name + '=' + STYLE_ESCAPE + cookie.value, STYLE_BOLD, STYLES_BOLD_WHITE_BG_GREEN.join(';'));
// TODO: console in bg-red or bg-green 
}; 

/** 
 * eventListener
 * when window loaded, renew thedomain to the background.js
 */
window.addEventListener('load', function() {
  // TODO fix this
  chrome.runtime.sendMessage({message:'checkCookies', domain:document.domain});
  chrome.runtime.sendMessage({message:'setDomainAndCookies', domain:document.domain});
});