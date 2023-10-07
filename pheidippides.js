// CORE FUNCTIONS //
//----------------//
/**
 * This function is the top-level handler for creating new elements in the DOM
 * @param {function} func The function object to be called to create an element
 * @param {json} data The data passed to the function object
 * @param {json} attr An object of attributes and their values
 * @param {string} target The target location to append to
 * @returns Either nothing or the element tree created
 */
function create(func, data = {}, attr = {}, target = false){

    // Whatever function was passed is executed with data and disabled as params
    created = func(data, attr);

    // The created element tree is applied to the specified target (defaults to return)
    if(target == false){
        return created;
    }else{
        $(target).append(created);
    }
    
}


/**
 * Creates a new DOM element
 * @param {string} tag Name of the tag
 * @param {json} attr Attributes for the tag
 * @param {string} apnd The string to append to the ID
 * @returns An element
 */
function initialize(tag, attr = {}, apnd = false){

    // Wrap tag name in < >
    tag = `<${tag}>`;

    // Let element equal new tag, appended to nothing
    let element = $(tag);

    // Set proper ID
    attr = id_setter(apnd, attr);

    // Apply the attributes
    return attr_setter(element, attr);

}


/**
 * Sets many different attributes of an HTML element
 * @param {DOM element} el The element being updated
 * @param {json} data An object with a series of keys matching attributes and the value to be assinged
 * @returns DOM element after updates
 */
function attr_setter(el, data = {}){

    // Make sure to only move forward if DOM element
    if(is_object(el)){

        // Loop over data and assign
        for(let attr in data){

            if(attr == 'disabled'){

                // Does not stringify
                el.attr(attr, data[attr]);

            }else{

                // Stringifies
                el.attr(attr, String(data[attr]));

            }

        }

    }

    return el;

}


/**
 * Takes in an array of DOM elements and in order appends them to the el var
 * @param {DOM element} el The element to be appended to
 * @param {Array of DOM element} list The list of things to append
 * @returns The mutated DOM element
 */
function ordered_append(el, list = []){

    // Iterate over list and add to element
    for(let item in list){

        el.append(list[item]);

    }

    return el;

}




// HELPER FUNCTIONS //
//------------------//
/**
 * A generic recurser-iterator meant to scale objects' tree structure
 * @param {json} json The object being recursed (and iterated) over
 * @param {function} func The function to be called on each value within the containing object
 */
function _2nrecursion(json = {},func){
    for(value in json)
    {
        if(typeof value === 'object' && value !== null && !Array.isArray(value))
        {
            _2nrecursion(value);
        }
        else
        {
            func(value);
        }
    }
}


/**
 * Takes in a type and checks it against permissable types to return boolean
 * @param {string} type The string being evaluated
 * @returns Boolean outcome
 */
function check_type(type){
    // Always use lower case
    type = type.toLowerCase();

    // List of permissible types
    types = [
        "color", "date", "datetime-local",
        "email", "file", "hidden", "image",
        "month", "number", "password", "range",
        "reset", "search", "tel", "text", "time",
        "url", "week"
    ]

    // Return if in list of permissible types
    return in_array(type, types);

}


/**
 * Evals string for type value and returns package with it and the mutated parts object
 * @param {string} str The string to eval
 * @param {json} parts The current parts object
 * @returns A package containing the remaining string and the mutated parts
 */
function type_string(str, parts){

    // Get substring so we can check if it starts with special characters
    let sub = str.substring(0,2);

    // Create the type and remainder
    if(sub in Array("&&", "$$", "||")){

        parts["type"] = "text";
        remainder = "";

    }else{

        let amp = str.indexOf("&&");
        let usd = str.indexOf("$$");
        let pip = str.indexOf("||");

        let lowest = 0;

        if(amp == -1 && usd == -1 && pip == -1){

            if(str.indexOf(" ") > -1){

                parts["type"] = str.split(" ")[0];
                remainder = str.split(" ")[1];

            }else{

                parts["type"] = str;
                remainder = "";

            }

        }else{

            let arr = Array(amp, usd, pip);
            let arrNonNeg = Array();

            for(a in arr){

                if(arr[a] > -1){

                    arrNonNeg.push(arr[a]);

                }

            }

            lowest = Math.min(arrNonNeg);

            remainder = str.substring(lowest, str.length);
            let type = str.substring(0, lowest);

            if(type.indexOf(" ") > -1){

                parts["type"] = type.split(" ")[0];

            }else{

                parts["type"] = type;

            }

        }

        

    }

    return {"parts":parts, "remainder":remainder};

}


