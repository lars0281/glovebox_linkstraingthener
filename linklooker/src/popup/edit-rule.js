
console.log("edit-rule.js running");

// attach event listeners


// read the rule to be edited from storage
console.log("read back: " + browser.storage.sync.get(['dataValue2', 'type', 'key'], function (data) {
        console.log(data);
    }));

browser.storage.sync.get(['editThisRule', 'type', 'key']).then(function (data) {
    // console.log(data);
    console.log(JSON.stringify(data));
    // step through the rule object and populate the tables
    var rule = data.editThisRule;

    var direction = rule.direction;

    var popup_html = "";
    // make update to the html to reflect the information in the rule and what
    // kind of rule it is.
    // The html should be disturbed as little as possible since the html should
    // properly be created by a separate editor ( as far as possible).


    document.querySelectorAll("table.single_rule_table tr td[j_name=scope]")[0].textContent = rule.scope;
    document.querySelectorAll("table.single_rule_table tr td[j_name=direction]")[0].textContent = rule.direction;

    document.querySelectorAll("table.single_rule_table tr td[j_name=url_match]")[0].textContent = rule.url_match;
    document.querySelectorAll("table.single_rule_table tr td[j_name=notes]")[0].textContent = rule.notes;

    document.querySelectorAll("table.single_rule_table tr td[j_name=createtime]")[0].textContent = rule.createtime;

    // if no modified time, just use createtime
    if (rule.lastmodifiedtime != null) {
        document.querySelectorAll("table.single_rule_table tr td[j_name=lastmodifiedtime]")[0].textContent = rule.lastmodifiedtime;
    } else {
        console.log("no modified");

        document.querySelectorAll("table.single_rule_table tr td[j_name=lastmodifiedtime]")[0].textContent = rule.createtime;

    }

    // scope
    if (rule.scope == "Fulldomain") {

        document.querySelectorAll("table.single_rule_table tr td[j_name=scope]")[0].textContent = "Fully qualified Domainname";

    } else if (rule.scope == "Domain") {

        document.querySelectorAll("table.single_rule_table tr td[j_name=scope]")[0].textContent = "Domain";

    } else if (rule.scope == "Url") {
        document.querySelectorAll("table.single_rule_table tr td[j_name=scope]")[0].textContent = "Url";

    }

    // set up the table with steps
    // pic the first line in the table of steps
    var step_template = document.querySelectorAll("tr.step_row")[0];

    console.log(step_template);

    // loop through the steps in the rule and clone the step node as required.

    console.log(rule.steps);
    console.log(rule.steps.length);
    console.log(JSON.stringify(rule.steps));

    // The template page has one table row for description of the step, use this
    // row first

    var last_row = document.querySelectorAll("tr.step_row")[0];

    attachButtonEventlisteners(last_row);

    // all rules must have at least one step
    var s = 0;
    last_row.querySelector("td.rank").textContent = (s + 1);
    last_row.querySelector("td[j_name=procedure]").textContent = rule.steps[s].procedure;
    // loop through parameters - assume just one paramater for now
    if (rule.steps[s].parameters.length > 0) {
        var p = 0;
        console.log("parameter: " + JSON.stringify(rule.steps[s].parameters));
        console.log(new_row);

        var last_param_row = last_row.querySelectorAll("tr.parameter")[0];
        console.log(last_param_row);
        last_param_row.querySelector("td[j_name=value]").textContent = rule.steps[s].parameters[p].value;
        last_param_row.querySelector("td[j_name=notes]").textContent = rule.steps[s].parameters[p].notes;

        // are there more parameters?
        p = 1;
        while (p < rule.steps[s].parameters.length && p < 12) {
            // add another parameter
            // ok, need another row so clone the last row (and edit it)
            var new_param_row = last_param_row.cloneNode(true);
            new_param_row.querySelector("td[j_name=value]").textContent = rule.steps[s].parameters[p].value;
            new_param_row.querySelector("td[j_name=notes]").textContent = rule.steps[s].parameters[p].notes;

            last_param_row.insertAdjacentElement('afterend', new_param_row);

            // make the new parameter row the last row
            last_param_row = new_param_row;
            p++;
        }
    }

    last_row.querySelector("td.notes").textContent = rule.steps[s].notes;

    // are there additional steps ?
    s = 1;
    // also impose a maximum limit
    while (s < rule.steps.length && s < 12) {
        console.log(rule.steps[s]);
        console.log(JSON.stringify(rule.steps[s]));

        // ok, need another row so clone the last row (and edit it)
        var new_row = step_template.cloneNode(true);

        new_row.querySelector("td.rank").textContent = (s + 1);
        new_row.querySelector("td[j_name=procedure]").textContent = rule.steps[s].procedure;

        // Loop through parameters - assume just one parameter for now
        // setup a table for the parameter and notes
        // A parameter is not required, but rather than leaving the table empty,
        // set "N/A".
        console.log(rule.steps[s].parameters);
        console.log(JSON.stringify(rule.steps[s].parameters));
        console.log("parameter count: " + rule.steps[s].parameters.length);
        if (rule.steps[s].parameters.length > 0) {
            var p = 0;
            console.log("parameter: " + JSON.stringify(rule.steps[s].parameters));
            console.log(new_row);

            var last_param_row = new_row.querySelectorAll("tr.parameter")[0];
            console.log(last_param_row);
            last_param_row.querySelector("td[j_name=value]").textContent = rule.steps[s].parameters[p].value;
            last_param_row.querySelector("td[j_name=notes]").textContent = rule.steps[s].parameters[p].notes;

            // are there more parameters?
            p = 1;
            while (p < rule.steps[s].parameters.length && p < 12) {
                // add another parameter
                // ok, need another row so clone the last row (and edit it)
                var new_param_row = last_param_row.cloneNode(true);
                new_param_row.querySelector("td[j_name=value]").textContent = rule.steps[s].parameters[p].value;
                new_param_row.querySelector("td[j_name=notes]").textContent = rule.steps[s].parameters[p].notes;

                last_param_row.insertAdjacentElement('afterend', new_param_row);

                // make the new parameter row the last row
                last_param_row = new_param_row;
                p++;
            }
        }
        new_row.querySelector("td[j_name=notes]").textContent = rule.steps[s].notes;

        // append this new row and make the inserted row the new last row
        // last_row = last_row.parentNode.insertBefore( p3, last_row);
        last_row.insertAdjacentElement('afterend', new_row);

        // make the new row the last row
        last_row = new_row;
         attachButtonEventlisteners(last_row);
        s++;
    }

    // rule.sourceFulldomain


    //
    // add listener to the "add step" button

    try {
        // addStep(event)
        document.getElementById('button_addstep').addEventListener('click',
            function (event) {
            addStep(event);
        });
    } catch (e) {
        console.log(e);

    }

    // add listener to the "SAVE" button

    try {
        // addStep(event)
        document.getElementById('save_changes_button').addEventListener('click',
            function (event) {
            saveChanges(event);
        });
    } catch (e) {
        console.log(e);

    }

    // add listener to the "edit rule" button

    try {
        // addStep(event)
        document.getElementById('edit_rule_button').addEventListener('click',
            function (event) {
            editRule(event);
        });
    } catch (e) {
        console.log(e);

    }

    
    
    console.log(JSON.stringify(rule));
});

