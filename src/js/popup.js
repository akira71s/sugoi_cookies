/** 
 * eventListener - eventListener for chrome.tabs.sendMessage(tabID, obj, function) 
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  let msg = request.message;
  if(msg==='sendDomainName'){
    const $iFrame = document.getElementById('main-iframe');
    $iFrame.contentWindow.postMessage(JSON.stringify({type:'sendDomainName', 'domainName':request.domainName}),'*');  
  } if(msg==='sendCookie'){
    const $iFrame = document.getElementById('main-iframe');
    $iFrame.contentWindow.postMessage(JSON.stringify({type:'sendCookie', 
      'cookieName':request.cookieName,'cookieValue':request.cookieValue}),'*');  
  } 
 
  return true;
});

window.addEventListener('message',(e)=>{
  if(!IsJsonString(e.data)){
    return;
  }
  const data = JSON.parse(e.data);
  const type = data.type;
  if(!type){
    return;
  }

  if(type ==='checkEnabled'){
    const isEnabledStr = window.localStorage.getItem('enabled');
    const isEnabled = isEnabledStr && isEnabledStr=='true'? true : false;
    const $iFrame = document.getElementById('main-iframe');
    $iFrame.contentWindow.postMessage(JSON.stringify({type:'isEnabled', 'isEnabled':isEnabled}),'*');

  } else if(type ==='toggleEnabled'){
    const isEnabledStr = window.localStorage.getItem('enabled');
    const isEnabled = isEnabledStr && isEnabledStr=='true'? true : false;
    // toggle
    window.localStorage.setItem('enabled', !isEnabled);

  } else if(type==='sendMsg'){
    const msg = data.msg;
    const val = data.val!=null ? data.val : '';
    const $iFrame = document.getElementById('main-iframe');
    const callback = data.callback ?
      $iFrame.contentWindow.postMessage(JSON.stringify({type:data.callback}),'*'):(()=>{});
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabID = tabs[0].id;
      if (!tabID) {
        return null;
      }
      chrome.tabs.sendMessage(tabID, {message: msg, value:val}, callback);
    });

  } else if (type==='reload'){
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabID = tabs[0].id;
      if (tabID) {
        chrome.tabs.sendMessage(tabID, {message: 'getUrl'}, ((response)=>{
          const url = getUrlWithoutGclid(response);
          if(url){
            // & or ? gclid=...
            const gclid = getGclid_(url,data.gclidVal);
            chrome.tabs.sendMessage(tabID, {message: 'reload', value:url+gclid});
          }
        return true; 
        }));
      }
      return true; 
    })

  } else if (type==='getDomainName'){
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabID = tabs[0].id;
      if (tabID) {
        chrome.tabs.sendMessage(tabID, {message: 'getDomainName'}, ()=>{});
      }
      return true; 
    })
   } else if (type==='getCookies'){
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabID = tabs[0].id;
      if (tabID) {
        chrome.tabs.sendMessage(tabID, {message: 'getCookies'}, ()=>{});
      }
      return true; 
    })
  }

});

/** 
 * @return {string} url - url without gclid
 * @param {string} url - url with or without gclid
 */
function getUrlWithoutGclid (url) {
  if(!url){
    return;
  }
  if(url.includes('?gclid')){
    url = url.substring(url.indexOf('?gclid'),0);
  } else if(url.includes('&gclid')) {
    url = url.substring(url.indexOf('&gclid'),0);
  } else if (url.includes('?_gl')){
    url = url.substring(url.indexOf('?_gl'),0);
  } else if (url.includes('&_gl')){
    url = url.substring(url.indexOf('&_gl'),0);
  }
  return url;
};

/** 
 * get gclid val according to the value in the input box
 * @return {!string};
 * @param {string} url
 */
function getGclid_(url, val) {
  if(!val){
    return '';
  }
  return url.includes('?') ? '&gclid='+val : '?gclid='+val; 
};

/**
 * check if the string is JSON parsable
 * @return {boolean}  
 */
function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};