/**
 * Evals string for placeholder value and returns package with it and the mutated parts object
 * @param {string} remainder The string to eval
 * @param {json} parts The current parts object
 * @returns A package containing the remaining string and the mutated parts
 */
function placeholder_string(remainder, parts){

    if(parts["has_default"]){

        parts["placeholder"] = remainder.substring(remainder.indexOf("&&") + 2, remainder.indexOf("$$"));
        remainder = remainder.split("$$")[1];

    }else if(parts["has_options"]){

        parts["placeholder"] = remainder.substring(remainder.indexOf("&&") + 2, remainder.indexOf("||"));
        options = remainder.split("||");
        options.shift();
        remainder = options.join("||");

    }else{

        parts["placeholder"] = remainder.substring(remainder.indexOf("&&") + 2, remainder.length);
        remainder = "";

    }

    return {"parts":parts, "remainder":remainder};

}


/**
 * Evals string for default value and returns package with it and the mutated parts object
 * @param {string} remainder The string to eval
 * @param {json} parts The current parts object
 * @returns A package containing the remaining string and the mutated parts
 */
function default_string(remainder, parts){

    if(parts["has_options"]){

        parts["default"] = remainder.substring(remainder.indexOf("&&") + 2, remainder.indexOf("||"));
        options = remainder.split("||");
        options.shift();
        remainder = options.join("||");

    }else{

        parts["options"] = remainder.substring(remainder.indexOf("&&") + 2, remainder.length);
        remainder = "";

    }

    return {"parts":parts, "remainder":remainder};

}


/**
 * Breaks the string into parts based around special characters (&&, $$, ||)
 * @param {string} str The string to be parsed
 * @returns A json with the string parts
 */
function str_parts(str){

    // Assume this is a string because it's always called within str_parse()

    // Create empty parts object
    let parts = {
        "type":"",
        "placeholder":"",
        "default":"",
        "options":"",
        "has_placeholder":false,
        "has_default":false,
        "has_options":false
    }

    let config = {"placeholder":"&&", "default":"$$", "options":"||"};

    // Analyze for special characters (&&, $$, ||'s)
    for(let char in config){

        // Slick eval that uses the config object to set boolean evals for
        // the various special character sections
        if(str.includes(config[char])){
            parts["has_" + char] = true;
        }

    }

    // Now we check that this isn't a case where there is more than one word but no special charactersf
    if(!parts["has_placeholder"] && !parts["has_default"] && !parts["has_options"]){

        if(str.includes(" ")){

            parts["type"] = "text";

        }else{

            parts["type"] = str;

        }

    }else{

        // There is going to be a string remainder for more parsing usually
        let remainder = "";

        // If it starts with special characters, then the type was missed and we
        // should assume it's type "text". Otherwise, the type is the first word.
        let package = type_string(str, parts);
        parts = package["parts"];
        remainder = package["remainder"];

        // Get the placeholder string
        if(parts["has_placeholder"]){

            package = placeholder_string(remainder, parts);
            parts = package["parts"];
            remainder = package["remainder"];

        }

        // Get the default value string
        if(parts["has_default"]){

            package = default_string(remainder, parts);
            parts = package["parts"];
            remainder = package["remainder"];

        }
        
        // Get the array of options
        if(parts["has_options"]){

            parts["options"] = remainder.split("||");

        }

    }

    return parts;

}


/**
 * Takes in a string with potential special characters (&&, $$, and ||) 
 * and returns an object of those sets
 * @param {string} str The string to be parsed
 * @returns JSON of strings and arrays
 */