// delete from storage


// Receive message from background-script
browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // if (sender.url === THIS_PAGE_URL)
    // return
    console.log("<br>PopuP received a new msg: " + message.msg);

    sendResponse({
        msg: "This is an auto-response message sent from the popup"
    })
    return true
});

// const THIS_PAGE_URL = chrome.runtime.getURL('popup.html')

// Send message from browser-action-popup to background-script
setTimeout(function () {

    browser.runtime.sendMessage({
        msg: "This is a message sent from the browser-action-popup to the admin page"
    })
    .then(response => { // Receive response from the background-script
        if (!response) {
            console.log("Popup sent a msg and received no response.")
            return
        }
        // document.body.innerHTML += "<br>Popup sent a msg and received a
        // response: " + response.msg
    })

}, 3000);

function attachButtonEventlisteners(node) {

    console.log("#start attachButtonEventlisteners");

    // for step edit button(s)
    var htmlElements = node.getElementsByClassName("editstep_button");
    // console.log(htmlElements);

    // loop through all edit steps and their buttons to attach event
    // listener to each one
    // console.log(htmlElements.length);

    for (var i = 0; i < htmlElements.length; i++) {

        // console.log("## attach");
        // console.log(htmlElements[i]);

        htmlElements[i].addEventListener('click',
            function (event) {
            editStep(event);
        });

    }

    // for step "up" button(s)
    htmlElements = node.getElementsByClassName("upstep_button");
    // console.log(htmlElements);

    // loop through all edit steps and their buttons to attach event
    // listener to each one
    // console.log(htmlElements.length);

    for (var i = 0; i < htmlElements.length; i++) {
        // console.log("## attach");
        // console.log(htmlElements[i]);

        htmlElements[i].addEventListener('click',
            function (event) {
            upStep(event);
        });
    }

    // for step "down" button(s)
    htmlElements = node.getElementsByClassName("downstep_button");
    // console.log(htmlElements);

    // loop through all edit steps and their buttons to attach event
    // listener to each one
    // console.log(htmlElements.length);

    for (var i = 0; i < htmlElements.length; i++) {
        // console.log("## attach");
        // console.log(htmlElements[i]);

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
        // console.log("## attach");
        // console.log(htmlElements[i]);

        htmlElements[i].addEventListener('click',
            function (event) {
            deleteStep(event);
        });
    }

}



