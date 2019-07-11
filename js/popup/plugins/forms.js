var EsatChromeExtension = EsatChromeExtension || {};

(function ($) {
    /**
     * Dashboard Forms Handler
     *
     * @type {void|Object|*}
     */
    EsatChromeExtension.Forms = $.extend(true, EsatChromeExtension.Forms || {}, {
        /**
         * Initialize form plugins
         */
        renderPlugins: function () {
            // Style checkboxes and radios
            $('.styled').uniform({
                radioClass: 'choice'
            });

            // Set file inputs
            $('input[type="file"]:not(.dz-hidden-input)').uniform({
                fileButtonClass: 'action btn bg-esat-primary'
            });

            // Bootstrap switches
            $('.esat-bootstrap-switch').bootstrapSwitch();

            // Select2 selects
            $('.esat-select-select2').select2();

            // Bootstrap selects
            $.fn.selectpicker.defaults = {
                iconBase: '',
                tickIcon: 'icon-checkmark3'
            };
            $('.bootstrap-select').selectpicker('refresh');

            // Pickadate Date picker
            if ($('.esat-pickadate').length) {
                $('.esat-pickadate').pickadate({
                    selectYears: true,
                    selectMonths: true
                });
            }

            // Switchery
            let elements = Array.prototype.slice.call(document.querySelectorAll('.switchery:not(.switchery-done)'));
            elements.forEach(function (html) {
                $(html).addClass('switchery-done');
                let switchery = new Switchery(html);
            });

            // Colored switches
            elements = Array.prototype.slice.call(document.querySelectorAll('.switchery-esat-primary:not(.switchery-done)'));
            elements.forEach(function (html) {
                $(html).addClass('switchery-done');
                let switchery = new Switchery(html, {color: '#28a9e1'});
            });
            elements = Array.prototype.slice.call(document.querySelectorAll('.switchery-esat-cta:not(.switchery-done)'));
            elements.forEach(function (html) {
                $(html).addClass('switchery-done');
                let switchery = new Switchery(html, {color: '#f85e2f'});
            });
            elements = Array.prototype.slice.call(document.querySelectorAll('.switchery-primary:not(.switchery-done)'));
            elements.forEach(function (html) {
                $(html).addClass('switchery-done');
                let switchery = new Switchery(html, {color: '#2196f3'});
            });
            elements = Array.prototype.slice.call(document.querySelectorAll('.switchery-danger:not(.switchery-done)'));
            elements.forEach(function (html) {
                $(html).addClass('switchery-done');
                let switchery = new Switchery(html, {color: '#ef5350'});
            });
            elements = Array.prototype.slice.call(document.querySelectorAll('.switchery-warning:not(.switchery-done)'));
            elements.forEach(function (html) {
                $(html).addClass('switchery-done');
                let switchery = new Switchery(html, {color: '#ff7043'});
            });
            elements = Array.prototype.slice.call(document.querySelectorAll('.switchery-info:not(.switchery-done)'));
            elements.forEach(function (html) {
                $(html).addClass('switchery-done');
                let switchery = new Switchery(html, {color: '#00bcd4'});
            });
        },
    });

    // Initialize
    $(document).one('ready', function () {
        EsatChromeExtension.Forms.renderPlugins();
    });
})(jQuery);