function str_parse(str){

    // Cast str as a string just to be sure
    str = String(str);

    // We want the sections broken up for evaluation. In order, this should be:
    // (1) type $$ (2) placeholder && (3) default value || (4) options || ... ||
    parts = str_parts(str);

    return {
        "PLACEHOLDER":parts["placeholder"],
        "DEFAULT":parts["default"],
        "DATALIST":parts["options"],
        "TYPE":parts["type"]
    };

}


/**
 * Returns an array of strings broken up at &&
 * @param {string} str String to be parsed
 * @returns Array of strings
 */
function lookup_amps(str){

    if(str.split('&&').length - 1 > 0){

        return str.split('&&')[1];

    }else{

        return '';

    }

}


/**
 * Returns an array of strings broken up at $$
 * @param {string} str String to be parsed
 * @returns Array of strings
 */
function lookup_usd(str){

    if(str.split('$$').length - 1 > 0){

        return str.split('$$')[1];

    }else{

        return '';

    }

}


/**
 * Returns an array of strings broken up at ||
 * @param {string} str String to be parsed
 * @returns Array of strings
 */
function lookup_pipes(str){

    // Empty array
    ret_array = Array();

    // Array of split string
    splits = str.split('||');

    if(splits.length - 1 > 0){

        for(let i = 1; i < splits.length; i++){

            ret_array.push(splits[i]);

        }

    }

    return ret_array;

}


/**
 * Evaluates letiable for object type
 * @param {*} test The object to test
 * @returns Evaluation of object type
 */
function is_object(test){

    return (typeof test == 'object' && typeof test !== null && !Array.isArray(test));

}


/**
 * Evaluates letiable for string type
 * @param {*} test The object to test
 * @returns Evaluation of string type
 */
function is_string(test){

    return (typeof test == 'string');

}


/**
 * Replaces spaces with underscore
 * @param {string} str The string to manipulate
 * @returns The mutated screen
 */
function syntax(str){

    return str.split(' ').join('_').toLowerCase();

}


/**
 * Evaluates the attribute for the ID and appends new text to it
 * @param {string} append The string to append to the ID to make a new ID 
 * @param {json} attr The attribute object
 * @returns The mutated attribute object
 */
function id_setter(append = "_", attr = {}){

    // Make sure append begins with a _
    if(!append.startsWith("_")){
        append = "_" + append;
    }

    // Handle differently if ID exists or not
    if("id" in attr){

        attr["id"] = attr["id"] + append;

    }else{

        attr["id"] = (new Date()).getTime() + append;

    }

    return attr;

}




// BUTTON FUNCTIONS //
//------------------//
/**
 * Creates a div and iterates over data to create buttons
 * @param {json} json The object containing button data
 * @param {json} attr The object containing attribute settings
 * @returns A div filled with buttons
 */
function create_button_group(json = {}, attr = {}){

    // Create empty div
    div = initialize('div', attr, '_button_group');

    // Iterate over JSON
    for(let btn in json){

        btnid = div[0].id + "_" + btn;
        div.append(create(create_button, {btn:json[btn]}, {"id":btnid}));

    }

    return div;

}


/**
 * Creates a button element and assumes the first key, val of
 * the json is the name and on-click event
 * @param {json} json The key and value pertaining to name and on-click
 * @param {json} attr The other attributes to be set
 * @returns A button
 */
function create_button(json = {}, attr = {}){

    // Create button element
    button = initialize("button", attr, "_button");

    // Add button text
    button.text(json["text"]);

    // Add an on-click event with the named function from the JSON
    button.attr('onclick', json["func"]);

    return button;

}




// LABEL FUNCTIONS //
//-----------------//
/**
 * Creates a button element and assumes the label text is the first key's value
 * @param {json} json The object containing the label data
 * @param {json} attr The object containing the attribute settings
 * @returns A label
 */
function create_label(json = {}, attr = {}){

    // Get data from json
    _name = json["name"];
    text = json["text"];

    // Set name attribute value
    attr["name"] = _name;

    // Create button element
    label = initialize("label", attr, "_label");

    // Set label to key name
    label.text(text);

    return label;

}




