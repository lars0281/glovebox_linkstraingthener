
console.log("start LinkLooker background");

let salt;

let db;

let indexedDB;

// databases:

// Apr 28 2021


/*
 * Apply rules to determine where link end up. Some links result in redirect,
 * but in the querystring there are values to indicate what the redirect URL
 * will be. Use rules to compute this URL without having to call the URL.
 * 
 * Lookup link to check if ends in a redirect (use HTTP HEAD method)
 * 
 * Apply controls to HTTP cookie
 * 
 * 
 * Control cookies
 * 
 * Rules to which cookies to never send and allways send Rules scoped for
 * domain, fulldomain and URL
 * 
 * Purpose to achieve with this functionality.
 * 
 * 1) Always send the cookie to a server to avoid being confronted by
 * GPDR-mandated cookie acceptance form. Where these forms are prompted by a
 * missing cookie, clearing cookies will mean that the user is repeatedly asked
 * to accept cookies. Permanently setting the cookie will avoid this nuisance.
 * 
 * Example www.youtube.com After the user click to concent to cookies, this is
 * returned to the browser set-cookie:
 * CONSENT=YES+cb.20210425-18-p0.en-GB+FX+944; Domain=.youtube.com; Expires=Sun,
 * 10-Jan-2038 07:59:59 GMT; Path=/; Secure; SameSite=none
 * 
 * Send this cookie from then on: CONSENT=YES+cb.20210425-18-p0.en-GB+FX+944;
 * Note the seemingly random data after "YES". it contains a timestamp and some
 * other sender specific data. The rules must have a language to compute this
 * value as needed.
 * 
 * 
 * 2) Some services have a "first one is free" setup where the user is entitled
 * to see a limited number of something, but once the limit has been exceeded is
 * required to login
 * 
 * 
 * Example www.nytimes.co m
 * 
 * 
 */


// context menu related


/*
 * to add context menu item for analysing links Added in v 1.0
 */

browser.contextMenus.create({
    id: "glovebox-link-reveal",
    title: "reveal the true endpoint of this link",
    contexts: ["link"]
});

/*
 * Add context menu item for selection. User may select a text and have this
 * menuitem appear when righ-cliking on the selection The selection is sent
 * verbatim to search engine and top three results are presented in a message
 * box. Added in v 1.1
 */
// browser.contextMenus.create({
// id: "selected-text-lookup",
// title: "send text to search engine",
// contexts: ["selection"]
// });




indexedDB = window.indexedDB || window.webkitIndexedDB ||
    window.mozIndexedDB || window.msIndexedDB;

// listener for message sent from the admin page of the plugin
browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	   console.log("message:" + JSON.stringify(message));
	   console.log("sender:" + JSON.stringify(sender));
	   console.log("sendResponse:" + sendResponse);

    console.log("received from page:  message: " + JSON.stringify(message) + " message.type=" + message.type);

    
    console.log("request:" + message[0]);
    console.log("request:" + message.request);

    console.log("request:" + JSON.stringify(message.request));
    console.log("request:" + JSON.stringify(message.request.sendRule));

    console.log("request:" + message.request.sendRule);

    console.log("request:" + message.linkurl);

    try {

        if (message.request.sendRule == 'toEditPopup') {
            console.log("contact edit popup:");

            var page_message = message.message;
            console.log("page_message:" + page_message);
            // Simple example: Get data from extension's local storage
            // var result = localStorage.getItem('whatever');
            
            
            
            var result = JSON.parse('{"test":"one"}');
            // Reply result to content script
            sendResponse(result);
        }

    
} catch (e) {
    console.log(e);
}

    try {

    	// make call to rule editing popup containing the rule to display in it.
    	
    	
    	
    	
        if (message && message.type == 'page') {
            console.log("page_message:");
            var page_message = message.message;
            console.log("page_message:" + page_message);
            // Simple example: Get data from extension's local storage
            // var result = localStorage.getItem('whatever');
            var result = JSON.parse('{"test":"one"}');
            // Reply result to content script
            sendResponse(result);
        }

        if (message && message.request == 'skinny_lookup' && message.linkurl != '') {
            console.log("look up :" + message.linkurl);
            var true_destination_url = "";
            true_destination_url = skinny_lookup(message.linkurl);
            sendResponse({
                true_destination_url: true_destination_url,
                linkUrl: message.linkurl,
                success: "true"
            });
        }
    } catch (e) {
        console.log(e);
    }

});

if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
} else {
    console.log("1.1.0");
}

let pendingCollectedUrls = [];

browser.contextMenus.onClicked.addListener((info, tab) => {
    console.log("background.js: browser.contextMenus.onClicked.addListener");
    console.log("background.js: browser.contextMenus.onClicked.addListener:info:" + JSON.stringify(info));
    console.log("background.js: browser.contextMenus.onClicked.addListener:tab:" + JSON.stringify(tab));

    /*
	 * When the user has selected from the context meny to revel the true end
	 * point of a url
	 * 
	 */
    if (info.menuItemId == "glovebox-link-reveal") {
        console.log("glovebox-link-reveal");
        // console.log(info);
        // console.log(tab);
        reveal_true_url_endpoint(info, tab);

    }else if (info.menuItemId == "selected-text-lookup") {
        console.log("selected-text-lookup");
        // console.log(info);
        // console.log(tab);
        selected_text_lookup(info, tab);

    }

    
    
    
    
    console.log("#### request completed");
});

// add listener to open the admin page when user clicks on the icon in the
// toolbar
browser.browserAction.onClicked.addListener(() => {
    // use this functionality to get a full tabpage
    browser.tabs.create({
        url: "/rule-admin.html"
    });
    // Can replace the above with a direct referal to the html, in the manifest.
    // - but this would not provide a full tab-page
    // "brower_action": {
    // "default_popup": "navigate-collection.html"

});


