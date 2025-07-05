document.addEventListener('DOMContentLoaded', function() {
  var copyBtn = document.getElementById('copy-link');
  if(copyBtn){
    copyBtn.addEventListener('click', function(e){
      e.preventDefault();
      var url = window.location.href;
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(url);
      } else {
        var tmp = document.createElement('input');
        tmp.value = url;
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand('copy');
        document.body.removeChild(tmp);
      }
    });
  }
});
