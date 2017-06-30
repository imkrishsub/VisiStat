###*
 * Provide dimmer overlay for popup dialog boxes.
###

FADEOUT_DURATION_MS = 400

###*
 * Adds the dimmer layer to the page in front of the current DOM elements
 * in <body>. Call this function before adding pop-up dialog box to DOM.
###
addDimmer = ->
  if (document.getElementById('dimmer')?)
    return

  $("body").append("<div id='dimmer'></div>")
  autoResizeDimmer()
  $("#dimmer").fadeIn()
  $(window).bind("resize", autoResizeDimmer)

###*
 * Removes the dimmer layer. (See mutex specification below.)
###
removeDimmer = ->
  $("#dimmer").fadeOut(FADEOUT_DURATION_MS, ->
    $(window).unbind("resize", autoResizeDimmer)
    $("#dimmer").remove()
    )

# allow this method to be called only once
$.fn.mutex('set', "removeDimmer", FADEOUT_DURATION_MS / 1000)
  
###*
 * Resizes the dimmer layer according to the window size. (Internal call)
###
autoResizeDimmer = ->
  $("#dimmer").css(
    "height": $(window).height(),
    "width": $(window).width()
    )


# export functions to be used globally
root = exports ? this
root.VisiStat ?= {}
root.VisiStat.UI ?= {}
root.VisiStat.UI.Dimmer ?= {}
root.VisiStat.UI.Dimmer.addDimmer = addDimmer
root.VisiStat.UI.Dimmer.removeDimmer = removeDimmer