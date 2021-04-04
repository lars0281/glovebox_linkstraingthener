
console.log("start Glovebox background");

// Start the recursion from the body tag. create highlight of Glovebox tags
markGlovebox(document.body);

let salt;

let db;

let indexedDB;

// databases, datastores, key

// key stores

// gloveboxKeys decryptionKeys keyPath
// gloveboxKeys encryptionKeys keyId
// privateKeys keyPairs keyId

// transaction stores

// encryptionKeysSecureOffers createdKeyOffers refId

// Mar 18 2021




// context menu related
browser.contextMenus.create({
    id: "glovebox-encrypttextonly",
    title: "encrypt_textonly",
    contexts: ["selection"]
});

browser.contextMenus.create({
    id: "glovebox-encrypthtml",
    title: "encrypt_html",
    contexts: ["selection"]
});

browser.contextMenus.create({
    id: "glovebox-encrypt-embeded",
    title: "encrypt_embeded",
    contexts: ["selection"]
});


browser.contextMenus.create({
    id: "glovebox-decrypttextonly_temporarily",
    title: "decrypt textonly temporarily (safe mode)",
    contexts: ["selection"]
});

browser.contextMenus.create({
    id: "glovebox-decrypttextonly_permanently",
    title: "decrypt textonly permanently",
    contexts: ["selection"]
});


// to add context menu item for links
browser.contextMenus.create({
    id: "glovebox-link-reveal",
    title: "reveal the true endpoint of URL",
    contexts: ["link"]
});



//
browser.contextMenus.create({
    id: "glovebox-decrypthtml_temp",
    title: "decrypt html temporarily",
    contexts: ["selection"]
});

browser.contextMenus.create({
    id: "glovebox-decrypthtml_perm",
    title: "decrypt html permanently",
    contexts: ["selection"]
});


browser.contextMenus.create({
    id: "glovebox-removedecrypthtml",
    title: "remove decrypt html",
    contexts: ["selection"]
});

browser.contextMenus.create({
    id: "glovebox-pasteGloveboxOpenKeyToken",
    title: "paste decryptiontoken",
    contexts: ["selection"]
});

browser.contextMenus.create({
    id: "glovebox-acceptdecryptiontoken_open",
    title: "accept decryptiontoken",
    contexts: ["selection"]
});

// GloveboxSecureKeyOfferToken
browser.contextMenus.create({
    id: "paste-GloveboxSecureKeyOfferToken",
    title: "1. offer decryptiontoken securely",
    contexts: ["selection"]
});

browser.contextMenus.create({
    id: "consume-GloveboxSecureKeyOfferToken",
    title: "2. accept offer of decryptiontoken securely",
    contexts: ["selection"]
});

browser.contextMenus.create({
    id: "consume-GloveboxAcceptedSecureKeyOfferToken",
    title: "3. send key securely to recipient based on previous offer",
    contexts: ["selection"]
});

browser.contextMenus.create({
    id: "consume-GloveboxSecureKeyTokenFromAcceptedOfferToken",
    title: "4. add key",
    contexts: ["selection"]
});

// Add a context menu action on every image element in the page.
browser.contextMenus.create({
    id: "glovebox-key",
    title: "Add to the collected keys",
    contexts: ["image"],
});

browser.browserAction.onClicked.addListener(() => {
    // use this functionality to get a full tabpage
    browser.tabs.create({
        url: "/navigate-collection.html"
    });
    // can replace the above with a direct referal to this html in the manifest - but this would not provide a full tab-page
    // "brower_action": {
    // "default_popup": "navigate-collection.html"

});

// handler for messages sent from
//browser.runtime.onMessage.addListener(function(message,sender,sendResponse){
//alert(message.data);
//	console.log("#### message received");
//		chrome.runtime.sendMessage({data:datax},function(response){
//				});
//				});

