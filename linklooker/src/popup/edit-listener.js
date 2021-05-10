console.log("edit-listener.js running");



window.addEventListener("message", (event) => {
	  if (event.origin !== "http://example.org:8080")
		  console.log("message received");
		  console.log(event);
	    return;

	  // ...
	}, false);

// Receive message from background-script
browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	  console.log("#### response received from background.js");
	    console.log("message: " + message);
	    console.log("sender: " + sender);
	    console.log("sendResponse: " + sendResponse);
	  // if (sender.url === THIS_PAGE_URL)
	// return
	console.log("<br>PopuP received a new msg: " + message.msg);

 sendResponse({
 msg : "This is a auto-response message sent from the popup"
 });
	return true;
});

