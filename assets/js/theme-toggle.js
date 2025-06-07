(function(){
  const body = document.body;
  const stored = localStorage.getItem('theme');
  if(stored === 'dark') body.setAttribute('data-theme','dark');
  const btn = document.getElementById('theme-toggle');
  if(btn){
    btn.addEventListener('click', function(){
      if(body.getAttribute('data-theme') === 'dark'){
        body.removeAttribute('data-theme');
        localStorage.removeItem('theme');
      } else {
        body.setAttribute('data-theme','dark');
        localStorage.setItem('theme','dark');
      }
    });
  }
})();