var request = indexedDB.open("sourceFulldomainRuleDB", 1);
request.onupgradeneeded = function (event) {
    db = event.target.result;
    db.onerror = function (event) {};
    // Create an objectStore in this database to keep trusted decryption
    // keys
    console.log("create objectstore sourceFulldomainRuleStore in sourceFulldomainRuleDB");
    var objectStore2 = db.createObjectStore('sourceFulldomainRuleStore', {
            keyPath: 'keyId'
        });

    objectStore2.createIndex('keyId', 'keyId', {
        unique: true
    });
};
request.onerror = function (event) {
    console.log("dp open request error 201");
};
request.onsuccess = function (event) {
    db = event.target.result;
    db.onerror = function (event) {
        console.log("db open request error 2");
    };
    db.onsuccess = function (event) {
        console.log("db open request success 2");
    };
};

var request2 = indexedDB.open('sourceUrlRuleDB', 1);
request2.onupgradeneeded = function (event) {
    db = event.target.result;
    db.onerror = function (event) {};
    // Create an objectStore in this database to keep trusted decryption
    // keys
    console.log("background.js: create objectstore sourceUrlRuleStore in sourceUrlRuleDB");
    var objectStore2 = db.createObjectStore('sourceUrlRuleStore', {
            keyPath: 'keyId'
        });

    objectStore2.createIndex('keyId', 'keyId', {
        unique: true
    });
};
request2.onerror = function (event) {
    console.log("background.js: dp open request error 201");
};
request2.onsuccess = function (event) {
    db = event.target.result;
    db.onerror = function (event) {
        console.log("background.js: db open request error 2");
    };
    db.onsuccess = function (event) {
        console.log("background.js: db open request success 2");
    };
};

// create database
request2 = indexedDB.open('sourceDomainRuleDB', 1);
request2.onupgradeneeded = function (event) {
    db = event.target.result;
    db.onerror = function (event) {};
    // Create an objectStore in this database to keep trusted decryption
    // keys
    console.log("background.js: create objectstore sourceDomainRuleStore in sourceDomainRuleDB");
    objectStore2 = db.createObjectStore('sourceDomainRuleStore', {
            keyPath: 'keyId'
        });

    objectStore2.createIndex('keyId', 'keyId', {
        unique: true
    });
};
request2.onerror = function (event) {
    console.log("background.js: dp open request error 201");
};
request2.onsuccess = function (event) {
    db = event.target.result;
    db.onerror = function (event) {
        console.log("background.js: db open request error 2");
    };
    db.onsuccess = function (event) {
        console.log("background.js: db open request success 2");
    };
};

// create
request2 = indexedDB.open('destinationDomainRuleDB', 1);
request2.onupgradeneeded = function (event) {
    db = event.target.result;
    db.onerror = function (event) {};
    // Create an objectStore in this database to keep trusted decryption
    // keys
    console.log("background.js: create objectstore destinationDomainRuleStore in destinationDomainRuleDB");
    objectStore2 = db.createObjectStore('destinationDomainRuleStore', {
            keyPath: 'keyId'
        });

    objectStore2.createIndex('keyId', 'keyId', {
        unique: true
    });
};
request2.onerror = function (event) {
    console.log("background.js: dp open request error 201");
};
request2.onsuccess = function (event) {
    db = event.target.result;
    db.onerror = function (event) {
        console.log("background.js: db open request error 2");
    };
    db.onsuccess = function (event) {
        console.log("background.js: db open request success 2");
    };
};

// create
// create
request2 = indexedDB.open('destinationFulldomainRuleDB', 1);
request2.onupgradeneeded = function (event) {
    db = event.target.result;
    db.onerror = function (event) {};
    // Create an objectStore in this database to keep trusted decryption
    // keys
    console.log("background.js: create objectstore destinationFulldomainRuleStore in destinationFulldomainRuleDB");
    objectStore2 = db.createObjectStore('destinationFulldomainRuleStore', {
            keyPath: 'keyId'
        });

    objectStore2.createIndex('keyId', 'keyId', {
        unique: true
    });
};
request2.onerror = function (event) {
    console.log("background.js: dp open request error 201");
};
request2.onsuccess = function (event) {
    db = event.target.result;
    db.onerror = function (event) {
        console.log("background.js: db open request error 2");
    };
    db.onsuccess = function (event) {
        console.log("background.js: db open request success 2");
    };
};

// create destinationUrlRuleDB
var request6 = indexedDB.open('destinationUrlRuleDB', 1);
request6.onupgradeneeded = function (event) {
    db = event.target.result;
    db.onerror = function (event) {};
    // Create an objectStore in this database to keep trusted decryption
    // keys
    console.log("background.js: create objectstore destinationUrlRuleStore in destinationUrlRuleDB");
    var objectStore6 = db.createObjectStore('destinationUrlRuleStore', {
            keyPath: 'keyId'
        });

    objectStore6.createIndex('keyId', 'keyId', {
        unique: true
    });
};
request6.onerror = function (event) {
    console.log("background.js: dp open request error 201");
};
request6.onsuccess = function (event) {
    db = event.target.result;
    db.onerror = function (event) {
        console.log("background.js: db open request error 2");
    };
    db.onsuccess = function (event) {
        console.log("background.js: db open request success 2");
    };
};



// add defaults

generate_default_link_rules();


function skinny_lookup(url, info) {
    console.log("#start: skinny_lookup: " + url);
    var true_destination_url = "";
    var xhr = new XMLHttpRequest();
    // mark "false" to indicate synchronous
    try {
        xhr.open('HEAD', url, false);
        // request plain text return to look for http-based redirects too
        // xhr.responseType = 'blob';
    } catch (e) {
        console.log(e);
    }
    try {
        xhr.onload = function () {
            console.log(xhr);

            // check for a Location HTTP header in the response
            console.log(xhr);
            true_destination_url = xhr.responseURL;
        };
    } catch (e) {
        console.log(e);
    }
    xhr.onerror = () => console.log(xhr.statusText);
    try {

        xhr.send();
    } catch (e) {
        // console.log(xhr);
        console.log(e);
    }

    try {

        return true_destination_url;
    } catch (e) {
        // console.log(xhr);
        console.log(e);
    }
}




/*
 * 
 */

function selected_text_lookup(info, tab) {
	  console.log("#start: selected_text_lookup");
	  console.log(info);
	  console.log(tab);
}

// receive notice when user rightclick on a link and selects "reveal the true
// endpoint of URL"

