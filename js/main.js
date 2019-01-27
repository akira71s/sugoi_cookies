/** 
 * @author <Akira Sakaguchi> akira.s7171@gmail.com
 * 
 * main scripts to show Google Ads Cookies to users 
 */
!function(){
  let style = [STYLE_BOLD, STYLE_BLUE];
  console.log("%cSUGOI!Cookies for Google Ads ⊂(・(ェ)・)⊃ ver.0.7.1", style.join(';'));
  console.log("Your current domain is : 【", document.domain,"】");
  write('_gcl_aw');
  write('_gac');
  console.log("%cDONE!", style.join(';'));
}();