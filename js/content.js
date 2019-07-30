let scriptLoaded = false;

// Receive messages from the extension
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.message) {
        case 'apply_integration':
            applyIntegration(request, sender, sendResponse);
            break;
        case 'update_integration':
            updateIntegration(request, sender, sendResponse);
            break;
        case 'get_integration':
            getIntegration(request, sender, sendResponse);
            break;
        case 'clear_cache':
            clearCache(request, sender, sendResponse);
            break;
    }
});

function applyIntegration(request, sender, sendResponse) {
    // Check if script is loaded already
    if (scriptLoaded) {
        return;
    }

    // Set script as loaded
    scriptLoaded = true;

    // Initialize config
    let config = {application_id: request.config.application_id, collection: request.config.collection || {}};

    // Attach script in page
    let elt = document.createElement("script");
    elt.innerHTML = "" +
        "// Define e-satisfaction collection configuration\n" +
        "window.esat_config = " + JSON.stringify(config) + ";\n" +
        "\n" +
        "// Update metadata\n" +
        "window.Esat = window.Esat || {};\n" +
        "window.Esat.updateMetadata = function (q, m) {\n" +
        "    window.esat_config.collection[q] = window.esat_config.collection[q] || {};\n" +
        "    window.esat_config.collection[q].metadata = m;\n" +
        "};\n" +
        "\n" +
        "// Setup script\n" +
        "var l = function () {\n" +
        "    // Determine if website has jQuery\n" +
        "    let withJQuery = window.jQuery === undefined;\n" +
        "\n" +
        "    var r = document.getElementsByTagName('script')[0], s = document.createElement('script');\n" +
        "    s.async = true;\n" +
        "    s.src = 'https://collection.e-satisfaction.com/dist/js/integration' + (!!withJQuery ? '.jq' : '') + '.min.js';\n" +
        "    r.parentNode.insertBefore(s, r);\n" +
        "};\n" +
        "\n" +
        "// Attach script or run script if document is loaded\n" +
        "'complete' === document.readyState ? l() : (window.attachEvent ? window.attachEvent('onload', l) : window.addEventListener('load', l, false));";
    document.head.appendChild(elt);
}

function updateIntegration(request, sender, sendResponse) {
    // Initialize config
    let config = {application_id: request.config.application_id, collection: request.config.collection || {}};

    // Attach script in page
    let elt = document.createElement("script");
    elt.innerHTML = "" +
        "// Update e-satisfaction configuration\n" +
        "Esat.Config.setConfig(" + JSON.stringify(config) + ")";
    document.head.appendChild(elt);
}

function getIntegration(request, sender, sendResponse) {
    /**
     * Create a function that will be executed on the host page and will retrieve
     * the e-satisfaction configuration settings.
     *
     * It will set the textarea's value to the settings so that we can get these
     * settings later and transfer them to the extension
     */
    let getIntegrationConfiguration = function () {
        let textarea = document.getElementById('e-satisfaction-configuration-area');
        let configurationSettings = {
            config: window.Esat ? window.Esat.Config.getConfig() : null,
            jquery: window.jQuery !== undefined ? window.jQuery.fn.jquery : null,
            hasGTM: window.google_tag_manager !== undefined,
        };
        textarea.value = JSON.stringify(configurationSettings);
    };

    // Create textarea that will be populated with the configuration needed
    let textarea = document.createElement('textarea');
    textarea.setAttribute('id', 'e-satisfaction-configuration-area');
    textarea.style.display = 'none';
    document.body.appendChild(textarea);

    // Append the script to retrieve the configuration needed
    let script = document.createElement('script');
    script.appendChild(document.createTextNode('(' + getIntegrationConfiguration + ')();'));
    document.body.appendChild(script);

    /**
     * Get the textarea value after executing the script and transfer it to the
     * extension context as response.
     */
    sendResponse(textarea.value);

    // Remove textarea
    document.body.removeChild(textarea);
}

function clearCache(request, sender, sendResponse) {
    // Clear local storage
    localStorage.removeItem('esat_collection');

    // Clear all related cookies
    let allCookies = document.cookie.split(';');
    for (let c in allCookies) {
        let cookieName = allCookies[c].split('=')[0].trim();
        if (cookieName.startsWith('esat_campaign_')) {
            console.log('delete');
            document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=.e-satisfaction.com;';
        }
    }
}