// make call back to page script to run additonal code


function reveal_true_url_endpoint(info, tab) {
 // console.log("#start: reveal_true_url_endpoint");
 // console.log(info);
 // console.log(tab);

  // console.log("###calling ");
    // console.log(destination_url_rules);

    // information on which link was selected, use this to correctly
    // identify it in the content script.

    var tabId = tab.id;
    var frameId = info.frameId;
    var targetElementId = info.targetElementId;

    var linkUrl = info.linkUrl;
    var linkText = info.linkText;

    console.log("urlendpoint: " + info.linkUrl);
   // console.log("tabId: " + tabId);

    console.log("location page: " + info.pageUrl);

    var true_destination_url = "";

    // setup a ruleset. With some default values and adilito for user to
    // configure automatic behaviour.


    var new_url = info.linkUrl;
   // console.log("#### " + new_url);

    // apply rules to generate new URL. The rules are a collection of
    // rewrite statements applied to the submitted URL.
    // The rules are scoped in two ways: by source/destination and complete
    // URL (protocol fully-qualified domain port path), full domain
    // (protocol fully-qualified domain port ) and domain ( domain port )
    // The rewrite rules are applied in sequentially.

    // The source rules (if any) are applied first.

    // Then the destination rules are applied. And on top of any changes
    // made previosuly.

    // Two URLs are submitted: the URL of the page where the link is found,
    // and the link itself.


    // new_url = "";
    rules_enforcement(info.pageUrl, new_url).then(function(re){
    	  // console.log("#### " + re);

  		new_url = re;
    	
    
    console.log("#### after first rewrite: " + new_url);
    // if the rules caused the URL to be changed, there might also be rules
    // governing the new URL, so run through it again.

    return rules_enforcement(info.pageUrl, new_url);
    }).then(function (re){
    	new_url = re;
    console.log("#### after second rewrite: " + new_url);
    

    // new_url = rules_enforcement(info.pageUrl ,new_url);
    // console.log("#### " + new_url);

    // Call the URL by default if not rules applies to the URL.
    // If the URL has not been changed, assume no rule pertained to it, so
    // look it up directly.


    // console.log("true_destination_url: " + true_destination_url );


    // check linkURL against URL


    // send message back to the content script with this info

    return getRedirectUrl(new_url);

}).then(function (url) {

        // verify that the URL satify the minimum requirements
        var url_wellformed_regexp = /.*/i;

        // console.log(url_wellformed_regexp);
        // console.log("url_wellformed_regexp.text("+url+"): " +
        // url_wellformed_regexp.test(url));
        if (url.length > 9 && url_wellformed_regexp.test(url)) {
            true_destination_url = url;
        } else {
            true_destination_url = new_url;
        }

        // make attempt to clean the URL returned. In case of URL shorteners,
        // any manner of "villany" may be lurking
        
        return rules_enforcement(info.pageUrl, true_destination_url);
    }).then(function (res) {
console.log(res);
         true_destination_url = res;
        

        return browser.tabs.executeScript(tabId, {
            file: "content_scripts/RevealUrl.js",
            frameId: frameId
        });

    }).then(function (result) {

        // query for the one active tab
        return browser.tabs.query({
            active: true,
            currentWindow: true
        });

    }).then(function (tabs) {
// console.log(tabs);
        // send message back to the active tab
        console.log("#call back to content script");
        return browser.tabs.sendMessage(tabs[0].id, {
            targetElementId: targetElementId,
            true_destination_url: true_destination_url,
            linkText: linkText,
            linkUrl: linkUrl,
            success: "true"
        });
        // }).then(function (res) {
        // console.log("###### getHTML response " + JSON.stringify(res));
        // glovebox_token_ciphertext = res.response.token;

    });

}

function getRedirectUrl(url) {
    // console.log("##### getRedirectUrl.start: " + url);
    try {
        var p = new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('HEAD', url, true);
                xhr.responseType = 'blob';
                xhr.onload = function () {
                    // resolve(xhr.response);
                    var reader = new FileReader();
                    console.log(xhr.response);
                    console.log(xhr);

                    // check for a Location HTTP header in the response
                    // console.log(xhr.responseURL);

                    var redirectURL = "";

                    redirectURL = xhr.responseURL;
                    // consider also looking for a html-based redirect in the
                    // body of the retruend document.

                    // consider making this recursive, by calling the redirect
                    // URL to see if it results in another redirect


                    reader.readAsDataURL(xhr.response);
                    reader.onload = function (e) {

                        resolve(redirectURL);

                    };

                };

                xhr.onerror = () => reject(xhr.statusText);
                xhr.send();
            });
        return p;
    } catch (e) {
        console.log(e);
    }
}

function rules_enforcement(sourcePageUrl, url) {

	// console.log("# rules_enforcement begin");
	// console.log("sourcePageUrl: " + sourcePageUrl);
	// console.log("url: " + url);
	
    // apply rules to generate new URL. The rules are a collection of
    // rewrite statements applied to the submitted URL.
    // The rules are scoped in two ways: by source/destination and complete URL
    // (protocol fully-qualified domain port path), full domain (protocol
    // fully-qualified domain port ) and domain ( domain port )
    // The rewrite rules are applied in sequentially.

    // The source rules (if any) are applied first.

    // Then the destination rules are applied. And on top of any changes made
    // previosuly.

    // Two URLs are submitted: the URL of the page where the link is found, and
    // the link itself.


    var new_url = url;
    
    return new Promise(
            function (resolve, reject) {

            	console.log("# rules_enforcement begin promise");

    // start with source-based rules.
    // these are rules based on the the url of the "page" where the links are
    // located.
    console.log("source based rewriting");
    // new_url = circumstantial_rules_enforcement(window.location.href,
    // new_url,source_url_rules,source_fulldomain_rules,source_domain_rules);
    // new_url = source_rules_enforcement(sourcePageUrl, new_url,
	// source_url_rules,
    // source_fulldomain_rules, source_domain_rules);

    source_rules_enforcement(sourcePageUrl, new_url).then(function (two) {
        new_url = two;
        console.log(new_url);
        // then do destination-based rules
        // note that this is in addition to any changes made above.
           return destination_rules_enforcement(new_url, new_url);
    }).then(function(n){
        new_url = n;

    console.log(new_url);

	console.log("# rules_enforcement promise resolved");

    resolve(new_url);
    });
            });
    
}


