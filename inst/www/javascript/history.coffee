# Globals

eventHooks_History = 
	historyEntryIsClicked: (RQ, isIncluded) -> # no-op

registerEventHandler_History = (eventName, handler) ->
	eventHooks_History[eventName] = handler
	return

addEntryToHistory = (RQ, entryNumber) ->	
	html = ""
	html += """<tr class='historyEntry'>
			<td class='left'> <img class='selectedEntryIndicators' id = 'img_#{ entryNumber }' src='images/eyes.png'/> </td>
			<td class='middle'> <div class='entryName' name='#{ RQ }' id='entry_#{ entryNumber }' onclick='historyEntryIsClicked(this.name,this.id)'>#{ RQ }</div> </td>
			<td class='right'><img class='entryCheckbox' id = 'checkbox_#{ entryNumber }' src='images/checkOff.png' onclick='reportCheckboxIsClicked(this.src, this.id)'/> </td>
		      </tr>""" 
	appendDOM('#historyTable', html)
	$("#entry_#{ entryNumber }")[0].scrollIntoView()	

	return

addEntryToReport = (reportText, ID) ->

	html = ""
	html += """<div class='reportText' id='report_#{ ID }'>
			#{ reportText } 
		      </div>"""

	appendDOM("#reportSection", html)
	$("#report_#{ ID }")[0].scrollIntoView()
	return