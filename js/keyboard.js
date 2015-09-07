var KeyboardNavigation;

(function() {
    KeyboardNavigation = {};

    var background;
    var foreground;
    var init_key;

    var hud_is_shown = false;

    var selected_id;
    var buttons = [];
    var count = 0;

    var create_dom_element = function(top, left, id) {
        var element = document.createElement("DIV");
        element.id = id;
        element.style.position = "absolute";
        element.style.top = top;
        element.style.left = left;
        element.style.backgroundColor = "black";
        element.style.color = "white";
        element.style.zIndex = 1000;
        element.innerHTML = "" + count++;
        return element;
    };

    var create_id_generator = function() {
        var prefix = "hud_button_";
        var counter = 0;
        return {
            next: function() {
                counter += 1;
                return prefix + counter;
            },
            reset: function() {
                counter = 0;
            }
        };
    };

    var id_generator = create_id_generator();

    var create_button = function(node) {
        var pos_top     = node.offsetTop;
        var pos_left    = node.offsetLeft;
        var button_id   = id_generator.next();
        var dom_element = create_dom_element(pos_top, pos_left, button_id);

        return {
            dom_element: dom_element,
            id:          button_id,
            node:        node,

            position: {
                top: pos_top,
                left: pos_left
            },
            show: function() {
                dom_element.style.display = "block";
            },
	    hide: function () {
		dom_element.style.display = "none";
	    },
	    press: function () {
		if (node.tagName === "A") {
		    if (typeof node.onclick == "function") {
			node.onclick.apply(elem);
		    } else {
			window.location.href = node.href;
		    }
		} else if (node.tagName === "BUTTON") {

		}
	    }
        };
    };

    var create_input_field = function() {
        var input = document.createElement("INPUT");
        input.id = "keyboard_nav_input";
        input.setAttribute("type", "text");
        input.setAttribute("value", "");

        input.style.width = "40px";
        input.style.height = "20px";
        input.style.color = "white";
	input.style.display = "none";
        input.style.backgroundColor = "black";

        return {
            dom_element: input,
            show: function() {
                input.style.display = "block";
            },
            hide: function() {
                input.style.display = "none";
            },
            focus: function() {
                input.focus();
            },
	    clear: function() {
		input.value = "";
	    },
	    value: function () {
		return input.value;
	    }
        };
    };

    var input_field = create_input_field();

    var get_bounding_box = function(element) {
        var tag_name = element.tagName;
        if (tag_name === "A" || tag_name === "BUTTON") {
            return element.getBoundingClientRect();
        }
        return null;
    };

    var is_valid_node = function(node) {
        if (node instanceof Element) {
            return (node.tagName === "A" || node.tagName == "BUTTON");
        }
        return false;
    };

    var create_link_button = function(node) {
        if (is_valid_node(node)) {
            var button = create_button(node);
            buttons.push(button);
            console.log(button);
            document.body.appendChild(button.dom_element);
        }
    };

    var is_visible = function(element) {
        if (element && element.style) {
            var style = window.getComputedStyle(element);
            var visible = (style.visibility !== "hidden");
            var displayed = (style.display !== "none");
            return (visible && displayed);
        }
        return null;
    };

    var walk_visible_dom = function(node, func) {
        if (is_visible(node)) {
            func(node);
            node = node.firstChild;
            while (node) {
                node = node.nextSibling;
                walk_visible_dom(node, func);
            }
        }
    };

    var show_hud = function() {
        input_field.show();
	buttons.forEach( function (button) {
	    button.show();
	});
	input_field.focus();
	input_field.clear(); 
	hud_is_shown = true;
    };

    var clear_hud = function() {
        buttons.forEach(function(button) {
            button.hide();
        });
        input_field.hide();
	input_field.clear();
	hud_is_shown = false;
    };

    var init = function() {
        walk_visible_dom(document.body, create_link_button);
	buttons.forEach(function (button) {
	    button.hide();
	});
        window.onkeydown = function(event) {
            if (event.keyCode === 70) {
                console.log("show hud");
                show_hud();
            } else if (event.keyCode === 27) {
                console.log("clear hud");
                clear_hud();
            } else if (event.keyCode === 13 && hud_is_shown) {
		var button_number = input_field.value();
		buttons[parseInt(button_number)].press();
	    }
        };
        document.body.appendChild(input_field.dom_element);
    };

    KeyboardNavigation.config = function(options) {
        background = options.background || "black";
        foreground = options.foreground || "white";

        var init_character = options.key || "m";
        init_key = init_character.keyCodeAt(0);
        console.log(init_key);
    };
    KeyboardNavigation.init = init;
})();

