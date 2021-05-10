/* global loadStoredImages, removeStoredImages, saveToIndexedDB */

console.log("### rule-admin.js ");

// array of all rule databases
var parentArray = [
    ["sourceFulldomainRuleDB", "sourceFulldomainRuleStore", "sourceFulldomainRuleStore"], ["sourceDomainRuleDB", "sourceDomainRuleStore", "sourceDomainRuleStore"], ["sourceUrlRuleDB", "sourceUrlRuleStore", "sourceUrlRuleStore"], ["destinationFulldomainRuleDB", "destinationFulldomainRuleStore", "destinationFulldomainRuleStore"], ["destinationDomainRuleDB", "destinationDomainRuleStore", "destinationDomainRuleStore"], ["destinationUrlRuleDB", "destinationUrlRuleStore", "destinationUrlRuleStore"]
];

class NavigateCollectionUI {
    constructor(containerEl) {

       // console.log("### rule-admin.js ");

        this.containerEl = containerEl;

        console.log(document);

        this.state = {
            storedImages: [],
        };

        // create tables to present all available rules
        var table_conf = {};
        table_conf["conf"] = [ {
                "id": "1",
                "width": "100px"
            }, {
                "id": "1",
                "width": "290px"
            }, {
                "id": "1",
                "width": "290px"
            }, {
                "id": "1",
                "width": "100px"
            }, {
                "id": "1",
                "width": "100px"
            }, {
                "id": "1",
                "width": "100px"
            }
        ];

        // presentation_format: text, JSON, table, dropdown

        // setup column headers for table
        var header_conf = [];
        header_conf = [ {
                "id": "1",
                "text": "domain"
            }, {
                "id": "2",
                "text": "steps"
            }, {
                "id": "5",
                "text": "notes"
            }, {
                "id": "3",
                "text": "ed. bttn"
            }, {
                "id": "4",
                "text": "del. bttn"
            }
        ];

        // setup column configuration for table

        var column_conf = [];
        column_conf = [ {
                "id": "1",
                "json_path": "fulldomain",
                "presentation_format": "text"
            }, {
                "id": "2",
                "json_path": "steps",
                "presentation_format": "table",
                "cell_table_conf": {
                    "table_conf": {
                        "class": "steps_table"
                    },
                    "row_conf": {
                        "class": "step_row"
                    },
                    "column_conf": [{
                            "id": "31",
                            "class": "step_procedure_name",
                            "json_path": "procedure",
                            "presentation_format": "text"
                        }, {
                            "id": "32",
                            "class": "step_procedure_parameter",
                            "json_path": "parameters",
                            "presentation_format": "table",
                            "cell_table_conf": {
                                "table_conf": {
                                    "class": "parameter_table"
                                },
                                "row_conf": {
                                    "class": "parameter_row"
                                },
                                "column_conf": [{
                                        "class": "parameter_value",
                                        "json_path": "value",
                                        "presentation_format": "text"
                                    }, {
                                        "class": "parameter_notes",
                                        "json_path": "notes",
                                        "presentation_format": "text"
                                    }
                                ]
                            }
                            
                        }, {
                            "id": "33",
                            "class": "step_notes",
                            "json_path": "notes",
                            "presentation_format": "text"
                        }
                    ]
                }
            },  {
                "id": "3",
                "json_path": "fulldomain",
                "presentation_format": "text"
            },{
                "id": "4",
                "node": {
                    "name": "form",
                    "class": "edit-rule-form",
                    "subnodes": [{
                            "name": "button",
                            "text": "edit",
                            "class": "edit-rule",
                            "EventListener": {
                                "type": "click",
                                "func": "editObject",
                                "parameter": "click"
                            }
                        }
                    ]
                }
            }, {
                "id": "5",
                "node": {
                    "name": "button",
                    "text": "delete",
                    "class": "delete-rule",
                    "EventListener": {
                        "type": "click",
                        "func": "deleteObject",
                        "parameter": "click"
                    }
                }
            },

        ];

        // console.log(JSON.stringify(column_conf));

        // destinationDomainRule
        header_conf[0].text = "destinationDomainRule";

        column_conf[0]["json_path"] = "destinationDomain";
        column_conf[1].json_path = "steps";
        // column_conf[2].node.text = "update this rule3";
 // column_conf[2].node["class"] = "update-rule";
        column_conf[3].node.subnodes[0]["EventListener"].func = "updateObject";
        // column_conf[3].node.text = "delete2";
   // column_conf[3].node["class"] = "update-rule";
        column_conf[4].node["EventListener"].func = "deleteObject";
        // console.log(JSON.stringify(column_conf));

        try {
            setup_rule_table('destination', 'destinationDomainRule', document.getElementById("destinationDomainRule"), table_conf, header_conf, column_conf);
        } catch (e) {
            console.log(e)
        }

        // destinationDomainRule
        header_conf[0].text = "destinationFulldomainRule";
        column_conf[0].json_path = "destinationFulldomain";

        try {
            setup_rule_table('destination', 'destinationFulldomainRule', document.getElementById("destinationFulldomainRule"), table_conf, header_conf, column_conf);
        } catch (e) {
            console.log(e)
        }

        // destinationUrl:"https://dagsavisen.us11.list-manage.com/track/click"

        // destinationUrlRule
        header_conf[0].text = "destinationUrlRule";
        column_conf[0].json_path = "destinationUrl";
        try {
            setup_rule_table('destination', 'destinationUrlRule', document.getElementById("destinationUrlRule"), table_conf, header_conf, column_conf);
        } catch (e) {
            console.log(e)
        }

        // sourceDomainRule
        header_conf[0].text = "sourceDomainRule";
        column_conf[0].json_path = "sourceDomain";

        try {
            setup_rule_table('source', 'sourceDomainRule', document.getElementById("sourceDomainRule"), table_conf, header_conf, column_conf);
        } catch (e) {
            console.log(e)
        }

        // sourceFulldomainRule
        header_conf[0].text = "sourceFulldomainRule";
        column_conf[0].json_path = "sourceFulldomain";
        try {
            setup_rule_table('source', 'sourceFulldomainRule', document.getElementById("sourceFulldomainRule"), table_conf, header_conf, column_conf);
        } catch (e) {
            console.log(e)
        }

        // sourceUrlRule
        header_conf[0].text = "sourceUrlRule";
        column_conf[0].json_path = "sourceUrl";

        try {
            setup_rule_table('source', 'sourceUrlRule', document.getElementById("sourceUrlRule"), table_conf, header_conf, column_conf);
        } catch (e) {
            console.log(e);
        }

        // attach event listeners to page buttons

        try {
            document.getElementById("button_generate_default").addEventListener('click',
                function () {
                console.log("### button.generate-source-fulldomain-rule begin");
                generate_default_link_rules();
                console.log("### button.generate-source-fulldomain-rule end");
            });

        } catch (e) {
            console.log(e);
        }

        // list of mail tables
        var tables = ['destinationUrlRule', 'destinationFulldomainRule', 'destinationDomainRule', 'sourceUrlRule', 'sourceFulldomainRule', 'sourceDomainRule'];

        // loop through all tables and set up what buttons are needed for each
        for (var t = 0; t < tables.length; t++) {
            // console.log("do: " + tables[t]);


            try {
                // console.log("hide button status: "+
                // document.getElementById("hide_"+tables[t]+"_button").style.display);

                // show/hide button
                document.getElementById("hide_" + tables[t] + "_button").addEventListener('click',
                    function (event) {
                    if (event.target.getAttribute('bool') == '1') {
                        var target_id = event.target.getAttribute('target_id');
                        document.getElementById(target_id).style.display = 'none';
                        // show the table
                        event.target.setAttribute('bool', '0');
                        var newtext = document.createTextNode("show table");
                        event.target.replaceChild(newtext, event.target.childNodes[0]);
                    } else {
                        // disappear the table
                        event.target.setAttribute('bool', '1');
                        var target_id = event.target.getAttribute('target_id');
                        document.getElementById(target_id).style.display = 'block';
                        var newtext = document.createTextNode("hide table");
                        event.target.replaceChild(newtext, event.target.childNodes[0]);
                    }
                });

            } catch (e) {
                console.log(e);
            }

        }

        // add backup button
        try {
            document.getElementById("backup-all-rules_button").addEventListener('click', () => {
                // document.querySelector("button.backup-all-keys").addEventListener('click',
                // ()
                // => {
                console.log("backup rules ");

                console.log("backup all keys start");
                backout_all_rules().then(function (e) {
                    console.log("backup complete");
                    console.log(e);
                });
            }, false);
        } catch (e) {
            console.log(e)
        }

        // add event listener for import button

        console.log("setup import form");
        try {
            document.getElementById('import-rules_button').addEventListener('click', function (evt) {
                console.log("### reading import file");

                var input = document.createElement('input');
                input.type = 'file';

                input.onchange = e => {

                    // getting a hold of the file reference
                    var file = e.target.files[0];

                    // setting up the reader
                    var reader = new FileReader();
                    reader.readAsText(file, 'UTF-8');

                    // here we tell the reader what to do when it's done
                    // reading...
                    reader.onload = readerEvent => {
                        var content = readerEvent.target.result; // this is
                        // the
                        // content!
                        console.log(content);

                        // add content to database
                        // loop parentArray
                        var p = [];
                        try {
                            for (var i = 0; i < parentArray.length; i++) {
                                console.log(parentArray[i][0]);

                                console.log("import into " + parentArray[i][0]);
                                var imported = JSON.parse(content);
                                console.log("import  " + imported[parentArray[i][0]].length);

                                for (var j = 0; j < imported[parentArray[i][0]].length; j++) {
                                    console.log("import  " + JSON.stringify(imported[parentArray[i][0]][j]));
                                    // add rule to data

                                    p.push(saveToIndexedDB_async(parentArray[i][0], parentArray[i][1], 'keyId', imported[parentArray[i][0]][j]));

                                }

                            }
                        } catch (e) {
                            console.log(e);
                        }
                        console.log(p);

                    }

                }

                input.click();

            });

        } catch (e) {
            console.log(e);
        }

    }
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

// create table

function setup_rule_table(type, key, node, t, h, c) {

    var table_conf = JSON.parse(JSON.stringify(t));
    var header_conf = JSON.parse(JSON.stringify(h));
    var column_conf = JSON.parse(JSON.stringify(c));

    try {
    // console.log("# setup_rule_table" );
       // console.log("type: " + type);
     // console.log("key: " + key);
        // console.log("node: " + JSON.stringify(node));
        // console.log("table_conf: " + JSON.stringify(table_conf));
        // console.log("header_conf: " + JSON.stringify(header_conf));
        // console.log("column_conf: " + JSON.stringify(column_conf));

        if (node != null) {
            // ##########
            // list all objects in db
            // ##########


            // var table_obj = createTable(table_conf, key);

            var div_table_obj = document.createElement("div");
            div_table_obj.setAttribute("class", "tableContainer");
            var table_obj = document.createElement("table");

            // div_obj.setAttribute("style", "border: 4px; height: 185px;
            // border-top-color:
            // rgba(2, 225, 225, 0.9)");
            // div_table_obj.setAttribute("class", "tableContainer");
            // table_obj.setAttribute("style", "width: 800px; float: left");
            // table_obj.setAttribute("style", "display: block;max-height:
            // 150px;max-widht: 600px;overflow: auto;");
            table_obj.setAttribute("border", "0");
            table_obj.setAttribute("cellspacing", "0");
            table_obj.setAttribute("cellpadding", "0");
            table_obj.setAttribute("class", "scrollTable");
            table_obj.setAttribute("width", "100%");
            table_obj.setAttribute("id", key);

            // for (var i = 0; i < table_conf.length; i++) {
            // var obj = table_conf[i];
            // create a column for each

            // console.log(JSON.stringify(obj));
            // console.log("create column ");

            // setup column width for table
            // var col_i = document.createElement("col");
            // col_i.setAttribute("width", obj.width);
            // table_obj.appendChild(col_i);

            // }


            div_table_obj.appendChild(table_obj);

            var thead = document.createElement("thead");
            thead.setAttribute("class", "fixedHeader");
            thead.appendChild(writeTableHeaderRow(header_conf, key));

            table_obj.appendChild(thead);

            var tbody = document.createElement("tbody");
            tbody.setAttribute("class", "scrollContent");
            // tbody.setAttribute("style", "display: block;height: 100px;width:
            // 100%;overflow-y: auto;");


            var dbRequest = indexedDB.open(key + "DB");
            dbRequest.onerror = function (event) {
                reject(Error("Error text"));
            };

            dbRequest.onupgradeneeded = function (event) {
                // Objectstore does not exist. Nothing to load
                event.target.transaction.abort();
                reject(Error('Not found'));
            };

            dbRequest.onsuccess = function (event) {
                var database = event.target.result;
                var transaction = database.transaction(key + 'Store', 'readonly');
                var objectStore = transaction.objectStore(key + 'Store');

                if ('getAll' in objectStore) {
                    // IDBObjectStore.getAll() will return the full set of items
                    // in our store.
                    objectStore.getAll().onsuccess = function (event) {
                        const res = event.target.result;
                        // console.log(res);


                        for (const url of res) {

                            // create table row for each entry returned from
                            // database
                            // const tr = document.createElement("tr");
                            // console.log("column_conf " +
                            // JSON.stringify(column_conf));
                            // console.log("url" + JSON.stringify(url));
                            // console.log("column_conf: " +
                            // JSON.stringify(column_conf));

                            const tr = writeTableRow(url, column_conf, type, key);

                            // create add row to table

                            tbody.appendChild(tr);

                        }

                    };
                    // add a line where information on a new key can be added to
                    // the database.
                    // document.querySelector("button.onAddDecryptionKey").onclick
                    // = this.onAddDecryptionKey;

                } else {
                    // Fallback to the traditional cursor approach if getAll
                    // isn't supported.
                    var timestamps = [];
                    objectStore.openCursor().onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            console.log(cursor.value);
                            // timestamps.push(cursor.value);
                            cursor.continue();
                        } else {
                            // logTimestamps(timestamps);
                        }
                    };

                    document.querySelector("button.onAddDecryptionKey").onclick = this.onAddDecryptionKey;

                    const tr_last = document.createElement("tr");

                    const td = document.createElement("td");
                    td.innerHTML = "key name";
                    tr_last.appendChild(td);
                    const td2 = document.createElement("td");
                    td2.innerHTML = "key";
                    tr_last.appendChild(td2);
                    const td3 = document.createElement("td");
                    td3.innerHTML = "jwk";
                    tr_last.appendChild(td3);

                    tbody.appendChild(tr_last);

                }

            };
            table_obj.appendChild(tbody);

            node.appendChild(div_table_obj);
        }
    } catch (e) {
        console.log(e)
    }

}


