/** 
 * @author akira.s7171@gmail.com
 */

/**
 * @return {?Array<string>}  
 */
let getGclAwCookies = () => {
    const cookieNm = '_gcl_aw';
    return getCookies(cookieNm)
}; 

/**
 * @return {?Array<string>} cookies 
 */
let getGacCookies = () =>{
    const cookieNm = '_gac';
    return getCookies(cookieNm)
}; 

/**
 *@return {?Array<string>} cookies 
 *@param {!string} cookies 
 */
let getCookies = (cookieNm) =>{
    const cookies = document.cookie;
    let extractedCookies = [];   
    if(!cookies || !cookieNm){
      return extractedCookies;
     }  
    let cookieAsArray = cookies.split(';');
    cookieAsArray.forEach(function(item){
      if(item.includes(cookieNm)){
        extractedCookies.push(item);
      }
     });
     return extractedCookies;
  }; 
  