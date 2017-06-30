//OpenCPU: load dataset
//load the file to a JS object
function loadFile()
{
    //loads the file and returns the dataset and variable names
    var req = ocpu.rpc("loadFile", 
    {
        fileName: sessionStorage.fileName
    }, function(output) 
    {    
        dataset = output.dataset;
        variableNames = output.variableNames;        

        for(var i=0; i<variableNames.length; i++)        
            variablesFromOpenCPU[variableNames[i]] = sessionStorage.getItem(variableNames[i]) == undefined ? "?" : sessionStorage.getItem(variableNames[i]);        

        variablesDidLoad(); 

        //for each variable, get the data and the IQR
        for(var i=0; i<output.variableNames.length; i++)
        {      
            variables[output.variableNames[i]] = new Object();
            MIN[output.variableNames[i]] = new Object();
            MAX[output.variableNames[i]] = new Object();
            IQR[output.variableNames[i]] = new Object();
            CI[output.variableNames[i]] = new Object();

            getData(dataset, output.variableNames[i]);      
        } 

        computeNumberOfBins();
        computeCIForSDs();
    });
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
} 

function parseStringToDataFrame()
{
    // Loads the file and returns the dataset and variable names

    var req = ocpu.rpc("parseStringToDataFrame", 
    {
        content: sessionStorage.fileContent
    }, function(output) 
    {  
        console.dir(output);
        
        dataset = output.dataset;
        variableNames = output.variableNames;

        sessionStorage.setObject("dataset", output.dataset);
        sessionStorage.setObject("variables", variableNames);

        var roles = new Array();
        var dataTypes = new Array();
        var variablesDiv = d3.select("#variablesDiv");

        var variablesTable = variablesDiv.append("table")
                                            .attr("class", "table table-hover")
                                            .attr("align", "center");
        
        var tr = variablesTable.append("tr");

        tr.append("th").text("Variable");
        tr.append("th").text("Role");
        tr.append("th").text("Data type");

        for(var i=0; i<variableNames.length; i++)
        {
            var tr = variablesTable.append("tr");                                        
                     tr.append("td").text(variableNames[i]);
                        
            var select = tr.append("td").append("select").attr("name", "role").attr("id", variableNames[i] + ".role").attr("class", "roleSelect");                    
        
            var independent = select.append("option").attr("value", "IV").text("Independent Variable");            
            var dependent = select.append("option").attr("value", "DV").text("Dependent Variable");
            var participant = select.append("option").attr("value", "ID").text("Participant or Subject IDs");            
            
            select = tr.append("td").append("select").attr("name", "dataType").attr("id", variableNames[i] + ".datatype").attr("class", "dataTypeSelect");

            var interval = select.append("option").attr("value", "interval").text("Ordered and has equally spaced intervals");
            var ordinal = select.append("option").attr("value", "ordinal").text("Ordered levels");
            var nominal = select.append("option").attr("value", "nominal").text("Unordered levels");
            
            // var ratio = select.append("option").attr("value", "ratio").text("Ratio");
        }
    });
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}    

//get data by each variable name into JS object-value pairs
function getData(dataset, variableName, level)
{
    if(level === undefined)  
        level = "dataset";
    
    variables[variableName][level] = [];
    
    for(var i=0; i<dataset.length; i++)
        variables[variableName][level].push(dataset[i][variableName]);  
        
    MIN[variableName][level] = Array.min(variables[variableName][level]);
    MAX[variableName][level] = Array.max(variables[variableName][level]);
    
    IQR[variableName][level] = findIQR(variables[variableName][level]);
    CI[variableName][level] = findCI(variables[variableName][level]); 
    
    if(++variableCount == getObjectLength(variableNames))
    {
        setVariableRoles();
        setVariableTypes();
        
        testForEvilVariables();
        
        removeElementsByClassName("loadingAnimation");
        plotVisualisation();
        freezeMouseEvents = false;
        
        experimentalDesign = findExperimentalDesign();            
        window.VisiStat.UI.leftPane.updateExperimentalDesign(experimentalDesign, participants)
        
        var visualisations = ["Histogram", "Boxplot", "Scatterplot", "Scatterplot matrix"];

        // displayToolTips();
    }

}

// ToDo: writes the list of tasks done to a file

