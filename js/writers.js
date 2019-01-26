/** 
 * @author akira.s7171@gmail.com
 */
let writeGclAw = function(){
  let gclAw = getGclAwCookies();
  !!gclAw ? 
    console.log('【found out:', gclAw.length,' gcl_aw cookies】') :
    console.log('NO _gcl_aw detected');
    gclAw.forEach(function(item){
      write_(item);
  });
}

let writeGac = function(){
  let gac = getGacCookies();
  !!gac ? 
    console.log('【found out:', gac.length,' gac cookies】') :
    console.log('NO _gac detected');  
  gac.forEach(function(item){
    write_(item);
  });
};

/** 
 * @private
 * @param {!string} item
 */
let write_ = function(item){
  if(!item){
    console.error('parameter invalid');
    return;
  }
  var spritedVals = item.split('.');
  spritedVals.length === DEFAULT_COOKIE_LENGTH ? 
    console.log(STYLE_ESCAPE + spritedVals[0] + '.' + spritedVals[1] + 
     '.' + STYLE_ESCAPE + spritedVals[2], STYLE_BOLD,STYLE_HIGHLIGHT) :
    console.log(item);  
;} 