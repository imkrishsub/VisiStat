//returns the reporting text for a given formula
function getReportingText(formula)
{
   return reportingTextsArray[formula];
}

//--------------- COPY THIS NEW 
//sets the reporting text by calling the appropriate function depending on test-type, stores text for formula in reportingTextsArray
function setReportingText(formula)
{
   var method = testResults["test-type"];
   
   //significance tests with one IV
   if (method == "upT" || method == "pT" || method == "wT" || method == "mwT" || method == "owA" || method == "WA" 
   || method == "kwT" || method == "owrA" || method == "fT" )
      reportingTextsArray[formula] = getSignificanceTestReportingText(method);
   
   //significance tests with two IVs
   else if (method == "twA" || method == "fA")
      reportingTextsArray[formula] = getSignificanceTest2WayReportingText(method);
   
   //post-hoc tests 
   else if (method == "ptT" || method == "pwT")
   {
      console.log("resultsFromANOVA = " + resultsFromANOVA);
      //display reporting text from ANOVA before and add post-hoc reporting text
      reportingTextsArray[formula] = resultsFromANOVA + "<br/><br/>" + getPostHocReportingText(method);
   }
   
   //correlations
   else if (method == "pC" || method == "kC" || method == "bC")
      reportingTextsArray[formula] = getCorrelationReportingText(method);
  
   //regressions
   else if (method == "linR" || method == "mulR")
      reportingTextsArray[formula] = getRegressionReportingText(method);      
   
   else
      console.log("Error: No Method selected");
}

//returns reporting text for significance tests
function getSignificanceTestReportingText(method)
{
    //all text is stored in this variable
   var text = "";
 
  //get current variables
   var variableList = getSelectedVariables();
   var currentIVlevel;
   
   //first sentence including method, in case that method is unpaired there has to be an "an" instead of an "a"
   text += (method == "upT" ? "An " : "A ") + testResults["method"] + " was conducted to investigate the effect of ";
  
   //add independent and dependent variable
   text += "<i>" + variableList["independent"] + "</i>" + " on " + "<i>" + variableList["dependent"] + "</i>";
   console.log("Method:" + method);

   if (method == "pT" || method == "owrA" || method == "fT" || method == "wT")
   {
      text += " (N = " + variables[variableList["dependent"]][variableList["independent-levels"][0]].length + ")";
   }

   text += ". ";

   //get highest mean 
   var index = getHighestMean();
   text += " The results indicated a higher " + "<i>" + variableList["dependent"] + "</i>" + " for ";
   //add condition of IV with highest mean and its characteristics mean, standard deviation, n and Confidence intervals
   currentIVlevel = variableList["independent-levels"][index]; 
   text += getVariableCharacteristicsReportingText(variableList["dependent"], currentIVlevel, variableList, method);
   
   text += " than for ";   
   
   //this variables counts the number of levels that have already been reported for language issues (insertig komma or "and")
   var nrOfLevels = 1;
   //add each condition of IV its mean, confidence intervals standard deviation and n have to be reported
   for (var i=0; i<variableList["independent-levels"].length; i++)
   {
      //for index (level with highest mean) results have already been reported
      if (i != index)
      {
         currentIVlevel = variableList["independent-levels"][i]; 
         text += getVariableCharacteristicsReportingText(variableList["dependent"], currentIVlevel, variableList, method);
      
         //add komma between each variable, add "and" for one before last, add nothing for last one
         if (nrOfLevels < variableList["independent-levels"].length - 2)
            text += ", ";
         else if (nrOfLevels == variableList["independent-levels"].length - 2)
            text += " and for ";
         
         nrOfLevels++;
      }
   }
   
   text += ".";
  
   //get pure p value without letter p or any operators
   var p = getPurePValue(testResults["p"]);
   
   //check whether p is significant
   if (p < 0.05)
      text += " A significant difference could be reported";
   else
      text += " This difference was not significant";
   
   //add results of test to text
   text += getTestResultsReportingText(testResults["parameter-type"], testResults["df"], testResults["parameter"], p);
   //add effect size to text (testResults["effect-size"] is an array)
   text += getEffectSizeReportingText(p, testResults["effect-size"][0]);
   
   return text;

}

