function findCorrelationCoefficient(variableA, variableB)
{
    console.log("\nCORRELATION");
    console.log("\t\ttypeOf(" + variableA + ")=" + variableDataTypes[variableA] + ", typeOf(" + variableB + ")=" + variableDataTypes[variableB]);
    
    var isScatterPlotMatrix = currentVisualizationSelection == "Scatterplot-matrix" ? true : false;
    
    
    if((variableDataTypes[variableA] == "binary") && (variableDataTypes[variableB] == "binary"))
    {
        //both are binary 
        
        //2x2 => Phi; Cramer's V otherwise
        console.log("\t\t\tCramer's V");
        return null;
    }
    else if(((variableDataTypes[variableA] == "binary") || (variableDataTypes[variableB] == "binary")) && ((variableDataTypes[variableA] != "binary") || (variableDataTypes[variableB] != "binary")))
    {
        //one is binary
    
        if(variableDataTypes[variableA] == "binary")
        {
            if(!isNaN(variables[variableB]["dataset"][0]))
            {
                console.log("\t\t\tBiserial Correlation Coefficient");
                if(!isScatterPlotMatrix)
                    getBiserialCorrelationCoefficient(variableB, variableA);
                else
                    return null;
            }
            else
            {   
                drawButtonInSideBar("CONSTRUCT MODEL", "regression");
                console.log("\t\t\tDoing nothing");
                return null;
            }
        }
        else
        {
            if(!isNaN(variables[variableA]["dataset"][0]))
            {
                console.log("\t\t\tBiserial Correlation Coefficient");
                if(!isScatterPlotMatrix)
                    getBiserialCorrelationCoefficient(variableA, variableB);
                else
                    return null
            }
            else
            {
                drawButtonInSideBar("CONSTRUCT MODEL", "regression");
                console.log("\t\t\tDoing nothing");
                return null;
            }            
        }
    }
    else
    {
        //both are not binary
        
        if(((variableDataTypes[variableA] == "ordinal") || (variableDataTypes[variableB] == "ordinal")) && ((variableDataTypes[variableA] != "nominal") && (variableDataTypes[variableB] != "nominal")))
        {
            console.log("\t\t\tKendall's Tau");            
            if(!isScatterPlotMatrix)
                getCorrelationCoefficient(variableA, variableB, "kendall");
            else
                return getPearsonCorrelation(variables[variableA]["dataset"], variables[variableB]["dataset"]);
        }
        else if((variableDataTypes[variableA] == "nominal") || (variableDataTypes[variableB] == "nominal"))
        {
            //do nothing
            drawButtonInSideBar("CONSTRUCT MODEL", "regression");
            console.log("\t\t\tDoing nothing");
            return null;
        }
        else
        {
            console.log("\t\t\tPearson's correlation");
            if(!isScatterPlotMatrix)
                getCorrelationCoefficient(variableA, variableB, "pearson");
            else
                return getPearsonCorrelation(variables[variableA]["dataset"], variables[variableB]["dataset"]);
        }
    }
}

function testForEvilVariables()
{  
    for(var i=0; i<variableNames.length; i++)
    {
        var variable = variableNames[i];
        var variableData = variables[variable]["dataset"];
        var uniqueVariableData = variableData.unique();

        if(isNaN(variableData[0]) || variableTypes[variable]=="participant")
        {            
            if(uniqueVariableData.length >= 10)
            {
                console.log("\n\tmaking " + variable + " as an evil variable");
                setThisVariableEvil(variableNames[i]);
            }
        }
    }
}

function changePValueNotation(p)
{
    if(p<0.001)
        return "p < 0.001";
    else
        return "p = " + p;
}
        