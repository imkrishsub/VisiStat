# single instance of the logger, shared only in this file
theLogger = null
lastVariableList = null

class PartialTestLogger
  constructor: ->
    @log = {}

  ###*
   * Return a formatted key for the PartialTestLogger instance
   * @param  {string(s)} ivs [one or multiple strings of IV names]
   * @return {string}        [a formatted key for the PartialTestLogger instance]
  ###
  ivKey: (ivs...) ->
    JSON.stringify(ivs.sort())

  ###*
   * Return the number of partial tests used
   * @param  {string} dv     [DV name]
   * @param  {string(s)} ivs [one or multiple strings of IV names]
   * @return {integer}       [the number of partial tests used]
  ###
  countMatchingTests: (dv, ivs...) ->
    @log[dv][@ivKey(ivs)]

  ###*
   * Reset the counter of the test matching the given parameters
   * @param  {string} dv     [DV name]
   * @param  {string(s)} ivs [one or multiple strings of IV names]
  ###
  resetMatchingTests: (dv, ivs...) ->
    @log[dv][@ivKey(ivs)] = 0

  # TODO: Update function name once variable model is set
  # TODO: revise the code to derive proper ivs for multiple IVs
  ###*
   * Update the number of partial tests used
   * @param  {object} variableList variables used
  ###
  update: (variableList) ->
    return unless variableList["independent"].length is 1
    
    iv = variableList["independent"][0]
    comparedLevels = variableList["independent-levels"]
    allLevels = variables[iv]["dataset"].unique()
    
    dv = variableList["dependent"][0]

    ivs = [iv]
    theIvKey = @ivKey(ivs)

    # Check if it is a partial test. If so, update object
    if comparedLevels.length < allLevels.length
      @log[dv] ?= {}
      @log[dv][theIvKey] ?= 0
      @log[dv][theIvKey]++





###*
 * Checks if there is cyclic testing for over-testing. The number of distributions involved should be > 2.
 * Also update the PartialTestLogger instance.
 * @return {Boolean} true if over-testing
###
checkIfOverTesting = ->

  theLogger ?= new PartialTestLogger()

  [..., lastVariableList] = listOfLevelsCompared

  theLogger.update(lastVariableList)

  # TODO(Krishna): Change the function to accomodate multiple independent variables
  return  unless lastVariableList["independent"].length is 1

  dv = lastVariableList["dependent"][0]
  iv = lastVariableList["independent"][0]

  ivs = [iv]  # TODO(Krishna): Update when there are multiple independent variables
  
  displayOverTestingPopup(dv, iv) if theLogger.countMatchingTests(dv, ivs...) is 2


# TODO: Revise this function after AngularJS
# TODO: Revise text when we have multiple IVs
###*
Displays the popup (warning and corrective procedure) for over-testing
@param  {string} DV [Dependent variable]
@param  {string} IV [Independent variable]
###
displayOverTestingPopup = (DV, IV) ->
  root.VisiStat.UI.Dimmer.addDimmer()
  
  # Display warning to the user that over-testing is detected
  div = d3.select("body").append("div").attr("id", "overTestingPopup") # Attach a div to body, where we will append our popup content
  
  # Get the level pairs of the IV that were compared (which lead to potential over-testing)
  testedPairs = []
  levels = variables[IV]["dataset"].unique()
  i = 0

  while i < listOfLevelsCompared.length
    testedPairs.push "<li>" + listOfLevelsCompared[i]["independent-levels"][0] + " vs. " + listOfLevelsCompared[i]["independent-levels"][1] + "</li>"  if listOfLevelsCompared[i]["independent"] is IV
    i++
  htmlText = ""
  
  # TODO: In AngularJS, make this a view.
  htmlText += "<div class='overTestingHead'>Are these tests for single research questions?</div>" + "<div class='overTestingBody'>" + "You have compared the following pairs of " + fV(IV) + ":" + "<ul class='overTestingBody'>" + testedPairs.join() + "</ul>" + "Using multiple tests in one research question increases the probability of having a significant effect when there is really none (Type I error)." + "To avoid this error, we suggest using omni-bus test (e.g., ANOVA) followed by a post-hoc test instead. <br/>" + "</div>" + "<label class='overTesting'><input type='radio' name='test' onClick='doOmnibusTest()'/> The tests above are considered as <b>single</b> research question. " + "<span class='overTestingExplanation'>Perform omni-bus test: " + fV(DV) + " ~ " + fV(IV) + "(" + levels + "). </span></label>" + "<label class='overTesting'><input type='radio' name='test' onClick='continuePairwiseTesting()'/>The tests above are considered as <b>multiple</b> research questions." + "<span class='overTestingExplanation'>Continue with the tests you've selected.</span> </label>"
  div.html htmlText
  return


# TODO: After AngularJS, use annonymous function that binds to the button when it is created
continuePairwiseTesting = ->
  root.VisiStat.UI.Dimmer.removeDimmer()
  removeElementById "overTestingPopup"

  dv = lastVariableList["dependent"][0]
  iv = lastVariableList["independent"][0]
  theLogger.resetMatchingTests(dv, iv)
  
# TODO: After AngularJS, use annonymous function that binds to the button when it is created
doOmnibusTest = ->
  
  # UI update
  root.VisiStat.UI.Dimmer.removeDimmer()
  removeElementById "overTestingPopup"
  resetSVGCanvas()
  
  # initiate omnibus test programmatically
  selectedVariables = listOfVariableSelections[numberOfEntriesInHistory - 1].clone() # Get the list of variables that were selected
  selectedVisualisation = "Boxplot"
  selectDefaultVisualisation() # selects the appropriate visualization based on the variables selected (role, number of)
  plotVisualisation() #checks which plot is selected and draws that plot
  setVisibilityOfVisualisations() #manages the fill colors of vizualizations (only one at a time) [ToDo]
  removeElementsByClassName "compareMean"
  d3.selectAll(".IQRs, .medians, .TOPFringes, .BOTTOMFringes, .TOPFringeConnectors, .BOTTOMFringeConnectors, .outliers, .CIs, .CITopFringes, .CIBottomFringes").style "opacity", "0.35" # Make some elements of the boxplot transparent
  selectAllMeans()
  compareMeans() # Perform the significance test
  
  # reset the logger
  dv = lastVariableList["dependent"][0]
  iv = lastVariableList["independent"][0]
  theLogger.resetMatchingTests(dv, iv)
  


      



# export functions to be used globally
root = exports ? this
root.VisiStat ?= {}
root.VisiStat.OverTesting ?= {}
root.VisiStat.OverTesting.checkIfOverTesting = checkIfOverTesting