// INPUT FUNCTIONS //
//-----------------//
/**
 * Creates a radio input
 * @param {json} json The object containing the radio input data
 * @param {json} attr The object containing the attribute settings
 * @returns An input of type radio
 */
function create_radio(json = {}, attr = {}){

    // Get data from json
    value = json["value"];
    _name = json["name"];

    // Set type of input
    attr["type"] = "radio";
    attr["name"] = _name;
    attr["value"] = value;

    // Create button element
    radio = initialize("input", attr, "_radio");

    return radio;

}


/**
 * Creates a checkbox input
 * @param {json} json The object containing the checkbox input data
 * @param {json} attr The object containing the attribute settings
 * @returns An input of type checkbox
 */
function create_checkbox(json = {}, attr = {}){

    // Get data from json
    value = json["value"];
    _name = json["name"];

    // Set type of input
    attr["type"] = "checkbox";
    attr["name"] = _name;
    attr["value"] = value;

    // Create button element
    radio = initialize("input", attr, "_checkbox_");

    return radio;

}


/**
 * Creates an input
 * @param {json} json The object containing the input data
 * @param {json} attr The object containing the attribute settings
 * @returns An input
 */
function create_input(json = {}, attr = {}){

    // Create button element
    input = initialize("input", attr, "_input");

    // Set default value if not empty
    if(json["default"] != ''){
        input.text(json["default"]);
    }

    // Set placeholder value (doing this here so the auto toLower() function doesn't affect it)
    input.attr('placeholder', json["placeholder"]);

    return input;

}


/**
 * Creates an option
 * @param {json} json The object containing the option data
 * @param {json} attr The object containing the attribute settings
 * @returns An option
 */
function create_option(json={}, attr = {}){

    // Set value attribute to json's value
    attr["value"] = json["value"];

    // Create option element
    option = initialize("option", attr, "_option");

    // Set option to key name
    option.text(json["value"]);
    
    return option;
    
}


/**
 * Creates a datalist
 * @param {json} json The object containing the datalist data
 * @param {json} attr The object containing the attribute settings
 * @returns A datalist
 */
function create_datalist(json = {}, attr = {}){

    // Create button element
    datalist = initialize("datalist", attr, "_datalist");

    // Ordered List
    ordered_list = [];

    // Get options and iterate over (assumes "options" is an array)
    for(let option in json["itemlist"]){

        optionid = datalist[0].id + "_" + option;

        ordered_list.push(create(create_option, {"value":option}, {"id":optionid}))

    }

    // Add options to dataset
    datalist = ordered_append(datalist, ordered_list);

    return datalist;

}




// FORM FUNCTIONS //
//----------------//
/**
 * Takes in a json to iterate over and creates an array of elements in
 * the order they should be appended
 * @param {string} id_prepend The string to put ahead of the ID
 * @param {json} list The object with radio definitions
 * @returns An array of elements
 */
function multiple_radio(id_prepend, list){

    // The ordered list to be returned
    let arr = Array();

    // Iterate over list radio definitions and create button-label pairs
    for(let radio in list){

        // Get radio ID
        let id = id_prepend + radio;

        // Stringified list entry
        let entry = String(list[radio]);

        // Get string-parsed values
        let value_set = str_parse(entry);

        // If defaulted, check the button
        let attr = {"id":id, "checked":(value_set['DEFAULT'] != '')};

        // Push the radio button and its label to the array
        arr.push(create(create_radio, {"value":radio, "name":radio}, attr));
        arr.push(create(create_label, {"text":id}, {"id":radio, "_for":radio}));

    }

    return arr;

}


/**
 * Takes in a json to iterate over and creates an array of elements in
 * the order they should be appended
 * @param {string} id_prepend The string to put ahead of the ID
 * @param {json} list The object with radio definitions
 * @returns An array of elements
 */