// listener for message sent from the admin page of the plugin
browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    console.log("received from page:  message: " + JSON.stringify(message) + " message.type=" + message.type);

    console.log("request:" + message.request);

    console.log("request:" + message.linkurl);

    try{
    
    if (message && message.request == 'generate_encryption_key') {
        console.log("request: generate_encryption_key: begin");

        // call out to the function generate_encryption_key
        var newkey;
        indexedDB = window.indexedDB || window.webkitIndexedDB ||
            window.mozIndexedDB || window.msIndexedDB;
        generate_encryption_key().then(function (key) {
            console.log("key returned");
            newkey = key;
            console.log(key);
        })
        console.log("request: generate_encryption_key: end");

    }

    if (message && message.type == 'page') {
        console.log("page_message:");
        var page_message = message.message;
        console.log("page_message:" + page_message);
        // Simple example: Get data from extension's local storage
        //var result = localStorage.getItem('whatever');
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
}

let pendingCollectedUrls = [];

browser.contextMenus.onClicked.addListener((info, tab) => {
    console.log("background.js: browser.contextMenus.onClicked.addListener");
    console.log("background.js: browser.contextMenus.onClicked.addListener:info:" + JSON.stringify(info));
    console.log("background.js: browser.contextMenus.onClicked.addListener:tab:" + JSON.stringify(tab));

    if (info.menuItemId === "glovebox-key") {
        // use the selected text to read out the key for this user from the
        // database


        console.log("glovebox-key");

        // try {
        // browser.runtime.sendMessage({
        // type: "new-collected-images",
        // url: info.srcUrl,
        // });
        // } catch (err) {
        // if (err.message.includes("Could not establish connection. Receiving
        // end does not exist.")) {
        // Add the url to the pending urls and open a popup.
        // pendingCollectedUrls.push(info.srcUrl);

        try {
            browser.windows.create({
                type: "popup",
                url: "/popup.html",
                top: 0,
                left: 0,
                width: 300,
                height: 400,
            });
        } catch (err) {
            console.error(err);
        }
        return;
        // }

    }

   /*
    * WHen the user has selected from the context meny to revel the true end point of a url 
    * 
    */
    else if (info.menuItemId === "glovebox-link-reveal") {
        console.log("glovebox-link-reveal");
      //  console.log(info);
      //  console.log(tab);
        reveal_true_url_endpoint(info, tab);

    }

    
    // By key Recipient
    // accept a token containing a decryption key transmitted securely.
    // The key is from
    else if (info.menuItemId === "consume-GloveboxSecureKeyTokenFromAcceptedOfferToken") {
        console.log("background.js: consume-GloveboxSecureKeyTokenFromAcceptedOfferToken");

        consume_GloveboxSecureKeyTokenFromAcceptedOfferToken();

    }

    // By key Sender
    // consume the token GloveboxAcceptedSecureKeyOfferToken
    // issue the decryption key to the recipient.
    // Use the public RSA key contained in this token to encrypt the key
    else if (info.menuItemId === "consume-GloveboxAcceptedSecureKeyOfferToken") {
        consume_GloveboxAcceptedSecureKeyOfferToken();

    } else if (info.menuItemId === "paste-GloveboxSecureKeyOfferToken") {
        console.log("background.js: glovebox-GloveboxSecureKeyOfferToken");

        paste_GloveboxSecureKeyOfferToken();

    }

    // By key Recipient
    // consume a GloveboxSecureKeyOfferToken token
    // issue a GloveboxAcceptedSecureKeyOfferToken token
    else if (info.menuItemId === "consume-GloveboxSecureKeyOfferToken") {
        consume_GloveboxSecureKeyOfferToken();
    } else if (info.menuItemId === "glovebox-acceptdecryptiontoken_open") {
        glovebox_acceptdecryptiontoken_open();
    } else if (info.menuItemId === "glovebox-pasteGloveboxOpenKeyToken") {
        glovebox_pasteGloveboxOpenKeyToken();

    }

    // *** ENCRYPT *** 
    // encrypt a plain text selection
    else if (info.menuItemId === "glovebox-encrypttextonly") {
//        glovebox_encrypttextonly(info);
        glovebox_encryptPlaintext(info,"text");

    } else if (info.menuItemId === "glovebox-encrypthtml") {
//        glovebox_encrypthtml();
        glovebox_encryptPlaintext(info,"html");

    } else if (info.menuItemId === "glovebox-encrypt-embeded") {
  // encrypt the selected HTML and all embeded content (such as icons and other images referenced with with "src" attribute)
      glovebox_encryptPlaintext(info,"embeded");

    } else if (info.menuItemId === "glovebox-encrypt-linked") {
    	  // Encrypt the selected HTML and all linked and embedded content (such as icons and other images referenced with with "src" attribute)
    	  // This is likely to produce very large page documents but there are reasonable use cases for this kind of functionality. Most notable 
    	// web-based email where a file attachment should be read into the cipher text...
    	// and later be presented to the user as a clickable download link in the decrypted email, without ever appearing as an attachment.
    	// The encrypted message should appear as a (possibly very long) plain text message in transit and storage and no where real itself as containing a file. 
    	   glovebox_encryptPlaintext(info,"linked");
        

    // *** DECRYPT *** 

    // This take the Glovebox encrypted token and places it inside Glovebox markup
    // structure, along with the decrypted content.
    // An event listener is placed on the markup where by under some
    // circumstance, the decrypted content is deleted.This to prevent the accidental
    // dissemination of sensitive data.
    // These circumstances are:
    } else if (info.menuItemId === "glovebox-decrypttextonly_temporarily") {
        //glovebox_decrypttextonly_temporarily(info);
    	glovebox_decrypthtml(info,"text","temp");

    } else if (info.menuItemId === "glovebox-decrypttextonly_permanently") {
        //glovebox_decrypttextonly_permanently(info);
    	glovebox_decrypthtml(info,"text","perm");
    }
    else if (info.menuItemId === "glovebox-decrypthtml_temp") {
        console.log("calling glovebox_decrypthtml");
        glovebox_decrypthtml(info,"html","temp");
    }
    else if (info.menuItemId === "glovebox-decrypthtml_perm") {
        console.log("calling glovebox_decrypthtml");
        glovebox_decrypthtml(info,"html","perm");
    }

    
    
    
    // This removes any Glovebox markup, leaving the decrypted content in place ofthe enciphered content.
    // The aim is to have a procedure that is completely reversible.
    else if (info.menuItemId === "glovebox-removedecrypthtml") {

        glovebox_removedecrypthtml();

       
    }

    console.log("#### request completed");
});

// Both source and destination rules are applied. With source rules applied first. Links may be rewritten by one source rule, follow by one destination rule.


// rewrite URLs from the page
// the rules applies to link found on a matching page/url, regardless of here to go to

var source_fulldomain_rules = {};
// look for bit.ly link wherever we can find them.

// for any link found on www.facebook.com remove the query string parameter "fbclid"
source_fulldomain_rules['https://www.facebook.com/'] = ["regexp(sDfbclid=[^&]*DDg)"];
source_fulldomain_rules['https://www.imdb.com/'] = ["regexp(sDcharDCHARDg)"];
//while on linkedin, remove all querystring parameters to other URLs on linkedin
source_fulldomain_rules['https://www.linkedin.com/'] = ["regexp(sD\\?.*DDg)"];



var source_url_rules = {};

var source_domain_rules = {};



// rewrite URLs on the page
// these rules applies to link to URL, regardless of where they are found

// data structure containing the rules for which URL are to be considered, and what to do with them
// in priority order. a maximum of one rule can be used.

// for now, accept a loop-inside-loop-inside-loop arrangement. (shudder!)
// scope rules for current page domain

// console.log(document);

var destination_url_rules = {};

// which URL this applies to - what steps to carry out , in order, to compute the correct URL from available data (The query string typically).

// sample https://l.facebook.com/l.php
// 1. step Extract parameter "u" from the query string
// 2. step URI decode
// done

destination_url_rules['https://l.facebook.com/l.php'] = ["qs_param(u)", "uri_decode"];

// a somewhat more complex example

// sample https://l.facebook.com/l.php
// 1. step - Extract parameter "payload" from the query string
// 2. step - URI decode
// 3. step - BASE64 decode
// 4. step - in JSON structure get value found at path "url"
// done

destination_url_rules['https://ideas-admin.lego.com/mailing/email_link'] = ["qs_param(payLoad)", "uri_decode", "base64_decode", "JSON_path(url)"];

// a very simply example
// where the link is to a tracker, and the final URL is to common URL - The rule is just an alias
// 1. step Replace with

destination_url_rules['https://dagsavisen.us11.list-manage.com/track/click'] = ["replace_with(http://www.dagsavisen.no/minside)"];

// match against the URL on pattern

destination_url_rules['https://www.aftenposten.no/meninger/kommentar.*'] = ["regexp(?.*)"];


// youtube videos should be short, leave only v parameter in query string

	destination_url_rules['https://www.youtube.com/watch'] = ["regexp(sD(\\?v=[^&]*).*D$1Dg)"];

	// make urle for
	// https://www.linkedin.com/leadGenForm/urn:li:fs_leadGenForm:(3714563,-1,-1)?leadTrackingUrl=www%2Elinkedin%2Ecom%2Fcsp%2Fsct%3Fv%3D3%26lTrk%3DCwEAAAF4hbw9Een3c6ievr9hpezs-OhG01Jgg7kREzfCMnTPKP7EaMQ0uJUuRHGkXiZgIIXZQxwmsEgrNb4Trb9C0yc5E9Zpoxe8NHCS8WV4xM3S-et4F48UO5m4V9Wt-W_Fmk9dPn6rZhrWW91sGm8HAQujZS9obmxHKNHgplkpiLW2CVqT4XKpwDuoKxo7lfDVdDfdjxOihJ62NahQd90wngAi3NIQrF4qpbyek-mjJVgfpfTmI5-qI94lO7zj-CbNT2Y7B2xrm2X98_znvtc65ztpO8Mlk3358kF2Vs8EPyzbiYR41SPxKiUWLNWA-67uzBWxiHpY9wwlRGhu5szIsszy7Z5qco_qcr6aBNH5f2jxmVTYUTEW-JtbD9j2_tspPNs4MMfuzQ0shnaFpOxqcfA2cpbNHOI1YEM_Ps76nS8Sma98cxy1wzysSpLSt_tFq_h-yiWJJMyZ-ax8CT-tolBabrab2FDIRKNxf57PjeyLQZjs_xrdthzxAKkOQd48nQf7-FPwKtnPT4GF4dC0DP-0bYTrvlPZadqGZIObkk2KIBegOMaBetWCWo-4kvneGmetR91hu9cuKgw6UzxnmkhWfVPoysMRXSBuBVwl4Fgvy7-3Uzu6dsC9Owb2p98vs2w3ashNJh7r7xNHE1jnbHmXqAxA1sk_gvZC8SHyfI1OLjRlG8Rc7VqalxEP4ZLEapGv_JsoPz6BBTl2KaGNZ8Sk9K_wWRP3BNVYnyR15zo8IEg-Z7_G8nEBLhlYRgtV6lYD0fguOPVHGUxUkpHewgQSeeqaYzYXm817gvvFJ_nTFIty7pe1Hse6aOaV5Dly2dulIgWSdYiY4SLfAMfPCtK-Na2S12VtyQKFYofKz5xdQih29_Y9Mn2PnG-ASS9c_HX6LMQgQr9XaN1o-Ok6L80naCbLBdBqNajVtbkY6OHh1xHO5M8geK01a2aa4YbZFd75_2Wux4zERVLa9jxAFeWEcbdgF73aXHHz&lipi=urn%3Ali%3Apage%3Ad_flagship3_feed%3BeZvXnucnSUq4UaL5viatbA%3D%3D

	
	
// match against the URL on pattern

// destination_url_rules['http://ad.doubleclick.net/ddm/trackclk.*'] = ["regexp(\?.*)"];

// eliminate "URL shorteners" such as bit.ly
// rules for which domain names should be considered automatic redirtors that obscure the true endpoint
// In case the URL is matched, call the URL and determin if the response in an automatic redirect.
// If so, replace the link with this value so as to avoid calling the redirecting site. Rewrite URL (href attribute in the DOM,if possible.

// collect the rule set from background.js
// as a temprorary measure, keep the rules statically right here

var destination_fulldomain_rules = {};

destination_fulldomain_rules['https://lnkd.in/'] = ["skinny_lookup"];
destination_fulldomain_rules['https://cutt.ly/'] = ["skinny_lookup"];
destination_fulldomain_rules['https://tinyurl.com/'] = ["skinny_lookup"];
destination_fulldomain_rules['https://youtu.be/'] = ["skinny_lookup"];

// of this domain there is a lot of stuff going in the path-path of the URL. match on some part of this path before engaging in the rewrite
destination_fulldomain_rules['http://ad.doubleclick.net/'] = ["regexp(sD.*(http[s]*://[^&]*).*D$1Dg)", "regexp(sD\\?.*DDg)"];

// remove query string from links to www.facebook.com/some-single-phrase
destination_fulldomain_rules['http://www.facebook.com/'] = ["regexp(sD\\?.*DDg)"];
destination_fulldomain_rules['https://www.facebook.com/'] = ["regexp(sD\\?.*DDg)"];


var destination_domain_rules = {};

// 
destination_domain_rules['ct.sendgrid.net'] = ["regexp(sD-D%Dg)"];







function glovebox_encryptPlaintext(info,contenttype) {
	// contenttype
	// permitted values: text, html, embeded, linked

    console.log("glovebox_encryptPlaintext(info," +contenttype+ ")");

    indexedDB = window.indexedDB || window.webkitIndexedDB ||
    window.mozIndexedDB || window.msIndexedDB;

var request = indexedDB.open("decryptionKeysDB", 1);
request.onupgradeneeded = function (event) {
    db = event.target.result;
    db.onerror = function (event) {};
    // Create an objectStore in this database to keep trusted decryption
    // keys
    console.log("create objectstore decryptionKeysStore in decryptionKeysDB");
    var objectStore2 = db.createObjectStore('decryptionKeysStore', {
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

var request2 = indexedDB.open('encryptionKeysDB', 1);
request2.onupgradeneeded = function (event) {
    db = event.target.result;
    db.onerror = function (event) {};
    // Create an objectStore in this database to keep trusted decryption
    // keys
    console.log("create objectstore encryptionKeysStore in encryptionKeysDB");
    var objectStore2 = db.createObjectStore('encryptionKeysStore', {
            keyPath: 'keyId'
        });

    objectStore2.createIndex('keyId', 'keyId', {
        unique: true
    });
};
request2.onerror = function (event) {
    console.log("dp open request error 201");
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

// call out to the tab to collect the complete html selected
var replacement_text = new String("");

var selection_html;
var usekey;
var usekey_uuid;
// ID of tab in use
var tab_id = "";

console.log("###calling GetSelectedHTML.js");

// execute script in active tab
browser.tabs.executeScript({
    file: "GetSelectedHTML.js",
    allFrames: true
}).then(function (result) {
    console.log("background.js:onExecuted: result: " + JSON.stringify(result));
    // query for the one active tab
    return browser.tabs.query({
        active: true,
        currentWindow: true
    });
}).then(function (tabs) {
    console.log("###### GetSelectedHTML response " + JSON.stringify(tabs));
    // send message to the active tab
    tab_id = tabs[0].id;
    return browser.tabs.sendMessage(tabs[0].id, {
        GetSelectedHTML: "Glbx_marker",
        contenttype: contenttype
    });
}).then(function (res) {
    // console.log("###### getHTML response " + res);
    console.log("###### GetSelectedHTML response " + JSON.stringify(res));
    console.log("###### GetSelectedHTML response " + JSON.stringify(res.response));
    console.log("###### GetSelectedHTML response " + JSON.stringify(res.response.doc));
    selection_html = res.response.doc;
    // procceed with compression and encryption
    console.log("###### GetSelectedHTML response: " + selection_html);
    // console.log("###### GetSelectedHTML response: " +
    // JSON.stringify(selection_html));

    return getDefaultSecretKey();
}).then(function (response) {

    console.log('2 default encryption key loaded OK: ' + JSON.stringify(response));

    usekey = response.key_jwk;
    usekey_uuid = response.uuid;

    console.log("##usethiskey: " + usekey.k);
    console.log("##usethiskey(uuid): " + usekey_uuid);
    // proceed with encryption

    let ciphertext;
    let counter;

    // var iv = window.crypto.getRandomValues(new Uint8Array(12));

    var keyUsages = [
        'encrypt',
        'decrypt'
    ];

    var secretKey;
    var exportedKey;
    var encryptedText;

    return window.crypto.subtle.importKey('jwk', usekey, {
        name: 'AES-GCM'
    }, true, keyUsages);
}).then(function (key) {
    secretKey = key;
    console.log('background.js:0' + key);
    console.log('background.js:0: ' + usekey.k);

    console.log('background.js:0: source text length: ' + selection_html.length);
    var shorty_out = new Shorty();
    var compressed_plaintext = shorty_out.deflate(selection_html);

    console.log('background.js:0: compressed text: ' + compressed_plaintext);
    console.log('background.js:0: compressed text length: ' + compressed_plaintext.length);

    console.log('background.js:0: compressed text arraybuffer: ' + stringToArrayBuffer(compressed_plaintext));
    console.log('background.js:0: compressed text arraybuffer: ' + JSON.stringify(stringToArrayBuffer(compressed_plaintext)));
    console.log('background.js:0: compressed text arraybuffer: ' + stringToArrayBuffer(compressed_plaintext));
    var iv = new Uint8Array(12);

    var algoEncrypt = {
        name: 'AES-GCM',
        iv: iv,
        tagLength: 128
    };
    // return window.crypto.subtle.encrypt(algoEncrypt, key,
    // stringToArrayBuffer(plaintext));
    return window.crypto.subtle.encrypt(algoEncrypt, key, stringToArrayBuffer(compressed_plaintext));

}).then(function (cipherText) {

    // the replacement text is a concatenation of the cipher text and
    // additional referecens. These references are there to both
    // uniquely identify the text content as having been encrypted by
    // Glovebox and provide whatever information is required to identify
    // the key needed to decrypt it.

    replacement_text = replacement_text + ":Glovebox:" + convertBase64ToPsuedoText(usekey_uuid + ":" + _arrayBufferToBase64(cipherText)) + ':';

    console.log("usethiskey(uuid): " + usekey_uuid);

    console.log('Cipher Text (base64 enc): ' + _arrayBufferToBase64(cipherText));
    console.log("### calling HTMLToCiphertext.js");
    return browser.tabs.executeScript({
        file: "HTMLToCiphertext.js"
    });
}).then(function (result) {
    console.log("background.js:onExecuted4: We made it ....");
    console.log("background.js:onExecuted4: result: " + result);
    //  console.log("backgroupd.js:onExecuted4:selected_text: " + selected_text);
    console.log("backgroupd.js:onExecuted4:replacement_text: " + replacement_text);
console.log("id of active tab: " +tab_id);
//    return browser.tabs.query({
//        active: true,
//        currentWindow: true
//    });
//}).then(function (tabs) {
//	console.log("tab query result: " + JSON.stringify(tabs));

	browser.tabs.sendMessage(tab_id, {
        html_to_ciphertext_replacement: replacement_text

    });
}).then(function (r) {
    // call to remove page listener

    browser.tabs.executeScript({
        file: "RemoveTabOnMessageListenerGetSelectedHTML.js",
        allFrames: true
    });

}).then(function (r) {
    // call to remove page listener

    browser.tabs.executeScript({
        file: "RemoveTabOnMessageListenerHTMLToCiphertext.js",
        allFrames: true
    });
});
}

function DISABLEDglovebox_encrypttextonly(info) {

    console.log("glovebox-encrypttextonly.start");
    indexedDB = window.indexedDB || window.webkitIndexedDB ||
        window.mozIndexedDB || window.msIndexedDB;

    var request = indexedDB.open("decryptionKeysDB", 1);
    request.onupgradeneeded = function (event) {
        db = event.target.result;
        db.onerror = function (event) {};
        // Create an objectStore in this database to keep trusted decryption
        // keys
        console.log("background.js: create objectstore decryptionKeysStore in decryptionKeysDB");
        var objectStore2 = db.createObjectStore('decryptionKeysStore', {
                keyPath: 'keyId'
            });

        objectStore2.createIndex('keyId', 'keyId', {
            unique: true
        });
    };
    request.onerror = function (event) {
        console.log("background.js: dp open request error 201");
    };
    request.onsuccess = function (event) {
        db = event.target.result;
        db.onerror = function (event) {
            console.log("background.js: db open request error 2");
        };
        db.onsuccess = function (event) {
            console.log("background.js: db open request success 2");
        };
    };

    var request2 = indexedDB.open('encryptionKeysDB', 1);
    request2.onupgradeneeded = function (event) {
        db = event.target.result;
        db.onerror = function (event) {};
        // Create an objectStore in this database to keep trusted decryption
        // keys
        console.log("background.js: create objectstore encryptionKeysStore in encryptionKeysDB");
        var objectStore2 = db.createObjectStore('encryptionKeysStore', {
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

    // use the "selectionText" functionality 
    // - which means all markup contained in the selection will be ignored.
    console.log("info = " + JSON.stringify(info));
    console.log("info.selectionText = " + info.selectionText);

    var selected_text = new String(info.selectionText);
    console.log("backgroupd.js:selected_text: " + selected_text);

    // pull out the complete html of the selection


    console.log("background.js:selected_text: " + selected_text);
    // ok, make call to tab to grab the complete selection html
    var replacement_text = new String("");
    var usekey;
    var usekey_uuid;
    console.log('attempt 2 key loaded OK: ');

    
    // which key should be used to encrypt the selection
    // Later: add functionality to let the user select which key to use
    // For now: use the default key
    // pickup default encryption key from database

    getDefaultSecretKey().then(function (response) {

        console.log('The default encryption key was loaded OK ?: ' + JSON.stringify(response));

        usekey = response.key_jwk;
        usekey_uuid = response.uuid;

        console.log("##usethiskey: " + usekey.k);
        console.log("##usethiskey(uuid): " + usekey_uuid);
        // proceed with encryption


        /*
         * Store the calculated ciphertext and counter here, so we can
         * decrypt the message later.
         */
        let ciphertext;
        let counter;

        var algoKeyGen = {
            name: 'AES-GCM',
            // length: 256
            length: 128
        };
        // var iv = window.crypto.getRandomValues(new Uint8Array(12));
        var iv = new Uint8Array(12);
        var algoEncrypt = {
            name: 'AES-GCM',
            iv: iv,
            tagLength: 128
        };

        console.log('algoEncrypt: ' + JSON.stringify(algoEncrypt));

        var keyUsages = [
            'encrypt',
            'decrypt'
        ];
        console.log('keyUsages: ' + JSON.stringify(keyUsages));

        var secretKey;
        var exportedKey;
        var encryptedText;

        // window.crypto.subtle.generateKey(algoKeyGen, true,
        // keyUsages).then(function (key) {

        console.log('import: ' + JSON.stringify(usekey));

        window.crypto.subtle.importKey('jwk', usekey, {
            name: 'AES-GCM'
        }, true, keyUsages).then(function (key) {
            secretKey = key;
            console.log('background.js:0' + key);
            console.log('background.js:0: ' + usekey.k);

            console.log('background.js:0: source text length: ' + selected_text.length);
            var shorty_out = new Shorty();
            var compressed_plaintext = shorty_out.deflate(selected_text);

            console.log('background.js:0: compressed text: ' + compressed_plaintext);
            console.log('background.js:0: compressed text length: ' + compressed_plaintext.length);

            console.log('background.js:0: compressed text arraybuffer: ' + stringToArrayBuffer(compressed_plaintext));
            console.log('background.js:0: compressed text arraybuffer: ' + JSON.stringify(stringToArrayBuffer(compressed_plaintext)));
            console.log('background.js:0: compressed text arraybuffer: ' + stringToArrayBuffer(compressed_plaintext));

            return window.crypto.subtle.encrypt(algoEncrypt, key, stringToArrayBuffer(compressed_plaintext));

        }).then(function (cipherText) {

            encryptedText = cipherText;
            console.log('Cipher Text1: ' + arrayBufferToString(cipherText));
            console.log('background.js:secretKey 1' + secretKey);
            console.log('background.js:secretKey 1' + JSON.stringify(secretKey));
            return window.crypto.subtle.exportKey('jwk', secretKey);
        }).then(function (expkey) {
            console.log('background.js:secretKey 2' + secretKey);
            exportedKey = expkey.kgene
                console.log('key export: ' + JSON.stringify(expkey));
            exportedKey = expkey.k;
            return expkey.k;
        }).catch(e => {
            console.log('There has been a problem with your key export operation: ' + e.message);
        }).then(function (expkeybase64) {
            // carry on the rewriting

            // rewrite the base64 text to somethng that looks less
            // suspicious
            console.log("create psuedo_text from: " + usekey_uuid + ":" + _arrayBufferToBase64(encryptedText));
            var psuedo_text = convertBase64ToPsuedoText(usekey_uuid + ":" + _arrayBufferToBase64(encryptedText));

            console.log("psuedo_text: " + psuedo_text);
            console.log("psuedo_text(resolved: " + convertPsuedoTextToBase64(psuedo_text));

            // the replacement text is a concatenation of the cipher text
            // and additional referecens. These references are there to both
            // uniquely identify the text content as having been encrypted
            // by Glovebox and provide whatever information is required to
            // identify the key needed to decrypt it.

            // var replacement_text = new String("Glovebox:" + exported key
            // in base 64 + _arrayBufferToBase64(cipherText));

            // create the replacement text
            // replacement_text = replacement_text + ":Glovebox:" +
            // SHA1(exportedKey) + ":" + _arrayBufferToBase64(encryptedText)
            // + ":" + exportedKey + ":";
            replacement_text = replacement_text + ":Glovebox:" + psuedo_text + ':';

            console.log("usethiskey(uuid): " + usekey_uuid);

            console.log('Cipher Text (base64 enc): ' + _arrayBufferToBase64(encryptedText));
            console.log('Psuedo Text (base64 enc): ' + psuedo_text);
            console.log("###calling TextToCiphertext.js");

            // call out to the JS which will carry out the actual replacement.
            return browser.tabs.executeScript({
                file: "TextToCiphertext.js"
            });
        }).then(function (result) {
            console.log("background.js:onExecuted4: We made it ....");
            console.log("background.js:onExecuted4: result: " + result);
            console.log("backgroupd.js:onExecuted4:selected_text: " + selected_text);
            console.log("backgroupd.js:onExecuted4:replacement_text: " + replacement_text);
            return browser.tabs.query({
                active: true,
                currentWindow: true
            });
        }).then(function (tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                text_replacement_text: replacement_text,
                regex: selected_text
            });

        }).then(function (r) {
            // call to remove page listener
            console.log("###calling RemoveTabOnMessageListenerTextToCiphertext.js");

            browser.tabs.executeScript({
                file: "RemoveTabOnMessageListenerTextToCiphertext.js",
                allFrames: true
            });

        });

    });
}

function glovebox_pasteGloveboxOpenKeyToken() {

    console.log("background.js: glovebox-pasteGloveboxOpenKeyToken");
    // insert an importabe decryption token
    // suitable for use in a chat window


    indexedDB = window.indexedDB || window.webkitIndexedDB ||
        window.mozIndexedDB || window.msIndexedDB;

    var request = indexedDB.open("decryptionKeysDB", 1);
    request.onupgradeneeded = function (event) {
        db = event.target.result;
        db.onerror = function (event) {};
        // Create an objectStore in this database to keep trusted decryption
        // keys
        console.log("background.js: create objectstore decryptionKeysStore in decryptionKeysDB");
        var objectStore2 = db.createObjectStore('decryptionKeysStore', {
                keyPath: 'keyId'
            });

        objectStore2.createIndex('keyId', 'keyId', {
            unique: true
        });
    };
    request.onerror = function (event) {
        console.log("background.js: dp open request error 201");
    };
    request.onsuccess = function (event) {
        db = event.target.result;
        db.onerror = function (event) {
            console.log("background.js: db open request error 2");
        };
        db.onsuccess = function (event) {
            console.log("background.js: db open request success 2");
        };
    };

    var request2 = indexedDB.open('encryptionKeysDB', 1);
    request2.onupgradeneeded = function (event) {
        db = event.target.result;
        db.onerror = function (event) {};
        // Create an objectStore in this database to keep trusted decryption
        // keys
        console.log("background.js: create objectstore encryptionKeysStore in encryptionKeysDB");
        var objectStore2 = db.createObjectStore('encryptionKeysStore', {
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

    //


    // generate a Globebox descryption token form the default encryption key
    var glovebox_key_token_openform = "";
    // getDefaultSecretKey
    getDefaultSecretKey().then(function (obj) {
        // use the key

        console.log("default key: " + JSON.stringify(obj));
        // Glovebox keytoken open
        // syntax:":CloveboxToken:<username>:<keyuuid>:<base64(decryptionkey)>:"
        // Glovebox keytoken open
        // sample:":CloveboxToken:username01@domain.org:asasd-bb-erw-w45gvs-5asd:fsdawwefwrwtgRgevWefsfsetg3563rgvegreRErgvE==:"


        glovebox_key_token_openform = ':GloveboxOpenKeyToken:username01@domain.org:' + obj.uuid + ':' + obj.key + ':';

        console.log("created token " + glovebox_key_token_openform);
        console.log("###calling PasteGloveboxOpenKeyToken.js");

        return browser.tabs.executeScript({
            file: "PasteGloveboxOpenKeyToken.js"
        });
    }).then(function (result) {
        console.log("backgroupd.js:onExecuted4:glovebox_key_token_openform: " + glovebox_key_token_openform);
        return browser.tabs.query({
            active: true,
            currentWindow: true
        });
    }).then(function (tabs) {
        browser.tabs.sendMessage(tabs[0].id, {
            PasteGloveboxOpenKeyToken_text: glovebox_key_token_openform
        });
    }).then(function (r) {
        // call to remove page listener
        console.log("###calling RemoveTabOnMessageListenerPasteTokenText.js");

        browser.tabs.executeScript({
            file: "RemoveTabOnMessageListenerPasteTokenText.js",
            allFrames: true
        });

    });
}

function DISABLEglovebox_removedecrypthtml() {
    console.log("glovebox-removedecrypthtml");
    indexedDB = window.indexedDB || window.webkitIndexedDB ||
        window.mozIndexedDB || window.msIndexedDB;

    // recreate datastore if needed - fix this later
    var request = indexedDB.open("decryptionKeysDB", 1);
    request.onupgradeneeded = function (event) {
        db = event.target.result;
        db.onerror = function (event) {};
        // Create an objectStore in this database to keep trusted decryption
        // keys
        console.log("background.js: create objectstore decryptionKeysStore in decryptionKeysDB");
        var objectStore2 = db.createObjectStore('decryptionKeysStore', {
                keyPath: 'keyId'
            });

        objectStore2.createIndex('keyId', 'keyId', {
            unique: true
        });
    };
    request.onerror = function (event) {
        console.log("background.js: dp open request error 201");
    };
    request.onsuccess = function (event) {
        db = event.target.result;
        db.onerror = function (event) {
            console.log("background.js: db open request error 2");
        };
        db.onsuccess = function (event) {
            console.log("background.js: db open request success 2");
        };
    };

    var request2 = indexedDB.open('encryptionKeysDB', 1);
    request2.onupgradeneeded = function (event) {
        db = event.target.result;
        db.onerror = function (event) {};
        // Create an objectStore in this database to keep trusted decryption
        // keys
        console.log("background.js: create objectstore encryptionKeysStore in encryptionKeysDB");
        var objectStore2 = db.createObjectStore('encryptionKeysStore', {
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

    // the selection likely contains only a part for the Glovebox text. Or
    // possibly more than the Glovebox text. Expand or narrow as required.

    // call out to the tab to get the complete text
    var glovebox_token_ciphertext = "";
    var replacement_html = "";
    // console.log("background.js:decrypt: call to GetHTML");
    console.log("###calling Get_GloveboxCiphertext.js");

    // execute script in active tab
    browser.tabs.executeScript({
        file: "Get_GloveboxCiphertext.js",
        allFrames: true
    }).then(
        function (result) {
        console.log("background.js:onExecuted: result: " + JSON.stringify(result));
        // query for the one active tab
        browser.tabs.query({
            active: true,
            currentWindow: true
        }).then(function (tabs) {
            // send message to the active tab
            browser.tabs.sendMessage(tabs[0].id, {
                GetGloveboxCiphertext: "Glbx_marker"
            }).then(function (res) {
                console.log("###### GetGloveboxCiphertext response " + JSON.stringify(res));
                glovebox_token_ciphertext = convertPsuedoTextToBase64(res.response.doc);
                console.log("###### glovebox_token_ciphertext " + glovebox_token_ciphertext);

                // which key to use for decryption

                // get info out of token
                const decryptkey_uuid_regex = new RegExp(':Glovebox:([^:]*):', 'm');

                // var decryptkey_uuid_regex = /:Glovebox:([^:]*):/g;
                var decryptkey_uuid = "";
                if ((match3 = decryptkey_uuid_regex.exec(glovebox_token_ciphertext)) != null) {
                    decryptkey_uuid = match3[1];
                    console.log("decryptkey id: " + decryptkey_uuid);
                }

                // get the deckryption key

                return loadFromIndexedDB('decryptionKeysDB', 'decryptionKeysStore', decryptkey_uuid);
            }).then(function (response) {
                console.log("got key object: " + response);
                console.log("got key object: " + JSON.stringify(response));

                var usekey = response.key_jwk;
                var keyUsages = [
                    'encrypt',
                    'decrypt'
                ];
                // import the key
                return window.crypto.subtle.importKey('jwk', usekey, {
                    name: 'AES-GCM'
                }, true, keyUsages);

            }).catch(function (status) {

                console.log("handle error when decryption key is not found ");

            }).then(function (key) {

                console.log("key imported, use it" + key);

                // which key to use for decryption
                var ciphertext_raw_regex = /:([^:]*):$/g;
                var ciphertext_raw = "";
                if ((match3 = ciphertext_raw_regex.exec(glovebox_token_ciphertext)) != null) {

                    console.log("###### getHTML response count " + match3.length);

                    var ciphertextlength = match3[0].length;
                    // :Glovebox:47b83c2c-5d3b-3823-2fc2-d8256aeb7f73:JfBMxr2rcjZwSogJfVU/SGBEv5igNXyakVdaLoohqN7V6M2mVW8Y2Xqjw13+ch1rVX7K16STX/4yktRsJnHImkQ3LynnTPpW7YnAEpt5AnfrDgNZxSH03dipy0CZDs7m/eJU+Fwvixw=:
                    console.log("start: " + match3.index);
                    // console.log("end: " + ciphertext_raw);
                    console.log("length: " + match3[0].length);

                    var text_end_pos = match3.index + match3[0].length;
                    var text_start_pos = match3.index;

                    ciphertext_raw = match3[0].substring(1, match3[0].length - 1);
                    console.log("######  ciphertext_raw: " + ciphertext_raw);

                }

                console.log('glovebox-decrypthtml:attempt to decrypt: ' + ciphertext_raw.replace(/[^\w\s\+=\/]/gi, ''));
                console.log('glovebox-decrypthtml:attempt to decrypt: ' + ciphertext_raw.replace(/[^\w\s\+=\/]/gi, '').length);
                console.log('glovebox-decrypthtml:attempt to decrypt: ' + ciphertext_raw);
                console.log('glovebox-decrypthtml:attempt to decrypt: ' + ciphertext_raw.length);

                return window.crypto.subtle.decrypt({
                    name: "AES-GCM",
                    iv: new Uint8Array(12)
                },
                    key, _base64ToArrayBuffer(ciphertext_raw.replace(/[^\w\s\+=\/]/gi, '')));
            }).then(function (compressed_plaintext) {

                console.log('the decryption operation completed OK');
                console.log('decrypted data: ' + compressed_plaintext);
                console.log("decrypted1: " + arrayBufferToString(compressed_plaintext));
                var shorty_2 = new Shorty();
                replacement_html = shorty_2.inflate(arrayBufferToString(compressed_plaintext));

                console.log("replacement text: " + replacement_html);

                // send the decrypted text back to the tab

                console.log("###calling CiphertextToHTML.js");

                // execute script in active tab
                return browser.tabs.executeScript({
                    file: "CiphertextToHTML.js",
                    allFrames: true
                });

            }).then(function (result) {

                return browser.tabs.query({
                    active: true,
                    currentWindow: true
                });
            }).then(function (tabs) {
                // send message to the active tab
                console.log("replace" + glovebox_token_ciphertext);
                console.log("with" + replacement_html);

                browser.tabs.sendMessage(tabs[0].id, {
                    ciphertext_replacement_html: replacement_html,
                    regex: glovebox_token_ciphertext
                });

            }).then(function (a) {
                console.log("###calling RemoveTabOnMessageListenerGetGloveboxCiphertext.js");
                browser.tabs.executeScript({
                    file: "RemoveTabOnMessageListenerGetGloveboxCiphertext.js",
                    allFrames: true
                });
            }).then(function (a) {
                console.log("###calling RemoveTabOnMessageListenerCiphertextToHTML.js");
                browser.tabs.executeScript({
                    file: "RemoveTabOnMessageListenerCiphertextToHTML.js",
                    allFrames: true
                });
            });

        }).then(function (responsefromtab) {

            console.log("background.js:decrypt: responsefromtab:" + responsefromtab);
        });

    });
}


// 

function glovebox_acceptdecryptiontoken_open() {
    console.log("background.js: glovebox-acceptdecryptiontoken_open");
    // accepts a decryption token of type "open", into the database
    // suitable for use in a chat window


    indexedDB = window.indexedDB || window.webkitIndexedDB ||
        window.mozIndexedDB || window.msIndexedDB;

    var request = indexedDB.open("decryptionKeysDB", 1);
    request.onupgradeneeded = function (event) {
        db = event.target.result;
        db.onerror = function (event) {};
        // Create an objectStore in this database to keep trusted decryption
        // keys
        console.log("background.js: create objectstore decryptionKeysStore in decryptionKeysDB");
        var objectStore2 = db.createObjectStore('decryptionKeysStore', {
                keyPath: 'keyId'
            });

        objectStore2.createIndex('keyId', 'keyId', {
            unique: true
        });
    };
    request.onerror = function (event) {
        console.log("background.js: dp open request error 201");
    };
    request.onsuccess = function (event) {
        db = event.target.result;
        db.onerror = function (event) {
            console.log("background.js: db open request error 2");
        };
        db.onsuccess = function (event) {
            console.log("background.js: db open request success 2");
        };
    };

    var request2 = indexedDB.open('encryptionKeysDB', 1);
    request2.onupgradeneeded = function (event) {
        db = event.target.result;
        db.onerror = function (event) {};
        // Create an objectStore in this database to keep trusted decryption
        // keys
        console.log("background.js: create objectstore encryptionKeys in gloveboxKeys");
        var objectStore2 = db.createObjectStore('encryptionKeysStore', {
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

    // execute script in active tab
    // colllect the token
    console.log("###calling AcceptToken_open.js");

    browser.tabs.executeScript({
        file: "AcceptToken_open.js",
        allFrames: true
    }).then(function (result) {
        console.log("background.js:onExecuted4: We made it ....");
        // console.log("background.js:onExecuted4: result: " + result);
        // console.log("backgroupd.js:onExecuted4:selected_text: " +
        // selected_text);
        // console.log("backgroupd.js:onExecuted4:replacement_text: " +
        // replacement_text);
        // query for the one active tab
        return browser.tabs.query({
            active: true,
            currentWindow: true
        });
    }).then(function (tabs) {
        // send message to the active tab
        return browser.tabs.sendMessage(tabs[0].id, {
            replacement: "Glovebox token read."
        });
    }).then(function (res) {
        console.log("###### getHTML response " + JSON.stringify(res));
        glovebox_token_ciphertext = res.response.token;

        // get info out of token
        var decryptkey_uuid_regex = /:GloveboxToken:[^:]*:([^:]*):/g;
        var decryptkey_uuid = "";
        var decryptkey_username_regex = /:GloveboxToken:([^:]*):/g;
        var decryptkey_username = "";
        var decryptkey_key_regex = /:GloveboxToken:[^:]*:[^:]*:([^:]*):/g;
        var decryptkey_key = "";
        if ((match3 = decryptkey_uuid_regex.exec(glovebox_token_ciphertext)) != null) {
            decryptkey_uuid = match3[1];
            console.log("###### getHTML decryptkey id: " + decryptkey_uuid);
        }
        if ((match3 = decryptkey_username_regex.exec(glovebox_token_ciphertext)) != null) {
            decryptkey_username = match3[1];
            console.log("###### getHTML decryptkey_username: " + decryptkey_username);
        }
        if ((match3 = decryptkey_key_regex.exec(glovebox_token_ciphertext)) != null) {
            decryptkey_key = match3[1];
            console.log("###### getHTML decryptkey_key: " + decryptkey_key);
        }

        newItem = {
            'keyId': decryptkey_uuid,
            "uuid": decryptkey_uuid,
            'jwk': {
                "alg": "A128GCM",
                "ext": true,
                "k": decryptkey_key,
                "key_ops": ['decrypt'],
                "kty": "oct"
            },
            "format": 'jwk',
            "username": decryptkey_username,
            "ext": true
        };

        // insert key into the database of trusted decryption keys
        saveToIndexedDB('decryptionKeysDB', 'decryptionKeysStore', 'keyId', newItem).then(function (response) {});

    });

}

function consume_GloveboxAcceptedSecureKeyOfferToken() {
    console.log("background.js: consume-GloveboxAcceptedSecureKeyOfferToken");

    var storedRefObject;
    var secretObject;
    var token_obj;
    var recipient_enc_privateKeyJwk;
    var recipient_enc_publicKeyJwk;
    var recipient_enc_publicKey;

    var sender_sign_privkey_jwk;
    var sender_sign_pubkey_jwk;
    var sender_sign_privkey_obj;
    var sender_sign_pubkey_obj;

    var token_message;
    var token_text;
    var secret;
    indexedDB = window.indexedDB || window.webkitIndexedDB ||
        window.mozIndexedDB || window.msIndexedDB;

    // execute script in active tab
    // colllect the token
    console.log("###calling Get_AcceptedGloveboxSecureKeyOfferToken.js");

    browser.tabs.executeScript({
        file: "Get_AcceptedGloveboxSecureKeyOfferToken.js",
        allFrames: true
    }).then(function (result) {
        console.log("background.js:onExecuted4: We made it ....");
        // console.log("background.js:onExecuted4: result: " + result);
        // console.log("backgroupd.js:onExecuted4:selected_text: " +
        // selected_text);
        // console.log("backgroupd.js:onExecuted4:replacement_text: " +
        // replacement_text);
        // query for the one active tab
        return browser.tabs.query({
            active: true,
            currentWindow: true
        });
    }).then(function (tabs) {
        // send message to the active tab
        return browser.tabs.sendMessage(tabs[0].id, {
            AcceptedGloveboxSecureKeyOfferToken_replacement: "Glovebox token read.",
            remove: "true"
        });
    }).then(function (res) {
        // read in the token text
        console.log("###### getHTML response " + JSON.stringify(res));
        glovebox_token_ciphertext = res.response.token;
        console.log("token ciphertext: " + glovebox_token_ciphertext.replace(/:GloveboxAcceptedSecureKeyOfferToken:(.*):/, '$1'));
        // start decoding and decryting the token
        console.log("token ciphertext: " + _base64ToArrayBuffer(glovebox_token_ciphertext.replace(/:GloveboxAcceptedSecureKeyOfferToken:(.*):/, '$1')));

        var shorty_51 = new Shorty();

        var t = shorty_51.inflate(ab2str(_base64ToArrayBuffer(glovebox_token_ciphertext.replace(/:GloveboxAcceptedSecureKeyOfferToken:(.*):/, '$1'))));
        token_plaintext = t.replace(/}:[^}]*$/, '}');
        console.log("GloveboxAcceptedSecureKeyOfferToken plaintext: " + token_plaintext);

        token_obj = JSON.parse(token_plaintext);

        offerRefId = token_obj.refId;
        requestedKeyId = token_obj.offeredKeyId;

        console.log("token publicKey value: " + token_obj.recipient_enc_pubkey);

        // assemble a public key JWK with includes the key ("n") from the
        // received token

        recipient_enc_publicKeyJwk = {
            "alg": 'RSA-OAEP-256',
            "e": "AQAB",
            "ext": true,
            "key_ops": [
                'encrypt'
            ],
            "kty": "RSA",
            "n": token_obj.recipient_enc_pubkey.trim()
        }

        console.log("token publicKeyJwk: " + token_obj.recipient_enc_pubkey);

        var signatureStr = t.replace(/^.*}/, '').replace(/^:*/, '');

        console.log("token signatureStr: " + signatureStr);
        var message;
        message = '{"refId":"' + token_obj.refId + '","offeredKeyId":"' + token_obj.offeredKeyId + '","enc_pubkey":"' + recipient_enc_publicKeyJwk.n + '"}';

        var st = JSON.parse('{"s":"' + signatureStr + '"}');
        console.log("##### verified message:" + token_plaintext);

        console.log("import pubkey value:" + token_obj.recipient_enc_pubkey);
        console.log("encrypt with recipient own pubkey JWK:" + JSON.stringify(recipient_enc_publicKeyJwk));

        return window.crypto.subtle.importKey(
            'jwk', recipient_enc_publicKeyJwk, {
            name: "RSA-OAEP",
            hash: {
                name: "SHA-256"
            },
        },
            true,
            ['encrypt']);

    }).then(function (g) {
        // console.log(g);
        recipient_enc_publicKey = g;
        // console.log("use this: " + JSON.stringify(token_obj));

        return loadFromIndexedDB('createdKeyOffersDB', 'createdKeyOffersStore', token_obj.refId);

        // check the refid in token_obj

    }).then(function (refObj) {
        storedRefObject = refObj;

        console.log("refObj: " + JSON.stringify(storedRefObject));
        // check if object was returned and if it is a match on the token.

        console.log("refId from token: " + JSON.stringify(token_obj.refId));
        console.log("refId from database: " + JSON.stringify(refObj.refId));

        // if match, proceed with retrieveing key from database


        // return loadFromIndexedDB('encryptionKeys', 'encryptionKeys',
        // requestedKeyId);
        if (token_obj.refId == refObj.refId) {
            // proceed
            console.log("secretObject: " + JSON.stringify(secretObject));

        } else {
            // terminate here with a jump forward to the next "catch"
            // statement
            throw "false";
        }

        console.log("encrypt this: " + token_obj.requestKeyId);

        console.log("12");
        return loadFromIndexedDB('encryptionKeysDB', 'encryptionKeysStore', storedRefObject.offeredKeyId);

    }).then(function (a) {

        console.log("secretkey value to be encrypted: " + a.jwk.k);

        console.log("using: ");
        console.log(recipient_enc_publicKey);
        let enc = new TextEncoder();

        let encoded = enc.encode(a.jwk.k);

        return window.crypto.subtle.encrypt({
            name: 'RSA-OAEP',
        },
            recipient_enc_publicKey,
            encoded);

    }).then(function (b) {
        console.log("encrypted: " + b);
        console.log("encrypted: " + ab2str(b));
        console.log("encrypted: " + _arrayBufferToBase64(b));
        secret = _arrayBufferToBase64(b);

        // get the same signing key from the local database that was used in
        // the original offer.

        return loadFromIndexedDB('createdKeyOffersDB', 'createdKeyOffersStore', token_obj.refId);

    }).then(function (b) {

        console.log("offer object: " + JSON.stringify(b));

        var sender_sign_privkey_jwk;
        var sender_sign_pubkey_jwk;

        sender_sign_pubkey_jwk = b.sign_pubkey;
        sender_sign_privkey_jwk = b.sign_privkey;
        // assemble the message which will constitute the token

        token_message = '{"refId":"' + token_obj.refId + '","keyId":"' + token_obj.requestKeyId + '","enc_key":"' + secret + '"}'

            console.log("token_message: " + token_message);

        return sign(sender_sign_privkey_jwk, token_message);

    }).then(function (sigreq) {

        // create GloveboxSecureKeyTokenFromAcceptedOfferToken token

        console.log("calling Paste_GloveboxSecureKeyTokenFromAcceptedOfferToken");

        requestSignature = sigreq;
        console.log("##### signed request message signature:" + sigreq);

        return browser.tabs.executeScript({
            file: "Paste_GloveboxSecureKeyTokenFromAcceptedOfferToken.js"
        });
    }).then(function (result) {

        return browser.tabs.query({
            active: true,
            currentWindow: true
        });
    }).then(function (tabs) {

        var shorty_7 = new Shorty();

        console.log("backgroupd.js: token_text: " + token_message + ":" + requestSignature);

        var token_text = ':GloveboxSecureKeyTokenFromAcceptedOfferToken:' + _arrayBufferToBase64(str2ab(shorty_7.deflate(token_message + ":" + requestSignature))) + ':';

        console.log("backgroupd.js: token_text: " + token_text);

        browser.tabs.sendMessage(tabs[0].id, {

            Paste_GloveboxSecureKeyTokenFromAcceptedOfferToken_text: token_text
        });

    }).catch(function (error) {
        console.log("error: " + error);

        // "String contains an invalid character"
        // "not found"

    });
}


function skinny_lookup(url, info){
	console.log("#start: skinny_lookup: " + url);
	var  true_destination_url = "";
	  var xhr = new XMLHttpRequest();
      // mark "false" to indicate synchronous
      try {
          xhr.open('HEAD', url, false);
          // request plain text return to look for http-based redirects too
          //     xhr.responseType = 'blob';
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
          //console.log(xhr);
          console.log(e);
      }
      
      try{
     
	  return  true_destination_url;
      } catch (e) {
          //console.log(xhr);
          console.log(e);
      }
	
}

// receive notice when user rightclick on a link and selects "reveal the true endpoint of URL"

// make call back to page script to run additonal code


function reveal_true_url_endpoint(info,tab) {
	  console.log("#start: reveal_true_url_endpoint");
	   console.log(info);
       console.log(tab);
       
	  console.log("###calling ");
	  console.log(destination_url_rules);
	  
	  
	  // information on which link was selected, use this to correctly identify it in the content script.
	  
	  var tabId = tab.id;
	  var frameId = info.frameId;
	  var targetElementId = info.targetElementId;

	  var linkUrl = info.linkUrl;
	  var linkText = info.linkText;
	  
	  

	   console.log("urlendpoint: " + info.linkUrl );
	   console.log("tabId: " + tabId );

	   console.log("page: " + info.pageUrl );

	  var true_destination_url = "";
	  
	  // setup a ruleset. With some default values and adilito for user to configure automatic behaviour.

	  
	  var new_url = info.linkUrl;
      console.log("#### " + new_url);
      new_url = rules_enforcement(info.pageUrl , new_url);
      console.log("#### " + new_url);
    //  console.log("ruleHit: " + ruleHit);
      // if the rules caused the URL to be changed, there might also be rules governing the new URL, so run through it again.


      new_url = rules_enforcement(info.pageUrl ,new_url);
      console.log("#### " + new_url);

      // Call the URL by default if not rules applies to the URL.
      // If the URL has not been changed, assume no rule pertained to it, so look it up directly.


      //console.log(linkUrl);
      //console.log("#### " + new_url);
	  
	  

	   //console.log("true_destination_url: " + true_destination_url );

	   
	   // check linkURL against URL
	   
	   
	   // send message back to the content script with this info
	   
      
        
      getRedirectUrl(new_url).then(function(url){

    	  // verify that the URL satify the minimum requirements
    	  var url_wellformed_regexp = /.*/i;
    	  
    	  //console.log(url_wellformed_regexp);
    	  //console.log("url_wellformed_regexp.text("+url+"): " + url_wellformed_regexp.test(url));
    	  if (url.length > 9 && url_wellformed_regexp.test(url) ) {
    		  true_destination_url = url;
    	  }else{
    		  true_destination_url = new_url;
    	  }
    	  
    	// make attempt to clean the URL returned. In case of URL shorteners, any manner of "villany" may be lurking
    	  true_destination_url = destination_rules_enforcement(true_destination_url);
    	   

    	  
	  return browser.tabs.executeScript( tabId, {
	        file: "RevealUrl.js",
	        frameId: frameId
	    });
	  
      }).then(function (result) {
	     
	        // query for the one active tab
	        return browser.tabs.query({
	            active: true,
	            currentWindow: true
	        });

	       	        	
	        
	    }).then(function (tabs) {
	    	console.log(tabs);
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
	   //     console.log("###### getHTML response " + JSON.stringify(res));
	   //     glovebox_token_ciphertext = res.response.token;
	      
	    });
	  
	  
	  
}



function getRedirectUrl(url) {
  //  console.log("##### getRedirectUrl.start: " + url);
    try {
        var p = new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('HEAD', url, true);
                xhr.responseType = 'blob';
                xhr.onload = function () {
                    //resolve(xhr.response);
                    var reader = new FileReader();
                    console.log(xhr.response);
                    console.log(xhr);

                    // check for a Location HTTP header in the response
                    // console.log(xhr.responseURL);

                    var redirectURL = "";

                    redirectURL = xhr.responseURL;
                    // consider also looking for a html-based redirect in the body of the retruend document.

                    // consider making this recursive, by calling the redirect URL to see if it results in another redirect


                    reader.readAsDataURL(xhr.response);
                    reader.onload = function (e) {

                        resolve(redirectURL);

                    };

                };

                xhr.onerror = () => reject(xhr.statusText);
                xhr.send();
            });
        console.log(p);
        return p;
    } catch (e) {
        console.log(e);
    }
}


function rules_enforcement(sourcePageUrl,url) {
    var new_url = url;
    // start with source-based rules.
    // these are rules based on the the url of the "page" where the links are located.
    console.log("#source based rewriting");
    //  new_url = circumstantial_rules_enforcement(window.location.href, new_url,source_url_rules,source_fulldomain_rules,source_domain_rules);
    new_url = circumstantial_rules_enforcement(sourcePageUrl, new_url, source_url_rules, source_fulldomain_rules, source_domain_rules);
    console.log(new_url);

    // then do destination-based rules
    // note that this is in addition to any changes made above.
    console.log("#destination based rewriting");

    new_url = circumstantial_rules_enforcement(new_url, new_url, destination_url_rules, destination_fulldomain_rules, destination_domain_rules);
    console.log(new_url);
    return new_url;
}

function destination_rules_enforcement(url) {
    var new_url = url;
    // then do destination-based rules
    // note that this is in addition to any changes made above.
    console.log("#destination based rewriting");

    new_url = circumstantial_rules_enforcement(url, url, destination_url_rules, destination_fulldomain_rules, destination_domain_rules);
    console.log(new_url);
    return new_url;
}


function circumstantial_rules_enforcement(location, linkurl, url_rules, fulldomain_rules, domain_rules) {
    var new_url = "";
    // fall-back is to simply return the submitted value
    new_url = linkurl;
    // look for applicable rules using the value of "location" as referece, apply rules to the URL in "linkurl"

    console.log(location);
    console.log(linkurl);
    console.log(url_rules);
    console.log(fulldomain_rules);
    console.log(domain_rules);

    // use this to lookup any rules that may apply to this url
    var protocoldomainportpath = "";
    protocoldomainportpath = location.replace(/^(http[s]*:\/\/)([^\/]*\/)([^\?]*).*/i, '$1$2$3');
    //console.log("# checking current url (" + protocoldomainportpath + ") against url-specific rules.");
    //console.log(url_rules);
    var rewrite_steps_for_this_URL = [];
    var rewrite_stepcount_for_this_URL = 0;
    try {
        rewrite_steps_for_this_URL = url_rules[protocoldomainportpath];
        if (rewrite_steps_for_this_URL) {
            if (rewrite_steps_for_this_URL.length > 0) {
                rewrite_stepcount_for_this_URL = rewrite_steps_for_this_URL.length;
            }
        }
        // console.log("url was found in url-specfic rule store");
        // console.log(rewrite_step_count_for_this_URL);
    } catch (e) {
        // console.log("url not round in url-specfic rule store");
        rewrite_stepcount_for_this_URL = 0;
    }

    // lookup rules for this location fulldomain

    var protocolfulldomainport = "";
    protocolfulldomainport = location.replace(/^(http[s]*:\/\/)([^\/]*\/)([^\?]*).*/i, '$1$2');

    console.log("# checking current fulldomain (" + protocolfulldomainport + ") against fulldomain-specific rules:  (" + ")");
    // console.log(domain_rules);
    var rewrite_steps_for_this_fulldomain = [];
    var rewrite_stepcount_for_this_fulldomain = 0;

    // var source_based_rewrite_step_count_for_this_domain = 0;
    try {
        rewrite_steps_for_this_fulldomain = fulldomain_rules[protocolfulldomainport];
        //console.log(rewrite_steps_for_this_fulldomain);
        if (rewrite_steps_for_this_fulldomain) {
            //console.log(rewrite_steps_for_this_fulldomain.length);
            if (rewrite_steps_for_this_fulldomain.length > 0) {
                rewrite_stepcount_for_this_fulldomain = rewrite_steps_for_this_fulldomain.length;
                //console.log(rewrite_stepcount_for_this_fulldomain) ;
                //console.log("url was found in domain-specfic source rule store");
            }
        }
    } catch (e) {
        //console.log("url not found in domain-specfic rule store");
        source_based_rewrite_stepcount_for_this_fulldomain = 0;
        //console.log(source_based_rewrite_steps_for_this_fulldomain) ;
    }

    // lookup rules for this location domain ("top"-level example domain.com ) ignoring the first word in the fully qualified domain name

    var domainport = "";
    domainport = location.replace(/^http[s]*:\/\/[^\.]*\.([^\/]*)\/([^\?]*).*/i, '$1');

    console.log("# checking current domain (" + domainport + ") against domain-specific rules:  (" + ")");
    // console.log(domain_rules);
    var rewrite_steps_for_this_domain = [];
    var rewrite_stepcount_for_this_domain = 0;

    // var source_based_rewrite_step_count_for_this_domain = 0;
    try {
        rewrite_steps_for_this_domain = domain_rules[domainport];
        //console.log(rewrite_steps_for_this_fulldomain);
        if (rewrite_steps_for_this_domain) {
            //console.log(rewrite_steps_for_this_fulldomain.length);
            if (rewrite_steps_for_this_domain.length > 0) {
                rewrite_stepcount_for_this_domain = rewrite_steps_for_this_domain.length;
                //console.log(rewrite_stepcount_for_this_fulldomain) ;
                //console.log("url was found in domain-specfic source rule store");
            }
        }
    } catch (e) {
        //console.log("url not found in domain-specfic rule store");
        source_based_rewrite_stepcount_for_this_domain = 0;
        //console.log(source_based_rewrite_steps_for_this_fulldomain) ;
    }

    console.log("URL based ("+protocoldomainportpath+") rewrite rule step count: " + rewrite_stepcount_for_this_URL);
    console.log(rewrite_steps_for_this_URL);
    console.log("fulldomain based ("+protocolfulldomainport+") rewrite rule step count: " + rewrite_stepcount_for_this_fulldomain);
    console.log(rewrite_steps_for_this_fulldomain);
    console.log("domain based ("+domainport+") rewrite rule step count: " + rewrite_stepcount_for_this_domain);
    console.log(rewrite_steps_for_this_domain);

    if (rewrite_stepcount_for_this_URL > 0) {
        //console.log("#### there were some URL rule(s)");
        new_url = execute_rule_set(rewrite_steps_for_this_URL, linkurl);
    } else {
        // no url-specific rules found, look for fulldomain specific rules
        // anything for the fully qualified domain ?
        if (rewrite_stepcount_for_this_fulldomain > 0) {
            new_url = execute_rule_set(rewrite_steps_for_this_fulldomain, linkurl);
        } else {
            // no fulldomain source rules either
            // anything for the domain ?
            if (rewrite_stepcount_for_this_domain > 0) {
                new_url = execute_rule_set(rewrite_steps_for_this_domain, linkurl);
            } else {
                // no domain source rules either
            }
        }
    }
    return new_url;
}

function execute_rule_set(rule_set, url) {
    console.log("execute_rule_set");
    console.log(rule_set);
    var new_url = "";
    new_url = url;
    for (let m = 0; m < rule_set.length; m++) {
        new_url = execute_rule_step(rule_set[m], new_url);
    }
    return new_url;
}

function execute_rule_step(rule_step, url) {
    console.log("execute_rule_step");
    var new_url = "";
    new_url = url;
    console.log("apply step: " + rule_step + " to " + new_url);

    // syntax is STEP NAME ( PARAMETER VALUE)
    var step_name = ""
        var parameter_value = "";

    step_name = rule_step.replace(/\(.*$/i, '').replace(/^ */i, '');
    var param_regexp = /\(/;
    if (param_regexp.test(rule_step)) {
        parameter_value = rule_step.replace(/[^(]*\(/i, '').replace(/\) *$/i, '');
    }
    console.log("step_name: " + step_name);
    console.log("parameter_value: " + parameter_value);
    switch (step_name) {
    case 'regexp':
        // make allowances for g and i settings
        // Parse parameter which follows the sed-syntax
        // This means that the second character is the delimiter
        var delimiter = "";
        delimiter = parameter_value.replace(/^s(.).*/i, '$1');
        var flags_ext = new RegExp("[s]*" + delimiter + "[^" + delimiter + "]*" + delimiter + "[^" + delimiter + "]*" + delimiter + "(.*)$");
        var flags = "";
        flags = parameter_value.replace(flags_ext, '$1').replace(/ /g, '');
        //console.log("flags_ext: " + flags_ext);
        //console.log("flags: " + flags);
        var pattern_ext = new RegExp("[s]*" + delimiter + "([^" + delimiter + "]*)" + delimiter + ".*$");
        var pattern = "";
        pattern = parameter_value.replace(pattern_ext, '$1');
        //console.log("pattern_ext: " + pattern_ext);
        //console.log("pattern: " + pattern);
        var val_ext = new RegExp(".*" + delimiter + "([^" + delimiter + "]*)" + delimiter + "[ gi]*$");
        var val = "";
        val = parameter_value.replace(val_ext, '$1');
        //console.log("val_ext: " + val_ext)
        //console.log("val: " + val)
        //console.log(new RegExp(pattern, flags));
        new_url = new_url.replace(new RegExp(pattern, flags), val);
        break;
    case 'qs_param':
        console.log(new_url);
        console.log("get query string parameter");
        var u = "";
        // remove everything infront of and behind the parameter
        var reg_exp2 = new RegExp(".*[?&]" + parameter_value + "=([^&]*).*");
        console.log(reg_exp2);
        u = new_url.replace(reg_exp2, '$1');
        console.log(u);
        // remove everything infront of the parameter
        //var reg_exp1 = new RegExp(".*[\?&]" + parameter_value + "=([^&]*)$");
        //	console.log(reg_exp1);
        //	console.log(u);
        //	u = url.replace(reg_exp1, '$1' );
        //new_url = url_rewrite_step_qs_param(new_url, parameter_value);
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
        // lookup the URL and if it returns a HTTP 403 redirect and a Location header, insert that.
        // Itterate up to three times incase on redirect leads to another.
        console.log("lookup the URL without revealing anything");
        //new_url = parameter_value;
        break;
    default:
    }

    return new_url;

}




function consume_GloveboxSecureKeyTokenFromAcceptedOfferToken() {

    var t;
    var offerRefId;
    var requestedKeyId;
    var offeredKeyId;
    var counterpartyKeyNValue;
    var token_obj;
    var offerPersistentReferenceObj;
    var sender_sign_pubkey_jwk;
    var sender_sign_pubkey_obj;

    var sender_secretkey_n;

    indexedDB = window.indexedDB || window.webkitIndexedDB ||
        window.mozIndexedDB || window.msIndexedDB;

    // execute script in active tab
    // colllect the token
    console.log("###calling Get_GloveboxSecureKeyTokenFromAcceptedOfferToken.js");

    browser.tabs.executeScript({
        file: "Get_GloveboxSecureKeyTokenFromAcceptedOfferToken.js",
        allFrames: true
    }).then(function (result) {
        console.log("background.js:onExecuted4: We made it ....");

        // query for the one active tab
        return browser.tabs.query({
            active: true,
            currentWindow: true
        });
    }).then(function (tabs) {
        // send message to the active tab
        return browser.tabs.sendMessage(tabs[0].id, {
            Get_GloveboxSecureKeyTokenFromAcceptedOfferToken_replacement: "Glovebox token read.",
            remove: "true"
        });
    }).then(function (res) {
        console.log("###### getHTML response " + JSON.stringify(res));
        glovebox_token_ciphertext = res.response.token;
        console.log("token ciphertext: " + glovebox_token_ciphertext.replace(/:GloveboxSecureKeyTokenFromAcceptedOfferToken:(.*):/, '$1'));
        // start decoding and decryting the token
        // console.log("token ciphertext: " +
        // _base64ToArrayBuffer(glovebox_token_ciphertext.replace(/:GloveboxSecureRequestFromOfferToken:(.*):/,
        // '$1')));

        // console.log("token decompressedtext: " +
        // ab2str(_base64ToArrayBuffer(glovebox_token_ciphertext.replace(
        // /:GloveboxSecureRequestFromOfferToken:(.*):/, '$1' ))));
        var shorty_81 = new Shorty();

        // console.log("token inflated ciphertext: " +
        // shorty_81.inflate(ab2str(_base64ToArrayBuffer(glovebox_token_ciphertext.replace(
        // /:GloveboxSecureRequestFromOfferToken:(.*):/, '$1' )))));
        // console.log("token plaintext: " +
        // shorty_51.inflate(ab2str(_base64ToArrayBuffer(glovebox_token_ciphertext.replace(
        // /:GloveboxSecureOfferToken:(.*):/, '$1' )))));

        t = shorty_81.inflate(ab2str(_base64ToArrayBuffer(glovebox_token_ciphertext.replace(/:GloveboxSecureKeyTokenFromAcceptedOfferToken:(.*):/, '$1'))));
        token_message = t.replace(/}:[^}]*$/, '}');
        console.log("GloveboxSecureKeyTokenFromAcceptedOfferToken plaintext: " + token_message);

        // at this point we have the keys in the token in encrypted form


        token_obj = JSON.parse(token_message);

        offerRefId = token_obj.refId;
        // requestedKeyId = token_obj.requestKeyId;

        // lookin the databse for a record of this key having being
        // accepted,
        // and use the public key of the server stored from the original key
        // offer to verify the signature

        return loadFromIndexedDB('acceptedKeyOffersDB', 'acceptedKeyOffersStore', token_obj.refId);

    }).then(function (refobj) {
        offerPersistentReferenceObj = refobj;
        console.log("ref obj: " + JSON.stringify(offerPersistentReferenceObj));

        if (token_obj.refId == offerPersistentReferenceObj.refId) {
            // the reference id in the token was found in the database of
            // accepted key offers
            console.log("1");
            counterpartyKeyNValue = offerPersistentReferenceObj.sender_sign_publicKey;
            offeredKeyId = offerPersistentReferenceObj.offeredKeyId;

        } else {
            console.log("2");
            // if nothing found, throw error and exit

            throw "no ref match found";
        }

        console.log("token obj: " + JSON.stringify(token_obj));

        counterpartyPublicKeyJwk = {
            "alg": "RS1",
            "e": "AQAB",
            "ext": true,
            "key_ops": ['verify', 'sign'],
            "kty": "RSA",
            "n": counterpartyKeyNValue
        };

        // proceed to verify signature
        console.log("token obj: " + JSON.stringify(token_obj));
        console.log("t: " + t);
        var signatureStr = t.replace(/^.*}/, '').replace(/^:*/, '');

        console.log("token signatureStr: " + signatureStr);

        console.log("token sign verification key: " + JSON.stringify(counterpartyPublicKeyJwk));

        var st = JSON.parse('{"s":"' + signatureStr + '"}');
        console.log("##### verify message:" + token_message);
        console.log("##### verify signature:" + signatureStr);

        console.log("##### verify signature:" + st.s);
        console.log("##### counterparty public key jwk:" + counterpartyPublicKeyJwk);
        console.log("##### counterparty public key:" + JSON.stringify(counterpartyPublicKeyJwk));
        return verify(counterpartyPublicKeyJwk, signatureStr, token_message);

    }).catch(function (err) {
        console.error(err);
        return;
    }).then(function (c) {
        console.log("verified: " + c);
        if (c) {
            console.log("verified: OK to proceed");
            // look to database of accepted key offers for the private key
            // to be used to decrypt the secret key
            //

            console.log(JSON.stringify(offerPersistentReferenceObj));
            console.log(JSON.stringify(offerPersistentReferenceObj.enc_privkey));

        } else {
            console.log("verified: failed, terminate here.");
            throw "signature_failed"
        }

        // import a privatekey for use in decryption
        return window.crypto.subtle.importKey(
            'jwk', offerPersistentReferenceObj.enc_privkey, {
            name: 'RSA-OAEP',
            hash: {
                name: 'SHA-256'
            },
        },
            true,
            ['decrypt']);

    }).then(function (ownPrivateKeyObj) {
        console.log(ownPrivateKeyObj);

        console.log("decrypting: " + _base64ToArrayBuffer(token_obj.enc_key));
        console.log("using: " + ownPrivateKeyObj);
        // console.log("using: " + JSON.stringify(ownPrivateKeyObj));

        // decrypt with private key
        let enc = new TextEncoder();
        // let encoded = enc.encode(token_obj.enc_key);
        let encoded = _base64ToArrayBuffer(token_obj.enc_key);

        return window.crypto.subtle.decrypt({
            name: "RSA-OAEP",
        },
            ownPrivateKeyObj,
            encoded);

    }).then(function (plaintext) {
        // ready to proceed wit hdecryption of the decryption key sent over
        console.log("token key plaintext: " + plaintext);

        let utf8decoder = new TextDecoder(); // default 'utf-8' or 'utf8'
        console.log(utf8decoder.decode(plaintext));

        sender_secretkey_n = utf8decoder.decode(plaintext);
        // compose decryption key object and insert into database

        // uuid should be unique to an individual key and follow the key around.

        var keyid = "22" + offeredKeyId;
        var newitem;
        newItem = {
            'keyId': keyid,
            "uuid": offeredKeyId,
            "key": sender_secretkey_n,
            'jwk': {
                "alg": "A128GCM",
                "ext": true,
                "k": sender_secretkey_n,
                "key_ops": ['decrypt'],
                "kty": "oct"
            },
            "format": 'jwk',
            "username": "not_implemented",
            "ext": true
        };

        console.log("adding descryption key object: " + newitem);

        saveToIndexedDB('decryptionKeysDB', 'decryptionKeysStore', 'keyId', newItem);

    }).catch(function (err) {
        console.error(err);

    });
}

// By key Sender
// paste in the text containing a secure key offer
// the recipient is free to accept or reject the offer.
// The offer is rejected by simply ignoring it.
// to accept the offer, the recipient (or counterparty) responds with signed
// offer accepted token.
// The offer accepted token contains the offer refference id, the key ID and
// the public key of the recipient.


function paste_GloveboxSecureKeyOfferToken() {

    // place a glovebox token that contains an offer to send a specified
    // decryption token.
    // It contains the public key of the sender and the encryption key
    // reference; both are signed by the senders private key.

    // structure of the signed text is
    // uuId of key being offered:OfferReferenceId:Publickey of signer


    // The recipient of the token accepts the offer by responding with an
    // Accept Offer token.
    // The Accept Offer token is signed with the private key of the
    // recipient.


    indexedDB = window.indexedDB || window.webkitIndexedDB ||
        window.mozIndexedDB || window.msIndexedDB;

    // do_db_setup();


    // create key pair

    var defaultEncryptionKeyId;
    var privateKeyJwk;

    var offeredKeyId;

    var signatureStr;
    var publicKeyJwk;
    var signingKeyPair;
    var textToSign = "encryptionkeyreference:";

    var sign_privkey;
    var sign_pubkey;

    var token_text;
    // generates random id;
    let guid = () => {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
    var id = guid();
    var offerRefId = id;

    // generate public-private key pair suitable for signing.

    window.crypto.subtle.generateKey({
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 1024,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: {
            name: "SHA-1"
        },
    },
        true,
        ['sign', 'verify']).then(function (key) {
        // secretKey = key;
        testkeypairobj = key;
        console.log('navigate-collection.js:generate_encryption_key');
        // make key into exportable form
        return window.crypto.subtle.exportKey('jwk', testkeypairobj.publicKey);
    }).then(function (expkey) {
        console.log("2");
        sign_pubkey = expkey;
        console.log('navigate-collection.js: expkey: ' + JSON.stringify(expkey));

        console.log("22");
        return window.crypto.subtle.exportKey('jwk', testkeypairobj.privateKey);
    }).then(function (c) {
        console.log("3");
        sign_privkey = c;

        return loadFromIndexedDB('encryptionKeysDB', 'encryptionKeysStore', 'defaultSecretKey');
    }).then(function (defaultenckey) {
        offeredKeyId = defaultenckey.uuid;

        // token_text = ':GloveboxToken:' + '{"refId":' + offerRefId +
        // ',"offeredKeyId":' + offeredKeyId + '}:' + b;

        console.log("##### signing pubkey:" + JSON.stringify(sign_pubkey));
        console.log("##### signing privkey:" + JSON.stringify(sign_privkey));

        textToSign = '{"refId":"' + offerRefId + '","offeredKeyId":"' + offeredKeyId + '","sign_pubkey":"' + sign_pubkey.n + '"}';

        console.log("##### signed message:" + textToSign);

        return sign(sign_privkey, textToSign);

    }).then(function (b) {

        console.log("signed: " + b.typeof);
        console.log("signed: " + JSON.stringify(b));

        signatureStr = b;

        var createtime = new Date();

        // now write to db all relevant inof about this offer
        newItem = {
            "refId": offerRefId,
            "offeredKeyId": offeredKeyId,
            "createTime": createtime,
            'jwk': {
                "alg": "A128GCM",
                "ext": true,
                "key_ops": ['decrypt'],
                "kty": "oct"
            },
            "textToSign": "textToSign",
            "format": "text",
            "sign_privkey": sign_privkey,
            "sign_pubkey": sign_pubkey,
            "recipientusername": "test"
        };

        token_text = textToSign + ":" + signatureStr;

        console.log("verified: " + token_text);
        console.log("verified: " + _arrayBufferToBase64(stringToArrayBuffer(token_text)));

        console.log("verified: " + ab2str(str2ab(token_text)));

        var shorty_2 = new Shorty();
        console.log("verified: " + _arrayBufferToBase64(str2ab(shorty_2.deflate(token_text))));

        var shorty_3 = new Shorty();
        var shorty_4 = new Shorty();

        console.log("verified: " + shorty_3.inflate(ab2str(_base64ToArrayBuffer(_arrayBufferToBase64(str2ab(shorty_4.deflate('{"refId":"' + offerRefId + '","offeredKeyId":"' + offeredKeyId + '","sign_pubkey":"' + sign_pubkey.n + '"}' + ":" + signatureStr)))))));
        var shorty_6 = new Shorty();

        token_text = ':GloveboxSecureKeyOfferToken:' + _arrayBufferToBase64(str2ab(shorty_6.deflate('{"refId":"' + offerRefId + '","offeredKeyId":"' + offeredKeyId + '","sign_pubkey":"' + sign_pubkey.n + '"}' + ":" + signatureStr))) + ':';
        console.log("token plaintext: " + token_text);
        var shorty_5 = new Shorty();
        console.log("verified: 22");
        console.log("GloveboxSecureKeyOfferToken plaintext: " + shorty_5.inflate(ab2str(_base64ToArrayBuffer(token_text.replace(/:GloveboxSecureKeyOfferToken:(.*):/, '$1')))));

        console.log("writing offer to db> ");

        // insert key into the database of trusted decryption keys
        return saveToIndexedDB('createdKeyOffersDB', 'createdKeyOffersStore', 'refId', newItem);
    }).then(function (response) {
        console.log("###### textToSign:" + textToSign);
        console.log("###### signature:" + signatureStr);
        console.log("###### key:" + sign_pubkey);
        console.log("###### key:" + JSON.stringify(sign_pubkey));

        return verify(sign_pubkey, signatureStr, textToSign);
    }).then(function (c) {
        console.log("verified: " + c);
        console.log("###calling Paste_GloveboxSecureKeyOfferToken.js");
        return browser.tabs.executeScript({
            file: "Paste_GloveboxSecureKeyOfferToken.js"
        });
    }).then(function (result) {
        console.log("backgroupd.js: token_text: " + token_text);
        return browser.tabs.query({
            active: true,
            currentWindow: true
        });
    }).then(function (tabs) {
        browser.tabs.sendMessage(tabs[0].id, {
            Paste_GloveboxSecureKeyOfferToken_text: token_text
        });

    }).then(function (r) {
        // call to remove page listener
        console.log("###calling RemoveTabOnMessageListenerPasteTokenText.js");
        browser.tabs.executeScript({
            file: "RemoveTabOnMessageListenerPasteTokenText.js",
            allFrames: true
        });

    }).catch(function (error) {
        console.log("error: " + error);

        // "String contains an invalid character"
        // "not found"

    });
}

// Takes two parameters
// contenttype
// value: "html" (default)  and "text"

// duration
//value: "temp" and "perm" (default) 




function glovebox_decrypthtml(info,contenttype,duration) {

    console.log("glovebox-decrypthtml (info,"+contenttype+", "+duration+ ")");
    indexedDB = window.indexedDB || window.webkitIndexedDB ||
        window.mozIndexedDB || window.msIndexedDB;

    // recreate datastore if needed - fix this later
    var request = indexedDB.open("decryptionKeysDB", 1);
    request.onupgradeneeded = function (event) {
        db = event.target.result;
        db.onerror = function (event) {};
        // Create an objectStore in this database to keep trusted decryption
        // keys
        console.log("background.js: create objectstore decryptionKeys in gloveboxKeys");
        var objectStore2 = db.createObjectStore('decryptionKeysStore', {
                keyPath: 'keyId'
            });

        objectStore2.createIndex('keyId', 'keyId', {
            unique: true
        });
    };
    request.onerror = function (event) {
        console.log("background.js: dp open request error 201");
    };
    request.onsuccess = function (event) {
        db = event.target.result;
        db.onerror = function (event) {
            console.log("background.js: db open request error 2");
        };
        db.onsuccess = function (event) {
            console.log("background.js: db open request success 2");
        };
    };

    var request2 = indexedDB.open('encryptionKeysDB', 1);
    request2.onupgradeneeded = function (event) {
        db = event.target.result;
        db.onerror = function (event) {};
        // Create an objectStore in this database to keep trusted decryption
        // keys
        console.log("background.js: create objectstore encryptionKeys in gloveboxKeys");
        var objectStore2 = db.createObjectStore('encryptionKeysStore', {
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

    // the selection likely contains only a part for the Glovebox text. Or
    // possibly more than the Glovebox text. Expand or narrow as required.

    // call out to the tab to get the complete text
    var glovebox_token_ciphertext = "";
    var replacement_html = "";
 // ID of tab in use
    var tab_id = "";
    // console.log("background.js:decrypt: call to GetHTML");
    console.log("###calling Get_GloveboxCiphertext.js");

    // execute script in active tab
    browser.tabs.executeScript({
        file: "Get_GloveboxCiphertext.js",
        allFrames: true
    }).then(
        function (result) {
        console.log("background.js:onExecuted: result: " + JSON.stringify(result));
        // query for the one active tab
        browser.tabs.query({
            active: true,
            currentWindow: true
        }).then(function (tabs) {
        	tab_id = tabs[0].id;
            // send message to the active tab
            browser.tabs.sendMessage(tab_id, {
                GetGloveboxCiphertext: "Glbx_marker"
            }).then(function (res) {
                console.log("###### Get_GloveboxCiphertext response " + JSON.stringify(res));
                glovebox_token_ciphertext = convertPsuedoTextToBase64(res.response.doc);
                console.log("###### glovebox_token_ciphertext " + glovebox_token_ciphertext);

                // which key to use for decryption

                // get info out of token
                const decryptkey_uuid_regex = new RegExp(':Glovebox:([^:]*):', 'm');

                // var decryptkey_uuid_regex = /:Glovebox:([^:]*):/g;
                var decryptkey_uuid = "";
                if ((match3 = decryptkey_uuid_regex.exec(glovebox_token_ciphertext)) != null) {
                    decryptkey_uuid = match3[1];
                    console.log("decryptkey id: " + decryptkey_uuid);
                }

                // get the deckryption key

                return loadFromIndexedDB('decryptionKeysDB', 'decryptionKeysStore', decryptkey_uuid);
            }).then(function (response) {
                console.log("got key object: " + response);
                console.log("got key object: " + JSON.stringify(response));

                var usekey = response.key_jwk;
                var keyUsages = [
                    'encrypt',
                    'decrypt'
                ];
                // import the key
                return window.crypto.subtle.importKey('jwk', usekey, {
                    name: 'AES-GCM'
                }, true, keyUsages);

            }).catch(function (status) {

                console.log("handle error when decryotion key is not found ");

            }).then(function (key) {

                console.log("key imported, use it" + key);

                // which key to use for decryption
                var ciphertext_raw_regex = /:([^:]*):$/g;
                var ciphertext_raw = "";
                if ((match3 = ciphertext_raw_regex.exec(glovebox_token_ciphertext)) != null) {

                    console.log("###### getHTML response count " + match3.length);

                    var ciphertextlength = match3[0].length;
                    // :Glovebox:47b83c2c-5d3b-3823-2fc2-d8256aeb7f73:JfBMxr2rcjZwSogJfVU/SGBEv5igNXyakVdaLoohqN7V6M2mVW8Y2Xqjw13+ch1rVX7K16STX/4yktRsJnHImkQ3LynnTPpW7YnAEpt5AnfrDgNZxSH03dipy0CZDs7m/eJU+Fwvixw=:
                    console.log("start: " + match3.index);
                    // console.log("end: " + ciphertext_raw);
                    console.log("length: " + match3[0].length);

                    var text_end_pos = match3.index + match3[0].length;
                    var text_start_pos = match3.index;

                    ciphertext_raw = match3[0].substring(1, match3[0].length - 1);
                    console.log("######  ciphertext_raw: " + ciphertext_raw);

                }

                console.log('glovebox-decrypthtml:attempt to decrypt: ' + ciphertext_raw.replace(/[^\w\s\+=\/]/gi, ''));
                console.log('glovebox-decrypthtml:attempt to decrypt: ' + ciphertext_raw.replace(/[^\w\s\+=\/]/gi, '').length);
                console.log('glovebox-decrypthtml:attempt to decrypt: ' + ciphertext_raw);
                console.log('glovebox-decrypthtml:attempt to decrypt: ' + ciphertext_raw.length);

                return window.crypto.subtle.decrypt({
                    name: "AES-GCM",
                    iv: new Uint8Array(12)
                },
                    key, _base64ToArrayBuffer(ciphertext_raw.replace(/[^\w\s\+=\/]/gi, '')));
            }).then(function (compressed_plaintext) {

                console.log('the decryption operation completed OK');
                console.log('decrypted data: ' + compressed_plaintext);
                console.log("decrypted1: " + arrayBufferToString(compressed_plaintext));
                var shorty_2 = new Shorty();
                replacement_html = shorty_2.inflate(arrayBufferToString(compressed_plaintext));

                console.log("replacement html: " + replacement_html);

                // send the decrypted text back to the tab

                console.log("###calling CiphertextToPlaintext.js");

                // execute script in active tab
                return browser.tabs.executeScript({
                    file: "CiphertextToPlaintext.js",
                    allFrames: true
                });

            }).then(function (result) {

                // send message to the active tab
                console.log("replace" + glovebox_token_ciphertext);
                console.log("with: " + replacement_html);

                browser.tabs.sendMessage(tab_id, {
                    ciphertext_replacement: replacement_html,
                    regex: glovebox_token_ciphertext,
                    contenttype: contenttype,
                    duration: duration
                    
                });

         //   }).then(function (a) {
        //        console.log("###calling RemoveTabOnMessageListenerGetGloveboxCiphertext.js");
        //        browser.tabs.executeScript({
        //            file: "RemoveTabOnMessageListenerGetGloveboxCiphertext.js",
        //            allFrames: true
        //        });
         //  }).then(function (a) {
         //       console.log("###calling RemoveTabOnMessageListenerCiphertextToHTML.js");
         //       browser.tabs.executeScript({
         //           file: "RemoveTabOnMessageListenerCiphertextToHTML.js",
         //           allFrames: true
         //       });
            });

        }).then(function (responsefromtab) {

            console.log("background.js:decrypt: responsefromtab:" + responsefromtab);
        });

    });

}

function consume_GloveboxSecureKeyOfferToken() {

    console.log("background.js: consume-GloveboxSecureKeyOfferToken");

    // accept the offered decryption token. This means to return a token
    // contaning the reference value signed by own private key and include
    // in it own public key.

    // this action removes the token text and replaces it with the new token
    // text.


    // token_text = ':GloveboxAcceptSecureOfferToken:' +
    // _arrayBufferToBase64(stringToArrayBuffer(shorty_2.deflate('{"refId":'+offerRefId
    // + ',"offeredKeyId":' + offeredKeyId+ '}:' + b )));


    indexedDB = window.indexedDB || window.webkitIndexedDB ||
        window.mozIndexedDB || window.msIndexedDB;

    // extract the offer reference id and key ID.
    // encrypt with key owner's prublic key
    // sign own privateKey
    //

    var publicKey;
    var offerRefId;
    var requestedKeyId;
    var privateKeyJwk;
    var publicKeyJwk;
    var requestSignature;
    var requestToEncrypt;
    var signingKeyPair;
    var token_text;
    var encrypted_requestkeyid;
    var enckeypairobj; // pp key pair object generetated by the secret key
    // recipient
    var enc_pubkey; // include this public RSA key in the response token to
    // the key sender
    var enc_privkey; // encrypt the response token with this generated
    // private key.

    var sender_sign_publicKey;
    // execute script in active tab
    // colllect the token
    console.log("###calling Get_GloveboxSecureKeyOfferToken.js");

    browser.tabs.executeScript({
        file: "Get_GloveboxSecureKeyOfferToken.js",
        allFrames: true
    }).then(function (result) {
        console.log("background.js:onExecuted4: We made it ....");
        // console.log("background.js:onExecuted4: result: " + result);
        // console.log("backgroupd.js:onExecuted4:selected_text: " +
        // selected_text);
        // console.log("backgroupd.js:onExecuted4:replacement_text: " +
        // replacement_text);
        // query for the one active tab
        return browser.tabs.query({
            active: true,
            currentWindow: true
        });
    }).then(function (tabs) {
        // send message to the active tab
        return browser.tabs.sendMessage(tabs[0].id, {
            Get_GloveboxSecureKeyOfferToken_replacement: "Glovebox token read.",
            remove: "true"
        });
    }).then(function (res) {
        // read in the token text
        console.log("###### getHTML response " + JSON.stringify(res));
        glovebox_token_ciphertext = res.response.token;
        console.log("token ciphertext: " + glovebox_token_ciphertext.replace(/:GloveboxSecureKeyOfferToken:(.*):/, '$1'));
        // start decoding and decryting the token
        console.log("token ciphertext: " + _base64ToArrayBuffer(glovebox_token_ciphertext.replace(/:GloveboxSecureKeyOfferToken:(.*):/, '$1')));

        var shorty_51 = new Shorty();

        var t = shorty_51.inflate(ab2str(_base64ToArrayBuffer(glovebox_token_ciphertext.replace(/:GloveboxSecureKeyOfferToken:(.*):/, '$1'))));
        token_plaintext = t.replace(/}:[^}]*$/, '}');
        console.log("GloveboxSecureKeyOfferToken plaintext: " + token_plaintext);

        token_obj = JSON.parse(token_plaintext);

        sender_sign_publicKey = token_obj.sign_pubkey;
        offerRefId = token_obj.refId;
        requestedKeyId = token_obj.offeredKeyId;

        console.log("token publicKey: " + sender_sign_publicKey);

        // assmlble a public key JWK with includes the key ("n") from the
        // received token
        var sender_sign_publicKeyJwk = {
            "alg": "RS1",
            "e": "AQAB",
            "ext": true,
            "key_ops": ['verify'],
            "kty": "RSA",
            "n": sender_sign_publicKey
        };

        console.log("token publicKeyJwk: " + JSON.stringify(sender_sign_publicKeyJwk));

        var signatureStr = t.replace(/^.*}/, '').replace(/^:*/, '');

        console.log("token signatureStr: " + signatureStr);

        console.log("token sign verification key: " + JSON.stringify(sender_sign_publicKeyJwk));

        var st = JSON.parse('{"s":"' + signatureStr + '"}');
        console.log("##### verified message 2:" + token_plaintext);

        console.log("##### verified signature:" + signatureStr);

        console.log("##### verified signature:" + st.s);
        console.log("##### verify with key:" + sender_sign_publicKeyJwk);
        console.log("##### verify with key:" + JSON.stringify(sender_sign_publicKeyJwk));

        // verify the signature on the token
        return verify(sender_sign_publicKeyJwk, signatureStr, token_plaintext);
    }).then(function (c) {
        console.log("verified: " + c);

        // ok, the token signature checks out.

        // }).then(function (r) {
        // call to remove page listener
        console.log("###calling RemoveTabOnMessageListenerAcceptGloveboxSecureKeyOfferToken.js");
        browser.tabs.executeScript({
            file: "RemoveTabOnMessageListenerAcceptGloveboxSecureKeyOfferToken.js",
            allFrames: true
        });

        // start to compose the "answer" token
        // create a new key to use to encrypt the response
        // Include the public key with which the key Sender should encrypt
        // the secret key.
        return window.crypto.subtle.generateKey({
            name: "RSA-OAEP",
            modulusLength: 1024,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: {
                name: "SHA-256"
            }
        },
            true,
            ['encrypt', 'decrypt']);

    }).then(function (key) {
        console.log(key);
        console.log(key.privateKey);

        enckeypairobj = key;
        return window.crypto.subtle.exportKey('jwk', enckeypairobj.publicKey);
        // }).catch(function (err) {
        // console.log("HEY!: " + err.message);
    }).then(function (key_pub) {
        enc_pubkey = key_pub;
        console.log(key_pub);
        console.log("recipient encryption pubkey: " + JSON.stringify(key_pub));

        return window.crypto.subtle.exportKey('jwk', enckeypairobj.privateKey);
        // }).catch(function (err) {
        // console.log("HEY!: " + err.message);
    }).then(function (key_priv) {
        enc_privkey = key_priv;
        console.log(enc_privkey);
        console.log("recipient encryption privkey: " + JSON.stringify(enc_privkey));

        var request_record;
        request_record = {
            "refId": offerRefId,
            "offeredKeyId": requestedKeyId,
            "enc_pubkey": enc_pubkey,
            "enc_privkey": enc_privkey,
            "sender_sign_publicKey": sender_sign_publicKey
        };

        console.log("saving: " + JSON.stringify(request_record));

        return saveToIndexedDB('acceptedKeyOffersDB', 'acceptedKeyOffersStore', offerRefId, request_record);

    }).then(function (c) {

        // respond with an encrypted request for the decryption key in
        // question.
        // include the reference ID for authentication purposes.


        console.log("##### encrypt message:" + requestedKeyId);

        // encrypt the uuid for the decryption key that is requested
        let enc = new TextEncoder();

        let encoded = enc.encode(requestedKeyId);

        return window.crypto.subtle.encrypt({
            name: "RSA-OAEP"
        },
            enckeypairobj.publicKey,
            encoded);

    }).then(function (c) {

        encrypted_requestkeyid = c;

        // return window.crypto.subtle.importKey(
        // 'jwk', recipient_enc_publicKeyJwk, {
        // name: "RSA-OAEP",
        // hash: {
        // name: "SHA-256"
        // },
        // },
        // true,
        // ['encrypt']);
        // }).then(function (gg) {
        // console.log("re-imported public key:" + gg);


        console.log("encrypted requested keyid: " + _arrayBufferToBase64(encrypted_requestkeyid));

        console.log("###calling Paste_GloveboxAcceptedSecureKeyOfferToken.js");
        return browser.tabs.executeScript({
            file: "Paste_GloveboxAcceptedSecureKeyOfferToken.js"
        });
    }).then(function (result) {
        // console.log("backgroupd.js: token_text: " + token_text);
        return browser.tabs.query({
            active: true,
            currentWindow: true
        });
    }).then(function (tabs) {

        var shorty_7 = new Shorty();

        // token_text = '{"refId":"' + offerRefId + '","requestKeyId":"' +
        // _arrayBufferToBase64(encrypted_requestkeyid) + '","enc_pubkey":"'
        // + enc_pubkey.n + '"}';
        // dispence with encryption of key id
        var token_text = ':GloveboxAcceptedSecureKeyOfferToken:' + _arrayBufferToBase64(str2ab(shorty_7.deflate('{"refId":"' + offerRefId + '","requestKeyId":"' + requestedKeyId + '","recipient_enc_pubkey":"' + enc_pubkey.n + '"}'))) + ':';

        var shorty_out = new Shorty();

        console.log("GloveboxAcceptedSecureKeyOfferToken plaintext: " + token_text);

        browser.tabs.sendMessage(tabs[0].id, {

            Paste_GloveboxAcceptedSecureKeyOfferToken_text: token_text
        });
    }).then(function (r) {
        // call to remove page listener
        console.log("###calling Remove_Paste_GloveboxAcceptedSecureKeyOfferToken_Listener.js");
        browser.tabs.executeScript({
            file: "Remove_Paste_GloveboxAcceptedSecureKeyOfferToken_Listener.js",
            allFrames: true
        });

    }).catch(function (error) {
        console.log("error: " + error);

        // "String contains an invalid character"
        // "not found"

    });

    // remove listener
    // RemoveTabOnMessageListenerPasteGloveboxAcceptedSecureKeyOfferToken
}

async function sign_async(privateKeyObj, message) {

    const data = new TextEncoder().encode(message);

    const signature = await window.crypto.subtle.sign({
            name: "RSASSA-PKCS1-v1_5",
        },
            privateKeyObj,
            data, );

    // converts the signature to a colon seperated string
    return new Uint8Array(signature).join(':');

}

// hash: sha-512, sha-256 , sha-1 (free version)
// modulus length: 4096, 2048 , 1024 (free version)

async function sign(privateKeyJwk, message) {
    //	console.log('sign');
    //	console.log(privateKeyJwk);
    //	console.log(message);


    const privateKey = await window.crypto.subtle.importKey('jwk', privateKeyJwk, {
            name: "RSASSA-PKCS1-v1_5",
            hash: {
                name: "SHA-1"
            },
        }, false, ['sign']);
    const data = new TextEncoder().encode(message);

    const signature = await window.crypto.subtle.sign({
            name: "RSASSA-PKCS1-v1_5",
        },
            privateKey,
            data, );

    // converts the signature to a colon seperated string
    return new Uint8Array(signature).join(':');
}

// Return the uuid referencing the key required to decrypt the glovebox text
// takes a de-obfuscated token as input
function get_keyuuid_from_gloveboxtoken(token) {
    console.log("called get_keyuuid_from_gloveboxtoken on: " + token);

    var uuid = "";
    try {
        // get key reference id info out of token
        const decryptkey_uuid_regex = new RegExp(':Glovebox:([^:]*):', 'm');

        if ((match3 = decryptkey_uuid_regex.exec(token)) != null) {
            uuid = match3[1];
            console.log("key id: " + uuid);
        }
    } catch (e) {
        console.log(e);
    }

    return uuid;

}

async function verify(publicKeyJwk, signatureStr, message) {
    const signatureArr = signatureStr.split(':').map(x => +x);
    const signature = new Uint8Array(signatureArr).buffer

        const publicKey = await window.crypto.subtle.importKey('jwk', publicKeyJwk, {
            name: "RSASSA-PKCS1-v1_5",
            hash: {
                name: "SHA-1"
            },
        }, false, ['verify']);
    const data = new TextEncoder().encode(message);

    const ok = await window.crypto.subtle.verify({
            name: "RSASSA-PKCS1-v1_5",
        },
            publicKey,
            signature,
            data);
    return ok;
}

async function generateRSAKeyPair() {
    const key = await window.crypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 1024,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {
                name: "SHA-1"
            },
        },
            true,
            ['sign', 'verify']);

    return {
        privateKey: await window.crypto.subtle.exportKey(
            'jwk',
            key.privateKey, ),
        publicKey: await window.crypto.subtle.exportKey(
            'jwk',
            key.publicKey, ),
    };
}

async function generateRSAKeyPair_CryptoKey() {
    const key = await window.crypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 1024,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {
                name: "SHA-1"
            },
        },
            true,
            ['sign', 'verify']);

    return key;
}

async function rsa_encrypt(publicKey, message) {

    console.log("rsa_encrypt: " + message);
    console.log("publicKey: " + JSON.stringify(publicKey));

    // const signatureArr = signatureStr.split(':').map(x => +x);
    // const signature = new Uint8Array(signatureArr).buffer

    // const publicKey = await window.crypto.subtle.importKey('jwk',
    // publicKeyJwk, {
    // name: "RSASSA-PKCS1-v1_5",
    // hash: {
    // name: "SHA-1"
    // },
    // }, false, ['verify']);
    // const data = new TextEncoder().encode(message);

    let enc = new TextEncoder();

    let encoded = enc.encode(message);

    const ok = await window.crypto.subtle.encrypt({
            name: "RSA-OAEP"
        },
            publicKey,
            encoded);

    return ok;

}

async function encrypt_test(data) {

    const key = await window.crypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 1024,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {
                name: "SHA-1"
            },
        },
            true,
            ['encrypt', 'decrypt']);

    // const key = await window.crypto.subtle.generateKey(
    // {
    // name: 'AES-GCM',
    // length: 256
    // }
    // , true, ['encrypt', 'decrypt']);


    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    // const cypher = ab2str(await window.crypto.subtle.encrypt({ name:
    // 'AES-GCM', iv: iv }, key, str2ab(data)));
    const cypher = ab2str(await window.crypto.subtle.encrypt({
                name: 'RSA-OAEP',
                iv: iv
            }, key, str2ab(data)));

    return {
        data: cypher,
        iv: iv,
        key: key
    };
}

async function decrypt_test(data, key, iv) {
    console.log("iv" + iv);
    console.log("iv" + JSON.stringify(iv));

    return ab2str(await window.crypto.subtle.decrypt({
            name: 'AES-GCM',
            iv: iv
        }, key, str2ab(data)))
}

async function publicKeyGenerateKeys() {
    console.log("publicKeyGenerateKeys");
    var g;
    // name: "RSA-OAEP",

    window.crypto.subtle.generateKey({
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 1024,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: {
            name: "SHA-1"
        },
    },
        true,
        ['sign', 'verify']).then(function (key3) {
        console.log("ret");
        return window.crypto.subtle.exportKey('jwk', key3);
    }).then(function (ret) {
        g = ret;
        console.log("ret:" + JSON.stringify(ret));

    });

    // console.log('navigate-collection.js: g: ' + JSON.stringify(g));

    var f;
    const key = await window.crypto.subtle.generateKey({
            // name: "RSA-OAEP",
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 1024,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {
                name: "SHA-1"
            },
        },
            true,
            ['sign', 'verify']);

    f = {
        privateKey: await window.crypto.subtle.exportKey(
            'jwk',
            key.privateKey, ),
        publicKey: await window.crypto.subtle.exportKey(
            'jwk',
            key.publicKey, ),
    };

    // console.log('navigate-collection.js: f: ' + JSON.stringify(f));

    return f.publicKey;
}

function publicKeyGenerateKeysTest() {
    return window.crypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
    },
        false,
        ['encrypt', 'decrypt'])
}

async function publicKeyDecrypt(myPrivateKey, data) {
    return window.crypto.subtle.decrypt({
        name: "RSA-OAEP"
    }, myPrivateKey, data)
}

async function publicKeyEncrypt(theirPublicKey, data) {
    console.log("publicKeyEncrypt:begin");
    keyPair = await window.crypto.subtle.generateKey({
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
            true,
            ['encrypt', 'decrypt']);

    let message = "hello"
        let enc = new TextEncoder();

    let encoded = enc.encode(message);
    let encrypted = await window.crypto.subtle.encrypt({
            name: "RSA-OAEP"
        },
            keyPair.publicKey,
            encoded);
    console.log("encrypted: " + encrypted);

    var a = await window.crypto.subtle.encrypt({
            name: "RSA-OAEP"
        }, keyPair.publicKey, 'test data').catch(function (err) {
            console.error(err);
        }); ;

    console.log("a" + JSON.stringify(a));

    var pub = await window.crypto.subtle.exportKey(
            'jwk', keyPair, );

    console.log("publicKeyEncrypt" + pub);
    console.log("publicKeyEncrypt" + JSON.stringify(pub));
    pub.key_ops = ['encrypt', 'decrypt'];

    let pubk2 = await window.crypto.subtle.importKey(
            'jwk', pub, {
            name: "RSA-OAEP",
            hash: {
                name: "SHA-256"
            }
        },
            true,
            ['decrypt', 'encrypt']).then(function (publicKey) {
            console.log(publicKey);
            console.log("pubkey " + JSON.stringify(publicKey));
            return publicKey;
        }).catch(function (err) {
            console.error(err);
        });

    console.log("publicKeyEncrypt");
    console.log("publicKeyEncrypt" + JSON.stringify(theirPublicKey));
    console.log("publicKeyEncrypt" + JSON.stringify(theirPublicKey.key_ops));
    theirPublicKey.key_ops = ['encrypt', 'decrypt'];
    console.log("publicKeyEncrypt" + JSON.stringify(theirPublicKey));

    let pubkey = await window.crypto.subtle.importKey(
            'jwk', theirPublicKey, {
            name: "RSASSA-PKCS1-v1_5",
            hash: {
                name: "SHA-1"
            }
        },
            true,
            ['decrypt', 'encrypt']).then(function (publicKey) {
            console.log(publicKey);
            console.log("pubkey: " + JSON.stringify(publicKey));
            return publicKey;
        }).catch(function (err) {
            console.error(err);
        });
    console.log("pubkey: " + JSON.stringify(pubkey));

    console.log("publicKeyEncrypt:end");
    return window.crypto.subtle.encrypt({
        name: "RSA-OAEP"
    }, pubk2, "data");
}

function encryptMessage(publicKey) {
    let encoded = getMessageEncoding();
    return window.crypto.subtle.encrypt({
        name: "RSA - OAEP"
    },
        publicKey,
        encoded);
}

function do_db_setup() {

    indexedDB = window.indexedDB || window.webkitIndexedDB ||
        window.mozIndexedDB || window.msIndexedDB;

    var request = indexedDB.open("decryptionKeysDB", 1);
    request.onupgradeneeded = function (event) {
        db = event.target.result;
        db.onerror = function (event) {};
        // Create an objectStore in this database to keep trusted decryption
        // keys
        console.log("background.js: create objectstore decryptionKeysStore in decryptionKeysDB");
        var objectStore2 = db.createObjectStore('decryptionKeys', {
                keyPath: 'keyId'
            });

        objectStore2.createIndex('keyId', 'keyId', {
            unique: true
        });
    };
    request.onerror = function (event) {
        console.log("background.js: dp open request error 201 ");
    };
    request.onsuccess = function (event) {
        db = event.target.result;
        db.onerror = function (event) {
            console.log("background.js: db open request error 2 ");
        };
        db.onsuccess = function (event) {
            console.log("background.js: db open request success 2 ");
        };
    };

    var request2 = indexedDB.open('encryptionKeysDB', 1);
    request2.onupgradeneeded = function (event) {
        db = event.target.result;
        db.onerror = function (event) {};
        // Create an objectStore in this database to keep trusted decryption
        // keys
        console.log("background.js: create objectstore encryptionKeysStore in  encryptionKeysDB");
        var objectStore2 = db.createObjectStore('encryptionKeysStore', {
                keyPath: 'keyId'
            });

        objectStore2.createIndex('keyId', 'keyId', {
            unique: true
        });
    };
    request2.onerror = function (event) {
        console.log("background.js: dp open request error 201 ");
    };
    request2.onsuccess = function (event) {
        db = event.target.result;
        db.onerror = function (event) {
            console.log("background.js: db open request error 2 ");
        };
        db.onsuccess = function (event) {
            console.log("background.js: db open request success 2 ");
        };
    };

    var request3 = indexedDB.open("createdKeyOffersDB", 1);
    request3.onupgradeneeded = function (event) {
        db = event.target.result;
        db.onerror = function (event) {};
        // Create an objectStore in this database to keep offers to passout
        // decryption keys in a secure way.
        console.log("background.js: create objectstore createdKeyOffersStore for secure key offers ");
        var objectStore2 = db.createObjectStore("createdKeyOffersStore", {
                keyPath: "refId"
            });

        objectStore2.createIndex("refId", "refId", {
            unique: true
        });
    };
    request3.onerror = function (event) {
        console.log("background.js: dp open request error 201 ");
    };
    request3.onsuccess = function (event) {
        db = event.target.result;
        db.onerror = function (event) {
            console.log("background.js: db open request error 2 ");
        };
        db.onsuccess = function (event) {
            console.log("background.js: db open request success 2 ");
        };
    };

}


// create a new encryption key and place it both in the encryption and
// decryption key databases
// return the key object
async function generate_encryption_key() {
    console.log("background.js: generate_encryption_key");

    // uuid of generated key;
    var uuid;

    var key;
    var jwk;

    var algoKeyGen = {
        name: 'AES-GCM',
        // length: 256
        length: 128
    };

    // console.log('background.js:algoKeyGen: ' + JSON.stringify(algoKeyGen));

    var keyUsages = [
        'encrypt',
        'decrypt'
    ];

    return new Promise(
        function (resolve, reject) {

        window.crypto.subtle.generateKey(algoKeyGen, true, keyUsages)
        .then(function (key) {
            // secretKey = key;
            console.log('background.js:generate_encryption_key:2');
            // put key into encryption key store

            return window.crypto.subtle.exportKey('jwk', key);
        })
        .then(function (expkey) {

            console.log('background.js: expkey: ' + JSON.stringify(expkey));

            key = expkey.k;
            jwk = expkey;

            // generates random id;
            let guid = () => {
                let s4 = () => {
                    return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
                }
                // return id of format
                // 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
                console.log('backgroupnd.js: about to return ');

                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            }

            var id = guid();
            uuid = id;

        })
        .then(function (a) {

            console.log('background.js:generate_encryption_key:generated 1:' + uuid);
            console.log('background.js:generate_encryption_key:generated 1:' + key);
            console.log('background.js:generate_encryption_key:generated 1:' + jwk);
            var newItem = {
                keyId: uuid,
                uuid: uuid,
                "key": key,
                'jwk': jwk,
                "ext": true
            };

            console.log('data to be saved 1: ' + JSON.stringify(newItem));
            // '{'keyId':" one "," uuid ":" two "}'
            saveToIndexedDB('encryptionKeysDB', 'encryptionKeysStore', 'keyId', newItem)

            .then(function (b) {
                console.log('background.js:generate_encryption_key:generated 2:' + uuid);
                console.log('background.js:generate_encryption_key:generated 2:' + key);
                console.log('background.js:generate_encryption_key:generated 2:' + jwk);

                var newItem = {
                    keyId: uuid,
                    uuid: uuid,
                    "key": key,
                    'jwk': jwk,
                    "ext": true
                };
                console.log('data to be saved 2: ' + JSON.stringify(newItem));

                saveToIndexedDB('decryptionKeysDB', 'decryptionKeysStore', 'keyId', newItem).then(function (response) {
                    console.log('data saved on ' + uuid);
                    resolve(newItem);
                }).catch(function (error) {
                    console.log(error.message);
                    resolve('blank');
                });
            });
        });
    });
}

// Takes base64 text and recasts it into something that looks like plain written
// text
function convertBase64ToPsuedoText(base64_text) {
    console.log("background.js: convertBase64ToPsuedoText ");
    // insert spaces and punktuation at random intervals.

    // replace non-aphabetic with words.

    var base_text_rewritten = new String();
    // this needs tightening up - unacceptable chance of "overfitting"
    base_text_rewritten = base64_text.replace(new RegExp('\\/', 'gm'), 'slash').replace(new RegExp('\\+', 'gm'), 'pluss').replace(new RegExp('=', 'gm'), 'equals').replace(new RegExp('-', 'gm'), 'minus');

    console.log(base_text_rewritten);
    var n = '';

    var res = base_text_rewritten.split("");

    for (i = 0; i < res.length; i++) {

        n = n + res[i];

        // console.log(Math.floor((Math.random() * 13) + 1));
        if (Math.floor((Math.random() * 13) + 1) > 12) {
            n = n + " ";
        } else {}

        if (Math.floor((Math.random() * 20) + 1) > 19) {
            n = n + ".";
        } else {}

    }

    console.log(n);

    return n;

}

function convertPsuedoTextToBase64(psuedo_text) {

    console.log("convert psuedo text to base64: " + psuedo_text);

    var b = '';

    b = psuedo_text.replace(new RegExp('[ \.]', 'gm'), '').replace(new RegExp('slash', 'gm'), '/').replace(new RegExp('pluss', 'gm'), '+').replace(new RegExp('equals', 'gm'), '=').replace(new RegExp('minus', 'gm'), '-');

    return b;

}

// designate an encryption key as default
function makeDefaultEncryptionKey(uuid) {
    console.log("background.js: makeDefaultEncryptionKey " + uuid);

    // get tne existing default key and give it a new keyId


    loadFromIndexedDB('encryptionKeysDB', 'encryptionKeysStore', 'defaultSecretKey').then(function (currentdefaultkey) {

        console.log("background.js: makeDefaultEncryptionKey read default from db:           " + currentdefaultkey);
        console.log("background.js: makeDefaultEncryptionKey read default from db:           " + JSON.stringify(currentdefaultkey));
        // make the UUID of the object the new keyId
        currentdefaultkey.keyId = currentdefaultkey.uuid;

        saveToIndexedDB('encryptionKeysDB', 'encryptionKeysStore', currentdefaultkey.keyId, currentdefaultkey).then(function (response) {
            console.log("background.js: makeDefaultEncryptionKey save to db: " + response);

        });

    });

    loadFromIndexedDB('encryptionKeysDB', 'encryptionKeysStore', uuid).then(function (obj) {

        console.log("background.js: makeDefaultEncryptionKey read from db: " + obj);
        console.log("background.js: makeDefaultEncryptionKey read from db: " + JSON.stringify(obj));
        // reinsert with a new reference -
        obj.uuid = obj.keyId;

        // make defaultSecretKey the new keyid
        obj.keyId = 'defaultSecretKey';

        saveToIndexedDB('encryptionKeysDB', 'encryptionKeysStore', 'defaultSecretKey', obj).then(function (response) {
            console.log("ibackground.js: makeDefaultEncryptionKey save to db: " + response);
        });

    });
}

// create a new encryption key and set it as default, as well as returning the
// key object
async function makeNewDefaultEncryptionKey() {
    console.log("background.js: makeNewDefaultEncryptionKey ");

    // generate new key

    return new Promise(
        function (resolve, reject) {

        var genereated_key_id = " ";
        generate_encryption_key().then(function (genereated_key) {
            console.log("gen keys res 6: " + genereated_key);
            // get tne existing default key and give it a new keyId
            // loadFromIndexedDB('encryptionKeys', 'encryptionKeys',
            // genereated_key_id).then(function (obj) {

            // console.log("background.js: makeNewDefaultEncryptionKey read
            // from db: " + obj);
            console.log("background.js: makeNewDefaultEncryptionKey1: " + JSON.stringify(genereated_key));
            // reinsert with a new reference -
            // genereated_key.uuid = genereated_key.keyId;

            // make defaultSecretKey the new keyid
            genereated_key.keyId = 'defaultSecretKey';

            console.log("background.js: makeNewDefaultEncryptionKey2: " + JSON.stringify(genereated_key));

            saveToIndexedDB('encryptionKeysDB', 'encryptionKeysStore', 'defaultSecretKey', genereated_key).then(function (response) {
                console.log("background.js: makeNewDefaultEncryptionKey save to db: " + response);
            });
            resolve(genereated_key);

            // });
        });
    });
}

// set up a default private key to be used if no other is available
async function addDefaultKeys() {
    console.log("background.js:  ## addDefaultKeys ");

    // check if there is a default key already.
    // only if not, add one
    var isone;
    try {
        console.log("##  # check if already is a default key ");
        loadFromIndexedDB('encryptionKeysDB', 'encryptionKeysStore', 'defaultSecretKey').then(function (currentdefaultkey) {

            console.log("background.js:          addDefaultKeys: found = " + currentdefaultkey);
            console.log("background.js: addDefaultKeys: found = " + JSON.stringify(currentdefaultkey));

            // make a new default encryption key
            let one = makeNewDefaultEncryptionKey();
            console.log("background.js: addDefaultKeys: one = " + one);

        });

    } catch (e) {

        console.log("##  # check if already default key: error = " + e);

    }

    console.log("##  # check if already default key:  succ = " + isone);

    // var genereated_key_id = " ";
    // genereated_key_id = await generate_encryption_key()
    // console.log("gen keys res 5: " + genereated_key_id);


}

// set up a default private key to be used if no other is available
async function getDefaultSecretKey() {
    console.log("background.js: getDefaultSecretKey ");

    return new Promise(
        function (resolve, reject) {
        console.log("getDefaultSecretKey:  ##  # check if there is a default key ");

        loadFromIndexedDB('encryptionKeysDB', 'encryptionKeysStore', 'defaultSecretKey').then(function (currentdefaultkey) {

            console.log("background.js: getDefaultSecretKey: found = " + currentdefaultkey);
            console.log("background.js: getDefaultSecretKey: found = " + JSON.stringify(currentdefaultkey));
            resolve(currentdefaultkey);

        }).catch(function (err) {
            console.log("background.js: getDefaultSecretKey: err = " + err);

            if (err == " Error: object not found: encryptionKeys: defaultSecretKey ") {
                console.log("background.js: defaultkey not found,                 create it ");
                // make a new default encryption key
                makeNewDefaultEncryptionKey().then(function (key) {
                    console.log("background.js: key: " + key);
                });

            }
            if (err == " Error: objectstore_error ") {
                console.log("background.js: respond to objectstore error ");

                var request4 = indexedDB.open('encryptionKeysDB', 1);
                request4.onupgradeneeded = function (event) {
                    db = event.target.result;
                    db.onerror = function (event) {};
                    // Create an objectStore in this database to keep trusted
                    // decryption keys
                    console.log("background.js: getDefaultSecretKey: create objectstore encryptionKeysStore in encryptionKeysDB");
                    console.log("background.js: attempt to create objectstore ");
                    var objectStore2 = db.createObjectStore('encryptionKeysStore', {
                            keyPath: 'keyId'
                        });

                    objectStore2.createIndex('keyId', 'keyId', {
                        unique: true
                    });
                    console.log("background.js: attempt to create objectstore ");

                };
                console.log("background.js: 4 " + request4);
                console.log("background.js: 4 " + JSON.stringify(request4));

                request4.onerror = function (event) {
                    console.log("background.js: getDefaultSecretKey: dp open request error 201 ");
                };
                console.log("background.js: 5 ");
                request4.onsuccess = function (event) {
                    console.log("background.js: 6 " + event);
                    var db_1;
                    db_1 = event.target.result;
                    console.log("background.js: 7 " + db_1);
                    db_1.onerror = function (event) {
                        console.log("background.js: getDefaultSecretKey: db open request error 2 ");
                    };
                    // db_1.onsuccess = function (event) {
                    console.log("background.js: getDefaultSecretKey: db open request success 2 ");

                    console.log("background.js: attempt to create objectstore ");
                    var objectStore2 = db_1.createObjectStore('encryptionKeysStore', {
                            keyPath: 'keyId'
                        });

                    objectStore2.createIndex('keyId', 'keyId', {
                        unique: true
                    });
                    console.log("background.js: attempt to create objectstore ");

                    console.log("create new default key ");
                    makeNewDefaultEncryptionKey().then(function (res) {
                        console.log("created new default key result:    " + res);
                        resolve(res);

                    });

                    // };
                };

            }

        });

    });

}

// function for creating the notification
function createNotification(title, db) {
    console.log("background.js: createNotification ");
    // Create and show the notification
    let img = '/to-do-notifications/img/icon-128.png';
    let text = 'HEY! Your task " ' + title + ' " is now overdue.';
    let notification = new Notification('To do list', {
            body: text,
            icon: img
        });

    // we need to update the value of notified to " yes " in this particular
    // data object, so the
    // notification won't be set off on it again

    console.log("background.js: createNotification 2 ");

    // first open up a transaction as usual
    let objectStore = db.transaction(['toDoList'], " readwrite ").objectStore('toDoList');
    console.log("background.js: createNotification 3 ");

    // get the to-do list object that has this title as it's title
    let objectStoreTitleRequest = objectStore.get(title);

    console.log("background.js: createNotification 4 ");

    objectStoreTitleRequest.onsuccess = function () {
        // grab the data object returned as the result
        let data = objectStoreTitleRequest.result;

        // update the notified value in the object to " yes "
        data.notified = 'yes';

        // create another request that inserts the item back into the database
        let updateTitleRequest = objectStore.put(data);

        // when this new request succeeds, run the displayData() function again
        // to update the display
        updateTitleRequest.onsuccess = function () {
            // displayData();
        }
    }
}

function isDoubleByte(str) {
    for (var i = 0, n = str.length; i < n; i++) {
        if (str.charCodeAt(i) > 255) {
            return true;
        }
    }
    return false;
}

async function importKey(objectKey) {
    console.log("importKey: begin ");
    // const objectKey = window.location.hash.slice("# key = ".length);
    const key = await window.crypto.subtle.importKey(
            'jwk', {
            k: objectKey,
            alg: 'A128GCM',
            ext: true,
            key_ops: ['encrypt', 'decrypt'],
            kty: 'oct',
        }, {
            name: 'AES-GCM',
            length: 128
        },
            false, // extractable
            ['decrypt']);

    console.log("importKey: end ");
    return key;

}

async function encryptText(content, key) {
    console.log("encryptText: begin ");

    const encrypted = await window.crypto.subtle.encrypt({
            name: 'AES - GCM',
            iv: new Uint8Array(12) /* don't reuse key! */
        },
            key,
            new TextEncoder().encode(JSON.stringify(content)));

    console.log("encryptText: end ");

}

function messageTab(tabs) {
    browser.tabs.sendMessage(tabs[0].id, {
        replacement: 'option1',
        regex: 'reg1'

    });
}

function onExecuted(result) {
    console.log("background.js: onExecuted: We made it....");
    console.log("background.js: onExecuted: result: " + result);
    console.log("backgroupd.js: onExecute: selected_text: " + selected_text);

    var querying = browser.tabs.query({
            active: true,
            currentWindow: true
        });
    querying.then(messageTab);
}

function onError(error) {
    console.log("Error: $ {        error      }        ");
}

function replaceSelectedText(replacementText) {
    var sel,
    range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(replacementText));
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.text = replacementText;
    }
}

function stringToArrayBuffer(str) {
    var buf = new ArrayBuffer(str.length * 2);
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function arrayBufferToString(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function encryptPlaintext(sessionKey, plaintext) {
    // The plaintext is in an enclosing scope, called plaintext
    console.log("5.encryptPlaintext ");
    var iv = window.crypto.getRandomValues(new Uint8Array(16));
    return window.crypto.subtle.encrypt({
        name: 'AES-CBC',
        iv: iv
    }, sessionKey, plaintext).
    then(function (ciphertext) {
        return [iv, new Uint8Array(ciphertext)];
    });
}

function decryptMessage(key, ciphertext, counter) {
    let decrypted = window.crypto.subtle.decrypt({
            name: 'AES-CTR',
            counter,
            length: 64
        },
            key,
            ciphertext);

    console.log(dec.decode(decrypted));
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    const buffer = new ArrayBuffer(8);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

/*
 * Get some key material to use as input to the deriveKey method. The key
 * material is a password supplied by the user.
 */
function getKeyMaterial() {
    const password = window.prompt("Enter your password ");
    const enc = new TextEncoder();
    return window.crypto.subtle.importKey(
        'raw',
        enc.encode(password), {
        name: 'PBKDF2'
    },
        false,
        ['deriveBits', 'deriveKey']);
}

/*
 * Given some key material and some random salt derive an AES-KW key using
 * PBKDF2.
 */
function getKey(keyMaterial, salt) {
    return window.crypto.subtle.deriveKey({
        'name': 'PBKDF2',
        salt: salt,
        'iterations': 100000,
        'hash': 'SHA-256'
    },
        keyMaterial, {
        'name': 'AES - KW',
        'length': 256
    },
        true,
        ['wrapKey', 'unwrapKey']);
}

/*
 * Wrap the given key.
 */
async function wrapCryptoKey(keyToWrap) {
    // get the key encryption key
    const keyMaterial = await getKeyMaterial();
    salt = window.crypto.getRandomValues(new Uint8Array(16));
    const wrappingKey = await getKey(keyMaterial, salt);

    return window.crypto.subtle.wrapKey(
        'raw',
        keyToWrap,
        wrappingKey,
        'AES - KW');

}

async function createSymetricKey() {
    console.log("createSymetricKey: start ");
    let a = await createSymetricKey2()
        .catch(e => {
            console.log('There has been a problem with your key create operation: ' + e.message);
        })
        console.log("createSymetricKey: a " + a);
    console.log("createSymetricKey: end ");
}

async function createSymetricKey2() {
    console.log("createSymetricKey2: start ");
    let key = await window.crypto.subtle.generateKey({
            name: 'AES - GCM',
            length: 128
        },
            true, // extractable
            ['encrypt', 'decrypt']);

    console.log("createSymetricKey2: key: " + key);

    // let result1 = await Promise.all([key]);

    let objectKey = (await window.crypto.subtle.exportKey('jwk', key)).k;

    console.log("createSymetricKey2: objectKey: " + objectKey);
    // let result2 = await Promise.all([ objectKey]);
    console.log("createSymetricKey2: objectKey: " + objectKey);
    console.log("createSymetricKey2: objectKey(json): " + JSON.stringify(objectKey));

    if (objectKey === undefined) {

        console.log("createSymetricKey2: objectKey(json): 2: undefinED ");

    }

    // while(true){
    // if (objectKey === undefined) continue;
    // else {
    // $("# output ").append(result);
    console.log("createSymetricKey: objectKey(json): 2: " + JSON.stringify(objectKey));

    // return;
    // }
    // }


    // return JSON.stringify(key);

}

async function createSymetricKey3() {
    console.log("createSymetricKey3: start ");

    let key = await window.crypto.subtle.generateKey({
            name: 'AES - GCM',
            length: 128
        },
            true, // extractable
            ['encrypt', 'decrypt']);

    // let objectKey = (await window.crypto.subtle.exportKey('jwk', key)).k;

    let result = await Promise.all([key]);
    // console.log("createSymetricKey3: key: " + objectKey);
    console.log("createSymetricKey3: key(json): " + JSON.stringify(key));

    return JSON.stringify(key);

}

const getSymKey = async() => {
    console.log("getSymKey: start ");

    const key = await window.crypto.subtle.generateKey({
            name: 'AES - GCM',
            length: 128
        },
            true, // extractable
            ['encrypt', 'decrypt']);

    const objectKey = (await window.crypto.subtle.exportKey('jwk', key)).k;
    console.log("getSymKey: objectKey: " + objectKey);
    console.log("getSymKey: objectKey: " + JSON.stringify(objectKey));

    console.log("getSymKey: keys: " + JSON.stringify(key));
    const symKey = await window.crypto.subtle.exportKey('jwk', key);
    console.log("getSymKey: symKey: " + JSON.stringify(symKey));

    return JSON.stringify(symKey);
    // let body = window.btoa(String.fromCharCode(...new Uint8Array(symKey)));
    // body = body.match(/.{1,64}/g).join('\n');

    // return `-----BEGIN KEY-----\n${body}\n-----END KEY-----`;
};

const getPublicKey = async() => {
    console.log('getPublicKey: start');

    const options = {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: {
            name: 'SHA-256'
        },
    };

    const keys = await window.crypto.subtle.generateKey(
            options,
            true, // non-exportable (public key still exportable)
            ['sign', 'verify'], );

    console.log("getPublicKey: keys: " + JSON.stringify(keys));

    const publicKey = await window.crypto.subtle.exportKey('spki', keys.publicKey);

    let body = window.btoa(String.fromCharCode(...new Uint8Array(publicKey)));
    body = body.match(/.{1,64}/g).join('\n');

    return `-----BEGIN PUBLIC KEY-----\n${body}\n-----END PUBLIC KEY-----`;
};

// from
// https://stackoverflow.com/questions/41586400/using-indexeddb-asynchronously

function loadFromIndexedDB(dbName, storeName, id) {
    // console.log("loadFromIndexedDB: 0 ");
    console.log("loadFromIndexedDB: 1 " + dbName);
    console.log("loadFromIndexedDB: 2 " + storeName);
    console.log("loadFromIndexedDB: 3 " + id);

    return new Promise(
        function (resolve, reject) {

        try {
            var dbRequest = indexedDB.open(dbName);

            dbRequest.onerror = function (event) {
                reject(Error("Error text"));
            };

            dbRequest.onupgradeneeded = function (event) {
                // Objectstore does not exist. Nothing to load
                event.target.transaction.abort();
                // start process of creating default object stores
                // addDefaultKeys();

                // makeNewDefaultEncryptionKey();

                reject(Error('Not found'));
            };

            dbRequest.onsuccess = function (event) {
                var database = event.target.result;
                console.log("loadFromIndexedDB: database " + JSON.stringify(database));

                var transaction;
                try {
                    transaction = database.transaction([storeName]);
                } catch (e) {
                    console.log("loadFromIndexedDB: database failed to open datastore " + JSON.stringify(e));
                    console.log("loadFromIndexedDB: database failed to open datastore " + [storeName]);
                }

                var objectStore;
                try {
                    objectStore = transaction.objectStore(storeName);
                } catch (f) {
                    console.log("loadFromIndexedDB: database failed to open objectstore " + JSON.stringify(f));
                    console.log("loadFromIndexedDB: database failed to open objectstore " + [storeName]);
                }

                try {
                    var objectRequest = objectStore.get(id);

                    objectRequest.onerror = function (event) {
                        reject(Error('Error text'));
                    };

                    objectRequest.onsuccess = function (event) {
                        if (objectRequest.result)
                            resolve(objectRequest.result);
                        else
                            if (id == 'defaultSecretKey') {
                                // if default key is missing, add it
                                console.log("## missing defaults ");
                                // addDefaultKeys();
                            }

                        reject(Error('object not found: ' + storeName + ": " + id));
                    };
                } catch (f) {
                    console.log("objectstore error: ");
                    reject(Error('objectstore_error'));
                }
            };

        } catch (e) {
            console.log("loadFromIndexedDB: error: " + e);
        }
    });
}

// from
// https://stackoverflow.com/questions/41586400/using-indexeddb-asynchronously


// sample call to this function:
//
// saveToIndexedDB('dn\bname', 'objectstoreName', data).then(function (response)
// {
// alert('data saved');
// }).catch(function (error) {
// alert(error.message);
// });


function saveToIndexedDB(dbName, storeName, keyId, object) {
    console.log("saveToIndexedDB: " + dbName + " " + storeName + " " + keyId);
    console.log("saveToIndexedDB: 1 " + dbName);
    console.log("saveToIndexedDB: 2 " + storeName);
    console.log("saveToIndexedDB: 3 " + keyId);
    console.log("saveToIndexedDB: 4 " + JSON.stringify(object));

    indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

    return new Promise(
        function (resolve, reject) {

        var dbRequest = indexedDB.open(dbName);

        dbRequest.onerror = function (event) {
            reject(Error("IndexedDB database error "));
        };

        dbRequest.onupgradeneeded = function (event) {
            var database = event.target.result;
            var objectStore = database.createObjectStore(storeName, {
                    keyId: keyId
                });
        };

        dbRequest.onsuccess = function (event) {
            console.log("saveToIndexedDB: 31 ")
            var database = event.target.result;
            var transaction = database.transaction([storeName], 'readwrite');
            var objectStore = transaction.objectStore(storeName);
            var objectRequest = objectStore.put(object); // Overwrite if
            // exists

            objectRequest.onerror = function (event) {
                // console.log("saveToIndexedDB: error: " + storeName);

                reject(Error('Error text'));
            };

            objectRequest.onsuccess = function (event) {
                // console.log("saveToIndexedDB: success: " + storeName);
                resolve('Data saved OK');
            };
        };
    });
}

/**
 * Secure Hash Algorithm (SHA1) http://www.webtoolkit.info/
 */
function SHA1(msg) {
    console.log("navigate - collection: SHA1 ");
    function rotate_left(n, s) {
        var t4 = (n << s) | (n >>> (32 - s));
        return t4;
    };
    function lsb_hex(val) {
        var str = '';
        var i;
        var vh;
        var vl;
        for (i = 0; i <= 6; i += 2) {
            vh = (val >>> (i * 4 + 4)) & 0x0f;
            vl = (val >>> (i * 4)) & 0x0f;
            str += vh.toString(16) + vl.toString(16);
        }
        return str;
    };
    function cvt_hex(val) {
        var str = '';
        var i;
        var v;
        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    };
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, '\n');
        var utftext = '';
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    var blockstart;
    var i,
    j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A,
    B,
    C,
    D,
    E;
    var temp;
    msg = Utf8Encode(msg);
    var msg_len = msg.length;
    var word_array = new Array();
    for (i = 0; i < msg_len - 3; i += 4) {
        j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
            msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
        word_array.push(j);
    }
    switch (msg_len % 4) {
    case 0:
        i = 0x080000000;
        break;
    case 1:
        i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
        break;
    case 2:
        i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
        break;
    case 3:
        i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
        break;
    }
    word_array.push(i);
    while ((word_array.length % 16) != 14)
        word_array.push(0);
    word_array.push(msg_len >>> 29);
    word_array.push((msg_len << 3) & 0x0ffffffff);
    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
        for (i = 0; i < 16; i++)
            W[i] = word_array[blockstart + i];
        for (i = 16; i <= 79; i++)
            W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;
        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
    }
    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

    return temp.toLowerCase();
}

async function find_tabs(queryyy) {
    console.log("background.js: find_tabs ");
    // locate all Tabs, windows and popups
    let this_tab_url = browser.runtime.getURL("find.html ");
    let tabs = await browser.tabs.query({});
    console.log("background.js: find_tabs: " + tabs.length);
    for (let tab of tabs) {
        // Iterate through the tabs, but exclude the current tab.
        console.log("background.js: found tabs > " + tab.url);
        console.log("background.js: found tabs > " + tab.id);
        if (tab.url === this_tab_url) {
            continue;
        }

        // Call the find API on each tab. We'll wait for the results for each
        // tab before progressing onto the next one by using await.
        //
        // After getting the results, send a message back to the query page
        // and highlight the tab if any results are found.
        // let result = await browser.find(queryyy, { tabId: tab.id });
        // browser.runtime.sendMessage({
        // msg: " found - result ",
        // id: tab.id,
        // url: tab.url,
        // count: result.count
        // });

        // if (result.count) {
        // browser.find.highlightResults({
        // tabId: tab.id
        // });
        // }
    }
    return tabs.length;
}

function shorty_out() {}

// highlight Glovebox keywords in all pages


var markText = function (node, regex, callback, excludeElements) {

    excludeElements || (excludeElements = ['script', 'style', 'iframe', 'canvas']);
    var child = node.firstChild;

    do {
        switch (child.nodeType) {
        case 1:
            if (excludeElements.indexOf(child.tagName.toLowerCase()) > -1) {
                continue;
            }
            markText(child, regex, callback, excludeElements);
            break;
        case 3:
            child.data.replace(regex, function (all) {
                console.log("split here ");
                var args = [].slice.call(arguments),
                offset = args[args.length - 2],
                newTextNode = child.splitText(offset);

                newTextNode.data = newTextNode.data.substr(all.length);
                callback.apply(window, [child].concat(args));
                child = newTextNode;
            });
            break;
        }
    } while (child = child.nextSibling);

    return node;
}

/**
 * Substitutes emojis into text nodes. If the node contains more than just text
 * (ex: it has child nodes), call markGlovebox() on each of its children.
 *
 * @param {Node}
 *            node - The target DOM Node.
 * @return {void} - Note: the emoji substitution is done inline.
 */
function markGlovebox(node) {
    // Setting textContent on a node removes all of its children and replaces
    // them with a single text node. Since we don't want to alter the DOM aside
    // from substituting text, we only substitute on single text nodes.
    // @see https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
    if (node.nodeType === Node.TEXT_NODE) {
        // This node only contains text.
        // @see https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType.

        // console.log("--sub ");
        // Skip textarea nodes due to the potential for accidental submission
        // of substituted emoji where none was intended.
        if (node.parentNode &&
            node.parentNode.nodeName === 'TEXTAREA') {
            return;
        }

        // Because DOM manipulation is slow, we don't want to keep setting
        // textContent after every replacement. Instead, manipulate a copy of
        // this string outside of the DOM and then perform the manipulation
        // once, at the end.
        let content = node.textContent;

        // let html = node.innerHTML;

        // Replace every occurrence of 'word' in 'content' with its emoji.
        // Use the emojiMap for replacements.
        // for (let [word, emoji] of emojiMap) {
        // Grab the search regex for this word.
        // const regex = regexs.get(word);

        // Actually do the replacement / substitution.
        // Note: if 'word' does not appear in 'content', nothing happens.
        // content = content.replace(regex, '##EMOJI##');
        // content = content.replace(/Glo/g, '<mark>##EMOJIGlo</mark>');
        // }

        var token_username_regex = /lov/g;
        var token_username_match = token_username_regex.exec(content);
        // console.log("match token_username_match: " + token_username_match);

        const regexp = RegExp('lov', 'g');
        // console.log("matchcaount: " + content.match(regexp).length);
        var k = 0;

        var placebeforeNode = node.nextSibling;
        if (token_username_match) {
            var splits = content.split(/(:Glovebox:)/);

            if (node.parentNode.nodeName && node.parentNode.nodeName.toUpperCase() != 'MARK') {

                var count = splits.length;
                node.textContent = splits[0];
                for (n = 1; n < count; n++ && k < 10) {
                    if (n % 2 == 0) {
                        // asuming even numbered index is the text between the
                        // pattern match

                        // add remaining text node to parent, immediately after
                        // the text node
                        var remaningText = document.createTextNode(splits[n]);

                        node.parentNode.insertBefore(remaningText, placebeforeNode);

                    } else {
                        // asuming odd numbered index is the regexp pattern grab
                        // - which should be highlighted
                        console.log("highlight text: " + splits[n]);

                        // create mark node
                        const marktext = document.createElement("mark ");
                        // marktext.setAttribute("class ", " highlighted - text
                        // ");
                        marktext.appendChild(document.createTextNode(splits[n]));

                        console.log("new node: " + marktext.innerHTML);
                        // add mark node to parent, immediately after the text
                        // node
                        node.parentNode.insertBefore(marktext, placebeforeNode);

                    }
                    k++;
                }

            } else {
                console.log("already marked ");
            }

        }
    } else {
        // This node contains more than just text, call markGlovebox() on each
        // of its children.
        for (let i = 0; i < node.childNodes.length; i++) {
            markGlovebox(node.childNodes[i]);
        }
    }
}

// Now monitor the DOM for additions and substitute emoji into new nodes.
// @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver.
const observer2 = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // This DOM change was new nodes being added. Run our
                // substitution
                // algorithm on each newly added node.
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const newNode = mutation.addedNodes[i];
                    markGlovebox(newNode);
                }
            }
        });
    });
