////////////////////////////
//2+ IVs: Factorial ANOVA //
////////////////////////////

function performMixedANOVA()
{
   var variableList = selectedVisualisation == "DoSignificanceTest" ? sort(selectedVariables) : getSelectedVariables();
    
    var DV = variableList["dependent"][0];
    var IVs = variableList["independent"];

    var formula = "performMixedEffectsANOVA(" + DV + " ~ " + IVs + ")";
    multiVariateTestResults["method"] = "Mixed-design Analysis of Variance"; //todo

    if(sessionStorage.getObject(formula) == null)
    {
        var req = ocpu.rpc("performMixedEffectsANOVA", 
        {
            dataset: dataset,
            dependentVariable: DV,
            independentVariables: IVs,
            subject: participants
        }, function(output) 
        {   
            sessionStorage.setObject(formula, output);        
            callBackForFactorialANOVA(output);            
        });
        
        //if R returns an error, alert the error message
        req.fail(function()
        {
            alert("Server error: " + req.responseText);
        });
    }
    else
    {
        var output = sessionStorage.getObject(formula);        
        callBackForFactorialANOVA(output);
    }
}

function performNWayANOVA()
{
    var variableList = selectedVisualisation == "DoSignificanceTest" ? sort(selectedVariables) : getSelectedVariables();
    
    var DV = variableList["dependent"][0];
    var IVs = variableList["independent"];

    var formula = "performNWayANOVA(" + DV + " ~ " + IVs + ")";
    multiVariateTestResults["method"] = "Independent Factorial ANOVA"; //todo

    if(sessionStorage.getObject(formula) == null)
    {
        var req = ocpu.rpc("performNWayANOVA", 
        {
            dataset: dataset,
            dependentVariable: DV,
            independentVariables: IVs            
        }, function(output) 
        {   
            sessionStorage.setObject(formula, output);
            callBackForFactorialANOVA(output);
        });
        
        //if R returns an error, alert the error message
        req.fail(function()
        {
            alert("Server error: " + req.responseText);
        });
    }
    else
    {
        var output = sessionStorage.getObject(formula);
        callBackForFactorialANOVA(output);
    }
}

function callBackForFactorialANOVA(output)
{
    var variableList = selectedVisualisation == "DoSignificanceTest" ? sort(selectedVariables) : getSelectedVariables();
    
    var DV = variableList["dependent"][0];
    var IVs = variableList["independent"];

    multiVariateTestResults["df"] = new Array();
    multiVariateTestResults["rawP"] = output.p;
    multiVariateTestResults["p"] = (output.p).clone();            

    if(output.denomDF.length == 1)
    {
        for(var i=0; i<output.p.length; i++)
        {                
            multiVariateTestResults["df"][i] = output.numDF[i] + ", " + output.denomDF[0];
            multiVariateTestResults["p"][i] = changePValueNotation(multiVariateTestResults["p"][i]);
        }    
    }
    else
    {
        for(var i=0; i<output.p.length; i++)
        {                
            multiVariateTestResults["df"][i] = output.numDF[i] + ", " + output.denomDF[i];
            multiVariateTestResults["p"][i] = changePValueNotation(multiVariateTestResults["p"][i]);
        }    
    }    

    multiVariateTestResults["parameter"] = output.F;
    multiVariateTestResults["parameter-type"] = "F";

    multiVariateTestResults["test-type"] = "factorialANOVA";
    multiVariateTestResults["effect-size"] = output.etaSquared;

    multiVariateTestResults["effect-size-type"] = "ηS";
    multiVariateTestResults["formula"] = DV + " ~ " + IVs[0];

    for(var i=1; i<IVs.length; i++)
        multiVariateTestResults["formula"] = multiVariateTestResults["formula"] + " * " + IVs[i];

    multiVariateTestResults["labels"] = output.labels;

    logResult();  
    removeElementsByClassName("completeLines");

    resultsFromANOVA = setReportingText(multiVariateTestResults["formula"]); 
    setReportingText(multiVariateTestResults["formula"]);

    // Find the highest-order effect that is significant (n-way interaction > (n-1)-way interaction > ... 2-way interaction > main effect)
    multiVariateTestResults["labels"] = output.labels;
    createEffectsObject(); 

    highestOrderEffect = effects.hasOwnProperty("3-way interaction") ? "3-way interaction" : "2-way interaction";
    var effectsHierarchy = ["main", "2-way interaction", "3-way interaction"];

    // Display the highest-order effect (if main effect, just show the results of ANOVA)
    highestOrderSignificantEffect = "main";

    for(anEffect in effects)
    {
        var effectsArray = effects[anEffect];

        for(var i=0; i<effectsArray.length; i++)
        {
            if((effectsArray[i]["rawP"] < 0.05) && (effectsHierarchy.indexOf(anEffect) > effectsHierarchy.indexOf(highestOrderSignificantEffect)))
            {
                highestOrderSignificantEffect = anEffect;
            }
        }
    }   

    // Display graph            
    drawEffects(highestOrderSignificantEffect);

    resultsFromANOVA = setReportingText(multiVariateTestResults["formula"]); 
    setReportingText(multiVariateTestResults["formula"]);   
}

