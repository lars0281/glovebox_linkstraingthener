
console.log("edit-rule.js running");

// attach event listeners

try {

	attachButtonEventlisteners(document);
	

} catch (e) {
    console.log(e);
}

// Receive message from background-script
browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // if (sender.url === THIS_PAGE_URL)
    // return
    document.body.innerHTML += "<br>PopuP received a new msg: " + message.msg
    sendResponse({
        msg: "This is a response message sent from the browser-action-popup"
    })
    return true
});

// const THIS_PAGE_URL = chrome.runtime.getURL('popup.html')

// Send message from browser-action-popup to background-script
setTimeout(function () {

    browser.runtime.sendMessage({
        msg: "This is a message sent from the browser-action-popup to the background-script"
    })
    .then(response => { // Receive response from the background-script
        if (!response) {
            console.log("Popup sent a msg and received no response.")
            return
        }
        document.body.innerHTML += "<br>Popup sent a msg and received a response: " + response.msg
    })

}, 3000);


function attachButtonEventlisteners(node){
	
    // for step edit button(s)
    var htmlElements = node.getElementsByClassName("editstep_button");
    console.log(htmlElements);

    // loop through all edit steps and their buttons to attach event
    // listener to each one
    console.log(htmlElements.length);

    for (var i = 0; i < htmlElements.length; i++) {

        htmlElements[i].addEventListener('click',
            function (event) {
        	editStep(event);
        });

    }

    // for step "up" button(s)
    htmlElements = node.getElementsByClassName("upstep_button");
    console.log(htmlElements);

    // loop through all edit steps and their buttons to attach event
    // listener to each one
    console.log(htmlElements.length);

    for (var i = 0; i < htmlElements.length; i++) {

        htmlElements[i].addEventListener('click',
            function (event) {
        	upStep(event);
        });
    }

    // for step "down" button(s)
    htmlElements = node.getElementsByClassName("downstep_button");
    console.log(htmlElements);

    // loop through all edit steps and their buttons to attach event
    // listener to each one
    console.log(htmlElements.length);

    for (var i = 0; i < htmlElements.length; i++) {

        htmlElements[i].addEventListener('click',
            function (event) {
        	downStep(event);

        });
    }

    // for step "delete" button(s)
    htmlElements = node.getElementsByClassName("deletestep_button");
    console.log(htmlElements);

    // loop through all edit steps and their buttons to attach
    // event
    // listener to each one
    console.log(htmlElements.length);

    for (var i = 0; i < htmlElements.length; i++) {

        htmlElements[i].addEventListener('click',
            function (event) {
        	deleteStep(event);
        });
    }
    // add listener to the "add step" button

try{
    // addStep(event)
    node.getElementById('button_addstep').addEventListener('click',
        function (event) {
        addStep(event);
    });
}catch(e){
	console.log(e);
	
}
	
}

