


export  function loadFromIndexedDB_async(dbName, storeName, id) {
    console.log("loadFromIndexedDB:0");
    console.log("loadFromIndexedDB:1 " + dbName);
    console.log("loadFromIndexedDB:2 " + storeName);
    console.log("loadFromIndexedDB:3 " + id);

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
            //  console.log("loadFromIndexedDB:onsuccess ");

            var database = event.target.result;
            var transaction = database.transaction([storeName]);
            //  console.log("loadFromIndexedDB:transaction: " + JSON.stringify(transaction));
            var objectStore = transaction.objectStore(storeName);
            //  console.log("loadFromIndexedDB:objectStore: " + JSON.stringify(objectStore));
            var objectRequest = objectStore.get(id);

            // console.log("loadFromIndexedDB:objectRequest: " + JSON.stringify(objectRequest));


try {
	

            objectRequest.onerror = function (event) {
               // reject(Error('Error text'));
			reject('Error text');
            };

            objectRequest.onsuccess = function (event) {
                if (objectRequest.result) {
                    console.log("loadFromIndexedDB:result " + JSON.stringify(objectRequest.result));

                    resolve(objectRequest.result);
                } else {
                    //reject(Error('object not found'));
				reject('object not found');
					
                }
            };
			
			   } catch (error) {
            console.log(error);
         
        }

        };
    });
}

export async function loadFromIndexedDB(dbName, storeName, id) {
    console.log("loadFromIndexedDB:0");
    console.log("loadFromIndexedDB:1 " + dbName);
    console.log("loadFromIndexedDB:2 " + storeName);
    console.log("loadFromIndexedDB:3 " + id);

    await loadFromIndexedDB_async(dbName, storeName, id);

}

export async function generateRSAKeyPair() {
    // for signing
    // name: "RSASSA-PKCS1-v1_5"
    // for encryption
    // name: "RSA-OAEP"

    console.log("generateRSAKeyPair");

    const key = await window.crypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 1024,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {
                name: "SHA-1"
            },
        },
            true,
            ["sign", "verify"]);

    const key2 = await window.crypto.subtle.generateKey({
            name: "RSA-OAEP",
            modulusLength: 1024,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {
                name: "SHA-1"
            },
        },
            true,
            ["encrypt", "decrypt"]);

    return {
        RSASSAPKCS1v1_5_privateKey: await window.crypto.subtle.exportKey(
            "jwk",
            key.privateKey, ),
        RSASSAPKCS1v1_5_publicKey: await window.crypto.subtle.exportKey(
            "jwk",
            key.publicKey, ),
        RSAOAEP_privateKey: await window.crypto.subtle.exportKey(
            "jwk",
            key2.privateKey, ),
        RSAOAEP_publicKey: await window.crypto.subtle.exportKey(
            "jwk",
            key2.publicKey, ),
    };
}

export function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

export function base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    const buffer = new ArrayBuffer(8);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

export function saveToIndexedDB_async(dbName, storeName, keyId, object) {

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

export async function saveToIndexedDB(dbName, storeName, id, object) {

    console.log("saveToIndexedDB:1 " + dbName);
    console.log("saveToIndexedDB:2 " + storeName);
    console.log("saveToIndexedDB:3 " + id);
    console.log("saveToIndexedDB:4 " + JSON.stringify(object));

    await saveToIndexedDB_async(dbName, storeName, id, object);

}

export function deleteFromIndexedDB_async(dbName, storeName, keyId) {
    console.log("deleteFromIndexedDB:1 " + dbName);
    console.log("deleteFromIndexedDB:2 " + storeName);
    console.log("deleteFromIndexedDB:3 " + keyId);

    //  indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

    return new Promise(
        function (resolve, reject) {

        var dbRequest = indexedDB.open(dbName);

        //  console.log("deleteFromIndexedDB: 1 dbRequest=" + dbRequest)

        dbRequest.onerror = function (event) {
            console.log("deleteFromIndexedDB:error.open:db " + dbName);
            reject(Error("IndexedDB database error"));
        };

        //  console.log("deleteFromIndexedDB: 2")

        dbRequest.onupgradeneeded = function (event) {
            console.log("deleteFromIndexedDB: 21")
            var database = event.target.result;
            console.log("deleteFromIndexedDB:db create obj store " + storeName);
            var objectStore = database.createObjectStore(storeName, {
                    keyId: keyId
                });
        };

        // console.log("deleteFromIndexedDB: 3")

        dbRequest.onsuccess = function (event) {
            //       console.log("deleteFromIndexedDB: 31")
            var database = event.target.result;
            var transaction = database.transaction([storeName], 'readwrite');
            var objectStore = transaction.objectStore(storeName);
            var objectRequest = objectStore.delete(keyId); // Overwrite if exists

            objectRequest.onerror = function (event) {
                console.log("deleteFromIndexedDB:error: " + storeName + "/" + keyId);

                reject(Error('Error text'));
            };

            objectRequest.onsuccess = function (event) {
                console.log("deleteFromIndexedDB:success: " + storeName + "/" + keyId);
                resolve('Data saved OK');
            };
        };
    });
}

export async function deleteFromIndexedDB(dbName, storeName, keyId) {
    console.log("deleteFromIndexedDB:1 " + dbName);
    console.log("deleteFromIndexedDB:2 " + storeName);
    console.log("deleteFromIndexedDB:3 " + keyId);

    await deleteFromIndexedDB_async(dbName, storeName, keyId);

    //  indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

}

/**
 * Secure Hash Algorithm (SHA1)
 * http://www.webtoolkit.info/
 **/
export function SHA1(msg) {
    console.log("navigate-collection:SHA1");
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
