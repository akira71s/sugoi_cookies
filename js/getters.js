/**
 * @return {?Array<string>}  
 */
let getGclAwCookies = function (){
    const cookieNm = '_gcl_aw';
    return getCookies(cookieNm)
}; 

/**
 * @return {?Array<string>} cookies 
 */
let getGacCookies = function (){
    const cookieNm = '_gac';
    return getCookies(cookieNm)
}; 

/**
 *@return {?Array<string>} cookies 
 *@param {!string} cookies 
 */
let getCookies = function (cookieNm){
    const cookies = document.cookie;
    if(!cookies || !cookieNm){
      return;
     }  
    let extractedCookies = [];   
    let cookieAsArray = cookies.split(';');
    cookieAsArray.forEach(function(item){
      if(item.includes(cookieNm)){
        extractedCookies.push(item);
      }
     });
     return extractedCookies;
  }; 
  