function submitAddNewRule(type, key) {
    console.log("## submitAddNewRule");
    console.log(type);
    console.log(key);

}


// pass in a JSON with a descrition columns
// return

function createTable(data, table_conf, row_conf, column_conf) {
  // console.log("# createTable" );
	// console.log("data: " + JSON.stringify(data));
 // console.log("table_conf: " + JSON.stringify(table_conf));
 // console.log("row_conf: " + JSON.stringify(row_conf));
 // console.log("column_conf: " + JSON.stringify(column_conf));
	
    var table_obj = null;

    try {
        table_obj = document.createElement("table");
        
        if (table_conf.hasOwnProperty('class')) {
        	 table_obj.setAttribute("class", table_conf.class);
        }
       // table_obj.setAttribute("width", "100%");

        // loop though data to create one row for each
        var i = 0;
        while(i < data.length  && i < 5){

            var tr_i = createTableRow(data[i], row_conf, column_conf);

            table_obj.appendChild(tr_i);
        	i++;
        }

    } catch (e) {
        console.log(e)
    }

    return table_obj;
}


function createTableRow(data, row_conf, column_conf) {
// console.log("# createTableRow start" );
	// console.log("data: " + JSON.stringify(data));
  // console.log("row_conf: " + JSON.stringify(row_conf));
 // console.log("column_conf: " + JSON.stringify(column_conf));
	
     
    var row_obj = null;

    try {
    	row_obj = document.createElement("tr");

        
        if (row_conf.hasOwnProperty('class')) {
        	 row_obj.setAttribute("class", row_conf.class);
        }
        
   
     // table_obj.setAttribute("id", table_id);

        // loop though column conf to create one column for each
        var i = 0;
        var column_count = column_conf.length;
       // console.log("column_count: " + column_count);
        while(i < column_count  && i < 5){

            var tr_i = writeTableCell(data, column_conf[i]);

            row_obj.appendChild(tr_i);
        	i++;
        }
        
    } catch (e) {
        console.log(e)
    }

    return row_obj;

}




