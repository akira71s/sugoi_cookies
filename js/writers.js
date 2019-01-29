/** 
 * @author Akira Sakaguchi <akira.s7171@gmail.com>
 */

/** 
 * eventListener - eventListener for chrome.tabs.sendMessage(tabID, obj, function) 
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // background JS sends back this message agter 'start' ->  'cross domain check'
  if (request.message=='domainChecked'){
    // TODO listen Google Ads & Analytics Cookies Events instead of calling setTimeout
    setTimeout(start_(request.value), 1000);
    getCookies_(); // => returnCookies
  } else if (request.message=='returnCookies'){
    let cookies = request.value;
    write_(cookies, document.domain);
  }
});

/** 
 * calling console log for starter messages
 * @param{string} meg
 */
function start_(msg){
  let domain = document.domain;
  console.log("%cSUGOI!Cookies for Google Ads ⊂(・(ェ)・)⊃" + VERSION, STYLES_BOLD_BULE.join(';'));
  msg === 'noError' ?
    console.log("Current domain is : 【", domain ,"】"):
    console.log("%cDOMAIN CHANGED to " + domain, STYLES_BOLD_RED.join(';'));
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
  writeCookies_(cookies, gclAwNm)
  .then(()=>{
  /** _gac */ 
    writeCookies_(cookies, gacNm)
      .then(()=>{
        console.log("%cDONE!", STYLES_BOLD_BULE.join(';'));
    })
 })
}

/** 
 * calling console log for cookies
 * @private
 * @return {Promise} 
 * @oaram {Array.<string>} cookies
 * @oaram {string} cookieNm
 */
function writeCookies_(cookies, cookieNm){
 return new Promise((resolve, reject)=>{
    cookies = cookies.filter(cookie => cookie.name.includes(cookieNm));  
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
  console.log(STYLE_ESCAPE + cookie.name + '=' + values[0] +'.'+ values[1] +'.'+ STYLE_ESCAPE + values[2], STYLE_BOLD, STYLE_HIGHLIGHT):
  console.log(STYLE_ESCAPE + cookie.name + '=' + STYLE_ESCAPE + cookie.value, STYLE_BOLD, STYLE_HIGHLIGHT);
// TODO: console in bg-red or bg-green 
}; 

/** 
 * eventListener
 * when window loaded, renew thedomain to the background.js
 */
window.addEventListener('load', function() {
  chrome.runtime.sendMessage({message:'setDomain', domain:document.domain});
});