# Globals

buttonInvokedPopup = undefined
currentSubjectIdVariable = undefined
eventHooks = 
	variableInclusionDidChange: (variableName, isIncluded) -> # no-op
	variableRoleDidChange:  (variableName, role) ->  # no-op
	graphChoiceDidChange: (graphName) ->  # no-op
	didRemoveDesignDeterminer: () ->  # no-op
	variableRoleShouldChange: (variableName, currentRole, selectedVarRole) -> return true

registerEventHandler = (eventName, handler) ->
	eventHooks[eventName] = handler
	return

init = () ->
  # initial state of panel buttons
  $("#designDeterminerButton").css("visibility", "hidden")
  $(".panelItemButton").css("visibility", "hidden")

  # mouse event handlers
  $("#designSection").hover((event) -> 
  	$("#designDeterminerButton").css("visibility", if event.type == "mouseenter" then "visible" else "hidden")
  	return
  	) 
  $(".varLabel").hover((event) -> 
  	targetButton = $(event.currentTarget).find(".panelItemButton")
  	if targetButton.get(0) isnt buttonInvokedPopup
  		targetButton.css("visibility", if event.type == "mouseenter" then "visible" else "hidden")
  	return
  	)
  $(".variableRoleButton").click(onClickVariableRoleButton)

  $(".variableCheckbox").click((event) ->
  	checkbox = $(event.currentTarget)
  	
  	# prevent using the variable without a role
  	button = $(event.currentTarget).parent().find("#variableRoleButton")
  	if button.text() is "?"
  		button.pulse({opacity: 0.1}, {duration : 100, pulses : 5})
  		checkbox.prop("checked", false)
  		return

  	# inform external handler
  	eventHooks["variableInclusionDidChange"](checkbox.prop("name"), checkbox.prop("checked"))
  	return
  	)

  $(".graphRadio").click( (event) ->
  	# inform external handler
  	eventHooks["graphChoiceDidChange"]($(event.currentTarget).val())
  	)
  return

updateVariableEnabling = () ->
	$("input.variableCheckbox").removeAttr("disabled")
	currentSubjectIdVariable = $(".variableRoleDisplay:contains('ID')").parents(".varLabel").find(".variableName").first().text()
	(k for k, v of variables when v == "ID")
	$("input.variableCheckbox[name='#{currentSubjectIdVariable}']")
		.attr("disabled", "disabled")
		.removeAttr("checked")


disableGraphs = (graphNames) ->	
	$(".graphRadio").prop("disabled", false);
	$(".graphRadio[value='#{ aName }']").prop("disabled", true) for aName in graphNames
	return

selectGraph = (graphName, isSelected) ->
	$(".graphRadio").prop("checked", false)
	graph = $(".graphRadio[value='#{ graphName }']")
	if graph.prop("disabled")
		graph.prop("disabled", false)	
	graph.prop("checked", isSelected)
	return

appendDOM = (parentSelector, html) ->
	$(parentSelector).append($.parseHTML(html))
	return

replaceDOM = (parentSelector, html) ->
	$(parentSelector).replaceWith($.parseHTML(html))
	return

renderVariables = (variables) ->
	
	html = ""
	html += """<label class='varLabel' id='varLabel_#{ aVariableName }'>
			    <input type='checkbox' class='variableCheckbox' name='#{ aVariableName }'/>
			    <span class='variableName'>#{ aVariableName }</span>
			    <span class="variableRole">
		    		<span class="variableRoleDisplay">#{ aVariableRole }</span>
		    		<button id="variableRoleButton" class="panelItemButton variableRoleButton">#{ aVariableRole }</button>
		    	</span>
			</label>
			""" for aVariableName, aVariableRole of variables
	appendDOM('#variableSection', html)

	# initial appearance of the subject variable
	updateVariableEnabling()

	return

