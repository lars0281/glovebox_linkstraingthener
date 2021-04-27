/*
 * This script is called by background.js when the user selects "reveal URL" from the context menu on a link (the "click" goes to backgroupnd.js which in turn calls this js-script.
 *
 * It presents a dialog window to the user with an explanation of the URL.
 * - where the URL ends up (endpoint of all redirects, if any)
 * - information about what, it anything, happens during the course of those redirects. (etablishment of login, cookies etc.)
 * - give the user the option of passing directly to the endpoint without going through the redirects.
 * - let the user configure default behaviour for next time a link of this type is encountered.
 * 
 * 
 * Issues. 
 * The use of targetElementId which is as yet supported only on Firefox
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/menus/getTargetElement
 */

function xstooltip_findPosX(obj) {
	var curleft = 0;
	if (obj.offsetParent) {
		while (obj.offsetParent) {
			curleft += obj.offsetLeft
			obj = obj.offsetParent;
		}
	} else if (obj.x)
		curleft += obj.x;
	// console.log("xstooltip_findPosx returning: " + curleft);
	return curleft;
}

function xstooltip_findPosY(obj) {
	var curtop = 0;
	if (obj.offsetParent) {
		while (obj.offsetParent) {
			curtop += obj.offsetTop
			obj = obj.offsetParent;
		}
	} else if (obj.y)
		curtop += obj.y;
	// console.log("xstooltip_findPosY returning: " + curtop);
	return curtop;
}

function glovebox_archived_original_href(node) {

	// check if the URL has been inspected already by looking for the attribute
	// glovebox_archived_original_href indicating that the URL has already been
	// been rewritten by glovebox
	// console.log(node.getAttribute('glovebox_archived_original_href'));
	try {
		var archived_url = "";
		archived_url = node.getAttribute('glovebox_archived_original_href');
		// console.log(archived_url);
		// console.log(archived_url.length);
		if (archived_url && archived_url.length > 9) {
			// console.log("archived");
			return archived_url;
		} else {
			// console.log("NOT archived");
			return "";
		}
	} catch (e) {
		// clearly, nothing sensible was found, so return a blank.
		return "";
	}

}

