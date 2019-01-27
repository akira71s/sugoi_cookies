// TODO
// /** 
//  * @author akira.s7171@gmail.com
//  */
// /**
//  * setCookie to the domain. if not params passed , 
//  * 'gclid', '_gcl_aw' and 1 hour are used as default  
//  * 
//  * @return{string} 
//  * @param {string} queryName
//  * @param {string} cookieName
//  * @param {number} lifeSpan 
//  */
// var cookieBaker = function(queryNameb = 'gclid', cookieName='_gcl_aw', lifeSpan =60 * 60){
//     var queryVal;   
//     // current parameter 
//     var s = document.location.search;
//     var queryVal = !!s ? getQueryVal(s, queryName) : null;
    
//     if(queryVal){
//       document.cookie = cookieName + '=' + queryVal + ';path=/; max-age=' + lifeSpan + ';';
//     }
//   };
  
//   var getQueryVal= function(s, queryName){
//       if(!s || !queryName){
//         return; 
//       }
//       // remove '&' from the param, then make it an array splitted by '&'  
//       var param= s.substring(1).split('&');
//       var idx = 0;
//       while(idx < param.length){
//         if(!param[idx].indexOf(queryName +'=')){
//           queryVal = param[idx].split('=')[1];
//           break;
//          } 
//          idx++;
//       }
//       return queryVal;
//   };
  
  