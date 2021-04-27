/* global IDBFiles */
/* exported saveCollectedKeyBlobs, saveCollectedBlobs, loadStoredImages, removeStoredImages */

"use strict";

async function saveCollectedBlobs(collectionName, collectedBlobs) {
	 console.log("image-store.js: saveCollectedBlobs" );
	 console.log("image-store.js: saveCollectedBlobs: collectionName: " + collectionName );
	 console.log("image-store.js: saveCollectedBlobs: collectedBlobs: " + collectedBlobs );

  const storedImages = await IDBFiles.getFileStorage({name: "stored-images"});

 console.log("image-store.js: saveCollectedKeyBlobs: storedImages: " + storedImages);

 console.log("image-store.js: saveCollectedBlobs: 50" );

  for (const item of collectedBlobs) {
	 console.log("image-store.js: saveCollectedBlobs: item: " + item );
    await storedImages.put(`${collectionName}/${item.uuid}`, item.blob);
  }
}

async function saveCollectedKeyBlobs(collectionName, collectedKeyBlobs) {
	 console.log("image-store.js: saveCollectedKeyBlobs" );
	 console.log("image-store.js: saveCollectedKeyBlobs: collectionName: " + collectionName );
console.log("image-store.js: saveCollectedKeyBlobs: collectedKeyBlobs: " + collectedKeyBlobs );

  const storedKeys = await IDBFiles.getFileStorage({name: "stored-images"});

 console.log("image-store.js: saveCollectedKeyBlobs: storedKeys: " + storedKeys);

 console.log("image-store.js: saveCollectedKeyBlobs: 51" );

  //for (const item of collectedBlobs) {
  
 console.log("image-store.js: saveCollectedKeyBlobs: item 1: " + new Blob(['hello world']) );
 console.log("image-store.js: saveCollectedKeyBlobs: item 2: " + new Blob([collectedKeyBlobs]) );


console.log("image-store.js: saveCollectedKeyBlobs: item: " + collectedKeyBlobs );

// Store in localstorage
localStorage.setItem(collectionName + "lastname", collectedKeyBlobs);


//await storedImages.put(`${collectionName}/${item.uuid}`, collectedKeyBlobs);
//await storedKeys.put( collectionName, collectedKeyBlobs);
await storedKeys.put( collectionName, new Blob([collectedKeyBlobs]));


// test by carrying out a read back
 console.log("image-store.js: saveCollectedKeyBlobs: start readback " );
 const imagesStore = await IDBFiles.getFileStorage({name: "stored-images"});
var filter = 'a';
 let listOptions = filter ? {includes: filter} : undefined;
 const imagesList = await imagesStore.list(listOptions);

let storedImages =[];
for (const storedName of imagesList) {
    const blob = await imagesStore.get(storedName);

 console.log("image-store.js: saveCollectedKeyBlobs: reading: " + blob);
 console.log("image-store.js: saveCollectedKeyBlobs: reading: " + URL.createObjectURL(blob));
    storedImages.push({storedName, blobUrl: URL.createObjectURL(blob)});
  }
// }
}


async function loadStoredImages(filter) {
	 console.log("image-store.js: loadStoredImages" );
  const imagesStore = await IDBFiles.getFileStorage({name: "stored-images"});

  let listOptions = filter ? {includes: filter} : undefined;
  const imagesList = await imagesStore.list(listOptions);

  let storedImages = [];

  for (const storedName of imagesList) {
    const blob = await imagesStore.get(storedName);

    storedImages.push({storedName, blobUrl: URL.createObjectURL(blob)});
  }

  return storedImages;
}


async function removeStoredImages(storedImages) {
	 console.log("image-store.js: removeStoredImages" );
  const imagesStore = await IDBFiles.getFileStorage({name: "stored-images"});
  for (const storedImage of storedImages) {
    URL.revokeObjectURL(storedImage.blobUrl);
    await imagesStore.remove(storedImage.storedName);
  }
}
