// Data
    var wd = "http://hci.rwth-aachen.de/~subramanian/datasets/new/" + sessionStorage.fileName + ".csv";
    // var wd = "/Users/krishsub/Documents/datasets/" + sessionStorage.fileName + ".csv";
    var pathToFile =  wd;

    // Skeleton
    var width = getWidth();
    var height = getHeight();  

    var panelColors = new Object();
        panelColors.normal = "#F5F5F5";
        panelColors.active = "#3957F1";

    // defining dimensions for panels

    var variablesPanelHeight = 0.6*height;
    var variablesPanelWidth = 0.25*width;

    var visualizationsPanelHeight = 0.4*height;
    var visualizationsPanelWidth = 0.25*width;

    var assumptionsPanelHeight = 0.15*height;
    var assumptionsPanelWidth = 0.5*width;

    var plotPanelHeight = 0.6*height;
    var plotPanelWidth = 0.5*width;

    var resultsPanelHeight = 0.25*height;
    var resultsPanelWidth = 0.25*width;

    var buttonsPanelHeight = 0.25*height;
    var buttonsPanelWidth = 0.25*width;

    var sidePanelHeight = height;
    var sidePanelWidth = 0.25*width; 

    var reportPanelHeight = height*4;
    var reportPanelWidth = (width - sidePanelWidth);

    var sideCanvasButtonHeight = scaleForWindowSize(50);

    var bottomDivHeight = height/7;
    
    var loadingImageSize = scaleForWindowSize(100);

    // Variable panel
        var variableNameHolderPadding = scaleForWindowSize(15);
        var radius = variableNameHolderPadding + "px";
        var variableNameHolderHeight = scaleForWindowSize(60); // TODO: Find this dynamically based on number of variable names (50 is the maximum), do this for font-size as well
        var variableSelectionButtonWidth = scaleForWindowSize(60);
        var variableTypeSelectionButtonWidth = scaleForWindowSize(135);
        
        var flagImageSize = scaleForWindowSize(45);
        
        var variablePanelColors = new Object();
            variablePanelColors["active"] = "lightgrey";
            variablePanelColors["disabled"] = "#8F6B3F";
        
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

    // Visualisation panel
        var visualizationHolderRadius = scaleForWindowSize(15) + "px";

// Displaying Data
    var displayDataLimit = 20;
    var rangeToFade = 3*displayDataLimit/5;
    var fontSizeForDisplayDataTitle = scaleForWindowSize(36);
    var fontSizeForDisplayDataTableElements = scaleForWindowSize(20);
    var fontSizeLabels = scaleForWindowSize(16);
    var fontSizeTicks = scaleForWindowSize(12);
    var fontSizeAssumptions = scaleForWindowSize(18);
    var fontSizeAssumptionsTitle = scaleForWindowSize(26);
    var fontSizeVariablePanel = scaleForWindowSize(20);
    var fontSizeVisualisationPanel = scaleForWindowSize(32);
    var fontSizeSignificanceTestResults = scaleForWindowSize(18);    
    var fontSizeButtonLabel = scaleForWindowSize(10);
    
// Plots (general)
    var axesOffset = scaleForWindowSize(50); //distance from plots to axes (for an R-like appearance)
    var tickTextOffsetXAxis = scaleForWindowSize(25);
    var tickTextOffsetYAxis = scaleForWindowSize(15);
    var yAxisTickTextOffset = scaleForWindowSize(6);
    var fontSize = scaleForWindowSize(10);
    var tickLength = scaleForWindowSize(10);
    var border = scaleForWindowSize(20);

    var plotHeight = plotPanelHeight - 2.35*(axesOffset + tickTextOffsetXAxis + border);
    var plotWidth = 4*plotHeight/3;
    
    var displayOffsetTop = scaleForWindowSize(10);
    var displayOffsetBottom = scaleForWindowSize(25);

