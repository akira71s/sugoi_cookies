/** 
 * @author akira.s7171@gmail.com
 */

/** 
 * eventListener
 */
window.addEventListener('load', function() {
  let goBtnEl = document.getElementById("go");
  // event lisner for clicking 'GO' to execute a gclid test 
  goBtnEl.onclick = () =>{
    let inputEl =document.getElementById('input');
    if(inputEl && inputEl.value){
      sendMsgToContentJS_('reload', 'gclidVal', getGclid());
    }
  };
  
  // event lisner for pressing enter to execute a gclid test 
  document.addEventListener('keyup', function(e){
    let inputEl =document.getElementById('input');
    if(e.key==='Enter'&&inputEl && inputEl.value){
      sendMsgToContentJS_('reload', 'gclidVal' ,getGclid());
    }
  });

  // event lisner for clicking 'clear' to clear cache 
  let clearBtnEl = document.getElementById("clear");
  clearBtnEl.onclick = () =>{
    sendMsgToContentJS_('clearCookies');
    emptyInput_();
  };

  // event lisner for clicking 'clear' to clear cache 
  let clearAllBtnEl = document.getElementById("clear-all");
  clearAllBtnEl.onclick = () =>{
    sendMsgToContentJS_('clearAll');
    emptyInput_();
  };

  // event lisner for clicking 'clear' to clear cache 
  let toggleEl = document.getElementById("toggle");
  let isChecked = window.localStorage.getItem('enabled');
  toggleEl.checked = isChecked && isChecked=='true'? true : false;
  toggleEl.onchange = () =>{
    sendMsgToContentJS_('toggle', 'shouldEnabled', toggleEl.checked);
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
 * @return {!string}
 */
function getGclid () {
  let inputEl =document.getElementById('input');
  let val = inputEl && inputEl.value ? inputEl.value : 'TEST';  
  let currentHref = window.location.href;
  return currentHref.includes('?') ? '&gclid='+val : '?gclid='+val; 
};

/** 
 * @return {!string} msg
 * @return {?string} key
 * @return {?string} value
 */
function sendMsgToContentJS_(msg, key, value){
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabID = tabs[0].id;
    if (!tabID) {
      return;
    }
    console.log(msg, obj);
    key && value ?
      chrome.tabs.sendMessage(tabID, {message: msg, key:value}):
      chrome.tabs.sendMessage(tabID, {message: msg});
  });
};