function editRule(event) {

    console.log("### edit begin");
    console.log(event);
    
    // mark fields editable
    
    var edit_cell2 = document.querySelector("#notes_table td[j_name=notes]");
    console.log(edit_cell2);
    edit_cell2.setAttribute("contenteditable", "true");
    // also , change class to signify editable
    edit_cell2.setAttribute("class", "value_editable");

    
    
    // replace edit button with save button

    
    // create save button
       var newbutton_3 = document.createElement('button');
    newbutton_3.setAttribute("class", "rulelevel_button");
     newbutton_3.setAttribute("id", "save_rule_button");
    newbutton_3.appendChild(document.createTextNode("Save Rule"));

	document.querySelector("#edit_rule_button").insertAdjacentElement('afterend', newbutton_3);
    
  document.querySelector("#edit_rule_button").remove();
    
    
    
    
    // add listener to the "edit rule" button

    try {
        // addStep(event)
        document.getElementById('save_rule_button').addEventListener('click',
            function (event) {
        	saveRuleChanges(event);
        });
    } catch (e) {
        console.log(e);

    }
    
    

}


function saveRuleChanges(event) {

    console.log("### save begin");
    console.log(event);
    
    
    // save changes to database
    
    // keyid
    var keyId = document.querySelector("table.single_rule_table tr td[j_name=url_match]").textContent;

    
    var direction = document.querySelector("table.single_rule_table tr td[j_name=direction]").textContent;

    var scope = document.querySelector("table.single_rule_table tr td[j_name=scope]").textContent;

    
    // get value of notes field and save it to the object in the database
    
    var scope = document.querySelector("table.single_rule_table tr td[j_name=scope]").textContent;
    
    // wash-out objectionable characters
    
    
    // mark fields non-editable
    var edit_cell2 = document.querySelector("#notes_table td[j_name=notes]");
        console.log(edit_cell2);
        edit_cell2.setAttribute("contenteditable", "false");
        // also , change class to signify editable
        edit_cell2.setAttribute("class", "value");
    
    
    // replace save button with edit button
    
    // create edit button
    var newbutton_3 = document.createElement('button');
    newbutton_3.setAttribute("class", "rulelevel_button");
     newbutton_3.setAttribute("id", "edit_rule_button");
    newbutton_3.appendChild(document.createTextNode("Edit Rule"));

	document.querySelector("#save_rule_button").insertAdjacentElement('afterend', newbutton_3);
    
  document.querySelector("#save_rule_button").remove();
    
    
    // add listener to the "edit rule" button

    try {
        // addStep(event)
        document.getElementById('edit_rule_button').addEventListener('click',
            function (event) {
            editRule(event);
        });
    } catch (e) {
        console.log(e);

    }
    

    
    var new_obj = readObject();
    



    saveUpdateToIndexedDB_async(direction + scope + 'RuleDB', direction + scope + 'RuleStore', 'keyId', new_obj);
    
}