// enforce rules that pertain to links found on the specified address.
function source_rules_enforcement(location, linkurl) {

	console.log("# source_rules_enforcement begin");
	
    var new_url = linkurl;

    return new Promise(
        function (resolve, reject) {
        	console.log("# source_rules_enforcement begin promise");

        // use this to lookup any rules that may apply to links found on the
		// page of
        // this url
        var protocolfulldomainportpath = "";
        protocolfulldomainportpath = location.replace(/^(http[s]*:\/\/)([^\/]*\/)([^\?]*).*/i, '$1$2$3');

        var protocolfulldomainport = "";
        protocolfulldomainport = location.replace(/^(http[s]*:\/\/)([^\/]*\/)([^\?]*).*/i, '$1$2');

        // lookup rules for this location domain ("top"-level example domain.com
		// )
        // ignoring the first word in the fully qualified domain name

        var domainport = "";
        domainport = location.replace(/^http[s]*:\/\/[^\.]*\.([^\/]*)\/([^\?]*).*/i, '$1');

        // sourceDomainRuleStore in sourceDomainRuleDB
        // sourceFulldomainRuleStore in sourceFulldomainRuleDB
        // create objectstore sourceUrlRuleStore in sourceUrlRuleDB");
        console.log("lookup: " + domainport);
        
        try {

            loadFromIndexedDB_async("sourceDomainRuleDB", "sourceDomainRuleStore", domainport).then(function (three) {
                console.log("########## 0");
          // console.log(three);

                if (three) {
            console.log("carry out rule on: " + new_url);
                    new_url = execute_rule(three, new_url);
                }

                // if anything returned, apply it

                // proceed with looking for more rules scopde for
				// protocolfulldomainport

                return loadFromIndexedDB_async("sourceFulldomainRuleDB", "sourceFulldomainRuleStore", protocolfulldomainport);
            }).then(function (one) {

                console.log("########## 1");
           // console.log(one);
                if (one) {
                    console.log("carry out rule on: " + new_url);
                    new_url = execute_rule(one, new_url);

                }

                return loadFromIndexedDB_async("sourceUrlRuleDB", "sourceUrlRuleStore", protocolfulldomainportpath);
            }).then(function (two) {
                console.log("########## 2");
            // console.log(two);
                if (two) {
                    console.log("carry out rule on: " + new_url);
                    new_url = execute_rule(two, new_url);
                }

                console.log("# # # #  resolve new_url: " + new_url);
            	console.log("# source_rules_enforcement promise resolved");

                resolve(new_url);

            });

        } catch (e) {
            console.log(e);

            console.log("# # # # new_url: " + new_url);
        	console.log("# source_rules_enforcement promise resolved");
            resolve(new_url);

        }

    });

}


function destination_rules_enforcement(location, linkurl){
	
	/*
	 * This is subject to rewriting, for now, accept the parameter for the
	 * location of the link to be rewritten, but do not use the value for
	 * anything
	 */
	
console.log("# destination_rules_enforcement begin");
	
    var new_url = linkurl;

    return new Promise(
        function (resolve, reject) {
        	console.log("# destination_rules_enforcement begin promise");

        // use this to lookup any rules that may apply to links found on the
		// page of
        // this url
        var protocolfulldomainportpath = "";
        protocolfulldomainportpath = linkurl.replace(/^(http[s]*:\/\/)([^\/]*\/)([^\?]*).*/i, '$1$2$3');

        var protocolfulldomainport = "";
        protocolfulldomainport = linkurl.replace(/^(http[s]*:\/\/)([^\/]*\/)([^\?]*).*/i, '$1$2');

        // lookup rules for this location domain ("top"-level example domain.com
		// )
        // ignoring the first word in the fully qualified domain name

        var domainport = "";
        domainport = linkurl.replace(/^http[s]*:\/\/[^\.]*\.([^\/]*)\/([^\?]*).*/i, '$1');

        // sourceDomainRuleStore in sourceDomainRuleDB
        // sourceFulldomainRuleStore in sourceFulldomainRuleDB
        // create objectstore sourceUrlRuleStore in sourceUrlRuleDB");
        console.log("lookup: " + domainport);
        
        try {

            loadFromIndexedDB_async("destinationDomainRuleDB", "destinationDomainRuleStore", domainport).then(function (three) {
                console.log("########## 0");
          // console.log(three);

                if (three) {
            console.log("carry out rule on: " + new_url);
                    new_url = execute_rule(three, new_url);
                }

                // if anything returned, apply it

                // proceed with looking for more rules scopde for
				// protocolfulldomainport

                return loadFromIndexedDB_async("destinationFulldomainRuleDB", "destinationFulldomainRuleStore", protocolfulldomainport);
            }).then(function (one) {

                console.log("########## 1");
           // console.log(one);
                if (one) {
                    console.log("carry out rule on: " + new_url);
                    new_url = execute_rule(one, new_url);

                }

                return loadFromIndexedDB_async("destinationUrlRuleDB", "destinationUrlRuleStore", protocolfulldomainportpath);
            }).then(function (two) {
                console.log("########## 2");
            // console.log(two);
                if (two) {
                    console.log("carry out rule on: " + new_url);
                    new_url = execute_rule(two, new_url);
                }

                console.log("# # # #  resolve new_url: " + new_url);
            	console.log("# destination_rules_enforcement promise resolved");

                resolve(new_url);

            });

        } catch (e) {
            console.log(e);

            console.log("# # # # new_url: " + new_url);
        	console.log("# destination_rules_enforcement promise resolved");
            resolve(new_url);

        }

    });

	
}



function execute_rule_set(rule_set, url) {
   // console.log("execute_rule_set");
   // console.log(rule_set);
    var new_url = "";
    new_url = url;
    for (let m = 0; m < rule_set.length; m++) {
        new_url = execute_rule_step(rule_set[m], new_url);
    }
    return new_url;
}