function getSignificanceTest2WayReportingText(method)
{
   var text = "";
 
   //get current variables
   var variableList = sort(currentVariableSelection);
   
   //add both IVs
   text += "To compare the effect of " + "<i>" + variableList["independent"][0] + "</i>" + " and " + "<i>" + variableList["independent"][1] + "</i>" + " as well as their interaction ";
   //add DV and method
   text += " on " + "<i>" + variableList["dependent"] + "</i>" + ", a " + testResults["method"] + " was conducted.\n";
   var currentIVlevel;
   
   //add main effects of each independent variable and for the interaction (therefore, i <= nr. of IV)
   for (var i=0; i<=variableList["independent"].length; i++)
   {
       //differ text between significant and non-significant p
      var p = getPurePValue(testResults["p"][i]);

      //results of each independent variable
      if (i<variableList["independent"].length)
      {
            //varying text so that text is more fluent: start
         if (i%2 == 0)
            text += "There was " + (p < 0.05 ? "a" : "no") + " significant difference between ";
         else
            text += "Comparing  "
         
         //add independent variables' levels and their means, n, sds, ci 
         for (var j = 0; j<variableList["independent-levels"][i].length; j++)
         {
            //get current level of current IV
            currentIVlevel = variableList["independent-levels"][i][j]; 
            text += getVariableCharacteristicsReportingText(variableList["dependent"], currentIVlevel, variableList, method);
   
            //add komma between each variable, add "and" for one before last, add nothing for last one
            if (j < variableList["independent-levels"][i].length - 2)
               text += ", ";
            else if (j == variableList["independent-levels"][i].length - 2)
               text += " and ";
         }
         
         
          //varying text so that text is more fluent: end
         if (i%2 == 0)
            //add dependent variable
            text += " on " + "<i>" + variableList["dependent"] + "</i>";
         else
            //add dependent variable and whether signifcant
            text += ", a " + (p < 0.05 ? "" : "non-") + "significant main effect on " + "<i>" + variableList["dependent"] + "</i>" + " was determined" 
            
      }
      //results for interaction
      else
      {
         text += "The interaction effect between " + "<i>" + variableList["independent"][0] + "</i>" + " and " + "<i>" + variableList["independent"][1] + "</i>" + " was "; 
         text += (p < 0.05 ? "" : "not ") + "significant";
      }
      
      //add results of test to text
      text += getTestResultsReportingText(testResults["parameter-type"], testResults["df"][i], testResults["parameter"][i], p);
      
      //add effect size to text
      text += getEffectSizeReportingText(p, testResults["effect-size"][i]);
      
      //add line break if this is not the last part of reporting textt
      if (i<variableList["independent"].length)
         text += "<br/><br/>";
      
   }
   return text;
}

//returns reporting text for post-hoc tests => has its own function in order to differ the text for better readability
function getPostHocReportingText(method)
{
   //add prior text from test before
   var text = "";
   
   //get pure p value without letter p or any operators
   var p = getPurePValue(testResults["p"]);
   var variableList = getSelectedVariables();
   
   text += "A " + testResults["method"] + " revealed that there was " + (p < 0.05 ? "a" : "no") + " significant difference between "; 
   
   //add conditions of indepdent variable (there can only be two due to pairwise)
   text += "<i>" + variableList["independent-levels"][0] + "</i>" + " and " + "<i>" + variableList["independent-levels"][1] + "</i>";
   
   //add results of test to text
   text += getTestResultsReportingText(testResults["parameter-type"], testResults["df"], testResults["parameter"], p);
         
   //add effect size to text (testResults["effect-size"] is an array)
   text += getEffectSizeReportingText(p, testResults["effect-size"][0]);
  
   return text;
}

//TODO: returns reporting text for correlation
function getCorrelationReportingText(method)
{
   var text = "";
   return text;
}

//TODO: returns reporting text for regression
function getRegressionReportingText(method)
{
   var text = "";
   return text;
}

