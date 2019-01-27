/** 
 * @author Akira Sakaguchi <akira.s7171@gmail.com>
 */

/**
 * main scripts to show Google Ads Cookies to users 
 */
window.addEventListener('load', function(){
  // TODO change appropriately to call this after cookies made (especially _gac)
  setTimeout(start_, 1000);
});

/** 
 *  calling console log for starter messages
 */
function start_(){
  console.log("%cSUGOI!Cookies for Google Ads ⊂(・(ェ)・)⊃" + VERSION, STYLES_BOLD_BULE.join(';'));
  console.log("Your current domain is : 【", document.domain,"】");
  write_();
};

/** 
 * calling console log for cookies
 * @private
 */
const write_ =() =>{  
  let gclAwNm ='_gcl_aw';
  let gacNm ='_gac';
  /** +gal_aw */ 
  getCookies(gclAwNm).then((result) =>{
    result.length > 0 ?
      console.log('【found out:', result.length, ' ', gclAwNm + ' cookies】') :
      console.log('NO '+ gclAwNm + ' detected');
      result.forEach(function(item){
        writeCookieInfo_(item);
      });
  }).then(()=>{
    /** _gac */ 
    getCookies(gacNm).then((result) =>{
      result.length > 0 ?
        console.log('【found out:', result.length, ' ', gacNm + ' cookies】') :
        console.log('NO '+ gacNm + ' detected');
        result.forEach(function(item){
          writeCookieInfo_(item);
        });
    }) 
  }) // after all the Promise functions, write DONE
  .then(()=>{console.log("%cDONE!", STYLES_BOLD_BULE.join(';'))});
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