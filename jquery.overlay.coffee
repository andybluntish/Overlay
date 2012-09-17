(($, window) ->

  # Defaults
  pluginName = 'overlay'
  document = window.document
  defaults =
    duration: 200
    onOpen: ->
    afterClose: ->
    fullResImageId: 'fullResImage'
    captionAttribute: 'title'
    closeLinkHTML: '&times;'
    closeLinkTitle: 'Close'
    classes:
      overlay: "#{pluginName}-overlay"
      wrapper: "#{pluginName}-wrapper"
      container: "#{pluginName}-container"
      close: "#{pluginName}-close"
      closeLink: "#{pluginName}-close-link"
      content: "#{pluginName}-content"
      caption: "#{pluginName}-caption"


  # The actual plugin constructor
  class Plugin
    constructor: (@element, options, @selector) ->

      @options = $.extend {}, defaults, options

      @_defaults = defaults
      @_name = pluginName

      @init()

    init: ->
      # Store 'this' so it can be accessed from callback methods
      t = @

      # Setup an object to store the markup elements
      @markup = {}

      # Only do this once!
      if  $( ".#{@options.classes.overlay}" ).length is 0

        # Setup markup
        @markup.page      = $('body')
        @markup.overlay   = $('<div />', class: "#{@options.classes.overlay} #{@options.classes.close}" ).appendTo @markup.page
        @markup.wrapper   = $('<div />', class: @options.classes.wrapper ).appendTo @markup.page
        @markup.container = $('<div />', class: @options.classes.container ).appendTo @markup.wrapper
        @markup.closeLink = $('<a />', class: "#{@options.classes.closeLink} #{@options.classes.close}", html: @options.closeLinkHTML, title: @options.closeLinkTitle, href: '#' ).appendTo @markup.container
        @markup.content   = $('<div />', class: @options.classes.content ).appendTo @markup.container
        @markup.caption   = $('<p />', class: @options.classes.caption ).appendTo @markup.container


        # Open the overlay window
        $( document ).on 'click', "#{@selector}:not(.#{@options.classes.close})", (e) ->
          e.preventDefault()
          t.open $(this).attr('href')

        # Close the overlay window
        $(".#{this.options.classes.close}").on 'click', (e) ->
          e.preventDefault()
          t.close()

        $( document ).on 'keyup', (e) ->
          switch e.keyCode
            when 27 then t.close() # `ESC` key

      else
        # After the first time around, just find the elements (don't create them again!)
        @markup.page      = $('body')
        @markup.overlay   = $(".#{@options.classes.overlay}", @markup.page)
        @markup.wrapper   = $(".#{@options.classes.wrapper}", @markup.page)
        @markup.container = $(".#{@options.classes.container}", @markup.wrapper)
        @markup.closeLink = $(".#{@options.classes.closeLink}", @markup.container)
        @markup.content   = $(".#{@options.classes.content}", @markup.container)
        @markup.caption   = $(".#{@options.classes.caption}", @markup.container)


    open: (url) ->
      @markup.content.html $('<img />', src: url, alt: '', id: @options.fullResImageId )
      @markup.caption.html $(@element).attr( @options.captionAttribute )
      @markup.overlay.height( $(document).height() ).fadeIn @options.duration
      @markup.wrapper.css( top: $(document).scrollTop() ).fadeIn @options.duration
      @options.onOpen()

    close: ->
      t = @
      @markup.overlay.fadeOut @options.duration
      @markup.wrapper.fadeOut @options.duration, ->
        t.options.afterClose()

  # Plugin wrapper around the constructor, prevents against multiple instantiations
  $.fn[pluginName] = (options) ->
    selector = @selector
    @each ->
      if !$.data(@, "plugin_#{pluginName}")
        $.data(@, "plugin_#{pluginName}", new Plugin(@, options, selector))
)(jQuery, window)