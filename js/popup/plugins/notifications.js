var EsatChromeExtension = EsatChromeExtension || {};

(function ($) {
    /**
     * Dashboard Navigation
     *
     * @type {void|Object|*}
     */
    EsatChromeExtension.Notifications = $.extend(true, EsatChromeExtension.Notifications || {}, {
        /**
         * Show a jGrowl notification
         *
         * @param {String} message
         * @param {Object} options
         */
        jGrowl: function (message, options) {
            $.jGrowl(message, options);
        },
    });
})(jQuery);
