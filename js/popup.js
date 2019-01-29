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
      reloadWithGclid();
    }
  };
  
  // event lisner for pressing enter to execute a gclid test 
  document.addEventListener('keyup', function(e){
    let inputEl =document.getElementById('input');
    if(e.key==='Enter'&&inputEl && inputEl.value){
      reloadWithGclid();
    }
  });

  // event lisner for clicking 'clear' to clear cache 
  let clearBtnEl = document.getElementById("clear");
  clearBtnEl.onclick = () =>{
    clearCookies_();
  };

  // event lisner for clicking 'clear' to clear cache 
  let clearAllBtnEl = document.getElementById("clear-all");
  clearAllBtnEl.onclick = () =>{
    clearCookies_(true);
  };

  // event lisner for clicking 'clear' to clear cache 
  let toggleEl = document.getElementById("toggle");
  let isChecked = window.localStorage.getItem('enabled');
  toggleEl.checked = isChecked && isChecked=='true'? true : false;
  toggleEl.onchange = () =>{
    toggle_(toggleEl.checked);
  };
}, false);

/**
 * send message to content JS to clear cookies
 * @private
 * @param{?boolean} shouldClearAll
 */
function clearCookies_(shouldClearAll){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    // found active tab
    const tabID = tabs[0].id;
    let msgObj = shouldClearAll ? {message: "clearAll"} : {message: "clearCookies"};
    chrome.tabs.sendMessage(tabID, msgObj, function(response) {
      emptyInput_();
    });
  });
}

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
 * reload with ?gclid or &gclid
 */
function reloadWithGclid() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabID = tabs[0].id;
    if (!tabID) {
      return;
    }
    chrome.tabs.sendMessage(tabID, {message: "reload", gclidVal: getGclid()});   
  });
};

/** 
 * @param{boolean}
 */
function toggle_(enabled) {
  console.log('to', enabled);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabID = tabs[0].id;
    if (!tabID) {
      return;
    }
    chrome.tabs.sendMessage(tabID, {message: "toggle", shouldEnabled : enabled});   
  });
};

/** 
 * @param{boolean}
 */
function start_(enabled) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabID = tabs[0].id;
    if (!tabID) {
      return;
    }
    chrome.tabs.sendMessage(tabID, {message: "start"});   
  });
}