// ensure fixed header row in scrollable table
// http://www.imaputz.com/cssStuff/bigFourVersion.html

// return table row (header) object
function writeTableHeaderRow(row_conf, table_id) {
    // console.log("## writeTableHeaderRow");
    // console.log(row_conf);

    // <thead><tr> </tr></thead>

    var tr = null;

    try {

        // t_head.setAttribute("style", "position: absolute; color: #000");

        tr = document.createElement("tr");
        // tr.setAttribute("style", "display: block; position: relative; color:
        // #000");
        tr.setAttribute("class", "normalRow");

        for (var i = 0; i < row_conf.length; i++) {
            var obj = row_conf[i];
            // create a column for each

            // console.log(JSON.stringify(obj));
            // console.log("create column header ");

            var i_col = document.createElement("th");

            i_col.setAttribute("col_num", i);
            // i_col.setAttribute("style", "background: #C96; text-align: left;
            // border-top: 1px; padding: 4px" );

            // create clickable link
            var a_ref = document.createElement("a");
            // set data type here
            // T for text
            // D for dates
            // N for numbers
            // a_ref.setAttribute("href", "javascript:SortTable("+i+",'T'," +
            // table_id +");");
            // i_col.innerHTML = obj.text;
            i_col.appendChild(document.createTextNode(obj.text));


            // create event listener to trigger sorting on the column
            i_col.addEventListener('click', function (event) {
                // SortTable(i, 'T', table_id);
                sortColumn(event);
            })
            i_col.appendChild(a_ref);
            tr.appendChild(i_col);

        }
    } catch (e) {
        console.log(e)
    }

    return tr;

}

