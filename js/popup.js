/** 
 * @author akira.s7171@gmail.com
 */

 /** 
 * eventListener
 */
window.addEventListener('DOMContentLoaded', function() {
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
});

/**
 * send message to content JS to clear cookies
 * @private
 * @param{?boolean} shouldClearAll
 */
function clearCookies_(shouldClearAll){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    // found active tab
    const tabID = tabs[0].id;
    let greetingObj = shouldClearAll ? {greeting: "clearAll"} : {greeting: "clearCookies"};
    chrome.tabs.sendMessage(tabID, greetingObj, function(response) {
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

    // active tab found 
    let url =tabs[0].url;
    chrome.tabs.sendMessage(tabID, {greeting: "reload", gclidVal: getGclid()});   
  });
}