function loadFromIndexedDB_async(dbName, storeName, id) {
  // console.log("loadFromIndexedDB:0");
  // console.log("loadFromIndexedDB:1 " + dbName);
  // console.log("loadFromIndexedDB:2 " + storeName);
  // console.log("loadFromIndexedDB:3 " + id);

    return new Promise(
        function (resolve, reject) {
        var dbRequest = indexedDB.open(dbName);

        dbRequest.onerror = function (event) {
            reject(Error("Error text"));
        };

        dbRequest.onupgradeneeded = function (event) {
            // Objectstore does not exist. Nothing to load
            event.target.transaction.abort();
            reject(Error('Not found'));
        };

        dbRequest.onsuccess = function (event) {
            // console.log("loadFromIndexedDB:onsuccess ");

            var database = event.target.result;
            var transaction = database.transaction([storeName]);
            // console.log("loadFromIndexedDB:transaction: " +
            // JSON.stringify(transaction));
            var objectStore = transaction.objectStore(storeName);
            // console.log("loadFromIndexedDB:objectStore: " +
            // JSON.stringify(objectStore));
            var objectRequest = objectStore.get(id);

            // console.log("loadFromIndexedDB:objectRequest: " +
            // JSON.stringify(objectRequest));


            try {

                objectRequest.onerror = function (event) {
                    // reject(Error('Error text'));
                    reject('Error text');
                };

                objectRequest.onsuccess = function (event) {
                    if (objectRequest.result) {
   // console.log("loadFromIndexedDB:result " +
	// JSON.stringify(objectRequest.result));

                        resolve(objectRequest.result);
                    } else {
                        // reject(Error('object not found'));
                        resolve(null);

                    }
                };

            } catch (error) {
                console.log(error);

            }

        };
    });
}


function execute_rule(rule, url) {
    var new_url = "";
    new_url = url;
    try {
    // console.log("execute_rule url: " + url);
    // console.log("execute_rule rule: " + JSON.stringify(rule));
    // console.log("execute_rule: " + JSON.stringify(rule.steps));
    // console.log("execute_rule: " + rule.steps.length);
        // loop through the steps contained in this rule
        // step-order is essential
        // the output of one is the input of the next

        for (var i = 0; i < rule.steps.length; i++) {
   // console.log("### apply step: " + JSON.stringify(rule.steps[i]) + " to " +
	// new_url);
            new_url = execute_rule_step(rule.steps[i], new_url);
        }
   // console.log("### apply step: " + rule + " to " + new_url);
    } catch (e) {}
    return new_url;
}

function execute_rule_step(rule_step, url) {
 // console.log("execute_rule_step");
    var new_url = "";
    new_url = url;
 // console.log("### apply step: " + JSON.stringify(rule_step) + " to " +
	// new_url);

    // syntax is STEP NAME ( PARAMETER VALUE)
    var step_name = ""

        step_name = rule_step.procedure;
    // var param_regexp = /\(/;
    // if (param_regexp.test(rule_step)) {
    // parameter_value = rule_step.replace(/[^(]*\(/i, '').replace(/\) *$/i,
    // '');
    // }
    console.log("step_name: " + step_name);
    var parameter_value = "";
    try {
        // consider only cases with at most a single parameter
        parameter_value = rule_step.parameters[0].value;

    } catch (e) {}

    var param_regexp = rule_step.parameters[0];

    console.log("parameter_value: " + parameter_value);
    switch (step_name) {
    case 'regexp':
        try {
            // make allowances for g and i settings
            // Parse parameter which follows the sed-syntax
            // This means that the second character is the delimiter
            var delimiter = "";
            delimiter = parameter_value.replace(/^s(.).*/i, '$1');
            var flags_ext = new RegExp("[s]*" + delimiter + "[^" + delimiter + "]*" + delimiter + "[^" + delimiter + "]*" + delimiter + "(.*)$");
            // console.log("flags_ext: " + flags_ext);
            var flags = "";
            flags = parameter_value.replace(flags_ext, '$1').replace(/ /g, '');
            // console.log("flags: " + flags);
            var pattern_ext = new RegExp("[s]*" + delimiter + "([^" + delimiter + "]*)" + delimiter + ".*$");
            // console.log("pattern_ext: " + pattern_ext);
            var pattern = "";
            pattern = parameter_value.replace(pattern_ext, '$1');
            // console.log("pattern: " + pattern);
            var val_ext = new RegExp(".*" + delimiter + "([^" + delimiter + "]*)" + delimiter + "[ gi]*$");
            var val = "";
            val = parameter_value.replace(val_ext, '$1');
            // console.log("val_ext: " + val_ext)
            // console.log("return val: " + val)
            // console.log(new RegExp(pattern, flags));
            new_url = new_url.replace(new RegExp(pattern, flags), val);
        } catch (e) {
            console.log(e);
        }
        break;
    case 'qs_param':
        // console.log(new_url);
        // console.log("get query string parameter named: " + parameter_value);
        var u = "";
        // remove everything infront of and behind the parameter
        var reg_exp2 = new RegExp(".*[?&]" + parameter_value + "=([^&]*).*");
        // console.log(reg_exp2);
        u = new_url.replace(reg_exp2, '$1');
        // console.log(u);
        // remove everything infront of the parameter
        var reg_exp1 = new RegExp(".*[\?&]" + parameter_value + "=([^&]*)$");
        // console.log(reg_exp1);
        // console.log(u);
        // u = url.replace(reg_exp1, '$1' );
        // new_url = url_rewrite_step_qs_param(new_url, parameter_value);
        new_url = u;
        break;
    case 'uri_decode':
        try {
            // for some reason decodeURI does not work
            new_url = new_url.replace(/%40/g, '@').replace(/%3A/g, ':').replace(/%3B/g, ';').replace(/%3C/g, '<').replace(/%3D/g, '=').replace(/%3E/g, '>').replace(/%3F/g, '?').replace(/%20/g, ' ').replace(/%21/g, '!').replace(/%22/g, '"').replace(/%23/g, '#').replace(/%25/g, '%').replace(/%26/g, '&').replace(/%28/g, '(').replace(/%29/g, ')').replace(/%2A/g, '*').replace(/%2B/g, '+').replace(/%2C/g, ',').replace(/%2D/g, '-').replace(/%2E/g, '.').replace(/%2F/g, '/').replace(/%5B/g, '[').replace(/%5C/g, '\\').replace(/%5D/g, ']').replace(/%5E/g, '^').replace(/%5F/g, '_').replace(/%60/g, "'").replace(/%25/g, '%');
        } catch (e) { // catches a malformed URI
            console.error(e);
        }
        break;
    case 'base64_decode':
        console.log(new_url);
        new_url = atob(new_url);
        break;
    case 'JSON_path':
        console.log(new_url);
        console.log(JSON.parse(new_url)[parameter_value]);

        new_url = JSON.parse(new_url)[parameter_value];
        break;
    case 'replace_with':
        console.log(new_url);
        new_url = parameter_value;
        break;
    case 'skinny_lookup':
        // lookup the URL and if it returns a HTTP 403 redirect and a Location
        // header, insert that.
        // Itterate up to three times incase on redirect leads to another.
        console.log("lookup the URL without revealing anything");
        // new_url = parameter_value;
        break;
    default:
    }

    return new_url;

}