function sortColumn(event) {

    console.log(event);

    console.log(event.target);
    console.log(event.target.th);
    var node = event.target;
    // get the number of the column

    var col_num = event.target.getAttribute('col_num');
    console.log("col_num: " + col_num);
    // get the type of sort (text etc.)
    var sort_type = "T";
    console.log("sort_type: " + sort_type);

    // get the direction of sort

    // id of table
    var table_id = event.target.parentNode.parentNode.parentNode.getAttribute('id');

    console.log(event.target.parentNode);
    console.log(event.target.parentNode.parentNode);
    console.log(event.target.parentNode.parentNode.parentNode);
    console.log(event.target.parentNode.parentNode.parentNode.getAttribute('id'));

    console.log("table_id: " + table_id);

    SortTable(col_num, sort_type, table_id);
    // trigger redraw/reflow
    // document.getElementsByTagName('body')[0].focus();

    console.log("table_id: " + table_id);
    console.log(document.getElementById(table_id));
    reflow(document.getElementById(table_id));

}

function reflow(elt) {
    void elt.offsetWidth;
    console.log(elt.offsetHeight);
}

// // accept data object and configuration object

// return tr object
function writeTableRow(rule, column_conf, type, key) {
    // console.log("## writeTableRow");
    // console.log("rule " + JSON.stringify(rule));
    // console.log("column_conf " + JSON.stringify(column_conf));
    // console.log("key " + JSON.stringify(key));
    // console.log("type " + JSON.stringify(type));

     const tr = document.createElement("tr");
     try {
        // look through the column definions to what goes into the fields in a
        // table
        // row
        for (var i = 0; i < column_conf.length; i++) {
            var obj = column_conf[i];

            var i_col = document.createElement("td");

            // present according to the specification in the "format"-field in
            // the column configuration
            var presentation_format = "text";
            if (obj.hasOwnProperty('presentation_format')) {
                presentation_format = obj.presentation_format;
            }

            if (obj.hasOwnProperty('json_path')) {
            	// use value json_path to lookup the data structure
            	
            	var cell_data = rule[obj.json_path];
            	
                // use json_path as path to look for value in JSON datastructure
            // console.log("json_path: " + obj.json_path);

                // console.log(url[obj.attribute]);
              // console.log(obj.attribute);
                if (presentation_format == "JSON") {
// i_col.innerHTML = JSON.stringify(cell_data);
                    i_col.appendChild(document.createTextNode(JSON.stringify(cell_data)));
                } else if (presentation_format == "table") {
                    // render a table inside the cell based on the detailed
                    // specifications contained in the "cell_table_column_conf"
                    // is not was specified, forget it.
                    if (obj.hasOwnProperty('cell_table_conf')) {
                        var cell_table_conf = obj.cell_table_conf;
    // console.log("### cell_table_conf");
  // console.log("table config" + JSON.stringify(cell_table_conf));

                     // console.log("table data" +
						// JSON.stringify(rule[obj.json_path]));
                        var cell_table = document.createElement("table");
                        cell_table.setAttribute('class', cell_table_conf.table_conf.class);


                        
                      // console.log("cell_table1: ");
                      // console.log(cell_table);

                     // console.log("##############################");
                    // console.log("row data: " +
					// JSON.stringify(rule[obj.json_path]));
                    // console.log(JSON.stringify(rule[obj.json_path].length));

                        // loop through all data objects that need a separate
                        // row in the cell-level
                        // table
                        var cell_table_row_count = cell_data.length;
                        
                   // console.log("cell_table_row_count: " +
					// cell_table_row_count);
                        // set a maximum of row permitted in a table embedded
						// inside a cell
                        var max_cell_table_rows = 8;
                        var k = 0;
                        while (k < cell_table_row_count && k < max_cell_table_rows) {
                        	var cell_data_row = cell_data[k];
                        // console.log("cell_data_row: " +
						// JSON.stringify(cell_data_row));
                            var cell_table_row = document.createElement("tr");
                            cell_table_row.setAttribute('class', cell_table_conf.row_conf.class);
              
                            // loop through all cells configure for this row

                            var cell_table_row_cell_count = cell_table_conf.column_conf.length;


                            // iterate over the number of configured columns
							// (max 5)
                            var max_cell_table_cells = 5;
                            var m = 0;
                            while (m < cell_table_row_cell_count && m < max_cell_table_cells) {
                            	var cell_table_column_conf = cell_table_conf.column_conf[m];
                                var cell_table_cell = document.createElement("td");
                                // console.log(cell_table_conf.column_conf[i].class);
                                cell_table_cell.setAttribute('class', cell_table_column_conf.class);
                                try {
                                var cell_data_path = cell_table_column_conf.json_path;
                         // console.log("path to cell data: " +
							// cell_data_path);
                        // console.log("path to cell config data: " +
						// JSON.stringify(cell_table_conf.column_conf[m]));

                              var presentation_format = cell_table_column_conf.presentation_format;
								// cell_table_conf.column_conf[m].presentation_format;
                           // console.log("presentation_format: " +
							// presentation_format);

                              // depending on the presentaiont format take
								// configurable action here
                              if (presentation_format == "table"){
                            	  // create a small table to contain the list

                            	  var list_table = createTable( cell_data_row[cell_data_path], cell_table_column_conf.cell_table_conf.table_conf, cell_table_column_conf.cell_table_conf.row_conf, cell_table_column_conf.cell_table_conf.column_conf);
	// console.log(list_table);
                            	  cell_table_cell.appendChild(list_table);
    
                              }else{
                            	  // present the data as text
                               
                     // console.log("cell data: " +
						// JSON.stringify(rule[obj.json_path][k][cell_data_path]));
                                    var newContent = document.createTextNode(cell_data_row[cell_data_path]);
                                    cell_table_cell.appendChild(newContent);
                              }
                                } catch (e) {
                                	consoel.log(e);
                                }
                                cell_table_row.appendChild(cell_table_cell);
                                m++
                            }

                            // add row to table
                            cell_table.appendChild(cell_table_row);
                            k++;
                        }

                         i_col.appendChild(cell_table);

                    } else {
                        console.log("cell_table_column_conf attribute missing");
                    }
                } else if (presentation_format == "dropdown") {
                    // render a dropdown list

                } else {
                	  i_col.appendChild(document.createTextNode(rule[obj.json_path]));
                    // i_col.innerHTML = rule[obj.json_path];
                }
            } else if (obj.hasOwnProperty('node')) {

                // var n = obj.node;
                // console.log("node definition " + JSON.stringify(obj.node));

                var node = writeTableNode(rule, obj.node, type, key);

                // any eventlisteners defined ?

                i_col.appendChild(node);

            }
            tr.setAttribute("class", "normalRow");
            tr.appendChild(i_col);
        }
    } catch (e) {
        console.log(e)
    }

    return tr;
}

