// Generated by CoffeeScript 1.3.3
(function() {

  (function($, window) {
    var Plugin, defaults, document, pluginName;
    pluginName = 'overlay';
    document = window.document;
    defaults = {
      duration: 200,
      onOpen: function() {},
      afterClose: function() {},
      fullResImageId: 'fullResImage',
      captionAttribute: 'title',
      closeLinkHTML: '&times;',
      closeLinkTitle: 'Close',
      classes: {
        overlay: "" + pluginName + "-overlay",
        wrapper: "" + pluginName + "-wrapper",
        container: "" + pluginName + "-container",
        close: "" + pluginName + "-close",
        closeLink: "" + pluginName + "-close-link",
        content: "" + pluginName + "-content",
        caption: "" + pluginName + "-caption"
      }
    };
    Plugin = (function() {

      function Plugin(element, options, selector) {
        this.element = element;
        this.selector = selector;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
      }

      Plugin.prototype.init = function() {
        var t;
        t = this;
        this.markup = {};
        if ($("." + this.options.classes.overlay).length === 0) {
          this.markup.page = $('body');
          this.markup.overlay = $('<div />', {
            "class": "" + this.options.classes.overlay + " " + this.options.classes.close
          }).appendTo(this.markup.page);
          this.markup.wrapper = $('<div />', {
            "class": this.options.classes.wrapper
          }).appendTo(this.markup.page);
          this.markup.container = $('<div />', {
            "class": this.options.classes.container
          }).appendTo(this.markup.wrapper);
          this.markup.closeLink = $('<a />', {
            "class": "" + this.options.classes.closeLink + " " + this.options.classes.close,
            html: this.options.closeLinkHTML,
            title: this.options.closeLinkTitle,
            href: '#'
          }).appendTo(this.markup.container);
          this.markup.content = $('<div />', {
            "class": this.options.classes.content
          }).appendTo(this.markup.container);
          this.markup.caption = $('<p />', {
            "class": this.options.classes.caption
          }).appendTo(this.markup.container);
          $(document).on('click', "" + this.selector + ":not(." + this.options.classes.close + ")", function(e) {
            e.preventDefault();
            return t.open($(this));
          });
          $("." + this.options.classes.close).on('click', function(e) {
            e.preventDefault();
            return t.close();
          });
          return $(document).on('keyup', function(e) {
            switch (e.keyCode) {
              case 27:
                return t.close();
            }
          });
        } else {
          this.markup.page = $('body');
          this.markup.overlay = $("." + this.options.classes.overlay, this.markup.page);
          this.markup.wrapper = $("." + this.options.classes.wrapper, this.markup.page);
          this.markup.container = $("." + this.options.classes.container, this.markup.wrapper);
          this.markup.closeLink = $("." + this.options.classes.closeLink, this.markup.container);
          this.markup.content = $("." + this.options.classes.content, this.markup.container);
          return this.markup.caption = $("." + this.options.classes.caption, this.markup.container);
        }
      };

      Plugin.prototype.open = function(el) {
        this.markup.content.html($('<img />', {
          src: el.attr('href'),
          alt: '',
          id: this.options.fullResImageId
        }));
        this.markup.caption.html(el.attr(this.options.captionAttribute));
        this.markup.overlay.height($(document).height()).fadeIn(this.options.duration);
        this.markup.wrapper.css({
          top: $(document).scrollTop()
        }).fadeIn(this.options.duration);
        return this.options.onOpen();
      };

      Plugin.prototype.close = function() {
        var t;
        t = this;
        this.markup.overlay.fadeOut(this.options.duration);
        return this.markup.wrapper.fadeOut(this.options.duration, function() {
          return t.options.afterClose();
        });
      };

      return Plugin;

    })();
    return $.fn[pluginName] = function(options) {
      var selector;
      selector = this.selector;
      return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
          return $.data(this, "plugin_" + pluginName, new Plugin(this, options, selector));
        }
      });
    };
  })(jQuery, window);

}).call(this);
