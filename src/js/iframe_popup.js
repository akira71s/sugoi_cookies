/** 
 * @author Akira Sakaguchi <akira.s7171@gmail.com>
 */
"use strict";

/**
*  Messages from popup.js (parent window)
*/
window.addEventListener('message', (e)=>{
  if(!IsJsonString(e.data)){
    return;
  }
  const data = JSON.parse(e.data);
  if(data.type && data.type==='isEnabled'){
    domainMsg.enabled = data.isEnabled ? true:false;
    data.isEnabled ? switchInput.check() : switchInput.uncheck();
  } else if(data.type && data.type==='reload'){
    reload();

  } else if(data.type && data.type==='emptyInput'){
    gclidInput.emptyInput();

  } else if(data.type && data.type==='sendDomainName'){
    domainMsg.domainName = data.domainName;

  } else if(data.type && data.type==='sendCookie'){
    const cookieName = data.cookieName;
    const cookieValue = data.cookieValue;
    if(cookieName.includes('gcl_aw')){
      gclawMsg.setValue(cookieValue);
    } else if (cookieName.includes('gac')){
      gacMsg.setValue(cookieValue);
    } else if (cookieName.includes('gclid')){
      gclidMsg.setValue(cookieValue);
    }
  }
});

/** 
* @private
*/
function reload(){
const obj = {'type':'reload','gclidVal':gclidInput.value};
window.parent.postMessage(JSON.stringify(obj), PARENT_URL);
};

/** 
 * @param {!string} msg
 * @param {?string} val
 * @param {function} callback
 */
function sendMsgToContentJS_(msg,val,callback){
  const obj = {'type':'sendMsg','msg':msg, 'val':val, 'callback':callback};
  window.parent.postMessage(JSON.stringify(obj), PARENT_URL);
};

/** 
 * TODO: import 
 */
function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

