(function() {
  $(document).ready(function() {
    var start = new Date();
    var publicationsJSON = []
    authorsJSON = [];
	var names = [];

    // get url info
    var query = window.location.search.substring(1);
    var authorname = query.split("=")[1];
    var author = authorname.replace(/%20/g, ' ');
  
    // create a new pubDB json object
    var converter = new pubDB.json();
 
    // initialize -> get a jQuery object of html contents in callback function
    converter.init(function(dbObject) {
      // pass dbObject to buildJSON method -> get a json object back (<- created on client side)
      converter.buildPublicationJSON(dbObject, function(pubData) {
        publicationsJSON = pubData;

        converter.buildAuthorJSON(pubData, function(authorData) {
          authorsJSON = authorData;

	
			for (var i = 0, l = publicationsJSON.length; i < l; i += 1) {
				for (var j = 0, m = publicationsJSON[i].authors.length; j < m; j += 1) {
					names.push(publicationsJSON[i].authors[j].name);
					$( "#select" ).append( "<option class='option' value='" + publicationsJSON[i].authors[j].name + "'>" + publicationsJSON[i].authors[j].name + "</option>" );
				
				}
			}
			$('.option').click(function(){
				//alert($('#select').val());
				author = $('#select').val();
				console.log(author);
				showAuthorInformation(author);
			});
			
			console.log("beforeAutocomplete");
			doAutocomplete(names);
			console.log("afterAutocomplete");


			function showAuthorInformation(author){
			
			  var publicationtitles = [];
			  var publicationtitlesLI= [];

			  for (var i = 0, l = authorsJSON.length; i < l; i += 1) {
				if(authorsJSON[i].name === author){
				  var publications = authorsJSON[i].publications; // Array with all publications
				  for (var j = 0, m = publications.length; j < m; j += 1) {
					for (var k = 0, n = publicationsJSON.length; k < n; k += 1) {
					  if(publicationsJSON[k].id === publications[j]) {
						publicationtitles.push(publicationsJSON[k].title.name);
					  }
					}
				  }
				}
			  }

			  $.each(publicationtitles, function(i, item) {
				publicationtitlesLI.push('<li>' + item + '</li>');
			  });  // close each()
			  $('#publicationoverview').append( publicationtitlesLI.join('') );
	
		
			}
		
        });
      });
    });
  });
})();