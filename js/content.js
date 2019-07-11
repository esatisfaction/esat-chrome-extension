var scriptLoaded = false;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // Check if script is loaded already
    if (scriptLoaded) {
        return;
    }

    // Set script as loaded
    scriptLoaded = true;

    // Initialize config
    let config = {application_id: request.application_id, collection: request.collection || {}};

    // Attach script in page
    let elt = document.createElement("script");
    elt.innerHTML = "" +
        "// Get current tab\n" +
        "let w = window;\n" +
        "let d = document;\n" +
        "\n" +
        "// Define e-satisfaction collection configuration\n" +
        "w.esat_config = " + JSON.stringify(config) + ";\n" +
        "\n" +
        "// Update metadata\n" +
        "w.Esat = w.Esat || {};\n" +
        "w.Esat.updateMetadata = function (q, m) {\n" +
        "    w.esat_config.collection[q] = w.esat_config.collection[q] || {};\n" +
        "    w.esat_config.collection[q].metadata = m;\n" +
        "};\n" +
        "\n" +
        "// Setup script\n" +
        "var l = function () {\n" +
        "    // Determine if website has jQuery\n" +
        "    let withJQuery = w.jQuery === undefined;\n" +
        "\n" +
        "    var r = d.getElementsByTagName('script')[0], s = d.createElement('script');\n" +
        "    s.async = true;\n" +
        "    s.src = 'https://collection.e-satisfaction.com/dist/js/integration' + (!!withJQuery ? '.jq' : '') + '.min.js';\n" +
        "    r.parentNode.insertBefore(s, r);\n" +
        "};\n" +
        "\n" +
        "// Attach script or run script if document is loaded\n" +
        "'complete' === d.readyState ? l() : (w.attachEvent ? w.attachEvent('onload', l) : w.addEventListener('load', l, false));";
    document.head.appendChild(elt);
});
