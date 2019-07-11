var EsatChromeExtension = EsatChromeExtension || {};

(function ($) {
    /**
     * Dashboard Navigation
     *
     * @type {void|Object|*}
     */
    EsatChromeExtension.Navigation = $.extend(true, EsatChromeExtension.Navigation || {}, {
        /**
         * The name of the configuration object in LocalStorage
         */
        panel_state: 'esat-panel-state',

        /**
         * Initialize global listeners.
         */
        init: function () {
            // Collapse on click
            $(document).off('click', '.panel [data-action=collapse]');
            $(document).on('click', '.panel [data-action=collapse]', function (e) {
                // Prevent any default actions
                e.preventDefault();

                // Get panel to slide
                var closestPanel = $(this).closest('.panel');
                var panelBody = closestPanel.children('.panel-body').first();
                closestPanel.toggleClass('panel-collapsed');
                var isCollapsed = closestPanel.hasClass('panel-collapsed');
                $(this).toggleClass('rotate-180', !isCollapsed);

                if (isCollapsed) {
                    panelBody.slideUp(150);
                } else {
                    panelBody.slideDown(150);
                }
            });

            // Collapse on panel-title click
            $(document).off('click', '.panel .panel-title');
            $(document).on('click', '.panel .panel-title', function () {
                $(this).closest('.panel').find('[data-action=collapse]').first().trigger('click');
            });

            this.renderPlugins();
        },

        /**
         * Render navigation plugins and elements
         */
        renderPlugins: function () {
            // Show all panels
            $('.panel:not(.panel-collapsed)').each(function () {
                $(this).find('.panel-heading').first().nextAll().show();
                $(this).find('[data-action=collapse]').first().addClass('rotate-180');
            });

            // Hide if collapsed by default
            $('.panel.panel-collapsed:not(.panel-collapsed-skip)').each(function () {
                $(this).find('.panel-heading').first().nextAll().hide();
                $(this).find('[data-action=collapse]').first().removeClass('rotate-180');
            });

            // Initialize all panels
            $('.panel:not(.initialized)').addClass('initialized');
        },
    });

    // Initialize
    $(document).one('ready', function () {
        EsatChromeExtension.Navigation.init();
    });
})(jQuery);
