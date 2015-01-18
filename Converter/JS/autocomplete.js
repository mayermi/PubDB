//window.onload = function(){

function doAutocomplete(nodesAutocomplete){
	
	console.log(nodesAutocomplete);
	function getAutocomplete(value){
		//var values = ["hallo", "das", "ist", "ein", "test", "die", "haus", "irgendwie"];
		var values = nodesAutocomplete;
		//console.log(values);
		var found = [];
		for (var i = 0; i < values.length; i++){
			if (values[i].substring(0, value.length) === value){
				found.push(values[i]);
			}
		};
		return found;
	}

	var input = document.getElementById("searchAuthor");
	var oldValue = input.value;
	input.onkeydown = function(ev){
		oldValue = this.value;
		//console.log("Input = " + oldValue);
	};
	input.onkeypress = function(ev){
		if (!ev){
			ev = event;
		}
		var c = String.fromCharCode(ev.charCode || ev.keyCode);
		console.log("c = " + c);
		if (typeof this.selectionStart !== "undefined"){
			if (this.selectionStart != this.selectionEnd && c === this.value.substr(this.selectionStart, 1)){
				this.selectionStart++;
				ev.preventDefault();
				return false;
			}
		}
		else {
			var range = document.selection.createRange();
			if (c === range.text.substr(0, 1)){
				range.moveStart("character", 1);
				range.select();
				ev.returnValue = false;
				return false;
			}
		}
	};
	input.onkeyup = function(ev){
		if (!ev){
			ev = event;
		}
		if (
			this.value !== oldValue && //all no text keys
			ev.keyCode !== 8  && //back space
			ev.keyCode !== 46 && // delete
			this.value
		){
			var found = getAutocomplete(this.value);
			if (found.length){
				var newValue = found[0];
				if (typeof this.selectionStart !== "undefined"){
					var start = this.selectionStart;
					this.value = newValue;
					this.selectionStart = start;
					this.selectionEnd = this.value.length;
				}
				else {
					var range = document.selection.createRange();
					this.select();
					var range2 = document.selection.createRange();
				
					range2.setEndPoint("EndToStart", range);
					var start = range2.text.length;
					
					this.value = newValue;
					this.select();
					range = document.selection.createRange();
					range.moveStart("character", start);
					range.select();
				}
			}
		}
	};
}
//};