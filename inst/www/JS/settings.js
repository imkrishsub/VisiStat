// Data
//     localStorage.fileName = "store";
//     var fileName = "weightLoss";//change this!
    var wd ="http://hci.rwth-aachen.de/~subramanian/datasets/" + sessionStorage.fileName +".txt"; // "/Users/krishnasubramanian/Documents/Media Informatics/Semester 4/Thesis/Implementation/Possible Datasets/Datasets/";/
    var pathToFile =  wd;

// Skeleton
    var width = getWidth();
    var height = getHeight();  

    var panelColors = new Object();
        panelColors.normal = "#C5B998";
        panelColors.active = "#2C2206";

    var canvasHeight = height*(3/4);
    var canvasWidth = width*0.60; 
    
    var sideBarWidth = width*0.20;
    var bottomDivHeight = height/7;

    // Variable panel
        var variableNameHolderPadding = scaleForWindowSize(15);
        var radius = variableNameHolderPadding + "px";
        var variableNameHolderHeight = scaleForWindowSize(60); // TODO: Find this dynamically based on number of variable names (50 is the maximum), do this for font-size as well
        var variableSelectionButtonWidth = scaleForWindowSize(60);
        var variableTypeSelectionButtonWidth = scaleForWindowSize(120);
        
        var flagImageSize = scaleForWindowSize(45);
        
        var variablePanelColors = new Object();
            variablePanelColors["active"] = "lightgrey";
            variablePanelColors["disabled"] = "darkgrey";
        
        var variableTypeButtonColors = new Object();
            variableTypeButtonColors["dependent"] = new Object();
                variableTypeButtonColors["dependent"]["normal"] = "Linen";
                variableTypeButtonColors["dependent"]["selected"] = "SaddleBrown";
            
            variableTypeButtonColors["independent"] = new Object();
                variableTypeButtonColors["independent"]["normal"] = "Linen";
                variableTypeButtonColors["independent"]["selected"] = "CornflowerBlue";
            
            variableTypeButtonColors["participant"] = "SaddleBrown";
        
        var variableTypeTextColors = new Object();
            variableTypeTextColors["dependent"] = new Object();
                variableTypeTextColors["dependent"]["normal"] = "black";
                variableTypeTextColors["dependent"]["selected"] = "white";
            
            variableTypeTextColors["independent"] = new Object();
                variableTypeTextColors["independent"]["normal"] = "black";
                variableTypeTextColors["independent"]["selected"] = "white";
            
            variableTypeTextColors["participant"] = "white";

    // Visualization panel
        var visualizationImageSize = scaleForWindowSize(200);  

// Displaying Data
    var displayDataLimit = 20;
    var rangeToFade = 3*displayDataLimit/5;
    var fontSizeForDisplayDataTitle = scaleForWindowSize(36);
    var fontSizeForDisplayDataTableElements = scaleForWindowSize(20);
    var fontSizeLabels = scaleForWindowSize(28);
    var fontSizeTicks = scaleForWindowSize(18);
    var fontSizeAssumptions = scaleForWindowSize(26);
    var fontSizeVariablePanel = scaleForWindowSize(24);
    var fontSizeVisualizationPanel = scaleForWindowSize(36);
        
// Plots (general)
    var axesOffset = scaleForWindowSize(25); //distance from plots to axes (for an R-like appearance)
    var tickTextOffsetXAxis = 25;
    var tickTextOffsetYAxis = 10;
    var yAxisTickTextOffset = 6;
    var fontSize = scaleForWindowSize(14);
    var tickLength = scaleForWindowSize(10);
    var border = scaleForWindowSize(20);

    var plotHeight = canvasHeight - 2*(axesOffset + tickTextOffsetXAxis + border);
    var plotWidth = 4*plotHeight/3;
    
    var displayOffsetTop = scaleForWindowSize(10);
    var displayOffsetBottom = scaleForWindowSize(25);

// Buttons
var buttonColors = new Object();   
    buttonColors["normal"] = "LightSkyBlue";
    buttonColors["hover"] = "lightgrey";
    buttonColors["click"] = "BlanchedAlmond";
    buttonColors["independent"] = "Peru";
    buttonColors["subject"] = "Orchid";

//Define colors for histogram bars, color scatterplot
var colors = ["rgba(255,0,0,0.8)","rgba(0,255,0,0.6)","rgba(0,0,255,0.4)", "rgba(255,255,0,0.2)","rgba(0,255,255,0.25)","rgba(255,0,255,0.25)"];

var meanColors = new Object(); //Colors for mean, and ?
    meanColors["normal"] = "purple";
    meanColors["hover"] = "lightgreen";
    meanColors["click"] = "green";

// Histogram
var nBins = 10; 
var binCountFontSize = "16px";
var histLegendOffsetX = scaleForWindowSize(45);
var histLegendOffsetY = scaleForWindowSize(45);
var histLegendSize = scaleForWindowSize(35);
var histDistanceBetweenLegendAndText = scaleForWindowSize(15);


// Boxplots
    var boxWidth = scaleForWindowSize(75);
    var intervals = new Object(); //for keeping track of animations
    var meanRadius = scaleForWindowSize(5) < 5 ? 5 : scaleForWindowSize(5);
    var engorgedMeanRadius = scaleForWindowSize(10) < 7 ? 7 : scaleForWindowSize(10);
    var outlierRadius = 2;

    var boxColors = new Object();
        boxColors["normal"] = "lightgrey";
        boxColors["notnormal"] = "crimson";

    var CIFringeLength = scaleForWindowSize(5);

// Scatterplot
var datapointRadius = scaleForWindowSize(4);
var numberOfGrooves = 10;
var topOffset = scaleForWindowSize(25);
var labelOffset = scaleForWindowSize(45);

// Significance test
var significanceTestScaleOffset = scaleForWindowSize(25);
var assumptionStep = scaleForWindowSize(30);
var assumptionOffsetTop = assumptionStep*3;
var assumptionImageSize = scaleForWindowSize(35);

var assumptionsText = new Object();
    assumptionsText["normality"] = "Normality of distributions";
    assumptionsText["homogeneity"] = "Homogeneity of variances";
    
var assumptions = ["normality", "homogeneity"];
var significanceTestResultOffset = scaleForWindowSize(40);

var effectSizeWidth = sideBarWidth*0.8;
var effectSizeHeight = scaleForWindowSize(30);
var effectSizeFontSize = scaleForWindowSize(20) + "px";

//transformation
var normalityPlotWidth = scaleForWindowSize(125);
var normalityPlotHeight = normalityPlotWidth*(3/4);
var normalityPlotOffset = scaleForWindowSize(75); //from canvasHeight
var boxPlotTransformationDuration = 700;

var sampleSizeCutoff = 20;

//buttons
var buttonOffset = assumptionOffsetTop + 3*assumptionStep;
var buttonHeight = scaleForWindowSize(50);
var buttonWidth = sideBarWidth;

//full screen button
var fullScreenButtonSize = scaleForWindowSize(75);
var fullScreenButtonOffset = scaleForWindowSize(10);

//Regression
var viewBoxXForRegressionLine = -scaleForWindowSize(300);
var viewBoxYForRegressionLine = -scaleForWindowSize(200);

var viewBoxWidthForRegressionLine = canvasWidth+scaleForWindowSize(750);
var viewBoxHeightForRegressionLine = viewBoxWidthForRegressionLine/2;