function writeToFileTests(fileName)
{
    return;
    var req = ocpu.rpc("writeToFile", 
    {
        object: logListTests,
        fileName: fileName
    }, function(output) 
    {
    
    })
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//TODO: writes the list of tasks done to a file
function writeToFileVisualizations(fileName)
{
    return;
    var req = ocpu.rpc("writeToFile", 
    {
        object: logViz,
        fileName: fileName
    }, function(output) 
    {
    
    })
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

function computeNumberOfBins()
{
    // ToDo: combine all distributions in our dataset

    var distributions = new Object(); // array of arrays    

    for(var aVariable in variables)
    {
        if((variableRoles[aVariable] != "IV") && (variableRoles[aVariable] != "ID"))
        {
            for(var aLevel in variables[aVariable])
            {
                if(aLevel.split("-").length < 2) // Get all distributions for combinations of upto 2 levels
                {
                    if(variables[aVariable][aLevel].length > 5)
                        distributions[aVariable + "_" + aLevel] = variables[aVariable][aLevel];
                }
            }
        }
    }

    var req = ocpu.rpc("getOptimalNumberOfBins", 
    {
        distribution: distributions
    }, function(output) 
    {
        values = output.nBinsArray;
        keys = output.nBinsArrayNames; 

        for(var i=0; i<keys.length; i++)
        {  
            if(nBinsArray[keys[i].split("_")[0]] == undefined)
                nBinsArray[keys[i].split("_")[0]] = new Object();

            nBinsArray[keys[i].split("_")[0]][keys[i].split("_")[1]] = values[i][0];
        }        
    })
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

function computeCIForSDs(callBack, transformationType)
{
    if(typeof(callBack) === 'undefined') callBack = false;
    if(typeof(transformationType) === 'undefined') transformationType = undefined;
    // ToDo: combine all distributions in our dataset

    var distributions = new Object(); // array of arrays    

    for(var aVariable in variables)
    {
        if((variableRoles[aVariable] != "IV") && (variableRoles[aVariable] != "ID"))
        {
            for(var aLevel in variables[aVariable])
            {
                if(aLevel.split("-").length < 3) // Get all distributions for combinations of upto 2 levels
                {
                    if(variables[aVariable][aLevel].length > 1)
                        distributions[aVariable + "_" + aLevel] = variables[aVariable][aLevel];
                }
            }
        }
    }

    var req = ocpu.rpc("getConfidenceIntervalForSDs", 
    {
        distribution: distributions
    }, function(output) 
    {
        keys = output.CIArrayNames;
        array = output.CI;
        SDArray = output.SD;

        for(var i=0; i<keys.length; i++)
        {
            if(!global.CIForSDs.hasOwnProperty(keys[i].split("_")[0]))
            {
                global.CIForSDs[keys[i].split("_")[0]] = {};
                global.SDs[keys[i].split("_")[0]] = {};

                global.CIForSDs[keys[i].split("_")[0]][keys[i].split("_")[1]] = [];
                global.SDs[keys[i].split("_")[0]][keys[i].split("_")[1]] = [];
            }

            global.CIForSDs[keys[i].split("_")[0]][keys[i].split("_")[1]] = array[i];
            global.SDs[keys[i].split("_")[0]][keys[i].split("_")[1]] = SDArray[i];
        }       
         
        if(callBack)
        {
            redrawBoxPlot(transformationType); // Redraws the boxplot with animation

            // ToDo: animate the assumption
            
            var assumptionType = document.getElementsByClassName("densityCurve").length == 0 ? "homogeneity" : "normality";       

            if(assumptionType == "homogeneity")
            {
                removeElementsByClassName("homogeneityPlot");

                d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + scaledPlotPanelHeight);
                drawAdvancedPlotButton();        
                drawHomogeneityPlot(true); 

                d3.select("#homogeneity.assumptionNodes").attr("fill", "green");
                testSelectionLogicAfterHomogeneityTest();
            }
            else if(assumptionType == "normality")
            {
                removeElementsByClassName("densityCurve");

                variableList = getSelectedVariables();                                            
                d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + scaledPlotPanelHeight);
                drawAdvancedPlotButton();

                for(var i=0; i<variableList["independent-levels"].length; i++)
                {                                                               
                    drawNormalityPlot(DV, variableList["independent-levels"][i], "normal");            
                }

                d3.select("#normality.assumptionNodes").attr("fill", "green");
                testSelectionLogicAfterNormalityTest();
            }
            else
            {
                console.log("Error: unhandled case");
            }
        }

    })
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}



