#returns the reporting text for a given formula
getReportingText = (formula) ->
  reportingTextsArray[formula]

#--------------- COPY THIS NEW 
#sets the reporting text by calling the appropriate function depending on test-type, stores text for formula in reportingTextsArray
setReportingText = (formula) ->
  switch multiVariateTestResults["test-type"]
    when "unpairedTTest", "pairedTTest", "WelchTTest", "MannWhitneyTest", "oneWayANOVA", "WelchANOVA", "KruskalWallisTest", "oneWayRepeatedMeasuresANOVA", "FriedmanTest"   # 1 IV
      if multiVariateTestResults["simpleMainEffect"]?
        reportingTextsArray[formula] = getSimpleMainEffectReportingText()
      else
        reportingTextsArray[formula] = getSignificanceTestReportingText()
    when "factorialANOVA"  # >2 IVs  
      variableList = sort(selectedVariables)
      if variableList["independent"].length == 2 then reportingTextsArray[formula] = getSignificanceTest2WayReportingText() else reportingTextsArray[formula] = getSignificanceTest3WayReportingText()
    when "pairwisePairedTTest", "pairwisePairedWelchTTest", "pairwisePairedWilcoxTest", "pairwiseUnpairedWilcoxTest", "tukeyHSDTest" # posthocs
      #display reporting text from ANOVA before and add post-hoc reporting text
      reportingTextsArray[formula] = resultsFromANOVA + "\n" + getPostHocReportingText()

      #reset ANOVA results text
      resultsFromANOVA = ""
    when "pC", "kC", "bC" # correlations
      reportingTextsArray[formula] = getCorrelationReportingText()
    when "linR", "mulR" # regressions
      reportingTextsArray[formula] = getRegressionReportingText()
    else
      console.log "Error: No Method selected"
  return

# returns string join in the fashion: "a, b, and c"
prettyStringJoin = (stringArray, delimiter = ",", lastDelimiter = "and") ->
  lastChunk = stringArray.pop()
  "#{stringArray.join(delimiter + " ")}#{if stringArray.length > 1 then delimiter else ""} #{ lastDelimiter } #{lastChunk}"

# variable formatting shorthand
fV = (varName) -> "<i>#{ varName }</i>"
fCI = (lower, upper) -> "95% CI [#{ lower.toFixed(2) },#{ upper.toFixed(2) }]"
fP = (p, format = "html", includeLabel = true) -> 
  p = Number(p)
  label = ""
  formattedP = switch format
    when "html" then "<i>p</i> " 
    when "svg" then "<tspan font-style='italic'>p</tspan>"
    else "p "
  if includeLabel
    label = formattedP + (if p >= 0.001 then "= " else "")
  signAndValue = if p < 0.001 then "< .001" else omitZeroPValueNotation(p)
  "#{label}#{signAndValue}"


#function returns reporting text for given independent variable's level and its characteristics (m/mdn, sd, n, ci)
statDesc = (dependentVariable, IVlevel, variableList) ->
  
  distribution = variables[variableList["dependent"]][IVlevel]
  bla = [val.toFixed(2) for val in findCI(distribution)]
  ci = findCI(distribution)
  sd = getStandardDeviation(distribution).toFixed(2)
  centStat = if variableTypes[dependentVariable] is "ordinal" then "<i>Mdn</i>" else "<i>M</i>"
  centValue = (if variableTypes[dependentVariable] is "ordinal" then median(distribution) else mean(distribution)).toFixed(2)
  n = distribution.length

  "#{fV(IVlevel)} (#{ centStat } = #{centValue}, #{ fCI(ci[0], ci[1]) }, <i>SD</i> = #{ sd }, <i>n</i> = #{ n })"


statES = (p, effectSize) ->
  effectSizeRounded = effectSize.toFixed(2)
  effectSizeAmount = getEffectSizeAmount(multiVariateTestResults["effect-size-type"], effectSize)
  
  #if effect size type is eS or RS, the letters have to be change to display correctly
  effectSizeType = multiVariateTestResults["effect-size-type"]
  effectSizeType = switch effectSizeType
                    when "ηS" then "η" + String.fromCharCode(178)
                    when "RS" then "r" + String.fromCharCode(178)
                    else effectSizeType
  
  # in case that effect size is smaller than medium, it is not remarkable as no significant results
  if p >= 0.05 and effectSizeAmount < 2
    return ""

  ESDesc = switch effectSizeAmount 
            when 0 then "However, there was nearly no effect, "
            when 1 then "However, the effect size was small, "
            when 2 then ( if p < 0.05 then "The" else "However, the" ) + " differences constituted a medium effect size, "  
            when 3 then ( if p < 0.05 then "The" else "However, the" ) + " differences constituted a large effect size, "
    
  " #{ ESDesc } (#{ fV(effectSizeType) } = #{ effectSizeRounded }). "