//function returns reporting text for given independent variable's level and its characteristics (m/mdn, sd, n, ci)
function getVariableCharacteristicsReportingText(dependentVariable, IVlevel, variableList, method)
{
   //variables for mean, median, confidence interval, standard deviation and number of participants
   var m, mdn, ci, sd, n;
   var text = "";
   //data distribution of a variable in order to calculate characteristics
   var distribution = variables[variableList["dependent"]][IVlevel];
   
   //add IV i: level j 
   text +=  "<i>" + IVlevel + "</i>" + " (";
   
   //report median for ordinal data and mean for rest of variable types
   if (variableTypes[dependentVariable] == "ordinal")
   {
      mdn = median(distribution);
      text += "<i>Mdn</i> = " + mdn.toFixed(2) + ", ";
   }
   else
   {
      m = mean(distribution);
      text += "<i>M</i> = " + m.toFixed(2) + ", ";
   }
   
   //add confidence intervals (round values to 3 decimal places)
   ci = findCI(distribution);
   text += "95% CI [" + ci[0].toFixed(2) + "," + ci[1].toFixed(2) + "], ";
      
   //add standard deviation and round it to 3 decimals places
   sd = getStandardDeviation(distribution);
   text += "<i>SD</i> = " + sd.toFixed(2);
   
   //in case that test is paired don't report n here  
   if(method == "pT" || method == "owrA" || method == "fT" || method == "wT")
      text += ")"
   else
      text += ", " + "<i>n</i> = " + (distribution).length + ")";
            
   return text;
}   

//returns reporting text for results of test
function getTestResultsReportingText(parameterType, df, parameter, p)
{
   var text = "";
   //if parameter type is cS, the letters have to be changed to display correctly
   if (parameterType == "cS")
      parameterType = String.fromCharCode(967) + String.fromCharCode(178);

   //complement text and give parameter result and degrees of freedom (if parameter has some) 
   text += ", " + "<i>" + parameterType + "</i>" + (hasDF[parameterType] ? "(" + df + ") " : "") + " = " + parameter + ", ";

   //add exact p-value (unless smaller than 0.001) and omit first zero
   text += "<i>" + "p" + "</i>" + (p < 0.001 ? " < " : " = ") + omitZeroPValueNotation(p) + ".";
   
   return text;
}

//depending on p-value and effect size, the effect size text is returned
function getEffectSizeReportingText(p, effectSize)
{
   var text = "";
   //round effect size to 2 decimal places (effectSize is currently an array)
   var effectSizeRounded = effectSize.toFixed(2);
   
   //depending on type of effect size the amount (small, medium, large) is measured and is returned here
   //0 = small; 1 = small-medium; 2 = medium-large; 3: large effect; 99 = error
   var effectSizeAmount = getEffectSizeAmount(testResults["effect-size-type"], effectSize);
  
   //if effect size type is eS or RS, the letters have to be change to display correctly
   var effectSizeType = testResults["effect-size-type"];
   if (effectSizeType == "ηS")
      effectSizeType = "η" + String.fromCharCode(178);
   else if (effectSizeType == "RS")
      effectSizeType = "r" + String.fromCharCode(178);
   
   if (p < 0.05)
   {
      //add effect size text depending on amount of effect
      if (effectSizeAmount == 0)
         text += " However, there was nearly no effect, ";
      else if (effectSizeAmount == 1)
         text += " However, the effect size was small, ";
      else if (effectSizeAmount == 2)
         text += " The differences constituted a medium effect size, ";
      else if (effectSizeAmount == 3)
         text += " The differences constituted a large effect size, ";
      //there is no effect size (should not happen)
      else
      {
         console.log("Error: no effect size");
         return "";
      }
      
      //add effect-size value
      text += “ ” + "<i>" + effectSizeType + "</i>" + " = " + effectSizeRounded + ". ";
   }
   //p > 0.05 (not significant)
   else 
   {
           //add effect size text depending on amount of effect
      if (effectSizeAmount == 2)
         text += " However, the differences constituted a medium effect size, " + "<i>" + effectSizeType + "</i>" + "= " + effectSizeRounded + ".";
      else if (effectSizeAmount == 3)
         text += " However, the differences constituted a large effect size, " + "<i>" + effectSizeType + "</i>" + "= " + effectSizeRounded + ".";
      //in case that effect size is smaller than medium, it is not remarkable as no significant results
   }
   
   return text;
}
