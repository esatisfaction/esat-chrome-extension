// ==================== QUESTIONNAIRE INTEGRATION ==================== //
(function ($) {
    // Initialize
    $(document).one('ready', function () {
        // Set questionnaire position according to type
        $(document).on('change', '#integration-type', function () {
            dispatchPositionOptions();
        });

        // Enable/Disable language
        $(document).on('change', '#integration-locale-auto-detect', function () {
            checkIntegrationLocaleAutodetect();
        });

        renderPlugins();
    });

    /**
     * Render questionnaire page plugins
     */
    function renderPlugins() {
        // Display and hide position types
        dispatchPositionOptions();

        // Check Locale Autodetect status
        checkIntegrationLocaleAutodetect();

        // Render form plugins
        EsatChromeExtension.Forms.renderPlugins();
    }

    /**
     * Display and hide position types
     */
    function dispatchPositionOptions() {
        $('.integration-type').each(function () {
            let parent = $(this).closest('.questionnaire-override-container');
            let integrationType = $(this).val();
            if (integrationType === "box" || integrationType === "box_classic") {
                parent.find('.integration-position-box').css('display', 'block');
                parent.find('.integration-position-embed').css('display', 'none');
            } else {
                parent.find('.integration-position-box').css('display', 'none');
                parent.find('.integration-position-embed').css('display', 'block');
            }
        });
    }

    /**
     * Enable/Disable language selector based on auto-detect option
     */
    function checkIntegrationLocaleAutodetect() {
        $('.integration-locale-auto-detect').each(function () {
            let parent = $(this).closest('.questionnaire-override-container');
            let state = $(this).prop('checked');
            parent.find('.questionnaire-locale').toggleClass('disabled', state).prop("disabled", state);
            parent.find('.questionnaire-locale').selectpicker('refresh');
        });
    }

    // Add panel
    $(document).on('click', '.btn-add-questionnaire', function () {
        let template = $('template.questionnaire-override-container-template').prop('content');
        $(template).find('.questionnaire-override-container').clone().appendTo(".questionnaire-overrides");
        EsatChromeExtension.Navigation.renderPlugins();
        EsatChromeExtension.Forms.renderPlugins();
        renderPlugins();
    });

    // Remove panel
    $(document).on('click', '.questionnaire-override-container a[data-action="delete"]', function () {
        $(this).closest('.panel').detach();
    });
})(jQuery);

// ==================== INTEGRATE CODE ==================== //
(function ($) {
    'use strict';

    // Integrate code on the website
    $(document).on('submit', '#e-satisfaction-config-form', function (ev) {
        // Prevent default action
        ev.preventDefault();

        /**
         * Check form validity in case the form submission
         * comes from a custom javascript code
         * or if a hidden input is not visible
         */
        if (!$(this)[0].checkValidity()) {
            console.log('form is not valid');
            return false;
        }

        // Get application id
        let applicationId = $(this).find('input[name="application_id"]').val();

        // Get collection overrides
        let collectionOverride = {};
        $('.questionnaire-overrides > .questionnaire-override-container').each(function () {
            // Get questionnaire id
            let questionnaireId = $(this).find('input[name="questionnaire_id"]').val();
            if (questionnaireId === '' || questionnaireId === undefined) {
                return true;
            }

            // Get all other settings
            let active = $(this).find('input[name="active"]').prop('checked');
            let activeMobile = $(this).find('input[name="active_mobile"]').prop('checked');
            let locale = $(this).find('select[name="locale"]').val();
            let localeAutodetect = $(this).find('input[name="locale_autodetect"]').prop('checked');
            let type = $(this).find('select[name="type"]').val();
            let position = '';
            if (type === 'box' || type === 'box_classic') {
                position = $(this).find('.integration-position-box select[name="position-box"]').val();
            } else {
                position = $(this).find('.integration-position-embed input[name="position-embed"]').val();
            }
            let positionType = $(this).find('select[name="position_type"]').val();
            let maximized = $(this).find('input[name="box_maximized"]').prop('checked');

            // Add to collection override configuration
            collectionOverride[questionnaireId] = {
                active: active,
                active_mobile: activeMobile,
                locale: locale,
                locale_autodetect: localeAutodetect,
                type: type,
                position: position,
                position_type: positionType,
                box_maximized: maximized
            };
        });
        console.log(collectionOverride);

        // Send Message
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {application_id: applicationId, collection: collectionOverride});
        });
    });
})(jQuery);
