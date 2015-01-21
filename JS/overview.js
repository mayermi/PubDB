(function() {
  $(document).ready(function() {
    var start = new Date();
    var publicationsJSON = []
    authorsJSON = [];
	var names = [];
	var authorname;
	var authorDouble = false;



    // get url info
    var query = window.location.search.substring(1);
	var serachString = query.split("=")[1];
	var name1 = serachString.split("+")[0];
	var name2 = serachString.split("+")[1];
	
	if (name2 !== undefined) {
	authorname = name1 + " " + name2;
	}else{
		authorname = name1;
	}
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

			//get list of author names
			for (var i = 0, l = publicationsJSON.length; i < l; i++) {
				for (var j = 0, m = publicationsJSON[i].authors.length; j < m; j++) {
					var selectionValue = publicationsJSON[i].authors[j].name;
					
					for(var counter=0; counter<names.length; counter++) {
						if(selectionValue == names[counter]) {				
							authorDouble = true;
						}
					}
								
					if (authorDouble !== true) {
						names.push(publicationsJSON[i].authors[j].name);
						$('#select').append( " <option class='option' value='" + selectionValue + "' selected='" + author + "'>" + selectionValue + "</option>" );

					} else {
						authorDouble = false;
					}
					
				
				}
			}
			
			//autocomplete-function
			doAutocomplete(names);


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
	
		
        });
      });
    });
  });
})();