let go = new Vue({
    el: '#go',
      data: {
      seen: true
    },
    methods: {
      greet: function (event) {
        console('Hello ' + this.name + '!')
        if (event) {
          console(event.target.tagName)
        }
      }
    }
});
  
let clear = new Vue({
  el: '#clear',
      data: {
      seen: true
    }
});

let input = new Vue({
    el: '#input',
      data: {
      seen: true
    }
});
