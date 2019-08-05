// ==================== QUESTIONNAIRE INTEGRATION ==================== //
(function ($) {
    // Initialize
    $(document).one('ready', function () {
        // Clear cache
        $(document).on('click', '.form-group.actions .btn-clear-cache', function () {
            // Send Message
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    message: 'clear_cache',
                });
            });

            // Display notification
            EsatChromeExtension.Notifications.jGrowl('Cache cleared', {
                header: 'Success',
                theme: 'bg-success-400'
            });
        });

        // Remove panel
        $(document).on('click', '.questionnaire-override-container a[data-action="delete"]', function () {
            $(this).closest('.panel').detach();
        });

        // Set questionnaire position according to type
        $(document).on('change', '#integration-type', function () {
            dispatchPositionOptions();
        });

        // Enable/Disable language
        $(document).on('change, switchChange.bootstrapSwitch', 'input[name="locale_autodetect"]', function () {
            checkIntegrationLocaleAutodetect();
        });

        // Update panel title with questionnaire id
        $(document).on('keyup', 'input[name="questionnaire_id"]', function () {
            updateQuestionnaireSettingsPanelHeading();
        });
        // Update panel with questionnaire type
        $(document).on('change', 'select[name="type"]', function () {
            updateQuestionnaireSettingsPanelHeading();
        });

        renderPlugins();

        getIntegrationInfo();
    });

    function getIntegrationInfo() {
        // Check if we are in chrome extension environment
        if (!chrome.tabs) {
            return;
        }

        // Check Page Integration
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                message: 'get_integration',
            }, function (response) {
                loadIntegrationConfiguration(response);
            });
        });
    }

    function loadIntegrationConfiguration(configuration) {
        let configurationSettings = JSON.parse(configuration);

        // Enable labels for jQuery and GTM
        if (configurationSettings.jquery !== null) {
            $('.config-labels .with-jquery').html('jQuery ' + configurationSettings.jquery);
        } else {
            $('.config-labels .with-jquery').remove();
        }
        if (!configurationSettings.hasGTM) {
            $('.config-labels .with-gtm').remove();
        }

        // Apply Integration Settings
        if (configurationSettings.config !== null) {
            // Set form to update integration instead of inserting it
            $('input[name="update_integration"]').val(1);

            // Set Application Id
            $('input[name="application_id"]')
                .val(configurationSettings.config.application_id)
                .attr('readonly', true);

            // Add all Questionnaire Settings
            let template = $('template.questionnaire-override-container-template').prop('content');
            for (let q in configurationSettings.config.collection) {
                // Get Questionnaire Configuration
                let questionnaireConfiguration = configurationSettings.config.collection[q];

                // Add panel
                let qPanel = $(template).find('.questionnaire-override-container').clone().appendTo(".questionnaire-overrides");

                // Set Questionnaire Settings
                $(qPanel).find('input[name="questionnaire_id"]')
                    .val(questionnaireConfiguration.questionnaire_id)
                    .attr('readonly', true);
                $(qPanel).find('input[name="active"]').prop('checked', questionnaireConfiguration.active);
                $(qPanel).find('input[name="active_mobile"]').prop('checked', questionnaireConfiguration.active_mobile);
                $(qPanel).find('select[name="locale"]').val(questionnaireConfiguration.locale);
                $(qPanel).find('input[name="locale_autodetect"]').prop('checked', questionnaireConfiguration.locale_autodetect);
                $(qPanel).find('select[name="type"]').val(questionnaireConfiguration.type);
                if (questionnaireConfiguration.type === 'box' || questionnaireConfiguration.type === 'box_classic') {
                    $(qPanel).find('.integration-position-box select[name="position-box"]').val(questionnaireConfiguration.position);
                } else {
                    $(qPanel).find('.integration-position-embed input[name="position-embed"]').val(questionnaireConfiguration.position);
                }
                $(qPanel).find('select[name="position_type"]').val(questionnaireConfiguration.position_type);
                $(qPanel).find('input[name="box_maximized"]').prop('checked', questionnaireConfiguration.box_maximized);
                $(qPanel).find('input[name="delay_cap_minutes"]').val(questionnaireConfiguration.delay_cap_minutes);
                $(qPanel).find('input[name="delay_cap_hours"]').val(questionnaireConfiguration.delay_cap_hours);
                $(qPanel).find('input[name="delay_cap_days"]').val(questionnaireConfiguration.delay_cap_days);
                $(qPanel).find('input[name="frequency_cap_minutes"]').val(questionnaireConfiguration.frequency_cap_minutes);
                $(qPanel).find('input[name="frequency_cap_hours"]').val(questionnaireConfiguration.frequency_cap_hours);
                $(qPanel).find('input[name="frequency_cap_days"]').val(questionnaireConfiguration.frequency_cap_days);
                $(qPanel).find('textarea[name="whitelist"]').val(questionnaireConfiguration.whitelist.split(',').join("\n"));
                $(qPanel).find('textarea[name="blacklist"]').val(questionnaireConfiguration.blacklist.split(',').join("\n"));
            }

            // Change button literal
            $('button[type="submit"]').html('Update Integration');

            // Render ui
            EsatChromeExtension.Navigation.renderPlugins();
            EsatChromeExtension.Forms.renderPlugins();
            renderPlugins();
        } else {
            $('.config-labels .with-e-satisfaction').remove();
        }
    }

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

        updateQuestionnaireSettingsPanelHeading();
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
        $('input[name="locale_autodetect"]').each(function () {
            let parent = $(this).closest('.questionnaire-override-container');
            let state = $(this).prop('checked');
            parent.find('.questionnaire-locale').toggleClass('disabled', state).prop("disabled", state);
            parent.find('.questionnaire-locale').selectpicker('refresh');
        });
    }

    /**
     * Update each questionnaire panel heading based on id and type
     */
    function updateQuestionnaireSettingsPanelHeading() {
        $('.questionnaire-override-container').each(function () {
            let questionnaireId = $(this).find('input[name="questionnaire_id"]').val();
            let type = $(this).find('select[name="type"]').val();
            let suffix = questionnaireId !== '' ? ' [' + questionnaireId + ']' : '';
            suffix += type !== '' ? ' [' + type + ']' : '';
            $(this).closest('.questionnaire-override-container.panel').find('.panel-heading .panel-title').html('Questionnaire' + suffix);
        });
    }
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
            let type = $(this).find('select[name="type"]').val();
            let position = '';
            if (type === 'box' || type === 'box_classic') {
                position = $(this).find('.integration-position-box select[name="position-box"]').val();
            } else {
                position = $(this).find('.integration-position-embed input[name="position-embed"]').val();
            }

            // Add to collection override configuration
            collectionOverride[questionnaireId] = {
                active: $(this).find('input[name="active"]').prop('checked'),
                active_mobile: $(this).find('input[name="active_mobile"]').prop('checked'),
                locale: $(this).find('select[name="locale"]').val(),
                locale_autodetect: $(this).find('input[name="locale_autodetect"]').prop('checked'),
                type: type,
                position: position,
                position_type: $(this).find('select[name="position_type"]').val(),
                box_maximized: $(this).find('input[name="box_maximized"]').prop('checked'),
                delay_cap_minutes: $(this).find('select[name="delay_cap_minutes"]').val(),
                delay_cap_hours: $(this).find('select[name="delay_cap_hours"]').val(),
                delay_cap_days: $(this).find('select[name="delay_cap_days"]').val(),
                frequency_cap_minutes: $(this).find('select[name="frequency_cap_minutes"]').val(),
                frequency_cap_hours: $(this).find('select[name="frequency_cap_hours"]').val(),
                frequency_cap_days: $(this).find('select[name="frequency_cap_days"]').val(),
            };
        });

        // Check if apply or update integration
        let updateIntegration = $(this).find('input[name="update_integration"]').val() == 1;

        // Send Message
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                message: updateIntegration ? 'update_integration' : 'apply_integration',
                config: {application_id: applicationId, collection: collectionOverride}
            });
        });

        // Display notification
        EsatChromeExtension.Notifications.jGrowl(updateIntegration ? 'Integration Updated' : 'Integration Applied', {
            header: 'Success',
            theme: 'bg-success-400'
        });
    });
})(jQuery);