// return td object
function writeTableCell(data, cell_conf) {
    // console.log("### writeTableCell ");
    // console.log("data: " + JSON.stringify(data));
    // console.log("cell_conf: " + JSON.stringify(cell_conf));

     var cell = null;
     try {
    	 
    	 cell = document.createElement("td");
    	 if (cell_conf.hasOwnProperty('class')) {
             cell.setAttribute("class", cell_conf['class']);
         }
    	 
    	 var json_path = "";
    	 if (cell_conf.hasOwnProperty('json_path')) {
    		 json_path = cell_conf['json_path'];
    		 
    		 cell.appendChild(document.createTextNode(data[json_path]));
         }
    // console.log("json_path: " +json_path );
    // console.log("data: " +data[json_path] );
    	 
    	 
     } catch (e) {
         console.log(e)
     }
     return cell;
}


function writeTableNode(rule, node_conf, type, key) {
    // console.log("### writeTableNode ");
    // console.log("rule " + JSON.stringify(rule));
    // console.log(rule);

    var node = null;
    var n = node_conf;
    try {
        // console.log("node definition " + JSON.stringify(node_conf));

        node = document.createElement(node_conf.name);

        // node configuration has sub nodes ?
        if (node_conf.hasOwnProperty('subnodes')) {

            // console.log("###### has sub nodes ");

            // console.log("###### has sub nodes " +
            // JSON.stringify(n.subnodes));
            // console.log("###### has sub nodes " + n.subnodes.length);

            for (var i = 0; i < node_conf.subnodes.length; i++) {
                // var obj = node_conf.subnodes[i];
                // console.log("###### has sub nodes " + JSON.stringify(obj));
                node.appendChild(writeTableNode(rule, node_conf.subnodes[i], type, key));
            }
        }

        if (node_conf.hasOwnProperty('class')) {
            node.setAttribute("class", node_conf['class']);
        }
        if (node_conf.hasOwnProperty('text')) {
            // node.appendChild(document.createTextNode(node_conf.text.substring(1)));
            node.appendChild(document.createTextNode(node_conf.text));

            // node.appendChild(document.createTextNode("HHHH"));
        }
        if (node_conf.hasOwnProperty('EventListener')) {

            var func = node_conf.EventListener.func;

            // console.log("node hadeleteObjects event listener function:" +
            // func);

            // depending on the parameter set for which function to call

            switch (func) {
            case "deleteObject":
                // console.log("####node has event listener
                // deleteDecryptionKey:" +
                // func);
                node.addEventListener('click', function () {
                    deleteObject(rule.keyId, type, key)
                })
                break;
            case "updateObject":
                // console.log("####node has event listener
                // updateEncryptionKey:" +
                // func);
                node.addEventListener('click', function (event) {
                    console.log(event);
                    updateObject(rule.keyId, type, key, rule)
                })
                break;
            case "exportPrivateKey":
                // console.log("####node has event listener exportPrivateKey:" +
                // func);
                node.addEventListener('click', function () {
                    exportPrivateKey(rule.keyId)
                })
                break;
            }
        }
    } catch (e) {
        console.log(e)
    }
    return node;

}

