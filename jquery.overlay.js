;(function ( $, window, undefined ) {

  // Defaults
  var pluginName = 'overlay',
    document = window.document,
    defaults = {
      duration: 200,
      onOpen: function() {},
      afterClose: function() {},
      fullResImageId: 'fullResImage',
      captionAttribute: 'title',
      closeLinkHTML: '&times;',
      closeLinkTitle: 'Close',
      classes: {
        overlay: pluginName + '-overlay',
        wrapper: pluginName + '-wrapper',
        container: pluginName + '-container',
        close: pluginName + '-close',
        closeLink: pluginName + '-close-link',
        content: pluginName + '-content',
        caption: pluginName + '-caption'
      }
    };

  // The actual plugin constructor
  function Plugin( element, options, selector ) {
    this.element = element;
    this.selector = selector;
    this.options = $.extend( {}, defaults, options) ;
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {

    init: function() {

      // Store 'this' so it can be accessed from callback methods
      var t = this;

      // Setup an object to store the markup elements
      this.markup = {};

      // Only do this once!
      if ( $( '.' + this.options.classes.overlay ).length === 0 ) {

        // Setup markup
        this.markup.page      = $('body'),
        this.markup.overlay   = $('<div />', { 'class': this.options.classes.overlay + ' ' + this.options.classes.close }).appendTo( this.markup.page ),
        this.markup.wrapper   = $('<div />', { 'class': this.options.classes.wrapper }).appendTo( this.markup.page ),
        this.markup.container = $('<div />', { 'class': this.options.classes.container }).appendTo( this.markup.wrapper ),
        this.markup.closeLink = $('<a />', { 'class': this.options.classes.closeLink + ' ' + this.options.classes.close, 'html': this.options.closeLinkHTML, 'title': this.options.closeLinkTitle, 'href': '#' }).appendTo( this.markup.container ),
        this.markup.content   = $('<div />', { 'class': this.options.classes.content }).appendTo( this.markup.container ),
        this.markup.caption   = $('<p />', { 'class': this.options.classes.caption }).appendTo( this.markup.container );

        // Open the overlay window
        $( document ).on('click', this.selector + ':not(.' + this.options.classes.close + ')', function(e) {
          e.preventDefault();
          t.open( $(this).attr('href') );
        });

        // Close the overlay window
        $('.' + this.options.classes.close).on('click', function(e){
          e.preventDefault();
          t.close();
        });
        $( document ).on('keyup', function(e) {
          switch ( e.keyCode ) {
            case 27: // `ESC` key
              t.close();
              break;
            default:
              //
          }
        });

      } else {
        // After the first time around, just find the elements (don't create them again!)
        this.markup.page = $('body');
        this.markup.overlay = $('.' + this.options.classes.overlay, this.markup.page);
        this.markup.wrapper = $('.' + this.options.classes.wrapper, this.markup.page);
        this.markup.container = $('.' + this.options.classes.container, this.markup.wrapper);
        this.markup.closeLink = $('.' + this.options.classes.closeLink, this.markup.container);
        this.markup.content = $('.' + this.options.classes.content, this.markup.container);
        this.markup.caption = $('.' + this.options.classes.caption, this.markup.container);
      }
    },

    // Open
    open: function(url) {
      this.markup.content.html( $('<img />', { 'src': url, 'alt': '', 'id': this.options.fullResImageId }) );
      this.markup.caption.html( $(this.element).attr( this.options.captionAttribute ) );
      this.markup.overlay.height( $(document).height() ).fadeIn( this.options.duration );
      this.markup.wrapper.css({ 'top': $(document).scrollTop() }).fadeIn( this.options.duration);
      this.options.onOpen();
    },

    // Close
    close: function() {
      var t = this;
      this.markup.overlay.fadeOut(this.options.duration);
      this.markup.wrapper.fadeOut(this.options.duration, function() {
        t.options.afterClose();
      });
    }

  }; // End Plugin.prototype

  // Plugin wrapper around the constructor, prevents against multiple instantiations
  $.fn[pluginName] = function (options) {
    var selector = this.selector;

    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin( this, options, selector ));
      }
    });
  };

}(jQuery, window));