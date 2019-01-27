/** 
 * @author akira.s7171@gmail.com
 */

/** 
 * @author <Akira Sakaguchi> akira.s7171@gmail.com
 * 
 * main scripts to show Google Ads Cookies to users 
 */
!function(){
  let style = [STYLE_BOLD, STYLE_BLUE];
  console.log("%cSUGOI!Cookies for Google Ads ⊂(・(ェ)・)⊃ ver.0.7.1", style.join(';'));
  console.log("Your current domain is : 【", document.domain,"】");
  write('_gcl_aw');
  write('_gac');
  console.log("%cDONE!", style.join(';'));
}();

/** 
 *  calling console log
 */
let write = function(cookieNm){
  /** @type {Promise} */
  getCookies(cookieNm).then((result) =>{
    result.length > 0 ?
      console.log('【found out:', result.length, ' ', cookieNm + ' cookies】') :
      console.log('NO '+ cookieNm + ' detected');
      result.forEach(function(item){
        write_(item);
      });
  }); 
}

/** 
 * @private
 * @param {!string} item
 */
let write_ = function(item){
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
  