function editStep(event) {

    console.log("### edit begin");
    console.log(event);

    var this_row = event.target.parentNode.parentNode;
    console.log(this_row);

    var edit_cell = this_row.querySelectorAll("td[j_name=procedure]")[0];

    var cell_text = edit_cell.textContent;

    console.log("edit: " + cell_text);

    // create drop-down list of permitted functions
    // which function is currently specified
    // remove everything after the first "(", including the "("
    var current_function = "";

    current_function = cell_text.replace(/\(.*/i, '');

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
    if (curr_opt) {

        curr_opt.setAttribute('selected', 'true');
    }

    edit_cell.setAttribute("class", "edit");
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

    // make step (and parameter) notes box editable

    var edit_cell2 = this_row.querySelectorAll("td[class=notes]");
    var n = 0;
    while (n < edit_cell2.length && n < 12) {
        console.log(edit_cell2[n]);
        edit_cell2[n].setAttribute("contenteditable", "true");
        // also , change class to signify editable
        edit_cell2[n].setAttribute("class", "notes_editable");
        n++;
    }

    // make parameter values editable

    var edit_cells3 = this_row.querySelectorAll("tr.parameter td[class=value]");
    var m = 0;
    while (m < edit_cells3.length && m < 12) {
        console.log(edit_cells3[m]);
        edit_cells3[m].setAttribute("contenteditable", "true");
        // also , change class to signify editable
        edit_cells3[m].setAttribute("class", "value_editable");
        m++;
    }

    // add buttons to each parameters: delete, up, down
    // add button to add parameter

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

    var stepCount = getStepCount();
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
    console.log("# move down step");
    var this_row = event.target.parentNode.parentNode;
    var current_rank = getRank(this_row);

    var stepCount = getStepCount();

    // check if there is a lower step (with a higher number)
    if (current_rank < stepCount) {
        // if so, proceed
        // console.log( "room below");


        // move this row one down by inserting the next row above this one


        var next_row = this_row.nextSibling;

        var it = this_row.parentNode.insertBefore(next_row, this_row);

        // rewrite the rank numbers displayed in the table

        this_row.querySelector("td.rank").textContent = getRank(this_row);

        next_row.querySelector("td.rank").textContent = getRank(next_row);

    } else {
        // , else stop
        // console.log( "no more room below");

    }

}

/*
 * */

function saveChanges(event) {

    console.log("### saveChanges");

    // run through all fields and compose the rule from all values found.

    // the rule object will be updates, to the keyid must remain the same.


    var this_row = event.target.parentNode.parentNode;

    // keyid
    var keyId = this_row.querySelector("table.single_rule_table tr td[j_name=url_match]").textContent;

    
    var direction = this_row.querySelector("table.single_rule_table tr td[j_name=direction]").textContent;

    var scope = this_row.querySelector("table.single_rule_table tr td[j_name=scope]").textContent;

    
    // get value of notes field and save it to the object in the database
    
    var scope = this_row.querySelector("table.single_rule_table tr td[j_name=scope]").textContent;
   
    var new_obj = readObject();
  
    
    
    
    // make parameter values non-editable

    var edit_cells3 = this_row.querySelectorAll("tr.parameter td[class=value_editable]");
    var m = 0;
    while (m < edit_cells3.length && m < 12) {
        console.log(edit_cells3[m]);
        edit_cells3[m].setAttribute("contenteditable", "false");
        // also , change class to signify editable
        edit_cells3[m].setAttribute("class", "value");
        m++;
    }

    // save the object in the right db

    // compute db names based on direction and scope


    saveUpdateToIndexedDB_async(direction + scope + 'RuleDB', direction + scope + 'RuleStore', 'keyId', new_obj);

}


/* read the rule object from the form as it exists at the moment */
function readObject(){
	
	
	  // compose object

    var new_obj = JSON.parse('{"keyid":"keyid" }');

    console.log(JSON.stringify(new_obj));

    // keyid
    var keyId = document.querySelector("table.single_rule_table tr td[j_name=url_match]").textContent;

    // validate data content
    console.log(keyId);

    new_obj.keyId = keyId;

    // url_match
    var url_match = document.querySelector("table.single_rule_table tr td[j_name=url_match]").textContent;

    // validate data content

    new_obj.url_match = url_match;
    // direction
    var direction = document.querySelector("table.single_rule_table tr td[j_name=direction]").textContent;

    // validate data content
    console.log(direction);

    new_obj.direction = direction;
    // scope
    var scope = document.querySelector("table.single_rule_table tr td[j_name=scope]").textContent;

    // validate data content

    new_obj.scope = scope;

    
   
    // steps
    var steps = [];

    var st = document.querySelectorAll("table.steps_table tr.step_row");
    var s = 0;
    while (s < st.length && s < 12) {
        console.log(st[s]);
        // st[m].setAttribute("contenteditable", "false");

        var param = st[s].querySelector("td[j_name=procedure]").textContent;

        var step = JSON.parse('{"procedure":"' + param + '"}');

        console.log(JSON.stringify(step));

        // parameters
        var parameters = [];
        var pt = st[s].querySelectorAll("table.parameters_table tr.parameter");
        console.log(pt);

        var p = 0;
        while (p < pt.length && p < 12) {
            console.log(pt[p]);

            var value = pt[p].querySelector("td[j_name=value]").textContent;

            var notes = pt[p].querySelector("td[j_name=notes]").textContent;

            var parameter = JSON.parse('{"value":"' + value + '","notes":"' + notes + '"}');

            parameters.push(parameter);
            p++;
        }
        step.parameters = parameters;

        var notes = st[s].querySelector("td[j_name=notes]").textContent;

        step.notes = notes;
        console.log(JSON.stringify(step));
        steps.push(step);

        s++;
    }

    new_obj.steps = steps;

    // notes
    var notes = document.querySelector("table.single_rule_table tr td[j_name=notes]").textContent;

    // validate data content
    new_obj.notes = notes;
    // createtime

    var createtime = document.querySelector("td[j_name=createtime]").textContent;
    // validate data format

    new_obj.createtime = createtime;
    // modifytime

    try {
        // compute current timestamp
        var today = new Date();

        var YYYY = today.getFullYear();
        var MM = (today.getMonth() + 1);
        var DD = (today.getDate() + 1);

        if (MM < 10) {
            MM = "0" + MM;
        }

        if (DD < 10) {
            DD = "0" + DD;
        }

        var HH = (today.getHours() + 1);

        if (HH < 10) {
            HH = "0" + HH;
        }

        var mm = (today.getMinutes() + 1);

        if (mm < 10) {
            mm = "0" + mm;
        }

        var ss = (today.getSeconds() + 1);

        if (ss < 10) {
            ss = "0" + ss;
        }

        var dateTime = YYYY + MM + DD + HH + mm + ss;

        console.log(dateTime);

        // validate data format
        new_obj.lastmodifiedtime = dateTime;
    } catch (e) {}

    console.log(JSON.stringify(new_obj));

    return new_obj;
	
}


function saveUpdatedAttributeToIndexedDB_async(dbName, storeName, keyId, attribute, object) {

    console.log("saveUpdatedFieldToIndexedDB_async:dbname " + dbName);
    console.log("saveUpdatedFieldToIndexedDB_async:objectstorename " + storeName);
    console.log("saveUpdatedFieldToIndexedDB_async:keyId " + keyId);
    console.log("saveUpdatedFieldToIndexedDB_async:attribute " + attribute);
    console.log("saveUpdatedFieldToIndexedDB_async:object " + JSON.stringify(object));

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
            console.log("saveUpdatedFieldToIndexedDB_async: 1 dbRequest=" + dbRequest);

            dbRequest.onerror = function (event) {
                console.log("saveUpdatedFieldToIndexedDB_async:error.open:db " + dbName);
                reject(Error("IndexedDB database error"));
            };

            console.log("saveUpdatedFieldToIndexedDB_async: 2" + JSON.stringify(dbRequest));

            console.log("saveUpdatedFieldToIndexedDB_async: 3" + JSON.stringify(dbRequest));
            try {

                dbRequest.onsuccess = function (event) {
                    console.log("saveUpdatedFieldToIndexedDB_async: 31");
                    var database = event.target.result;
                    console.log("saveUpdatedFieldToIndexedDB_async: 32");
                    var transaction = database.transaction([storeName], 'readwrite');
                    console.log("saveUpdatedFieldToIndexedDB_async: 33");
                    var objectStore = transaction.objectStore(storeName);
                    console.log("saveUpdatedFieldToIndexedDB_async:objectStore put: " + JSON.stringify(object));

                    var objectRequest = objectStore.put(object); // Overwrite
																	// if
                    // already
                    // exists

                    console.log("saveUpdatedFieldToIndexedDB_async:objectRequest: " + JSON.stringify(objectRequest));

                    objectRequest.onerror = function (event) {
                        console.log("saveUpdatedFieldToIndexedDB_async:error: " + storeName);

                        reject(Error('Error text'));
                    };

                    objectRequest.onsuccess = function (event) {
                        console.log("saveUpdatedFieldToIndexedDB_async:success: " + storeName);
                        resolve('Data saved OK');
                    };
                };

            } catch (error) {
                console.log(error);

            }

        });
	
}