#returns reporting text for results of test
statNHST = (parameterType, df, parameter, p) ->
  #if parameter type is cS, the letters have to be changed to display correctly
  parameterType = String.fromCharCode(967) + String.fromCharCode(178)  if parameterType is "cS"
  dfText = if hasDF[parameterType] then "(" + df + ") " else ""
  
  ", #{ fV(parameterType) }#{ dfText } = #{ Number(parameter).toFixed(2) }, #{ fP(p) }."


class ReportFactory
  constructor: (@varDict, @resultDict, @dv) ->

  # generate descriptive statistics by each IV level and join them together with "and" only at the end
  descText: (i) ->
    descTextChunks = (statDesc(@varDict["dependent"], @varDict["independent-levels"][i][j], @varDict) \
              for j in [0...@varDict["independent-levels"][i].length])
    prettyStringJoin(descTextChunks, ",", "and")

  # generate inferrential statistics by IV level, p-value
  nhstAndES: (i) ->
    statNHST(@resultDict["parameter-type"], @resultDict["df"][i], @resultDict["parameter"][i], @p(i)) +
          statES(@p(i), @resultDict["effect-size"][i])

  # lookup p-value
  p: (i) -> getPurePValue(@resultDict["p"][i])

  # generate main effect text
  mainFX: (i, simple = false) ->  # TODO: remove "simple" parameter
    if i % 2 is 0 
    then "#{if simple then  "As for simple main effect, t" else "T"}here was #{if @p(i) < 0.05 then "a" else "no"} significant difference in #{ @dv } between #{ @descText(i) }" \
    else "Comparing #{ @descText(i) }, a #{if @p(i) >= 0.05 then  "non-" else ""}significant #{if simple then  "simple " else ""}main effect on #{ @dv } was determined"

  # generate interaction effect text
  iFX2Way: (iv1, iv2, i) ->
    "The interaction effect between #{ iv1 } and #{ iv2 } was #{if @p(i) >= 0.05 then "not "}significant"



getSignificanceTestReportingText = (isSimpleMainEffect = false) ->
  # prepare variables
  variableList = getSelectedVariables()
  [iv, dv] = [fV(variableList["independent"]), fV(variableList["dependent"])]
  p = getPurePValue(multiVariateTestResults["p"])
  article = titleCaps(AvsAn.query(multiVariateTestResults["method"])["article"])
  highestMeanIdx = getHighestMean()
  highestMeanText = statDesc(variableList["dependent"], variableList["independent-levels"][highestMeanIdx], variableList)
  otherMeansText = prettyStringJoin((statDesc(variableList["dependent"], variableList["independent-levels"][i], variableList) \
              for i in [0...variableList["independent-levels"].length] when i isnt highestMeanIdx),
              ",", "and for")
  NHSTText = statNHST(multiVariateTestResults["parameter-type"], multiVariateTestResults["df"], multiVariateTestResults["parameter"], p)
  ESText = statES(p, multiVariateTestResults["effect-size"][0])
  
  introText = if isSimpleMainEffect then "" else 
    ("<p>#{ article } #{ multiVariateTestResults["method"] } was conducted to investigate the effect of " +
    "#{ iv } on #{ dv }.</p>") 

  introText +
  (if isSimpleMainEffect then "" else "<p>") +
  "The results indicated a higher #{ dv } for #{ highestMeanText } than for #{ otherMeansText }." +
  (if isSimpleMainEffect then " " else "</p><p>") +
  (if p <= 0.05 then "A significant difference could be reported" else "This difference was not significant") +
  NHSTText + ESText + 
  (if isSimpleMainEffect then "" else "</p>")
  

