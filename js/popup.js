/** 
 * @author akira.s7171@gmail.com
 */

/** 
 * eventListener
 */
window.addEventListener('DOMContentLoaded', function() {
  let btnEl = document.getElementById("btn");
  btnEl.onclick = () =>{
    let inputEl =document.getElementById('input');
    let val = inputEl && inputEl.value ? inputEl.value : 'TEST';  
    setGclid(val);
  };
});

/** 
 * @param {string} gclidTag - ?gclid=... OR &gclid=... 
 */
function changeLocation (gclidTag) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabID = tabs[0].id;
        if (!tabID) {
            return;
        }
        // active tab found 
        let url =tabs[0].url;

        // if gclid is already there in the URL, remove it
        url = checkGclid(url);

        // now move onto the URL with gclid
        let newURL = url + gclidTag;
        chrome.tabs.executeScript(tabID, {
            code: `window.location.href="${newURL}"`
          });
    });
}

/** 
 * @param {string} val - value after gclid +...
 */
function setGclid (val) {
  let currentHref = window.location.href;
  currentHref.includes('?') ? changeLocation('&gclid='+val) : changeLocation('?gclid='+val); 
};

/** 
 * @return {string} url - url without gclid
 * @param {string} url - url with or without gclid
 */
function checkGclid (url) {
  if(url.includes('?gclid')){
    url = url.substring(url.indexOf('?gclid'), url.indexOf('?gclid'));
  } else if(url.includes('&gclid')) {
    url = url.substring(url.indexOf('&gclid'), url.indexOf('&gclid'));
  }
  return url;
};