function editStep(event) {

    console.log("### edit begin");
    console.log(event);

    var this_row = event.target.parentNode.parentNode;
    console.log(this_row);

    var edit_cell = this_row.childNodes[1];

    
    var cell_text = edit_cell.textContent;

    console.log("edit: " + cell_text);

    // create drop-down list of permitted functions
// which function is currently specified
    // remove everything after the first "(", including the "("
    var current_function ="";
    
    current_function  = cell_text.replace(/\(.*/i, '');
    
    console.log("current_function: " + current_function);
    
    
    // create drop-down list
    
    var step_function_list = document.createElement('select');
var opt_1 = document.createElement('option');
opt_1.setAttribute("value", "base64_decode");
opt_1.appendChild(document.createTextNode("base64 decoding"));
step_function_list.appendChild(opt_1);

var opt_2 = document.createElement('option');
opt_2.setAttribute("value", "qs_param");
opt_2.appendChild(document.createTextNode("querystring parameter"));
step_function_list.appendChild(opt_2);

var opt_3 = document.createElement('option');
opt_3.setAttribute("value", "JSON_path");
opt_3.appendChild(document.createTextNode("JSON path"));
step_function_list.appendChild(opt_3);

var opt_4 = document.createElement('option');
opt_4.setAttribute("value", "regexp");
opt_4.appendChild(document.createTextNode("reg exp"));
step_function_list.appendChild(opt_4);

var opt_5 = document.createElement('option');
opt_5.setAttribute("value", "uri_decode");
opt_5.appendChild(document.createTextNode("uri decode"));
step_function_list.appendChild(opt_5);

var opt_6 = document.createElement('option');
opt_6.setAttribute("value", "replace_with");
opt_6.appendChild(document.createTextNode("replace with"));
step_function_list.appendChild(opt_6);

// make the current function pre-selected

var curr_opt = step_function_list.querySelector("option[value='" + current_function + "']");

console.log(curr_opt);
if(curr_opt){
	
	curr_opt.setAttribute('selected','true');
}



edit_cell.setAttribute("class","edit");
console.log(edit_cell);


edit_cell.appendChild(step_function_list);



    var newcell3 = document.createElement('input');
    newcell3.setAttribute("class", "edit");
    newcell3.setAttribute("type", "text");
    newcell3.setAttribute("value", "cell_text");
    
    // create new addstep button
  // var newbutton = document.createElement('button');
  // newbutton.setAttribute("class", "addstep_button");
  // newbutton.setAttribute("id", "button_addstep");
  // newbutton.appendChild(document.createTextNode("add this step"));
    //
    edit_cell.appendChild(newcell3);
   
    
    
    // change the text box containing the step text to be editable.

    // add a "save" button to the right side of the text box


    // generate_default_link_rules();
    console.log("### edit end");

}


function deleteStep(event) {

    console.log("### delete step");
    console.log(event);
    console.log(event.target);
    console.log(event.target.parentNode);
    console.log(event.target.parentNode.parentNode);
    console.log(event.target.parentNode.parentNode.childNodes);
    // generate_default_link_rules();
    console.log("### delete end");
    // delete the table row containing the step

    // change the numbers (subtract 1) for the steps
    // following this one

    var this_row = event.target.parentNode.parentNode;
    var current_rank = getRank(this_row);

    var stepCount = getStepCount(this_row.parentNode);
    // check if the removed row is the lastone

    var nextRow = this_row.nextSibling;
    // delete the row
    this_row.remove();

    console.log(nextRow);
    console.log(isStepRow(nextRow));
    var max_itt = 20;
    var i = 0;
    while (isStepRow(nextRow) && i < max_itt) {
        // re-number the row step
        console.log("renumber");
        console.log(nextRow);
        nextRow.childNodes[0].textContent = getRank(nextRow);
        nextRow = nextRow.nextSibling;

        i++;
    }


}


function downStep(event) {
    var this_row = event.target.parentNode.parentNode;
    var current_rank = getRank(this_row);

    var stepCount = getStepCount(this_row.parentNode);

    // check if there is a lower step (with a higher number)
    if (current_rank < stepCount) {
        // if so, proceed
        // console.log( "room below");


        // move this row one down by inserting the next row above this one


        var next_row = this_row.nextSibling;

        var it = this_row.parentNode.insertBefore(next_row, this_row);

        // rewrite the rank numbers displayed in the table

        this_row.childNodes[0].textContent = getRank(this_row);

        next_row.childNodes[0].textContent = getRank(next_row);

    } else {
        // , else stop
        // console.log( "no more room below");

    }

	
}

function upStep(event) {

    console.log("### move step up");
    // generate_default_link_rules();

    // calculate rank of this step
    // count step rows backward from current row
    // is this row a step row

    var this_row = event.target.parentNode.parentNode;

    var current_rank = getRank(this_row);
    // console.log("# selected step is of rank: " +
    // current_rank);

    // check if there is a higher step (with a lower number)
    if (current_rank > 1) {
        // if so, proceed
        // console.log( "move up");

        // move this row one up by inserting it above the row
        // above, thereby moving that row one down.
        var previous_row = this_row.previousSibling;

        var it = this_row.parentNode.insertBefore(this_row, previous_row);
        // rewrite the rank numbers displayed in the table
        this_row.childNodes[0].textContent = getRank(this_row);
        previous_row.childNodes[0].textContent = getRank(previous_row);
    } else {
        // ,else stop
        // console.log( "already on top");
    }

}

function addStep(event) {

    console.log("### add step");
    console.log(event);

    // add this step

    // set the rank number for this step

    var this_row = event.target.parentNode.parentNode;
    var current_rank = getRank(this_row);

    console.log(current_rank);
    // mark the row with current rank number
    this_row.childNodes[0].textContent = current_rank;
    this_row.childNodes[0].setAttribute("class", 'rank');
    // mark row as containing a step
    this_row.setAttribute("class", 'step_row');

    // add edit and control buttons
    
    var newbutton4 = document.createElement('button');
    newbutton4.setAttribute("class", "editstep_button");
    newbutton4.setAttribute("id", "editstep_button");
    newbutton4.appendChild(document.createTextNode("edit"));

    this_row.childNodes[2].appendChild(newbutton4);

    var newbutton5 = document.createElement('button');
    newbutton5.setAttribute("class", "upstep_button");
    newbutton5.setAttribute("id", "upstep_button");
    newbutton5.appendChild(document.createTextNode("up"));

    this_row.childNodes[2].appendChild(newbutton5);

    var newbutton6 = document.createElement('button');
    newbutton6.setAttribute("class", "deletestep_button");
    newbutton5.setAttribute("id", "deletestep_button");
    newbutton6.appendChild(document.createTextNode("delete"));

    this_row.childNodes[2].appendChild(newbutton6);

    var newbutton7 = document.createElement('button');
    newbutton7.setAttribute("class", "downstep_button");
    newbutton7.setAttribute("id", "downstep_button");
    newbutton7.appendChild(document.createTextNode("down"));

    this_row.childNodes[2].appendChild(newbutton7);
    this_row.childNodes[2].setAttribute("class", "buttons");

    // attach event listeners
    attachButtonEventlisteners(this_row);

    
  
    // var stepCount = getStepCount(this_row.parentNode);
    // check if the removed row is the last one

    // delete the add step button
    try{
   // this_row.getElementById('button_addstep').remove();
    this_row.querySelector('#button_addstep').remove();
    
    }catch(e){
    	
    }
    // add new row
    // popup_html= popup_html +'<tr class="blank"><td>' +
    // '</td><td class="value">'+ 'sample'
    // +'</td><td><button class="addstep_button"
    // id="button_addstep">add this
    // step</button></td></tr>';
    var newRow = document.createElement('tr');
    newRow.setAttribute("cellpadding", "0");
    newRow.setAttribute("class", "blank");

    var newcell = document.createElement('td');
    newcell.setAttribute("class", "blank");
    newRow.appendChild(newcell);
    var newcell2 = document.createElement('td');
    newcell2.setAttribute("class", "blank");
    newRow.appendChild(newcell2);
    var newcell3 = document.createElement('td');
    newcell3.setAttribute("class", "blank");
    
    
    
    // create new addstep button
    var newbutton = document.createElement('button');
    newbutton.setAttribute("class", "addstep_button");
    newbutton.setAttribute("id", "button_addstep");
    newbutton.appendChild(document.createTextNode("add this step"));

    
    
    //
    this_row.insertAdjacentElement('afterend', newRow);
    // attach event listener to the button
    newbutton.addEventListener('click',
        function (event) {
        addStep(event);
    });

    newcell3.appendChild(newbutton);
    newRow.appendChild(newcell3);

}

function getStepCount(node) {

    return node.querySelectorAll("tr.step_row").length;

}

function getRank(tablerownode) {
    // console.log(tablerownode);

    var max_itterations = 5;
    var m = 0;

    var rank = 1;

    var previous_row = tablerownode.previousSibling;
    while (m < max_itterations && isStepRow(previous_row)) {
        previous_row = previous_row.previousSibling;
        rank++;
        m++;

    }
    return rank;
}

function isStepRow(node) {

    if (node.getAttribute('class') == 'step_row') {
        console.log("yes");
        return true;
    } else {
        return false;
    }
}

/**
 * Listen for clicks on the buttons, and send the appropriate message to the
 * content script in the page.
 */
function listenForClicks() {
    document.addEventListener("click", (e) => {

        console.log("popup\choose_beast.js: start");
        /**
		 * Given the name of a beast, get the URL to the corresponding image.
		 */
        function beastNameToURL(beastName) {
            console.log("popup\choose_beast.js: beastNameToURL");
            switch (beastName) {
            case "Frog":
                return browser.extension.getURL("beasts/frog.jpg");
            case "Snake":
                return browser.extension.getURL("beasts/snake.jpg");
            case "Turtle":
                return browser.extension.getURL("beasts/turtle.jpg");
            }
        }

        /**
		 * Insert the page-hiding CSS into the active tab, then get the beast
		 * URL and send a "beastify" message to the content script in the active
		 * tab.
		 */
        function beastify(tabs) {
            console.log("popup\choose_beast.js: beastify");
            browser.tabs.insertCSS({
                code: hidePage
            }).then(() => {
                let url = beastNameToURL(e.target.textContent);
                browser.tabs.sendMessage(tabs[0].id, {
                    command: "beastify",
                    beastURL: url
                });
            });
        }

        /**
		 * Remove the page-hiding CSS from the active tab, send a "reset"
		 * message to the content script in the active tab.
		 */
        function reset(tabs) {
            console.log("popup\choose_beast.js: reset");
            browser.tabs.removeCSS({
                code: hidePage
            }).then(() => {
                browser.tabs.sendMessage(tabs[0].id, {
                    command: "reset",
                });
            });
        }

        /**
		 * Just log the error to the console.
		 */
        function reportError(error) {
            console.error(`Could not beastify: ${error}`);
        }

        /**
		 * Get the active tab, then call "beastify()" or "reset()" as
		 * appropriate.
		 */
        if (e.target.classList.contains("beast")) {
            browser.tabs.query({
                active: true,
                currentWindow: true
            })
            .then(beastify)
            .catch(reportError);
        } else if (e.target.classList.contains("reset")) {
            browser.tabs.query({
                active: true,
                currentWindow: true
            })
            .then(reset)
            .catch(reportError);
        }
    });
}