function setup_dialog_window(node, new_url, linkUrl) {

	console.log("setup_dialog_window");
	// console.log(node);
	// console.log(new_url);
	// console.log(linkUrl);

	// based on length of url to display, set size of window

	var chars_per_row = 60;
	var v_pix_per_row = 14;

	var h_pix_per_char = 6;

	var v_pix_margin = 50;
	var h_pix_margin = 10;

	console.log("url length" + new_url.length);

	console.log("url length" + (new_url.length / chars_per_row));
	var row_count = 0;
	row_count = Math.floor(new_url.length / chars_per_row) + 1;

	console.log("print rows: " + row_count);

	var box_height = 0;
	var box_widtht = 0;

	// calculate box width by multplying number of charcters per row by pix per
	// character, and add something for margin
	box_widtht = (chars_per_row * h_pix_per_char) + h_pix_margin;
	// calculate box height by multplying number of charcters per row by pix per
	// character, and add something for margin
	box_height = (row_count * v_pix_per_row) + v_pix_margin;

	console.log("box_height: " + box_height);
	console.log("box_width: " + box_widtht);
	console.log("row_count: " + row_count);

	var uuid;
	uuid = "gloveboxtooltip";

	// look for exising message box, and remove it if found
	var del_it = document.getElementById(uuid);
	console.log("look for existing tooltip");
	console.log(del_it);
	try {
		if (del_it) {
			del_it.style.visibility = 'hidden';
			del_it.remove();
		}
	} catch (e) {
	}

	try {
		// setup node in the DOM tree to contain content of message box
		var newGloveboxNode = document.createElement("Glovebox");
		newGloveboxNode.setAttribute("id", uuid); // attach a unique ID to the
		// element to make it more
		// easily addressable.

		// var newGloveboxNode2 = document.createElement("a");
		// newGloveboxNode2.setAttribute("href", "http://www.dn.no");
		// newGloveboxNode2.textContent("http://www.dn.no/NO");
		// newGloveboxNode.appendChild(newGloveboxNode2);

		var newTokenNode = document.createElement("glb:token");

		newGloveboxNode.appendChild(newTokenNode);
		// text marker
		// newTokenNode.textContent = "some MESSAGE text";

		var root = document.querySelector(':root');

		// let insertedNode = node.parentNode.insertBefore(newGloveboxNode,
		// node);

		let insertedNode = root.insertBefore(newGloveboxNode, root.firstChild);

		// start lookup
		// call the URL and look at what is returned.

		// var true_destination_url = new_url;
		var redirectURL = "";

		// create html of tooltip
		var it2 = document.createElement("div");
		// it2.setAttribute("id",tooltipId+ '_temp');
		it2.setAttribute("id", uuid);
		it2.setAttribute("class", 'xstooltip');
		// set style for the tooltip box. (Replaces an external CSS-stylesheet )
		// visibility: hidden;
		// position: absolute;
		// top: 0;
		// left: 0;
		// z-index: 2;
		// font: normal 8pt sans-serif;
		// padding: 3px;
		// border: solid 8px;
		// background-repeat: repeat;
		// background-image: url(icons/azure.png);

		// it2.setAttribute("style", 'position: absolute;z-index:-1;top: 0;left:
		// 0;font: normal 9pt sans-serif;padding: 3px;border: solid
		// 0px;background: rgba(225, 225, 225, 0.9);');
		it2
				.setAttribute(
						"style",
						'position: relative;z-index:-1;top: 0;left: 0;font: normal 9pt sans-serif;text-align: left;wordWrap=break-word;padding: 8px;border: solid 1px;background: rgba(225, 225, 225, 0.9);');

		var posX = 150;
		var posY = 20;

		// var it;
		// it2.innerHTML = inner_html;

		var display_text_for_url = ""
		// insert a space character at appropriate places (every chars_per_row
		// number of
		// chars) to ensure required
		// wordwrapping inside message box
		var i = 0;
		while (i < new_url.length) {

			display_text_for_url = display_text_for_url
					+ new_url.substring(i, i + chars_per_row) + " ";
			i = i + chars_per_row;
		}

		it2.innerHTML = '<table><tr><td style="width: 200px;text-align: left">This link ends up at </td><td style="width: 100px;text-align: right" id="gloveboxtooltipclose">close [X]</td></tr></table><a href="'
				+ new_url
				+ '" >'
				+ display_text_for_url
				+ '</a>'
				+ '<br/><br/>go there directly by just clicking on this link';
		// there directly by just clicking on this link

		// '<p class="gloveboxtooltip" id="gloveboxtooltipclose"
		// style="text-align:left;">CLOSE</p>';

		// console.log("1.2.8");
		// console.log(it2);
		// setup event listener whereby the user can configure this link
		// rewriting to be automatic

		// where to anchor the tooltip
		// add the created tooltip html into the document
		// var inserted = node.parentNode.appendChild(it2);
		// var inserted = node.parentNode.insertBefore( it2, node);
		var inserted = insertedNode.appendChild(it2);

		// console.log(inserted);

		// close button
		var close_button = document.getElementById("gloveboxtooltipclose");
		// console.log(close_button);

		// attach eventlistener
		close_button.addEventListener("click", function(event) {
			// console.log("on click action ...");
			close_tooltip(event);
		});
		// make rule to bypass redirects button

		// var make_bypass_redirect_rule_button =
		// document.getElementById("gloveboxtooltipmakerule");
		// attach eventlistener
		// make_bypass_redirect_rule_button.addEventListener("click", function
		// (event) {
		// console.log("on click action ...");
		// make_bypass_redirect_rule(event);
		// });

		// it = it2;

		if ((it2.style.top == '' || it2.style.top == 0 || it2.style.top == "0px")
				&& (it2.style.left == '' || it2.style.left == 0 || it2.style.left == "0px")) {
			// need to fixate default size (MSIE problem)
			it2.style.width = it2.offsetWidth + 'px';
			it2.style.height = it2.offsetHeight + 'px';

			// if tooltip is too wide, shift left to be within parent
			if (posX + it2.offsetWidth > node.offsetWidth)
				posX = node.offsetWidth - it2.offsetWidth;
			if (posX < 0)
				posX = 0;

			x = xstooltip_findPosX(node) + posX;
			y = xstooltip_findPosY(node) + posY;

			it2.style.top = y + 'px';
			it2.style.left = x + 'px';

			it2.style.visibility = 'visible';
			it2.style.zIndex = "1000";

			// examin options to make the width context sensitive
			it2.style.width = box_widtht + 'px';
			it2.style.height = box_height + 'px';

		}

		// depending on the rule settings...rewrite the link automatically.

		// if (new_url.length > 9 && linkUrl != new_url) {
		// console.log("replacing: " + linkUrl + " with " + new_url);
		// node.setAttribute('href', new_url);
		// // archive the original URL as an inserted attrbute
		// node.setAttribute('glovebox_archived_original_href', linkUrl);
		// } else {
		// console.log("invalid returns");
		// }

		// set a timeout to remove the message box after 60 seconds

		setTimeout(function() {
			del_it = document.getElementById(uuid);
			// console.log("look for existing tooltip");
			// console.log(del_it);
			try {
				if (del_it) {
					del_it.style.visibility = 'hidden';
					del_it.remove();
				}
			} catch (e) {
				console.log(e);
			}
		}, 30000);

	} catch (e) {
		console.log(e);
	}

}