function generate_default_link_rules() {

    console.log("generate_default_link_rules begin");

    // add rule objects to database
    try {
        var p = [];
        p.push(saveToIndexedDB_async('sourceFulldomainRuleDB', 'sourceFulldomainRuleStore', 'keyId', {
                keyId: 'https://www.google.com/',
                sourceFulldomain: 'https://www.google.com/',
                url_match: 'https://www.google.com/',
                scope: 'Fulldomain',
                direction: 'source',
                steps: [{
                        procedure: "qs_param",
                        parameters: [{
                                value: "url",
                                notes: "read url from querystring"
                            }
                        ],
                        notes: "grab the url parameter from the querystring"
                    }, {
                        procedure: "uri_decode",
                        parameters: [],
                        notes: "uri decode"
                    }
                ],
                notes: '',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('sourceFulldomainRuleDB', 'sourceFulldomainRuleStore', 'keyId', {
                keyId: 'https://www.facebook.com/',
                sourceFulldomain: 'https://www.facebook.com/',
                url_match: 'https://www.facebook.com/',
                scope: 'Domain',
                direction: 'source',
                steps: [{
                        procedure: "regexp",
                        parameters: [{
                                value: "sDfbclid=[^&]*DDg",
                                notes: "remove fbclid from qs"
                            }
                        ],
                        notes: "edit querystring"
                    }
                ],
                notes: 'remove tracking id from urls to thrrd parties',
                createtime: '202001010001'
            }));

        p.push(saveToIndexedDB_async('sourceDomainRuleDB', 'sourceDomainRuleStore', 'keyId', {
                keyId: 'google.com',
                sourceDomain: 'google.com',
                url_match: 'google.com',
                scope: 'Domain',
                direction: 'source',
                steps: [{
                        procedure: "regexp",
                        parameters: [{
                                value: "sDfbclid=[^&]*DDg",
                                notes: "remove fbclid from qs"
                            }
                        ],
                        notes: "edit querystring"
                    }
                ],
                notes: 'remove tracking id from urls to thrrd parties',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('sourceDomainRuleDB', 'sourceDomainRuleStore', 'keyId', {
                keyId: 'facebook.com',
                sourceDomain: 'facebook.com',
                url_match: 'facebook.com',
                scope: 'Domain',
                direction: 'source',
                steps: [{
                        procedure: "regexp",
                        parameters: [{
                                value: "sDfbclid=[^&]*DDg",
                                notes: "remove fbclid from qs"
                            }
                        ],
                        notes: "tracking token from querystring"
                    },{
                        procedure: "regexp",
                        parameters: [{
                                value: "s/(utm|hsa)_[a-z]*=[^&]*//g",
                                notes: "delete parameters with names starting with utm_ and hsa_"
                            }
                        ],
                        notes: "remove suspicious parameters from querystring"
                    }
                ],
                notes: 'remove tracking id from urls to thrrd parties',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('sourceFulldomainRuleDB', 'sourceFulldomainRuleStore', 'keyId', {
                keyId: 'https://www.imdb.com/',
                sourceFulldomain: 'https://www.imdb.com/',
                url_match: 'https://www.imdb.com/',
                scope: 'Fulldomain',
                direction: 'source',
                steps: [{
                        procedure: "regexp",
                        parameters: [{
                                value: "sDcharDCHARDg",
                                notes: "test"
                            }
                        ],
                        notes: "test"
                    }
                ],
                notes: 'test',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('sourceFulldomainRuleDB', 'sourceFulldomainRuleStore', 'keyId', {
                keyId: 'https://www.linkedin.com/',
                sourceFulldomain: 'https://www.linkedin.com/',
                url_match: 'https://www.linkedin.com/',
                scope: 'Fulldomain',
                direction: 'source',
                 steps: [{
                    procedure: "regexp",
                    parameters: [{
                            value: "s/(utm|hsa)_[a-z]*=[^&]*//g",
                            notes: "delete parameters with names starting with utm_ and hsa_"
                        }
                    ],
                    notes: "remove suspicious parameters from querystring"
                },{
                    procedure: "regexp",
                    parameters: [{
                            value: "s/[&]*li_fat_id=[^&]*//g",
                            notes: "delete qs parameter with named li_fat_id"
                        }
                    ],
                    notes: "remove extraneous parameter from querystring"
                }
                ],
                notes: 'test',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('destinationDomainRuleDB', 'destinationDomainRuleStore', 'keyId', {
                keyId: 'ct.sendgrid.net',
                destinationDomain: 'ct.sendgrid.net',
                url_match: 'ct.sendgrid.net',
                scope: 'Domain',
                direction: 'destination',
                steps: [{
                        procedure: "regexp",
                        parameters: [{
                                value: "sD-D%Dg",
                                notes: "test"
                            }
                        ],
                        notes: "test"
                    }
                ],
                notes: 'test',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('destinationFulldomainRuleDB', 'destinationFulldomainRuleStore', 'keyId', {
                keyId: 'https://www.facebook.com/',
                destinationFulldomain: 'https://www.facebook.com/',
                url_match: 'https://www.facebook.com/',
                scope: 'Fulldomain',
                direction: 'destination',
                steps: [{
                        procedure: "regexp",
                        parameters: [{
                                value: "sD\\?.*DDg",
                                notes: "test"
                            }
                        ],
                        notes: "test"
                    }
                ],
                notes: 'test',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('destinationFulldomainRuleDB', 'destinationFulldomainRuleStore', 'keyId', {
                keyId: 'http://ad.doubleclick.net/',
                destinationFulldomain: 'http://ad.doubleclick.net/',
                url_match: 'http://ad.doubleclick.net/',
                scope: 'Fulldomain',
                direction: 'destination',
                steps: [{
                        procedure: "regexp",
                        parameters: [{
                                value: "sD.*(http[s]*://[^&]*).*D$1Dg",
                                notes: "test"
                            }
                        ],
                        notes: "test"
                    }, {
                        procedure: "regexp",
                        parameters: [{
                                value: "sD\\?.*DDg",
                                notes: "test"
                            }
                        ],
                        notes: "test"
                    }
                ],
                notes: 'test',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('destinationFulldomainRuleDB', 'destinationFulldomainRuleStore', 'keyId', {
            keyId: 'https://www.linkedin.com/',
            destinationFulldomain: 'https://www.linkedin.com/',
            url_match: 'https://www.linkedin.com/',
            scope: 'Fulldomain',
            direction: 'destination',
            steps: [{
                procedure: "regexp",
                parameters: [{
                        value: "s/trackingId=[^&]*//g",
                        notes: "delete trackingId from querystring"
                    }
                ],
                notes: "remove tracking token from querystring used inside the linkedin application"
            }
            ],
            notes: 'remove tracker',
            createtime: '202001010001'
        }));


        // boil
        // https://ad.doubleclick.net/ddm/trackclk/N1114924.158707LINKEDIN/B25010089.299078854;dc_trk_aid=491804324;dc_trk_cid=142315430;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;gdpr=$%7BGDPR%7D;gdpr_consent=$%7BGDPR_CONSENT_755%7D;ltd=?li_fat_id=e1558f7d-a9f8-41dc-9c34-a654161f74be
        // https://ad.doubleclick.net/ddm/trackclk/N1114924.158707LINKEDIN/B25010089.299078854;dc_trk_aid=491804324;dc_trk_cid=142315430;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;gdpr=$(GDPR);gdpr_consent=(GDPR_CONSENT_755);ltd=?li_fat_id=e1558f7d-a9f8-41dc-9c34-a654161f74be
        // down to
        // 'https://ad.doubleclick.net/ddm/trackclk/N1114924.158707LINKEDIN/B25010089.299078854;dc_trk_aid=491804324;dc_trk_cid=142315430;
        // returns
        // https://bcp.crwdcntrl.net/5/c=10025/camp_int=Advertiser_${9340650}^Campaign_${25010089}^clicks?https://www.ibm.com/cloud/bare-metal-servers?utm_content=000016GC&utm_term=10006171&p1=PSocial&p2=299078854&p3=142315430&dclid=CNjrjqPkmfACFdaNsgodXggDvQ
        // which is turn must be reduced to
        // https://www.ibm.com/cloud/bare-metal-servers

        p.push(saveToIndexedDB_async('destinationFulldomainRuleDB', 'destinationFulldomainRuleStore', 'keyId', {
                keyId: 'https://ad.doubleclick.net',
                destinationFulldomain: 'https://ad.doubleclick.net',
                url_match: 'https://ad.doubleclick.net',
                scope: 'Fulldomain',
                direction: 'destination',
                destinationFulldomain: 'https://ad.doubleclick.net',
                steps: [{
                        procedure: "regexp",
                        parameters: [{
                                value: "sD\\?.*DDg",
                                notes: "remove the querystring"
                            }
                        ],
                        notes: "reduce to ;dc_trk_aid=11111111;dc_trk_cid=000000"
                    }, {
                        procedure: "regexp",
                        parameters: [{
                                value: "sD\\?.*DDg",
                                notes: "remove semmi-colon separated parameters from path where no value has been set ;dc_rdid=  "
                            }
                        ],
                        notes: "reduce to ;dc_trk_aid=11111111;dc_trk_cid=000000"
                    }
                ],
                notes: 'test',
                createtime: '202001010001'
            }));

        p.push(saveToIndexedDB_async('destinationUrlRuleDB', 'destinationUrlRuleStore', 'keyId', {
                keyId: 'https://l.facebook.com/l.php',
                destinationUrl: 'https://l.facebook.com/l.php',
                url_match: 'https://l.facebook.com/l.php',
                 scope: 'Url',
                direction: 'destination',
                steps: [{
                        procedure: "qs_param",
                        parameters: [{
                                value: "u",
                                notes: "read u from querystring"
                            }
                        ],
                        notes: "grab the u parameter from the querystring"
                    }, {
                        procedure: "uri_decode",
                        parameters: [{
                            value: "N/A",
                            notes: ""
                        }
                    ],
                    notes: "uri decode"
                    }
                ],
                notes: '',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('destinationUrlRuleDB', 'destinationUrlRuleStore', 'keyId', {
                keyId: 'https://www.google.com/url',
                destinationUrl: 'https://www.google.com/url',
                url_match: 'https://www.google.com/url',
                scope: 'Url',
                direction: 'destination',
                steps: [{
                        procedure: "qs_param",
                        parameters: [{
                                value: "url",
                                notes: "read url from querystring"
                            }
                        ],
                        notes: "grab the url parameter from the querystring"
                    }, {
                        procedure: "uri_decode",
                        parameters: [{
                            value: "N/A",
                            notes: ""
                        }
                    ],notes: "uri decode"
                    }
                ],
                notes: '',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('destinationUrlRuleDB', 'destinationUrlRuleStore', 'keyId', {
                keyId: 'https://ideas-admin.lego.com/mailing/email_link',
                destinationUrl: 'https://ideas-admin.lego.com/mailing/email_link',
                url_match: 'https://ideas-admin.lego.com/mailing/email_link',
                scope: 'Url',
                direction: 'destination',
                steps: [{
                        procedure: "qs_param",
                        parameters: [{
                                value: "payLoad",
                                notes: "read payLoad from querystring"
                            }
                        ],
                        notes: "grab the payLoad parameter from the querystring"
                    }, {
                        procedure: "uri_decode",
                        parameters: [{
                            value: "N/A",
                            notes: ""
                        }
                    ],notes: "uri decode"
                    }, {
                        procedure: "base64_decode",
                        parameters: [{
                            value: "N/A",
                            notes: ""
                        }
                    ],notes: "BASE64 decode"
                    }, {
                        procedure: "JSON_path",
                        parameters: [{
                                value: "url",
                                notes: "read url from object"
                            }
                        ],
                        notes: "get piece of JSON object"
                    }
                ],
                notes: 'handle links embedded in emails from LEGO',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('destinationUrlRuleDB', 'destinationUrlRuleStore', 'keyId', {
                keyId: 'https://dagsavisen.us11.list-manage.com/track/click',
                destinationUrl: 'https://dagsavisen.us11.list-manage.com/track/click',
                url_match: 'https://dagsavisen.us11.list-manage.com/track/click',
                 scope: 'Url',
                direction: 'destination',
                steps: [{
                        procedure: "replace_with",
                        parameters: [{
                                value: "http://www.dagsavisen.no/minside",
                                notes: "replace"
                            },{
                                value: "http://www.dagsavisen.no/minside2",
                                notes: "replace2 "
                            },{
                                value: "http://www.dagsavisen.no/minside3",
                                notes: "replace 3"
                            }
                        ],
                        notes: "replace with http://www.dagsavisen.no/minside"
                    }
                ],
                notes: 'test',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('destinationUrlRuleDB', 'destinationUrlRuleStore', 'keyId', {
                keyId: 'https://www.youtube.com/watch',
                destinationUrl: 'https://www.youtube.com/watch',
                url_match: 'https://www.youtube.com/watch',
                scope: 'Url',
                direction: 'destination',
                steps: [{
                        procedure: "regexp",
                        parameters: [{
                                value: "sD(\\?v=[^&]*).*D$1Dg",
                                notes: "sed statement to remove all but the v parameter"
                            }
                        ],
                        notes: "youtube videos should be short, leave only v parameter in query string"
                    }
                ],
                notes: 'clean youtube URLs',
                createtime: '202001010001'
            }));
        p.push(saveToIndexedDB_async('destinationUrlRuleDB', 'destinationUrlRuleStore', 'keyId', {
                keyId: 'https://www.flysas.com/en/flexible-booking/',
                destinationUrl: 'https://www.flysas.com/en/flexible-booking/',
                url_match: 'https://www.flysas.com/en/flexible-booking/',
                scope: 'Url',
                direction: 'destination',
                steps: [{
                        procedure: "regexp",
                        parameters: [{
                                value: "s/eCodsId=[^&]*//g",
                                notes: "sed-type regexp statement to delete CodsId from url"
                            }
                        ],
                        notes: "remove piece of querystring"
                    }
                ],
                notes: 'SAS tracing offers',
                createtime: '202001010001'
            }));

        console.log(p);
        // Using .catch:
        Promise.all(p)
        .then(values => {
            console.log(values);
        })
        .catch(error => {
            console.error(error.message)
        });

    } catch (f) {
        console.log(f);
    }
}


function saveToIndexedDB_async(dbName, storeName, keyId, object) {

    console.log("saveToIndexedDB_async:dbname " + dbName);
    console.log("saveToIndexedDB_async:objectstorename " + storeName);
    console.log("saveToIndexedDB_async:keyId " + keyId);
    console.log("saveToIndexedDB_async:object " + JSON.stringify(object));

    // indexedDB = window.indexedDB || window.webkitIndexedDB ||
    // window.mozIndexedDB || window.msIndexedDB;

    return new Promise(
        function (resolve, reject) {

        // console.log("saveToIndexedDB: 0 resolve=" + resolve )
        // console.log("saveToIndexedDB: 0 reject=" + reject )

        // if (object.taskTitle === undefined)
        // reject(Error('object has no taskTitle.'));

        var dbRequest;

        try {

            dbRequest = indexedDB.open(dbName);
        } catch (error) {
            console.log(error);

        }
        console.log("saveToIndexedDB_async: 1 dbRequest=" + dbRequest);

        dbRequest.onerror = function (event) {
            console.log("saveToIndexedDB:error.open:db " + dbName);
            reject(Error("IndexedDB database error"));
        };

        console.log("saveToIndexedDB: 2" + JSON.stringify(dbRequest));

        dbRequest.onupgradeneeded = function (event) {
            console.log("saveToIndexedDB: 21");
            var database = event.target.result;
            console.log("saveToIndexedDB:db create obj store " + storeName);
            var objectStore = database.createObjectStore(storeName, {
                    keyId: keyId
                });
        };

        console.log("saveToIndexedDB: 3" + JSON.stringify(dbRequest));
        try {

            dbRequest.onsuccess = function (event) {
                console.log("saveToIndexedDB: 31");
                var database = event.target.result;
                console.log("saveToIndexedDB: 32");
                var transaction = database.transaction([storeName], 'readwrite');
                console.log("saveToIndexedDB: 33");
                var objectStore = transaction.objectStore(storeName);
                console.log("saveToIndexedDB:objectStore put: " + JSON.stringify(object));

                var objectRequest = objectStore.put(object); // Overwrite if
                // already
                // exists

                console.log("saveToIndexedDB:objectRequest: " + JSON.stringify(objectRequest));

                objectRequest.onerror = function (event) {
                    console.log("saveToIndexedDB:error: " + storeName);

                    reject(Error('Error text'));
                };

                objectRequest.onsuccess = function (event) {
                    console.log("saveToIndexedDB:success: " + storeName);
                    resolve('Data saved OK');
                };
            };

        } catch (error) {
            console.log(error);

        }

    });
}