function multiple_checkbox(id_prepend, list){

    // The ordered list to be returned
    let arr = Array();

    // Iterate over list radio definitions and create button-label pairs
    for(let checkbox in list){

        // Get radio ID
        let id = id_prepend + checkbox;

        // If defaulted, check the button
        let attr = {"id":id, "checked":false};

        // Push the radio button and its label to the array
        arr.push(create(create_radio, {"value":radio, "name":radio}, attr));
        arr.push(create(create_label, {"text":id}, {"id":radio, "_for":radio}));

    }

    return arr;

}


/**
 * Takes in a json with a specific syntax defined in the README and produces a full form
 * from it's contents
 * @param {json} json The data used to build the form
 * @param {json} attr The attributes for the form
 * @returns The form element
 */
function create_form(json = {}, attr = {}){

    // Initialize form
    let form = initialize('form', attr, '_form');
    
    // Iterate over
    for(let item in json){

        // Make item's ID
        let itemid = form[0].id + "_" + item;

        // Create label for all radio buttons
        let over_label = create(create_label, {"text":item, "_name":item + "_label"}, {"id":itemid});

        // Empty array for ordered list of labels and checkboxes
        let ordered_list = [];

        // Handle differently depending on item value in json
        if(Array.isArray(json[item])){

            ordered_list = multiple_radio(json[item]);

        }else if(is_object(json[item])){

            ordered_list = multiple_checkbox(json[item]);

        }else if(is_string(json[item])){

            // We assume it's well formed, meaning it is written as
            // <type of input> && <placeholder> $$ <default value> || <datalist 1> || <datalist 2> || ... || <datalist n>
            // The pairs of special characters represent where one type ends and another begins.
            input_options = str_parse(json[item]);

            // Make the input
            let input = create(create_input, {"placeholder":input_options["PLACEHOLDER"], "default":input_options["DEFAULT"]}, {"type":input_options["TYPE"], "id":itemid});

            // If datalist was not at zero, make datalist
            if(input_options["DATALIST"] != ""){

                itemname = item + '_datalist';
                let datalist = create(create_datalist, {"itemlist":input_options["DATALIST"]}, {});

                // Make ordered list
                ordered_list = Array(input, datalist);

            }else{

                ordered_list = Array(input);

            }

        }

        // Ordered append on form (concat over_label with ordered_list to get one array first)
        form = ordered_append(form, Array(over_label).concat(ordered_list));

    }
    
    return form;
}




// GOOGLE MAPS //
//-------------//
/**
 * Creates a div and loads it with a google map
 * @param {json} json The data for the google map
 * @param {json} attr The attributes for the element
 * @returns A div with a google map
 */
function create_gmaps(json = {}, attr = {}){

    // Set some defaults
    if(!("location" in json)){

        json["location"] = { lat: 40.3334595, lng: -75.075157 };

    }

    if(!("zoom" in json)){

        json["zoom"] = 4;

    }

    // Initialize the div
    div = initialize('div', attr, "_gmaps");

    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById(div[0].id), {
        zoom: json["zoom"],
        center: location,
    });

    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
        position: json["location"],
        map: map,
    });

    return div;

}



















function validator(json = {}, on_success = Function(), classes = "", msg = "Not all fields contain valid information. Please review and try again.", alert_override = false){

    // Denotes that everything was good
    let allgood = true;

    // Iterate over json keys to find matching IDs on the page to evaluate
    for(item in json){

        // Fire off the function saved in item's index using item as the argument
        let fn = window[json[item]["func"]];

        if(!fn(item)){

            // Color it bad if invalid
            $('#' + json[item]["targ"]).addClass(classes);

            allgood = false;

        }else{

            // Remove styles indicating bad otherwise
            $('#' + json[item]["targ"]).removeClass(classes);

        }

    }

    if(!alert_override){

        on_failure = alert;

    }else{

        on_failure = alert_override;

    }

    if(!allgood){

        on_failure(msg);

    }else{

        on_success();

    }
    

}


function validate_password(id){

    let val = $('#' + id).val();

    if(val > ''){

        return true;

    }else{

        return false;

    }

}


function validate_email(id){

    let val = $('#' + id).val();

    if(val > ''){

        return true;
        
    }else{

        return false;

    }

}


function go_page(url){

    window.location = url;

}