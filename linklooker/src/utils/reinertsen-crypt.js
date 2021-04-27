console.log("test reinertsen encrypt");
/*
*
*
*/

//var authoritativetext = "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.";
var authoritativetext = "It is a truth";

//var ciphertext = "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.";
var ciphertext = "It truth";

// compare two lines of text to find the differences

const getDifference = (s, t) => {
	  let sum = t.charCodeAt(t.length - 1);
	  for (let j = 0; j < s.length; j++) {
	    sum -= s.charCodeAt(j);
	    sum += t.charCodeAt(j);
	  }
	  return String.fromCharCode(sum);
	};

	function getDiff (a,b){
		// step through a character by character and see if b has the same character at the same position.
		// for any misses, add the missing to the results string
		
var res = "";
		var i=0,j = 0;
		while (i < a.length && j < b.length){
			console.log(a[i] + " - " +  b[j]);
			if (a[i] == b[j]){
				console.log("hit");
				
				
			}else {
				console.log("miss");
				res = res + b[j];
			}
			
			
			i++;
			j++;
		}
		
		console.log("res: "+ res);
	}
	
	
	console.log(getDifference('lebronjames', 'lebronnjames'));
	console.log(getDifference('abc', 'abcd'));
	console.log(getDiff(authoritativetext, ciphertext));
	





