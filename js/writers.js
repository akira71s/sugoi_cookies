/** 
 * @author Akira Sakaguchi <akira.s7171@gmail.com>
 */

/** 
 * start - immediateb function
 */
!function(){
  chrome.runtime.sendMessage({message:'started', domain:document.domain});
}();

/** 
 * eventListener - eventListener for chrome.tabs.sendMessage(tabID, obj, function) 
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // background JS sends back this message agter 'start' ->  'cross domain check'
  if (request.message=='domainChecked'){
    // TODO listen Google Ads & Analytics Cookies Events instead of calling setTimeout
    setTimeout(start_(request.value), 1000);
  }
});

/** 
 * calling console log for starter messages
 * @param{boolean} isSameDomain
 */
function start_(isSameDomain){
  let domain = document.domain;
  console.log("%cSUGOI!Cookies for Google Ads ⊂(・(ェ)・)⊃" + VERSION, STYLES_BOLD_BULE.join(';'));
  isSameDomain ?
    console.log("Current domain is : 【", domain ,"】"):
    console.log("%cDOMAIN CHANGED to " + domain, STYLES_BOLD_RED.join(';'));
  write_(document.domain);
};

/** 
 * calling console log for cookies
 * @private
 */
const write_ =(domain) =>{
  let gclAwNm ='_gcl_aw';
  let gacNm ='_gac';
  /** _gal_aw */ 
  getCookies(gclAwNm).then((result) =>{
    result.length > 0 ?
      console.log('【found out:', result.length, ' ', gclAwNm + ' cookies】') :
      console.log('NO '+ gclAwNm + ' detected');
      result.forEach(function(item){
        writeCookieInfo_(item);
      });
  })
  .then(()=>{
    /** _gac */ 
    getCookies(gacNm).then((result) =>{
      result.length > 0 ?
        console.log('【found out:', result.length, ' ', gacNm + ' cookies】') :
        console.log('NO '+ gacNm + ' detected');
        result.forEach(function(item){
          writeCookieInfo_(item);
        });
    }) 
  })
  // after all the Promise functions, write DONE
  .then(()=>{console.log("%cDONE!", STYLES_BOLD_BULE.join(';'))})
}

/** 
 * @private
 * @param {!string} item
 */
const writeCookieInfo_ = (item) =>{
  if(!item){
    console.error('parameter invalid');
    return;
  }
  var spritedVals = item.split('.');
  spritedVals.length === DEFAULT_COOKIE_LENGTH ? 
    console.log(STYLE_ESCAPE + spritedVals[0] + '.' + spritedVals[1] + 
     '.' + STYLE_ESCAPE + spritedVals[2], STYLE_BOLD,STYLE_HIGHLIGHT) :
    console.log(item);  
}; 

/**
 * TODO: may be able to use Chrome.cookies API
 *@return {Promise}  
 *@param {string} cookieNm - either _gac or _gcl_aw
 */
const getCookies = (cookieNm) =>{
  return new Promise(function(resolve, reject){
    let extractedCookies = [];
    let cookies = document.cookie;
    if(!cookies || !cookieNm){
      return extractedCookies;
    }  
    let cookieAsArray = cookies.split(';');
    cookieAsArray.forEach(function(item){
      if(item.includes(cookieNm)){
        extractedCookies.push(item);
      }
    });
    resolve(extractedCookies);   
  }) 
}; 