function saveUpdateToIndexedDB_async(dbName, storeName, keyId, object) {

    console.log("saveUpdateToIndexedDB_async:dbname " + dbName);
    console.log("saveUpdateToIndexedDB_async:objectstorename " + storeName);
    console.log("saveUpdateToIndexedDB_async:keyId " + keyId);
    console.log("saveUpdateToIndexedDB_async:object " + JSON.stringify(object));

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
        console.log("saveUpdateToIndexedDB_async: 1 dbRequest=" + dbRequest);

        dbRequest.onerror = function (event) {
            console.log("saveUpdateToIndexedDB_async:error.open:db " + dbName);
            reject(Error("IndexedDB database error"));
        };

        console.log("saveUpdateToIndexedDB_async: 2" + JSON.stringify(dbRequest));

        console.log("saveUpdateToIndexedDB_async: 3" + JSON.stringify(dbRequest));
        try {

            dbRequest.onsuccess = function (event) {
                console.log("saveUpdateToIndexedDB_async: 31");
                var database = event.target.result;
                console.log("saveUpdateToIndexedDB_async: 32");
                var transaction = database.transaction([storeName], 'readwrite');
                console.log("saveUpdateToIndexedDB_async: 33");
                var objectStore = transaction.objectStore(storeName);
                console.log("saveUpdateToIndexedDB_async:objectStore put: " + JSON.stringify(object));

                var objectRequest = objectStore.put(object); // Overwrite if
                // already
                // exists

                console.log("saveUpdateToIndexedDB_async:objectRequest: " + JSON.stringify(objectRequest));

                objectRequest.onerror = function (event) {
                    console.log("saveUpdateToIndexedDB_async:error: " + storeName);

                    reject(Error('Error text'));
                };

                objectRequest.onsuccess = function (event) {
                    console.log("saveUpdateToIndexedDB_async:success: " + storeName);
                    resolve('Data saved OK');
                };
            };

        } catch (error) {
            console.log(error);

        }

    });
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
        console.log("move row up 1 step");

        // move this row one up by inserting it above the row
        // above, thereby moving that row one down.
        var previous_row = this_row.previousSibling;
        console.log("previous row");
        console.log(previous_row);

        var it = this_row.parentNode.insertBefore(this_row, previous_row);

        console.log("this row");
        console.log(it);

        // rewrite the rank numbers displayed in the table
        this_row.querySelector("td.rank").textContent = getRank(this_row);
        previous_row.querySelector("td.rank").textContent = getRank(previous_row);
    } else {
        // ,else stop
        // console.log( "already on top");
    }

}

