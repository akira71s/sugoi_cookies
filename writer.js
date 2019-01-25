!function(){
  let gclAw = getGclAwCookies();
  if(gclAw){
    gclAw.forEach(function(item){
      console.log('gcl_aw found!! : ',item)
    });
  }

  let gac = getGacCookies();
  if(gac){
    gac.forEach(function(item){
      console.log('gac found!! : ',item)
    });
  }  
}();