observer2.observe(document.body, {
    childList: true,
    subtree: true
});

async function get_default_signing_key_2() {
    console.log("#### get_default_signing_key_2:start");

    // This function returns a JSON structure contaning a public and private key suitable for digital signing and signature validation.
    // ( and also a keypai suitable for RSA encryption/dekryption)
    // If not such default key has been set, one is created and insterted into the database.
    // If a new key is created, it is inserted both under it's own unique identifier, as well as under the default identifier.

    // The function returns a Promise, which resolves to the key.


    //generates random id;
    let guid = () => {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    var defaultSigningKey;
    //var defaultSigningKey2;
    // look for default signing RSA key
    var newItem;
    var newItem2;

    var createdNewSigningKey = false;
    var enc_privkey_jwk;
    var enc_pubkey_jwk;
    var sign_privkey_jwk;
    var sign_pubkey_jwk;
    var testkeypairobj;
    var uuid;
    var dk;
    try {
        defaultSigningKey = await loadFromIndexedDB('keyPairsDB', 'keyPairsStore', 'defaultPrivateKey');
    } catch (e) {
        console.log(e);
    }
    //defaultSigningKey = dk;
    console.log(defaultSigningKey);
    console.log(typeof defaultSigningKey);
    if (typeof defaultSigningKey == 'undefined') {
        console.log("no default key found, create a new one");
        defaultSigningKey = await create_default_signing_key_3();
    } else if (defaultSigningKey.keyId == 'defaultPrivateKey') {
        // a default privatekey was found.
        console.log("use the default signing key that was found: " + JSON.stringify(defaultSigningKey));

    } else {
        // something was found, but there was something wrong with it, so create a new one
        console.log("an error was found, create a new one");
        defaultSigningKey = await create_default_signing_key_3();
    }
    // at this point there is a signing key available


    console.log("## get_default_signing_key_2 returning: " + JSON.stringify(defaultSigningKey));
    return defaultSigningKey;
}

async function create_default_signing_key_2() {
    console.log("#### create_default_signing_key_2:start");

    // This function returns a JSON structure contaning a public and private key suitable for digital signing and signature validation.
    // ( and also a keypai suitable for RSA encryption/dekryption)
    // The function returns a Promise, which resolves to the key.


    //generates random id;
    let guid = () => {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    var defaultSigningKey;
    //var defaultSigningKey2;
    // look for default signing RSA key
    var newItem;
    var newItem2;

    var createdNewSigningKey = false;
    var enc_privkey_jwk;
    var enc_pubkey_jwk;
    var sign_privkey_jwk;
    var sign_pubkey_jwk;
    var testkeypairobj;
    var uuid;
    var dk;

    console.log('###### testkeypairobj ' + testkeypairobj);

    //var d;
    //try {
    //    d = await loadFromIndexedDB('privateKeys', 'keyPairs', 'defaultPrivateKey');
    //} catch (e) {
    //    console.log(e);
    //}

    //console.log(d);
    // console.log(typeof d);
    // if (typeof d == "undefined") {
    console.log("no default signing priv key..");
    // make call to create one

    var key_pair_obj;
    key_pair_obj = await window.crypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 1024,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {
                name: 'SHA-1'
            },
        },
            true,
            ['sign', 'verify']); //.then(function (a) {
    //key_pair_obj = a;
    console.log("#### 2");

    console.log(key_pair_obj);
    console.log(typeof key_pair_obj);

    //        return window.crypto.subtle.exportKey('jwk', key_pair_obj.publicKey);
    var b = await window.crypto.subtle.exportKey('jwk', key_pair_obj.publicKey);
    //    }).then(function (b) {
    console.log(b);
    console.log(typeof b);
    sign_pubkey_jwk = b;
    console.log("#### 3");

    var c = await window.crypto.subtle.exportKey('jwk', key_pair_obj.privateKey);

    //        return window.crypto.subtle.exportKey('jwk', key_pair_obj.privateKey);
    //    }).then(function (c) {
    console.log(c);
    console.log(c.alg);
    // Have a valid RSA key been created ?
    if (c.alg == "RS1") {
        // ok, it has, set the flag to save it
        createdNewSigningKey = true;
    }

    console.log(typeof c);
    sign_privkey_jwk = c;
    console.log("#### 4");

    key_pair_obj = await window.crypto.subtle.generateKey({
            name: "RSA-OAEP",
            modulusLength: 1024,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {
                name: "SHA-256"
            },
        },
            true,
            ['encrypt', 'decrypt']);
    //    }).then(function (a) {
    console.log("#### 6");
    //      key_pair_obj = a;
    console.log(key_pair_obj);
    console.log(typeof key_pair_obj);

    //    return window.crypto.subtle.exportKey('jwk', key_pair_obj.publicKey);
    // }).then(function (b) {
    b = window.crypto.subtle.exportKey('jwk', key_pair_obj.publicKey);
    enc_pubkey_jwk = b;

    //    return window.crypto.subtle.exportKey('jwk', key_pair_obj.privateKey);
    // }).then(function (c) {
    //      enc_privatekey_jwk = c;
    enc_privatekey_jwk = await window.crypto.subtle.exportKey('jwk', key_pair_obj.privateKey);

    //  }
    console.log("#### 5");

    //  if (createdNewSigningKey) {

    uuid = guid();

    //      newItem = {
    //          keyId: uuid,
    //          uuid: uuid,
    //          "key": expkey.k,
    //          'jwk': expkey,
    //          "ext": true
    //       };
    defaultSigningKey = {
        'keyId': uuid,
        "uuid": uuid,
        "encryption_publicKey": enc_pubkey_jwk,
        "encryption_privateKey": enc_privkey_jwk,
        "signature_publicKeyJWK": sign_pubkey_jwk,
        "signature_privateKeyJWK": sign_privkey_jwk,

    };

    console.log("newitem: " + JSON.stringify(defaultSigningKey));

    //    });

    // at this point there is a signing key available

    console.log("create_default_signing_key_2 returning: " + JSON.stringify(defaultSigningKey));

    return defaultSigningKey;
}