function findLinearSimpleMainEffect()
{
    console.log("function: findLinearSimpleMainEffect()");
    var variableList = sort(selectedVariables);
    var DV = variableList["dependent"][0];

    var formula = "linearSimpleMainEffect()";
    multiVariateTestResults["method"] = "Independent Factorial ANOVA"; //todo

    if(sessionStorage.getObject(formula) == null)
    {
        var req = ocpu.rpc("findLinearSimpleMainEffect",  // (wholeDataset, DV, IV, fixedIVs, fixedIVLevels)
        {
            wholeDataset: dataset,
            DV: DV,
            IV: global.interactionEffect.IV,
            fixedIVs: global.interactionEffect.fixedIVs,
            fixedIVLevels: global.interactionEffect.fixedIVLevels       
        }, function(output) 
        {   
            sessionStorage.setObject(formula, output);
            callBackForFindLinearSimpleMainEffect(output);
        });
        
        //if R returns an error, alert the error message
        req.fail(function()
        {
            alert("Server error: " + req.responseText);
        });
    }
    else
    {
        var output = sessionStorage.getObject(formula);        
        callBackForFindLinearSimpleMainEffect(output);
    }
}

function findMixedSimpleMainEffect()
{
    console.log("function: findMixedSimpleMainEffect()");
    var variableList = sort(selectedVariables);
    var DV = variableList["dependent"][0];

    var formula = "mixedSimpleMainEffect()";
    multiVariateTestResults["method"] = "Independent Factorial ANOVA"; //todo

    if(sessionStorage.getObject(formula) == null)
    {
        var req = ocpu.rpc("findMixedSimpleMainEffect",  // (wholeDataset, DV, IV, fixedIVs, fixedIVLevels, subjectID)
        {
            wholeDataset: dataset,
            DV: DV,
            IV: global.interactionEffect.IV,
            fixedIVs: global.interactionEffect.fixedIVs,
            fixedIVLevels: global.interactionEffect.fixedIVLevels,
            subjectID: participants
        }, function(output) 
        {   
            sessionStorage.setObject(formula, output);
            callBackForFindMixedSimpleMainEffect(output);
        });
        
        //if R returns an error, alert the error message
        req.fail(function()
        {
            alert("Server error: " + req.responseText);
        });
    }
    else
    {
        var output = sessionStorage.getObject(formula);
        callBackForFindMixedSimpleMainEffect(output);
    }
}

