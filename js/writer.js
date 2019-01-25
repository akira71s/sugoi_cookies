let writeGclAw = function(){
  let gclAw = getGclAwCookies();
  !gclAw ? console.log('NO gcl_aw detected'):
    console.log('【foundout:', gclAw.length,' gcl_aw cookies】');
    gclAw.forEach(function(item){
      console.log(item)
    });
}

let writeGac = function(){
  let gac = getGacCookies();
  !gac ? console.log('NO gac detected'):
    console.log('【foundout:', gac.length,' gac cookies】')
    gac.forEach(function(item){
      console.log(item)
    });
};
