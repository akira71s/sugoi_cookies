/** 
 * @author Akira Sakaguchi <akira.s7171@gmail.com>
 */

/** 
 * eventListener
 */
window.addEventListener('load', function(){
  let goBtnEl = document.getElementById("go");
  // event lisner for clicking 'GO' to execute a gclid test 
  goBtnEl.onclick = () =>{
    let inputEl =document.getElementById('input');
    if(inputEl && inputEl.value){
      reload_();
    }
  };
  
// event lisner for pressing enter to execute a gclid test 
  let inputEl =document.getElementById('input');
  inputEl.onkeydown = (e) => {
    if(e.key==='Enter'&& inputEl && inputEl.value){
      reload_();
    }
  };

  // event lisner for clicking 'clear' to clear cache 
  let clearBtnEl = document.getElementById("clear");
  clearBtnEl.onclick = () =>{
    sendMsgToContentJS_('clearCookies', null, emptyInput_());
  };

  // event lisner for clicking 'clear' to clear cache 
  let clearAllBtnEl = document.getElementById("clear-all");
  clearAllBtnEl.onclick = () =>{
    sendMsgToContentJS_('clearAll', null, emptyInput_());
  };

  // event lisner for clicking 'clear' to clear cache 
  let toggleEl = document.getElementById("toggle");
  let isChecked = window.localStorage.getItem('enabled');
  toggleEl.checked = isChecked && isChecked=='true'? true : false;
  toggleEl.onchange = () =>{
    sendMsgToContentJS_('toggle', toggleEl.checked, reload_());
  };
}, false);

/** 
 * empty input box in the popup
 * @private
 */
function emptyInput_(){
  let inputEl =document.getElementById('input');
  inputEl.value = '';
}

/** 
 * get gclid val according to the value in the input box
 * @return {!string};
 * @param {string} url
 */
function getGclid_(url) {
  let inputEl =document.getElementById('input');
  let val = inputEl && inputEl.value ? inputEl.value : '';
  return url.includes('?') ? '&gclid='+val : '?gclid='+val; 
};
 
/** 
 * @return {string} url - url without gclid
 * @param {string} url - url with or without gclid
 */
function getUrlWithourGclid (url) {
  if(url.includes('?gclid')){
    url = url.substring(url.indexOf('?gclid'),0);
  } else if(url.includes('&gclid')) {
    url = url.substring(url.indexOf('&gclid'),0);
  }
  return url;
};

/** 
 * @private
 */
function reload_(){
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabID = tabs[0].id;
    if (!tabID) {
      return;
    }
    chrome.tabs.sendMessage(tabID, {message: 'getUrl'}, ((response)=>{
      let url = getUrlWithourGclid(response);
      let gclid = getGclid_(url);
      chrome.tabs.sendMessage(tabID, {message: 'reload', value:url+gclid});
    }));
  })
};

/** 
 * @return {!string} msg
 * @return {?string} val
 * @return {function} callback
 */
function sendMsgToContentJS_(msg,val,callback){
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabID = tabs[0].id;
    if (!tabID) {
      return;
    }
    callback = callback ? callback : (()=>{});
    val = val ? val : '';
    chrome.tabs.sendMessage(tabID, {message: msg, value:val}, callback);
  });
};