function deletePrivateKey(u) {
    console.log("navigate-collection.js: deletePrivateKey" + u);

    deleteFromIndexedDB('keyPairsDB', 'keyPairsStore', u);

}

function deleteObject(uuid, type, key) {
    console.log("deleteObject");

    console.log("type: " + type);
    console.log("key: " + key);
    console.log("uuid: " + uuid);

    var p = deleteFromIndexedDB_async(key + 'DB', key + 'Store', uuid);

    p.then(function (res) {
        console.log(res)
    });

}

function updateObject(uuid, type, key, rule) {
    console.log("updateObject");

    console.log("type: " + type);
    console.log("key: " + key);
    console.log("uuid: " + uuid);
    console.log("rule: " + JSON.stringify(rule));

    // var popup = window.open("<html><title>sub</title></html>");


    // create popup window where fields can be edited


    // two different popups depending on wheather not this is a rule based on
    // source URL (where the link is found)
    // or destination (where the link goes to)

    // Add the url to the pending urls and open a popup.
    // pendingCollectedUrls.push(info.srcUrl);
    var popup = null;
    try {
        // open up the popup


   

        // var w = window.open('', '',
		// 'width=1000,height=700,resizeable,scrollbars');
        
     // place the rule to be edited in storage
        
        browser.storage.sync.set({ 'editThisRule': rule, 'type': type, 'key': key }).then(function(g){
        	console.log(g);
        	});
        
        var w = window.open('popup/edit-rule.html', 'test01', 'width=1000,height=600,resizeable,scrollbars');
        // the popup is now open

        console.log("read back: " + browser.storage.sync.get(['editThisRule', 'type', 'key']));
        browser.storage.sync.get(['editThisRule', 'type', 'key']).then(function(e){
        	console.log(e);
        	});

        console.log("read back: " + browser.storage.sync.get(['editThisRule', 'type', 'key'], function (data){
        	console.log(data);
        } ));
        
        // send message to background, and have background send it to the popup
        browser.runtime.sendMessage({
            request: {"sendRule":"toEditPopup","rule": rule}
        }, function (response) {
            console.log("message sent to backgroup.js with response: " + JSON.stringify(response));
        });
        


    } catch (err) {
        console.error(err);
    }

}