function addStep(event) {

    console.log("### add step");
    // console.log(event);

    // add this step

    // set the rank number for this step



    // var stepCount = getStepCount(this_row.parentNode);
    // check if the removed row is the last one


    var newRow = document.createElement('tr');
    newRow.setAttribute("class", "step_row");

    var newcell_l = document.createElement('td');
    newcell_l.setAttribute("class", "rank");
    // compute rank
    newcell_l.appendChild(document.createTextNode((getStepCount() + 1)));
    newRow.appendChild(newcell_l);

    var newcell_2 = document.createElement('td');
    newcell_2.setAttribute("class", "procedure");
    newcell_2.setAttribute("j_name", "procedure");
    // create drop-down list in this cell
    newcell_2.appendChild(document.createTextNode("dropdown"));
    newRow.appendChild(newcell_2);

    var newcell_3 = document.createElement('td');
    newcell_3.setAttribute("class", "parameters");

    var newtable_2 = document.createElement('table');
    newtable_2.setAttribute("class", "parameters_table");
    newtable_2.setAttribute("j_name", "parameters");

    var newrow_2 = document.createElement('tr');
    newrow_2.setAttribute("class", "parameter");

    var newcell_31 = document.createElement('td');
    newcell_31.setAttribute("class", "value");
    newcell_31.setAttribute("j_name", "value");
    newcell_31.appendChild(document.createTextNode("default"));

    newrow_2.appendChild(newcell_31);

    var newcell_32 = document.createElement('td');
    newcell_32.setAttribute("class", "notes");
    newcell_32.setAttribute("j_name", "notes");
    newcell_32.appendChild(document.createTextNode("default"));

    newrow_2.appendChild(newcell_32);

    newtable_2.appendChild(newrow_2);
    newcell_3.appendChild(newtable_2);
    newRow.appendChild(newcell_3);

    var newcell_4 = document.createElement('td');
    newcell_4.setAttribute("class", "notes");
    newcell_4.setAttribute("j_name", "notes");
    // create drop-down list in this cell
    newcell_4.appendChild(document.createTextNode("text"));
    newRow.appendChild(newcell_4);

    // cell for buttons
    var newcell_5 = document.createElement('td');
    newcell_5.setAttribute("class", "buttons");
    // create new edit button
    var newbutton_1 = document.createElement('button');
    newbutton_1.setAttribute("class", "editstep_button");
    // newbutton_1.setAttribute("id", "button_generate_default");
    newbutton_1.appendChild(document.createTextNode("edit"));
    newcell_5.appendChild(newbutton_1);

    // create new up button
    var newbutton_2 = document.createElement('button');
    newbutton_2.setAttribute("class", "deletestep_button");
    // newbutton_2.setAttribute("id", "button_generate_default");
    newbutton_2.appendChild(document.createTextNode("up"));

    newcell_5.appendChild(newbutton_2);

    // create new delete button
    var newbutton_3 = document.createElement('button');
    newbutton_3.setAttribute("class", "deletestep_button");
    // newbutton_3.setAttribute("id", "button_generate_default");
    newbutton_3.appendChild(document.createTextNode("delete"));

    newcell_5.appendChild(newbutton_3);

    // create new delete button
    var newbutton_4 = document.createElement('button');
    newbutton_4.setAttribute("class", "downstep_button");
    // newbutton_4.setAttribute("id", "button_generate_default");
    newbutton_4.appendChild(document.createTextNode("down"));

    newcell_5.appendChild(newbutton_4);
    newRow.appendChild(newcell_5);

	// attach event listeners
    attachButtonEventlisteners(newRow);
    
    // is there a step row already, if so add this after it.

    console.log(document.querySelector("table.steps_table tr.step_row"));
    if (document.querySelector("table.steps_table tr.step_row")) {
        // is there a step row already, if so add this after it.
    	console.log("add new");
    	document.querySelector("table.steps_table tr.step_row:last-child").insertAdjacentElement('afterend', newRow);
} else {
        // no step nodes at all
    	console.log("add first");
  document.querySelector("table.steps_table").appendChild(newRow);
    }

}

function getStepCount() {
    console.log("# getStepCount");

    var res = document.querySelectorAll("tr.step_row").length;
    console.log("step count = " + res);
    return res;

}

function getRank(tablerownode) {
    console.log("# getRank");
    console.log(tablerownode);

    var max_itterations = 5;
    var m = 0;

    var rank = 1;

    var previous_row = tablerownode.previousSibling;
    while (m < max_itterations && isStepRow(previous_row)) {
        previous_row = previous_row.previousSibling;
        rank++;
        m++;

    }
    console.log("rank = " + rank);
    return rank;
}

function isStepRow(node) {

    console.log("# isStepRow");
    console.log(node);
    try {
        if (node.getAttribute('class') == 'step_row') {
            console.log("is step row = true");
            return true;
        } else {
            console.log("is step row = false");
            return false;
        }
    } catch (e) {
        console.log("is step row = false");
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