function callBackForFindLinearSimpleMainEffect(output)
{
    var variableList = selectedVisualisation == "DoSignificanceTest" ? sort(selectedVariables) : getSelectedVariables();
    
    var DV = variableList["dependent"][0];
    var IVs = variableList["independent"];

    multiVariateTestResults["df"] = new Array();
    multiVariateTestResults["rawP"] = output.p;
    multiVariateTestResults["p"] = (output.p).clone();            

    if(output.denomDF.length == 1)
    {
        for(var i=0; i<output.p.length; i++)
        {                
            multiVariateTestResults["df"][i] = output.numDF[i] + ", " + output.denomDF[0];
            multiVariateTestResults["p"][i] = changePValueNotation(multiVariateTestResults["p"][i]);
        }    
    }
    else
    {
        for(var i=0; i<output.p.length; i++)
        {                
            multiVariateTestResults["df"][i] = output.numDF[i] + ", " + output.denomDF[i];
            multiVariateTestResults["p"][i] = changePValueNotation(multiVariateTestResults["p"][i]);
        }    
    }    

    multiVariateTestResults["parameter"] = output.F;
    multiVariateTestResults["parameter-type"] = "F";

    multiVariateTestResults["test-type"] = "One-way ANOVA (simple main effects)";
    multiVariateTestResults["method"] = "One-way ANOVA (simple main effects)";
    multiVariateTestResults["effect-size"] = output.etaSquared;

    multiVariateTestResults["effect-size-type"] = "ηS";
    multiVariateTestResults["formula"] = DV + " ~ " + IVs[0];

    for(var i=1; i<IVs.length; i++)
        multiVariateTestResults["formula"] = multiVariateTestResults["formula"] + " * " + IVs[i];

    multiVariateTestResults["labels"] = output.labels;

    logResult();  
    removeElementsByClassName("completeLines");

    resultsFromANOVA = setReportingText(multiVariateTestResults["formula"]); 
    setReportingText(multiVariateTestResults["formula"]);

    // Display graph            
    drawEffects("simple main");

    // resultsFromANOVA = setReportingText(multiVariateTestResults["formula"]); 
    // setReportingText(multiVariateTestResults["formula"]);
}

function callBackForFindMixedSimpleMainEffect(output)
{
    var variableList = selectedVisualisation == "DoSignificanceTest" ? sort(selectedVariables) : getSelectedVariables();
    
    var DV = variableList["dependent"][0];
    var IVs = variableList["independent"];

    multiVariateTestResults["df"] = new Array();
    multiVariateTestResults["rawP"] = output.p;
    multiVariateTestResults["p"] = (output.p).clone();            

    if(output.denomDF.length == 1)
    {
        for(var i=0; i<output.p.length; i++)
        {                
            multiVariateTestResults["df"][i] = output.numDF[i] + ", " + output.denomDF[0];
            multiVariateTestResults["p"][i] = changePValueNotation(multiVariateTestResults["p"][i]);
        }    
    }
    else
    {
        for(var i=0; i<output.p.length; i++)
        {                
            multiVariateTestResults["df"][i] = output.numDF[i] + ", " + output.denomDF[i];
            multiVariateTestResults["p"][i] = changePValueNotation(multiVariateTestResults["p"][i]);
        }    
    }    

    multiVariateTestResults["parameter"] = output.F;
    multiVariateTestResults["parameter-type"] = "F";

    multiVariateTestResults["method"] = "One-way RM ANOVA (simple main effects)";
    multiVariateTestResults["test-type"] = "One-way RM ANOVA (simple main effects)";
    multiVariateTestResults["effect-size"] = output.etaSquared;

    multiVariateTestResults["effect-size-type"] = "ηS";
    multiVariateTestResults["formula"] = DV + " ~ " + IVs[0];

    for(var i=1; i<IVs.length; i++)
        multiVariateTestResults["formula"] = multiVariateTestResults["formula"] + " * " + IVs[i];

    multiVariateTestResults["labels"] = output.labels;

    logResult();  
    removeElementsByClassName("completeLines");

    resultsFromANOVA = setReportingText(multiVariateTestResults["formula"]); 
    setReportingText(multiVariateTestResults["formula"]);

    // Display graph            
    drawEffects("simple main");
}