async function create_default_signing_key_3() {
    console.log("#### create_default_signing_key_3:start");

    // This function returns a JSON structure contaning a public and private key suitable for digital signing and signature validation.
    // ( and also a keypai suitable for RSA encryption/dekryption)
    // The function returns a Promise, which resolves to the key.


    //generates random id;
    let guid = () => {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    var defaultSigningKey;
    //var defaultSigningKey2;
    // look for default signing RSA key
    var newItem;
    var newItem2;

    var createdNewSigningKey = false;
    var enc_privkey_jwk;
    var enc_pubkey_jwk;
    var sign_privkey_jwk;
    var sign_pubkey_jwk;
    var testkeypairobj;
    var uuid;
    var dk;

    console.log('###### testkeypairobj ' + testkeypairobj);

    //var d;
    //try {
    //    d = await loadFromIndexedDB('privateKeys', 'keyPairs', 'defaultPrivateKey');
    //} catch (e) {
    //    console.log(e);
    //}

    //console.log(d);
    // console.log(typeof d);
    // if (typeof d == "undefined") {
    console.log("no default signing priv key..");
    // make call to create one

    var key_pair_obj;
    key_pair_obj = await window.crypto.subtle.generateKey({
            name: 'RSASSA-PKCS1-v1_5',
            modulusLength: 1024,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {
                name: 'SHA-1'
            },
        },
            true,
            ['sign', 'verify']).then(function (a) {
            key_pair_obj = a;
            console.log("#### 2");

            console.log(key_pair_obj);
            console.log(typeof key_pair_obj);

            return window.crypto.subtle.exportKey('jwk', key_pair_obj.publicKey);
            //        var b = await window.crypto.subtle.exportKey('jwk', key_pair_obj.publicKey);
        }).then(function (b) {
            console.log(b);
            console.log(typeof b);
            sign_pubkey_jwk = b;
            console.log("#### 3");

            //        var c = await window.crypto.subtle.exportKey('jwk', key_pair_obj.privateKey);

            return window.crypto.subtle.exportKey('jwk', key_pair_obj.privateKey);
        }).then(function (c) {
            console.log(c);
            console.log(c.alg);
            // Have a valid RSA key been created ?
            if (c.alg == "RS1") {
                // ok, it has, set the flag to save it
                createdNewSigningKey = true;
            }

            console.log(typeof c);
            sign_privkey_jwk = c;
            console.log("#### 4");

            return window.crypto.subtle.generateKey({
                name: "RSA-OAEP",
                modulusLength: 1024,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: {
                    name: "SHA-256"
                },
            },
                true,
                ['encrypt', 'decrypt']);
        }).then(function (a) {
            console.log("#### 6");
            key_pair_obj = a;
            console.log(key_pair_obj);
            console.log(typeof key_pair_obj);

            return window.crypto.subtle.exportKey('jwk', key_pair_obj.publicKey);
        }).then(function (b) {
            //     b = window.crypto.subtle.exportKey('jwk', key_pair_obj.publicKey);
            enc_pubkey_jwk = b;

            return window.crypto.subtle.exportKey('jwk', key_pair_obj.privateKey);
        }).then(function (c) {
            enc_privatekey_jwk = c;
            //          enc_privatekey_jwk = await window.crypto.subtle.exportKey('jwk', key_pair_obj.privateKey);

            //  }
            console.log("#### 5");

            //  if (createdNewSigningKey) {

            uuid = guid();

            //      newItem = {
            //          keyId: uuid,
            //          uuid: uuid,
            //          "key": expkey.k,
            //          'jwk': expkey,
            //          "ext": true
            //       };
            defaultSigningKey = {
                'keyId': uuid,
                "uuid": uuid,
                "encryption_publicKey": enc_pubkey_jwk,
                "encryption_privateKey": enc_privkey_jwk,
                "signature_publicKeyJWK": sign_pubkey_jwk,
                "signature_privateKeyJWK": sign_privkey_jwk,

            };

            console.log("newitem: " + JSON.stringify(defaultSigningKey));
            return saveToIndexedDB('keyPairsDB', 'keyPairsStore', uuid, defaultSigningKey);
        }).then(function (c) {
            // as well as on the id designating it as the default
            defaultSigningKey.keyId = "defaultPrivateKey";

            return saveToIndexedDB('keyPairsDB', 'keyPairsStore', 'defaultSigningKey', defaultSigningKey);

        });

    // at this point there is a signing key available

    console.log("create_default_signing_key_3 returning: " + JSON.stringify(defaultSigningKey));
    console.log("#### create_default_signing_key_3:end");

    return defaultSigningKey;
}

// generate a new (symmetric) encryption key


// This function will generate a symmetric encryption key

// If there is no default encryption key designated, this key will also be designated the defaul encryption key

// The generated encryption key will also be added to the repository of decryption keys.

// A encryption key also requires a private key to sign it.
// This will by default be a private key designated as the default.
//If no default private signing key is present, one will also be created.


async function generate_encryption_key() {
    console.log("################");
    console.log("#### generate_encryption_key");
    console.log("################");

    var decryption_key_signature;
    var new_decryption_key;
    var new_encryption_key;
    var seconds_valid_duration_of_key = 3000000;

    //generates random id;
    let guid = () => {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    var sign_key;

    var sign_pubkey_obj;
    var sign_pubkey_jwk;

    var sign_privkey_obj;
    var sign_privkey_jwk;

    var uuid;
    var newItem;
    var algoKeyGen = {
        name: 'AES-GCM',
        //          length: 256
        length: 128
    };

    console.log('algoKeyGen: ' + JSON.stringify(algoKeyGen));

    var keyUsages = [
        'encrypt',
        'decrypt'
    ];

    // first, get the defaul RSA keypair with which to sign the encryption key.
    // Get default signing key
    // If there is on presente, use it, otherwise create one.


    console.log(' ###### call for a key ');
    get_default_signing_key_2().then(function (aw) {
        sign_key = aw;

        console.log(' ###### use signing key ');
        console.log(sign_key);
        //get_default_signing_key().then(function (s) {
        //  sign_key = s;
        console.log("sign_key: " + JSON.stringify(sign_key));

        sign_pubkey_jwk = sign_key.signature_publicKeyJWK;
        sign_privkey_jwk = sign_key.signature_privateKeyJWK;

        console.log(sign_pubkey_jwk);

        // exit early
        //return sign_key;

        // create the new symetric encryption key
        return window.crypto.subtle.generateKey(algoKeyGen, true, keyUsages);
    }).then(function (key) {
        // secretKey = key;
        console.log('generate_encryption_key');
        // make key into exportable form
        return window.crypto.subtle.exportKey('jwk', key);
    }).then(function (expkey) {

        console.log('expkey: ' + JSON.stringify(expkey));

        //generates random id;
        let guid = () => {
            let s4 = () => {
                return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }

        uuid = guid();

        // create timestamp for a give date
        console.log(new Date(Date.UTC(2018, 11, 1, 0, 0, 0)));

        // create timestamp for now
        console.log(Date.now());
        console.log(Date.UTC());

        // create a timestamp for a set time in the future
        // variable containign the number of seconds into the future the key is valid for
        var key_valid_for = 1000;

        var timeStamp = Math.floor(Date.now() / 1000);
        var validTo;
        validTo = timeStamp;
        var validFrom;

        validFrom = Date.now();

        console.log("seconds since epoc: " + validFrom);

        validTo = Date.now() + seconds_valid_duration_of_key;

        console.log("seconds since epoc to: " + validTo);

        // run some stats on the timestamps
        var diffInMilliSeconds = validTo - validFrom;
        // calculate days
        const days = Math.floor(diffInMilliSeconds / 86400);
        diffInMilliSeconds -= days * 86400;
        console.log('calculated days', days);

        // calculate hours
        const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
        diffInMilliSeconds -= hours * 3600;
        console.log('calculated hours', hours);

        // calculate minutes
        const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
        diffInMilliSeconds -= minutes * 60;
        console.log('minutes', minutes);

        // this example takes 2 seconds to run
        //    const start = Date.now();
        //    console.log('starting timer...');
        //    // expected output: starting timer...
        //    setTimeout(() => {
        //      const millis = Date.now() - start;
        //      console.log(`seconds elapsed = ${Math.floor(millis / 1000)}`);
        //      // expected output: seconds elapsed = 2
        //    }, 2000);


        // In the respository of decryption keys, the objects are signed (which is why a signing key was obtained above).
        // in the decryption respository the keys also have an expiration time and date.
        // decryption keys have the same unique identifier as encryption keys.( This is how they are matched up)
        // Encryption and decryption happens with the same key (its symmetric!)
        // validFrom is for future use and the value is included but ignored for now.
        // validTo has the UTV timestamp for when the key can not be used.
        // Any decryption key attempted to be used after the validTo time has passed is automatically and immediately removed from the decryptionkey respository.
        // autoReneval is a boolean and if set to true the automatic decryption key renewal process will be triggered before the key is been removed.


        new_encryption_key = {
            'keyId': uuid,
            "uuid": uuid,
            "key_jwk": expkey,
            "validFrom": validFrom,
            "publickey": sign_pubkey_jwk
        };

        new_decryption_key = {
            'keyId': uuid,
            "uuid": uuid,
            "key_jwk": expkey,
            "validFrom": validFrom,
            "validTo": validTo,
            "autoRenewal": "true",
            "autoRenewalUrl": "null",
            "publickey": sign_pubkey_jwk
        };

        // The signaturepart is added afterwards, and removed before signature validation..
        console.log("new_decryption_key: " + JSON.stringify(new_decryption_key));

        // create signature
        // the mesage to be signed is the serialized object containing at least the encryption key, the public key with which the signature can be verified and the expiration date.
        // the serialization need to be completely consitent.


        // var signature = await  sign(sign_pubkey_jwk ,JSON.stringify(new_decryption_key));

        //         return window.crypto.subtle.importKey('jwk', sign_privkey_jwk, {
        //            name: "RSASSA-PKCS1-v1_5",
        //            hash: {
        //                name: "SHA-1"
        //            },
        //        }, false, ['sign']);
        //    }).then(function(b){
        //   	// have the singing key in CryptoObject form
        //       sign_privkey_obj = b;
        //      console.log(sign_privkey_obj);

        const data = new TextEncoder().encode(JSON.stringify(new_decryption_key));
        console.log(data);
        // now proceed to sign the decryption key object

        return sign(sign_privkey_jwk, "message");

    }).then(function (c) {
        // have the singing key in CryptoObject form
        decryption_key_signature = c;
        console.log(decryption_key_signature);

        // create JWS
        // add signature to message;
        new_decryption_key.signature = decryption_key_signature;

        // put key into encryption key store

        console.log('data to be saved: ' + JSON.stringify(new_decryption_key));
        //  '{'keyId':"one","uuid":"two"}'
        return saveToIndexedDB_async('encryptionKeysDB', 'encryptionKeysStore', 'keyId', new_encryption_key);
    }).then(function (rc) {
        console.log(rc);
        // put into the decryption key store
        return saveToIndexedDB_async('decryptionKeysDB', 'decryptionKeysStore', 'keyId', new_decryption_key);
    }).then(function (rc) {
        console.log(rc);
        // check if there is a default encryption key and if not, make this the default key.

        // console.log('consider as possible new default key: ' + JSON.stringify(newItem));

        return loadFromIndexedDB('encryptionKeysDB', 'encryptionKeysStore', 'defaultSecretKey');

    }).then(function (currentdefaultkey) {

        console.log("background.js: getDefaultSecretKey:found=" + currentdefaultkey);
        console.log("background.js: getDefaultSecretKey:found=" + JSON.stringify(currentdefaultkey));

    }).catch(function (err) {
        console.log("background.js: err=\"" + err + "\"");
        // error
        // if error was "object not found" asume defaultencryptionkey not set, so set it now.
        console.log(err.toString().indexOf('object not found'));

        if (err.toString().includes("object not found")) {
            console.log("background.js: defaultkey not found, assign this key as it");
            // make a new default encryption key

            //        console.log('data to be saved on defaultkey: ' + JSON.stringify(newItem));
            new_encryption_key.keyId = 'defaultSecretKey';
            console.log('data to be saved on defaultkey: ' + JSON.stringify(new_encryption_key));

            saveToIndexedDB_async('encryptionKeysDB', 'encryptionKeysStore', 'keyId', new_encryption_key);

        }
        if (err == "Error: objectstore_error") {
            console.log("background.js: respond to objectstore error");

            var request4 = indexedDB.open('encryptionKeysDB', 1);
            request4.onupgradeneeded = function (event) {
                db = event.target.result;
                db.onerror = function (event) {};
                // Create an objectStore in this database to keep trusted decryption keys
                console.log("background.js: getDefaultSecretKey: create objectstore encryptionKeys in gloveboxKeys");
                console.log("background.js: attempt to create objectstore");
                var objectStore2 = db.createObjectStore('encryptionKeysStore', {
                        keyPath: 'keyId'
                    });

                objectStore2.createIndex('keyId', 'keyId', {
                    unique: true
                });
                console.log("background.js: attempt to create objectstore");

            };
            console.log("background.js: 4" + request4);
            console.log("background.js: 4" + JSON.stringify(request4));

            request4.onerror = function (event) {
                console.log("background.js:getDefaultSecretKey: dp open request error 201");
            };
            console.log("background.js: 5");
            request4.onsuccess = function (event) {
                console.log("background.js: 6" + event);
                var db_1;
                db_1 = event.target.result;
                console.log("background.js: 7" + db_1);
                db_1.onerror = function (event) {
                    console.log("background.js:getDefaultSecretKey: db open request error 2");
                };
                //   db_1.onsuccess = function (event) {
                console.log("background.js:getDefaultSecretKey: db open request success 2");

                console.log("background.js: attempt to create objectstore");
                var objectStore2 = db_1.createObjectStore('encryptionKeysStore', {
                        keyPath: 'keyId'
                    });

                objectStore2.createIndex('keyId', 'keyId', {
                    unique: true
                });
                console.log("background.js: attempt to create objectstore");

                console.log("create new default key");
                makeNewDefaultEncryptionKey().then(function (res) {
                    console.log("created new default key result:" + res);
                    resolve(res);

                });

                //  };
            };

        }

    });

    //});
}

function saveToIndexedDB_async(dbName, storeName, keyId, object) {
    console.log("saveToIndexedDB_async:begin");

    console.log("saveToIndexedDB_async:dbname " + dbName);
    console.log("saveToIndexedDB_async:objectstorename " + storeName);
    console.log("saveToIndexedDB_async:keyId " + keyId);
    console.log("saveToIndexedDB_async:object " + JSON.stringify(object));

    //  indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

    return new Promise(
        function (resolve, reject) {

        //console.log("saveToIndexedDB: 0 resolve=" + resolve )
        //console.log("saveToIndexedDB: 0 reject=" + reject )

        //if (object.taskTitle === undefined)
        //            reject(Error('object has no taskTitle.'));

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

                var objectRequest = objectStore.put(object); // Overwrite if already exists

                console.log("saveToIndexedDB:objectRequest: " + JSON.stringify(objectRequest));

                objectRequest.onerror = function (event) {
                    console.log("saveToIndexedDB:error: " + storeName);

                    reject(Error('Error text'));
                    console.log("saveToIndexedDB_async:end");
                };

                objectRequest.onsuccess = function (event) {
                    console.log("saveToIndexedDB:success: " + storeName);
                    resolve('Data saved OK');
                    console.log("saveToIndexedDB_async:end");
                };
            };

        } catch (error) {
            console.log(error);
            console.log("saveToIndexedDB_async:end");

        }

    });
    console.log("saveToIndexedDB_async:end");

}

async function saveToIndexedDB(dbName, storeName, id, object) {
    console.log("saveToIndexedDB(" + dbName + "," + storeName + "," + id + ", ...): begin");

    console.log("saveToIndexedDB:1 " + dbName);
    console.log("saveToIndexedDB:2 " + storeName);
    console.log("saveToIndexedDB:3 " + id);
    console.log("saveToIndexedDB:4 " + JSON.stringify(object));

    await saveToIndexedDB_async(dbName, storeName, id, object);

    console.log("saveToIndexedDB: completed");

}