updateExperimentalDesign = (design, determiner) ->
	# update text
	designText = switch design
		when "within-groups" then "Within-subjects design"
		when "between-groups" then "Between-subjects design"
	$("#designName").text(designText)
	$("#designDeterminerVariable").text(determiner ? "rows")
	$("#designDeterminerVariable").toggleClass("isVariable", determiner?)

	# update button
	updateExperimentalDesignButton(determiner?)
	
	return

updateExperimentalDesignButton = (withVariable = false) ->
	$("#designDeterminerButton").text(if withVariable then "x"  else "?")
	$("#designDeterminerButton").off("click").click(if withVariable then warnRemove else showExperimenalDesignHelp)
	return

warnRemove = (event) ->
	if confirm("Press OK to remove determiner variable. This will reset the current graph.")
		# inform external handler
		eventHooks["didRemoveDesignDeterminer"]()
	return

showExperimenalDesignHelp = (event) ->
	console.log "showExperimenalDesignHelp"
	return

onClickVariableRoleButton = (event) ->
	event.stopPropagation()
	buttonInvokedPopup = event.currentTarget
	varRoleButton = $(buttonInvokedPopup)
	
	# setup context menu state
	varRoleMenu = $("#variableRoleMenu")
	varRoleMenu.css("left", event.pageX).css("top", event.pageY)
	preSelectedRadio = $("input.variableRole[name='varRoleRadio'][value='#{varRoleButton.text()}']")
	if preSelectedRadio.length > 0
		preSelectedRadio.prop("checked", true) 
	else
		$("input.variableRole[name='varRoleRadio']").prop("checked", false) 
	
	# fade in context menu
	varRoleMenu.fadeIn(200, () ->

			# event handler to fade out context menu and button value
			hideRoleMenu = (event) ->
				varRoleMenu.fadeOut(200)
				varRoleButton.animate({"opacity": "0.1"}, 1000, () -> varRoleButton.css("visibility", "hidden").css("opacity", "1.0"))
				buttonInvokedPopup = undefined
				$(document).off("click", hideRoleMenu)
				$(".variableRoleRadioLabel").off("click", hideRoleMenu)
				return

			$(document).click(hideRoleMenu)
			
			$("label.variableRoleRadioLabel").click((event) -> 
				event.stopPropagation()
				variableName = varRoleButton.parent().prev().text()
				selectedVarRole = $("input.variableRole[name='varRoleRadio']:checked").val()
				currentRole = varRoleButton.text()

				# ignore if no change
				if currentRole == selectedVarRole
					return

				# check with external handler
				if not eventHooks["variableRoleShouldChange"](variableName, currentRole, selectedVarRole)
					$("input.variableRole[name='varRoleRadio'][value='#{currentRole}']").prop("checked", true)
					return

				# update the button label
				varRoleButton.text(selectedVarRole)
				varRoleButton.prev().text(selectedVarRole)

				if selectedVarRole == "ID"
					prevIdVariable = currentSubjectIdVariable
					currentSubjectIdVariable = variableName
					$("#varLabel_#{prevIdVariable}") \
						.find(".variableRoleDisplay").text("?").end() \
						.find("#variableRoleButton").text("?")

				# inform external handler
				eventHooks["variableRoleDidChange"](variableName, selectedVarRole)
				updateVariableEnabling()

				)
			return
		)
	return

# export functions to be used globally
root = exports ? this
root.VisiStat ?= {}
root.VisiStat.UI ?= {}
root.VisiStat.UI.leftPane ?= {}
root.VisiStat.UI.leftPane.registerEventHandler = registerEventHandler
root.VisiStat.UI.leftPane.init = init
root.VisiStat.UI.leftPane.selectGraph = selectGraph
root.VisiStat.UI.leftPane.disableGraphs = disableGraphs
root.VisiStat.UI.leftPane.renderVariables = renderVariables
root.VisiStat.UI.leftPane.updateExperimentalDesign = updateExperimentalDesign