getSimpleMainEffectReportingText = () ->
  fxInfo = multiVariateTestResults["simpleMainEffect"]
  [testedIV, dv] = [fV(fxInfo["testedIV"]), fV(fxInfo["dependent"])]
  fixedIVDicts  = fxInfo["fixedIVs"]
  fixLevelText = prettyStringJoin("#{ fV(anIV["name"]) } = #{ anIV["level"] }" for anIV in fixedIVDicts, ",", "and")
  
  "<p>For #{ fixLevelText }, the simple main effect of #{ testedIV } on #{ dv } follows: " +
  getSignificanceTestReportingText(true) + "</p>"

getSignificanceTest2WayReportingText = () ->
  
  # prepare variables
  variableList = sort(selectedVariables)
  [iv1, iv2] = [fV(variableList["independent"][0]), fV(variableList["independent"][1])]
  dv = fV(variableList["dependent"])

  rFactory = new ReportFactory(variableList, multiVariateTestResults, dv)

  idxIFX = variableList["independent"].length

  "<p>To compare the effect of #{ iv1 } and #{ iv2 } as well as their interaction " + 
  " on #{ dv }, a #{ multiVariateTestResults["method"] } was conducted.</p>" +
  "<p>" + rFactory.iFX2Way(iv1, iv2, idxIFX) + rFactory.nhstAndES(idxIFX) + "</p>" +
  "<p>" + ( rFactory.mainFX(i) + rFactory.nhstAndES(i) for i in [0...variableList["independent"].length] ).join("</p><p>") + "</p>"



getSignificanceTest3WayReportingText = () -> 
  [idx1Way, idx2Way, idx3Way] =[ [0..2], [3..5], 6]
  variableList = sort(selectedVariables)
  ivs = (fV(aVar) for aVar in variableList["independent"])
  dv = fV(variableList["dependent"])
  rFactory = new ReportFactory(variableList, multiVariateTestResults, dv)

  sig2WayIdx = (i for i in idx2Way when rFactory.p(i) < 0.05)
  ns2WayIdx = (i for i in idx2Way when rFactory.p(i) >= 0.05)

  iFXVars = (i) -> fV(multiVariateTestResults["labels"][i].split(":")[0]) + 
               " #{String.fromCharCode(215)} " +
               fV(multiVariateTestResults["labels"][i].split(":")[1])

  expandEffectText = (idxs, isSignificant) ->
    if idxs.length == 0
      return ""

    preamble = "<p>" + (if isSignificant then "The significant two-way interactions were " else "The following two-way interactions were not significant: ") +
               prettyStringJoin((("#{ iFXVars(i) }" + rFactory.nhstAndES(i)) for i in idxs ), ",", "and") +
               "</p>"


  "<p>#{ multiVariateTestResults["method"] } was conducted to compare the effect of " + 
  prettyStringJoin(ivs, ",", "and") + " as well as their interactions " + " on #{ dv }." +
  " The three-way interaction was #{if rFactory.p(idx3Way) >= 0.05 then "not "}significant" + rFactory.nhstAndES(idx3Way) + "</p>" +
  expandEffectText(sig2WayIdx, true) + 
  expandEffectText(ns2WayIdx, false) + "" +
  ( rFactory.mainFX(i, true) + rFactory.nhstAndES(i) for i in idx1Way ).join("<br/>")



getPostHocReportingText = () ->
  iv = fV(getSelectedVariables()["independent"][0])
  getPurePValue(multiVariateTestResults["p"])

  pairDiffStat = (idx) ->
    pairDiff = postHocTestResults["differences"][idx]
    ciText = fCI(postHocTestResults["lowerCI"][idx], postHocTestResults["upperCI"][idx])
    p = postHocTestResults["rawP"][idx]
    p = if p == 0 then "0.0001" else p + ""
    sigText = (if p < 0.05 then "" else "not ") + "significant"
    "#{ pairDiff } (#{ ciText }, #{ fP(p) }; #{ sigText })"

  pairLv = (i, j) -> fV(postHocTestResults["pairs"][i][j])

  "<p>Post-hoc #{ postHocTestResults["method"] } was conducted to further investigate the effect of #{ iv }. " + 
  "The difference between " +
  prettyStringJoin( "#{pairLv(idx,0)} and #{pairLv(idx,1)} was #{ pairDiffStat(idx) }" for idx in [0...postHocTestResults["pairs"].length], ",", "and") + ".</p>"
  




#TODO: returns reporting text for correlation
getCorrelationReportingText = () ->
  text = ""
  text

#TODO: returns reporting text for regression
getRegressionReportingText = () ->
  text = ""
  text