function deleteFromIndexedDB_async(dbName, storeName, keyId) {
    console.log("deleteFromIndexedDB:1 " + dbName);
    console.log("deleteFromIndexedDB:2 " + storeName);
    console.log("deleteFromIndexedDB:3 " + keyId);

    // indexedDB = window.indexedDB || window.webkitIndexedDB ||
    // window.mozIndexedDB || window.msIndexedDB;

    return new Promise(
        function (resolve, reject) {

        var dbRequest = indexedDB.open(dbName);

        // console.log("deleteFromIndexedDB: 1 dbRequest=" + dbRequest)

        dbRequest.onerror = function (event) {
            console.log("deleteFromIndexedDB:error.open:db " + dbName);
            reject(Error("IndexedDB database error"));
        };

        // console.log("deleteFromIndexedDB: 2")

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
            // console.log("deleteFromIndexedDB: 31")
            var database = event.target.result;
            var transaction = database.transaction([storeName], 'readwrite');
            var objectStore = transaction.objectStore(storeName);
            var objectRequest = objectStore.delete(keyId); // Overwrite if
            // exists

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

function backout_all_rules() {
    console.log("### backup_all_keys() begin");

    // return new Promise((resolve, reject) => {

    var listOfKeys = "{";

    // create list of databases and datastores to be backed up in the form of an
    // array of arrays with each field naming the database, datastore in the
    // database

    // //

    // ["acceptedKeyOffers", "acceptedKeyOffers", "acceptedKeyOffers"]
    // ["gloveboxKeys", "decryptionKeys", "decryptionKeys"],
    // ["gloveboxKeys", "encryptionKeys", "encryptionKeys"]
    // ["privateKeys", "keyPairs", "keyPairs"]


    try {
        for (var i = 0; i < parentArray.length; i++) {

            try {
                // await wait_promise(20); //wait for 2 seconds
                // var one = await
                // wait_promisedump_db(parentArray[i][0],parentArray[i][1],parentArray[i][2]);
                // var one =
                // dump_db(parentArray[i][0],parentArray[i][1],parentArray[i][2]);
                // var one;

                var db = parentArray[i][0];
                var dbName3 = parentArray[i][1];
                var storeName3 = parentArray[i][2];
                console.log("### accessing db:" + db + " dbname:" + dbName3 + " storeName:" + storeName3);

                const one = READ_DB(db, dbName3, storeName3);
                console.log("READ " + one);

                // console.log("# appending: " +parentArray[i][0] + " " + one);
                // console.log("#-#-#-#-# " + i + " " + listOfKeys);

                listOfKeys = listOfKeys + '"' + parentArray[i][0] + '":' + one + ',';
                console.log("#-#-#-#-# (accumulating) " + i + " " + listOfKeys);

            } catch (e) {
                console.log("ERROR");

                console.log(e);
            }

        }
    } catch (e) {
        console.log(e)
    }

    listOfKeys = listOfKeys.substring(0, listOfKeys.length - 1) + '}';

    // proceed with encryption
    // using passphrase specified in the form


    console.log("#-#-#-#-# listOfKeys (complete) " + listOfKeys);
    // encrypt the data using the passphrase contained in the variable
    // backupFilePwd

    download_file("linklooker_rules_backup.json", listOfKeys);

    // download_file("glovebox_keys_backup.txt", listOfKeys, "text/plain");
    console.log("### backup_all_keys() end");
    // resolve( "true");
    console.log("backup completed, proceed to flush all keys.");
    // await flush_all_dbs();

    // });

}

function READ_DB(db, dbName3, storeName3) {

    return new Promise((resolve, reject) => {

        try {
            var one;

            console.log("reading db:" + db + " dbname:" + dbName3 + " storeName:" + storeName3);
            var dbRequest = indexedDB.open(db);

            dbRequest.onerror = function () {
                console.log("Error", dbRequest.error);
                console.error("Error", dbRequest.error);
            };
            dbRequest.onupgradeneeded = function () {
                console.log("onupgradeneeded ");
                console.error("onupgradeneeded ");
            };

            dbRequest.onsuccess = function (event3) {
                console.log("one " + one);
                console.log("db:" + db + " dbname:" + dbName3 + " storeName:" + storeName3);
                var database3 = event3.target.result;
                console.log("2");
                // open database on read-only mode
                var transaction3 = database3.transaction([storeName3], 'readonly');
                var objectStore3 = transaction3.objectStore(storeName3);
                console.log("3");
                var allRecords3 = objectStore3.getAll();
                console.log("4");
                allRecords3.onsuccess = function () {
                    const res3 = allRecords3.result;
                    // get private(and their public component) signing keys
                    database3.close();
                    one = JSON.stringify(res3);
                    console.log("returning from database: " + one);
                    resolve(one);
                };
                database3.close();
            }

        } catch (e) {
            console.log(e);
            reject();
        }

    });

    // return one;
}

function download_file(name, contents, mime_type) {

    console.log("download_file BEGIN");

    mime_type = mime_type || "text/plain";

    var blob = new Blob([contents], {
            type: mime_type
        });

    var dlink = document.createElement('a');
    dlink.download = name;
    dlink.href = window.URL.createObjectURL(blob);
    dlink.onclick = function (e) {
        // revokeObjectURL needs a delay to work properly
        var that = this;
        setTimeout(function () {
            window.URL.revokeObjectURL(that.href);
        }, 1500);
    };

    dlink.click();
    dlink.remove();
    console.log("download_file END");
}

var TableLastSortedColumn = -1;

function SortTable() {
    var sortColumn = parseInt(arguments[0]);
    var type = arguments.length > 1 ? arguments[1] : 'T';
    var TableIDvalue = arguments.length > 2 ? arguments[2] : '';
    var dateformat = arguments.length > 3 ? arguments[3] : '';

    var table = document.getElementById(TableIDvalue);

    // console.log(sortColumn);
    // console.log(type);
    // console.log(TableIDvalue);
    // console.log(table);

    var tbody = table.getElementsByTagName("tbody")[0];
    // get the principal rows in the table
    // var rows = tbody.getElementsByTagName("tr");
    
    var rows = tbody.querySelectorAll('tr.normalRow');
    var arrayOfRows = new Array();
    type = type.toUpperCase();
    dateformat = dateformat.toLowerCase();
    for (var i = 0, len = rows.length; i < len; i++) {
        arrayOfRows[i] = new Object;
        arrayOfRows[i].oldIndex = i;
        // console.log(rows);
        // console.log(rows[i]);
        // console.log(rows[i].getElementsByTagName("td"));
        // console.log(sortColumn);
        // console.log(rows[i].getElementsByTagName("td")[sortColumn]);
        var celltext = rows[i].getElementsByTagName("td")[sortColumn].innerHTML.replace(/<[^>]*>/g, "");
        if (type == 'D') {
            arrayOfRows[i].value = GetDateSortingKey(dateformat, celltext);
        } else {
            var re = type == "N" ? /[^\.\-\+\d]/g : /[^a-zA-Z0-9]/g;
            console.log(celltext.replace(re, "").substr(0, 25).toLowerCase());
            arrayOfRows[i].value = celltext.replace(re, "").substr(0, 25).toLowerCase();
        }
    }
    if (sortColumn == TableLastSortedColumn) {
        arrayOfRows.reverse();
    } else {
        TableLastSortedColumn = sortColumn;
        switch (type) {
        case "N":
            arrayOfRows.sort(CompareRowOfNumbers);
            break;
        case "D":
            arrayOfRows.sort(CompareRowOfNumbers);
            break;
        default:
            arrayOfRows.sort(CompareRowOfText);
        }
    }
    var newTableBody = document.createElement("tbody");
    newTableBody.setAttribute("class", "scrollContent");
    for (var i = 0, len = arrayOfRows.length; i < len; i++) {
        newTableBody.appendChild(rows[arrayOfRows[i].oldIndex].cloneNode(true));
    }

    var one = tbody.parentNode.replaceChild(newTableBody, tbody);

    reflow(one);

} // function SortTable()

function CompareRowOfText(a, b) {
    var aval = a.value;
    var bval = b.value;
    return (aval == bval ? 0 : (aval > bval ? 1 : -1));
} // function CompareRowOfText()

function CompareRowOfNumbers(a, b) {
    var aval = /\d/.test(a.value) ? parseFloat(a.value) : 0;
    var bval = /\d/.test(b.value) ? parseFloat(b.value) : 0;
    return (aval == bval ? 0 : (aval > bval ? 1 : -1));
} // function CompareRowOfNumbers()

function GetDateSortingKey(format, text) {
    if (format.length < 1) {
        return "";
    }
    format = format.toLowerCase();
    text = text.toLowerCase();
    text = text.replace(/^[^a-z0-9]*/, "");
    text = text.replace(/[^a-z0-9]*$/, "");
    if (text.length < 1) {
        return "";
    }
    text = text.replace(/[^a-z0-9]+/g, ",");
    var date = text.split(",");
    if (date.length < 3) {
        return "";
    }
    var d = 0,
    m = 0,
    y = 0;
    for (var i = 0; i < 3; i++) {
        var ts = format.substr(i, 1);
        if (ts == "d") {
            d = date[i];
        } else if (ts == "m") {
            m = date[i];
        } else if (ts == "y") {
            y = date[i];
        }
    }
    d = d.replace(/^0/, "");
    if (d < 10) {
        d = "0" + d;
    }
    if (/[a-z]/.test(m)) {
        m = m.substr(0, 3);
        switch (m) {
        case "jan":
            m = String(1);
            break;
        case "feb":
            m = String(2);
            break;
        case "mar":
            m = String(3);
            break;
        case "apr":
            m = String(4);
            break;
        case "may":
            m = String(5);
            break;
        case "jun":
            m = String(6);
            break;
        case "jul":
            m = String(7);
            break;
        case "aug":
            m = String(8);
            break;
        case "sep":
            m = String(9);
            break;
        case "oct":
            m = String(10);
            break;
        case "nov":
            m = String(11);
            break;
        case "dec":
            m = String(12);
            break;
        default:
            m = String(0);
        }
    }
    m = m.replace(/^0/, "");
    if (m < 10) {
        m = "0" + m;
    }
    y = parseInt(y);
    if (y < 100) {
        y = parseInt(y) + 2000;
    }
    return "" + String(y) + "" + String(m) + "" + String(d) + "";
} // function GetDateSortingKey()


// kick off
const navigateCollectionUI = new NavigateCollectionUI(document.getElementById('app'));
