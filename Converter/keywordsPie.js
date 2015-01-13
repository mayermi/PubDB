(function() {
  $(document).ready(function() {
    var start = new Date();
    var publicationsJSON = []
    authorsJSON = [];
  
    // create a new pubDB json object
    var converter = new pubDB.json();
 
    // initialize -> get a jQuery object of html contents in callback function
    converter.init(function(dbObject) {
      // pass dbObject to buildJSON method -> get a json object back (<- created on client side)
      converter.buildPublicationJSON(dbObject, function(pubData) {
        publicationsJSON = pubData;

        converter.buildAuthorJSON(pubData, function(authorData) {
          authorsJSON = authorData;
          
          $('img').hide();
          $('span').text(new Date() - start + "ms");
          $('h2').show();
          $('#publications').val(JSON.stringify(publicationsJSON, null, 2)).show();
          $('#authors').val(JSON.stringify(authorsJSON, null, 2)).show();

          for (var i = 0, l = authorsJSON.length; i < l; i += 1) {
            var author = authorsJSON[i];
            console.log(author.name + ' has ' + author.publications.length + ' publications');
          }

          
       
        });
      });
    });
  });
})();