// Buttons
var buttonColors = new Object();   
//     "url(#buttonFillNormal)" = "LightSkyBlue";
    buttonColors["hover"] = "lightgrey";
    buttonColors["click"] = "BlanchedAlmond";

//Define colors for histogram bars, color scatterplot
var colors = ["#E6A960", "#D3E55F", "#5EA9D1", "#664E33", "#C45AD2", "#211F7C", "#479ED6", "#710012", "#F0DE4F", "#A5A5F6"];

var meanColors = new Object(); //Colors for mean, and ?
    meanColors["normal"] = "#374593";
    meanColors["hover"] = "#99ff33";
    meanColors["click"] = "#729e38";

// Histogram
var nBins = 6; 
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
        boxColors["normal"] = "#fff7e7";
        boxColors["notnormal"] = "#ff3d00";

    var CIFringeLength = scaleForWindowSize(5);

// Scatterplot
var datapointRadius = scaleForWindowSize(4);
var numberOfGrooves = 10;
var topOffset = scaleForWindowSize(25);
var labelOffset = scaleForWindowSize(45);

// Significance test
var significanceTestScaleOffset = scaleForWindowSize(25);

var assumptionStep = scaleForWindowSize(55);
var assumptionOffsetTop = assumptionStep*3.5;
var assumptionImageSize = scaleForWindowSize(35);

var assumptionsText = new Object();
    assumptionsText["normality"] = "Data are normally distributed";
    assumptionsText["homogeneity"] = "Variances are approximately the same";
    assumptionsText["sphericity"] = "Sphericity of distributions";
    
var helpButtonHeight = scaleForWindowSize(60);
    var helpButtonWidth = scaleForWindowSize(60);
    
    var helpButtonOffset = assumptionImageSize;
    
var assumptions = new Object();
assumptions["one-sample tests"] = ["normality"];
assumptions["normal"] = ["normality", "homogeneity"];
assumptions["repeated measures"] = ["normality", "homogeneity"];//["normality", "homogeneity", "sphericity"];

var significanceTestResultStep = scaleForWindowSize(37);
// var significanceTestResultOffsetTop = plotPanelHeight/2 + scaleForWindowSize(40);

var effectSizeWidth = resultsPanelWidth*0.8;
var effectSizeHeight = scaleForWindowSize(30);
var effectSizeFontSize = scaleForWindowSize(16) + "px";

var computingResultsImageSize = scaleForWindowSize(75);

var selectionButtonWidth = scaleForWindowSize(200);
var selectionButtonHeight = scaleForWindowSize(50);
var selectionButtonOffset = assumptionsPanelHeight/2;//scaleForWindowSize(15);

//transformation
var normalityPlotWidth = scaleForWindowSize(125);
var normalityPlotHeight = normalityPlotWidth*(3/4);
var normalityPlotOffset = scaleForWindowSize(75); //from plotPanelHeight
var boxPlotTransformationDuration = 700;

var sampleSizeCutoff = 20;

//buttons
var buttonOffset = scaleForWindowSize(150);//assumptionOffsetTop + 2*assumptionStep;
var buttonHeight = scaleForWindowSize(50);
// var buttonWidth = sideBarWidth;
var buttonPadding = assumptionStep;

//full screen button
var fullScreenButtonSize = scaleForWindowSize(75);
var fullScreenButtonOffset = scaleForWindowSize(10);

//Regression
var viewBoxXForRegressionLine = -scaleForWindowSize(300);
var viewBoxYForRegressionLine = -scaleForWindowSize(200);

var viewBoxWidthForRegressionLine = plotPanelWidth+scaleForWindowSize(750);
var viewBoxHeightForRegressionLine = viewBoxWidthForRegressionLine/2;



var parameterTypes = ["t", "V", "U", "F", "cS"];

var hasDF = new Object();
    hasDF["t"] = true;
    hasDF["V"] = false;
    hasDF["U"] = false;
    hasDF["F"] = true;
    hasDF["cS"] = true;

// History panel

var historyButtonTextSize = scaleForWindowSize(14) + "px";


