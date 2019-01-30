/**
 * @author Akira Sakaguchi <akira.s7171@gmail.com>  
 */

/**
 * chrome.cookies shoul be called in this file, otherwise it's gonna be undefined  
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  let msg = request.message;
  let subdomain = request.domain;
  let domain = request.domain.substr(request.domain.indexOf('.'));
  // receive start message on load 
  switch(msg){
    case 'start':
      // check if the plugin is enabled or not
      let enabled = window.localStorage.getItem('enabled') == 'true' ? true : false;
      // change the icon accordinglly
      updateIcon_(enabled);
      if(!enabled){
        return;
      }
      start_(request);
      break;

    case 'clearCookies':
      getCookies_(domain).then((cookies)=>{
        clearCookies_(cookies).then((result)=>{
          getCookies_(subdomain).then((otherCookies)=>{
            clearCookies_(otherCookies).then((otherResult)=>{
              sendMsg_(result || otherResult);
            });
          });
        });
      });
      break;
    
    case 'clearAll':
      getCookies_().then((cookies)=>{
        clearCookies_(cookies).then((result)=>{
          sendMsg_(result || otherResult);
        });
      });
      break;
    
    case 'getCookies':
      let array = [];
      getCookies_(domain).then((cookies)=>{
        push_(array, cookies).then((result)=>{
          getCookies_(subdomain).then((otherCookies)=>{
            push_(result, otherCookies).then((finalCookies)=>{
              sendMsg_('returnCookies', finalCookies);
            });
          });
        });
      });
      break;
      
  case 'setDomain':
   break;
    // renew a domain name in the  local storage
    // TODO
    // window.sessionStorage.setItem("domainNm", request.domain);      
  
  case 'toggle':
    toggle_(request)
    break;
  } 
});


/**
 * @private 
 * @param{Object} shouldEnabled 
 */
function toggle_(request){
  let shouldEnabled = request.shouldEnabled;
  updateIcon_(shouldEnabled);
  let booleanStr = shouldEnabled ? 'true' : 'false';
  window.localStorage.setItem('enabled', booleanStr);
  if(shouldEnabled){
    start_(request);
  }
};

/**
 * @private 
 * @return{Promise}
 * @param{Array} array 
 * @param{Array} cookies 
 */
function push_(array, cookies){
  return new Promise((resolve, reject)=>{
    resolve(array.concat(cookies));
  });
};
/**
 * @private 
 * @param{boolean} shouldEnabled 
 */
function updateIcon_(shouldEnabled) {
  let suffix = shouldEnabled ? '-on' : '';
  chrome.browserAction.setIcon({path:"../icon/cookie128" + suffix + ".png"});
};

/**
 * @private  
 * @param {Object} request
 */
function start_(request){
    let domain = request.domain;
    let refferer = request.refferer;
    let isTheSameDomain = isTheSameDomain_(domain);
    if(isTheSameDomain || refferer==''){
      sendMsg_('domainChecked', 'noError');
    } else {
      sendMsg_('domainChecked', 'noError');
    }
    // TODO
    //   let result = checkCookies_()
    //   if(result ==='fail'){
    //     // TODO: 
    //     // sendMsg_('cookieChecked', 'fail');
    //   } else if (result ==='success'){
    //     // TODO: 
    //     // sendMsg_('cookieChecked', 'success');
    //   }
    // }
};

// TODO
 // -> setItem('cookies', JSON)
 // -> parse -> cookies 
 
/**
 * @private 
 * @return {string} 'fali' || 'success'
 */
function checkCookies_(){
  // getCookies
  // getItem('cookies', JSON)
  // JSON.parse ->  

  // getCookies_('_gcl_aw')
  // getCookies_('_gac')
}


/**
 * @private 
 * @return {boolean} 
 * @param {String} domain 
 */
function isTheSameDomain_(domain){
  return domain === window.sessionStorage.getItem("domainNm");
}

/**
 * @private 
 * @return {Promise} 
 * @param {Array.<Object>} cookies - [] default 
 */
function clearCookies_(cookies=[]){
  return new Promise((resolve, reject)=>{ 
      cookies.forEach(function(cookie){
        let url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
        chrome.cookies.remove({"url": url, "name": cookie.name}, function(cookie){('deleted_cookie', cookie)});
      });
      resolve("cookieCleared");
    });
};

/**
 * @private 
 * @return {Promise} 
 * @param {?string} domaiNm - if null, get all 
 */
function getCookies_(domainNm){
  let detailObj = domainNm ? {domain:domainNm} :{};
  return new Promise((resolve, reject)=>{ 
    chrome.cookies.getAll(detailObj,((cookies)=>{
      resolve(cookies || []);
    }));
  });
};

/**
 * @private 
 * @param {string} msg 
 * @param {?Any} val
 */
function sendMsg_(msg, val){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    // found active tab
    if(!tabs[0]){
      return;
    }
    const tabID = tabs[0].id;
    val != undefined ? 
      chrome.tabs.sendMessage(tabID, {message: msg, value: val}):
      chrome.tabs.sendMessage(tabID, {message: msg});
    });
};