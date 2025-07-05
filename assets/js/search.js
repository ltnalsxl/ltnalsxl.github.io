---
---
(function($){
  var index = null;
  var baseurl = '';
  function loadIndex(){
    return $.getJSON(baseurl + '/search.json').done(function(data){
      index = new SimpleLunr(data);
    });
  }
  function render(results){
    var $list = $('#search-results');
    $list.empty();
    if(!results.length){
      $list.append('<li class="list-group-item">No results</li>');
      return;
    }
    results.slice(0,10).forEach(function(r){
      var item = $('<li class="list-group-item">');
      item.append($('<a>').attr('href', r.url).text(r.title));
      $list.append(item);
    });
  }
  $(document).ready(function(){
    baseurl = '{{ site.baseurl }}';
    loadIndex();
    $('#search-input').on('input', function(){
      var q = $(this).val();
      if(!q){ $('#search-results').empty(); return; }
      if(index){
        render(index.search(q));
      }
    });
  });
})(jQuery);