function make_bypass_redirect_rule(event) {

	console.log(event);
	// create a rule whereby this action can be taken automatically from now on

	// formulate the rule

	// the links obsure the true endpoint. Unlike some links on platforms like
	// facebook,
	// there is no information in the link itself (such as in the query string)
	// whereby the true endpoint can be determined.

	// ( In instances where the true endpoint can be determined from the URL,
	// the URL should not be called at all. )
	// But in the case at hand here, the URL must be called in some limited way
	// so that the redirect information (either HTTP 302 or HTTP-META) can be
	// received.
	// The limited call should to the extent possible be clear of any tracking
	// information.
	// Source IP is unavoidable. But cookies should be excludable such that the
	// redirecting endpoint will have difficulty correlating the traffic.

	// The rule will match link URLs on patterns
	// The assumtion being that these will link shorteners of the bit.ly type
	// that looks like https://<domain>/<code> where the code uniquely
	// identifies the true endpoint.
	// The rule will be a regexp pattern that identifies such a link.
	// the domain will be fully qualified and at rule lookup time, the domain is
	// used as a key to look up the rule.

	// Multiple rules are possible on the same domain. They must be mutually
	// exclusive.

	// Step 1. The content script read the rule set from the background.js at
	// starup time.

	// Step 2. link comes in, looking like "http://bit.ly/abcedfgh"
	// Step 3. exact protocol, domain and port (if any) "http://bit.ly/"
	// Step 4. Check for rule governing "http://bit.ly/"
	// Step 5. Find one rule - looking like "http://bit.ly\/[^\/*]$"
	// Step 6. Match rule against link URL
	// Step 7. OK, link "http://bit.ly/abcedfgh" matches against rule
	// "http://bit.ly\/[^\/*]$"
	// Step 8. If "OK" in step #7 then make clean call to the URL to find out
	// what it redirets to. Return to Step #2

	//

	// the

	// send rule to plugin (background.js) for storage in the database

}

function close_tooltip(event) {

	console.log(event);
	// call to kill the tooltip window

	// lookup the endpoint of the link
	var uuid;
	uuid = "gloveboxtooltip";

	// look for exising message box, and remove it if found
	var del_it = document.getElementById(uuid);
	console.log("look for existing tooltip");
	console.log(del_it);
	try {
		if (del_it) {
			del_it.style.visibility = 'hidden';
			del_it.remove();
		}
	} catch (e) {
	}
	del_it = document.getElementById(uuid);
	console.log("look for existing tooltip");
	console.log(del_it);
	try {
		if (del_it) {
			del_it.style.visibility = 'hidden';
			del_it.remove();
		}
	} catch (e) {
	}

}

// this global variable indicated whether or not any rule pertain to the URL
var ruleHit = false;
// this global variable indicated whether or not any
var ruleWrite = false;

function RevealUrl(request, sender, sendResponse) {

	var replacementStr = request.Paste_GloveboxAcceptedSecureKeyOfferToken_text;
	console.log("JSON(request): " + JSON.stringify(request));

	try {
		// if (replacementStr){
		var targetElementId = "";
		targetElementId = request.targetElementId;

		ruleHit = false;
		var linkUrl = "";
		linkUrl = request.linkUrl;
		var linkText = "";
		linkText = request.linkText;

		var true_destination_url = "";
		true_destination_url = request.true_destination_url;

		// if the link has the same domain as the current domain, also search
		// using a server relative path

		// locate the DOM node actually right-clicked by the user
		var node = null;

		// in the absence of broad support for targetElementId() on non-Firefox
		// browsers, use xpath as a work-around.
		// this must be rewritten for non-firefox browsers

		node = browser.menus.getTargetElement(targetElementId);

		// attempt to uniquely identify the link selected with a right click by
		// searching for one that has the same link and text.
		// search for both server-relative and fully qualified links

		console.log(linkUrl);
		console.log("#### " + true_destination_url);

		// create window for user to see, and click in
		setup_dialog_window(node, true_destination_url, linkUrl);

		// handleError(url);

	} catch (e) {
		console.log(e);
	}

	return Promise.resolve({
		response : {
			"selection_html" : "ok"
		}
	});
}
// }

//
browser.runtime.onMessage.addListener(RevealUrl);

// setup onClick listener to remove tooltip window for any click.
