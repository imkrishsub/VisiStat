/**
 * ToDo: make all settings accessible via config object file
 * @type {Object}
 */
var config = {};

////////////
//History //
////////////
config.history = {};

config.history.entryHeight = "50px";

/////////////
//Timeouts //
/////////////

config.timeouts = {};

config.timeouts.assumptionDecisionTree = 1200;
config.timeouts.assumptions = 1200;

///////////////////////
//Interaction Effect //
///////////////////////

config.interactionEffect = {};

config.interactionEffect.navigationButton = {};

config.interactionEffect.navigationButton.width = 200;
config.interactionEffect.navigationButton.height = 35;
config.interactionEffect.navigationButton.arrowSize = config.interactionEffect.navigationButton.height*0.75;
config.interactionEffect.navigationButton.padding = config.interactionEffect.navigationButton.height*0.25;

/////////////////////////
//Post-hoc comparisons //
/////////////////////////

config.postHoc = {};

config.postHoc.helpTextHeight = 100;

/////////////////////
//Description-text //
/////////////////////

config.description = {};


// Data
    var dataset = new Object();

    // Skeleton
    var width = getWidth();
    var height = getHeight();  

    var panelColors = new Object();
        panelColors.normal = "#F5F5F5";
        panelColors.active = "#3957F1";

    // defining dimensions for panels

    var variablesPanelHeight = 0.6*height;
    var variablesPanelWidth = 260; // This is fixed

    var visualizationsPanelHeight = 0.4*height;
    var visualizationsPanelWidth = variablesPanelWidth;

    var sidePanelHeight = height;
    var sidePanelWidth = 350; 

    var plotPanelHeight = 0.55*height;
    var plotPanelWidth = (width - variablesPanelWidth - sidePanelWidth);

    var assumptionsPanelHeight = 0.2*height;
    var assumptionsPanelWidth = plotPanelWidth;    

    var resultsPanelHeight = 0.25*height;
    var resultsPanelWidth = plotPanelWidth/2;

    var buttonsPanelHeight = 0.25*height;
    var buttonsPanelWidth = plotPanelWidth/2;

    var reportPanelHeight = height*4;
    var reportPanelWidth = (width - sidePanelWidth);

    var sideCanvasButtonHeight = scaleForWindowSize(50);

    var bottomDivHeight = height/7;
    
    var loadingImageSize = scaleForWindowSize(100);

    // Variable panel
        var variableNameHolderPadding = scaleForWindowSize(15);
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
            
            variableTypeButtonColors["subject"] = "SaddleBrown";
        
        var variableTypeTextColors = new Object();
            variableTypeTextColors["dependent"] = new Object();
                variableTypeTextColors["dependent"]["normal"] = "black";
                variableTypeTextColors["dependent"]["selected"] = "white";
            
            variableTypeTextColors["independent"] = new Object();
                variableTypeTextColors["independent"]["normal"] = "black";
                variableTypeTextColors["independent"]["selected"] = "white";
            
            variableTypeTextColors["subject"] = "white";

    // Visualisation panel
        var visualizationHolderRadius = scaleForWindowSize(15) ;

// Displaying Data

    var displayDataLimit = 100;
    var rangeToFade = 3*displayDataLimit/5;

    var textColor = new Object();
    textColor["history entry title"] = "blue";

    var fontSizes = new Object();

    fontSizes["label"] = "14px";
    fontSizes["tick"] = "10px";
    fontSizes["bin text"] = "12px";
    fontSizes["button label"] = "12px";
    fontSizes["boxplot.main difference"] = "14px";
    fontSizes["test result"] = "14px";  
    fontSizes["result one-liner"] = "10px";
    fontSizes["post-hoc button help text"] = "12px";
    fontSizes["decision tree"] = "12px";
    fontSizes["research question"] = "10px";
    fontSizes["effect plot title"] = "12px";
    fontSizes["effect plot legend"] = "10px";
    fontSizes["effect plot legend title"] = "12px";
    fontSizes["assumptions.label"] = "14px";
    fontSizes["assumptions.tick"] = "14px";
    fontSizes["display text"] = "16px";
    fontSizes["post-hoc table title"] = "20px";
    fontSizes["post-hoc comparison table cell content"] = "24px";
    fontSizes["effectSizeInterpretationIndicators"] = "12px";
    fontSizes["effectSize"] = "14px";

    var radius = new Object();

    radius["effectPlot.data point"] = "1.5px";
    radius["effectPlot.mean"] = "4px";
    radius["scatter plot"] = "1.5px";
    radius["outlier"] = "3px";

    var fontSizeForDisplayDataTitle = scaleForWindowSize(36);
    var fontSizeForDisplayDataTableElements = scaleForWindowSize(20);
    var fontSizeAssumptions = 14;
    var fontSizeAssumptionsTitle = 18;    
    
    var fontSizeHelpText = 14;
    
// Plots (general)
    var strokeWidth = new Object();

    strokeWidth["tick"] = "1px";
    strokeWidth["axis"] = "1px";
    strokeWidth["histogram.bar"] = "1px";
    strokeWidth["boxplot.box"] = "1px";
    strokeWidth["boxplot.median"] = "4px";
    strokeWidth["boxplot.fringe"] = "0.5px";
    strokeWidth["CI"] = "3px";
    strokeWidth["history entry"] = "1px";
    strokeWidth["effect plot border"] = "0.5px";
    strokeWidth["variance"] = "25px";
    strokeWidth["selected effect"] = "4px";

    var axesOffset = 25;
    var tickLength = 7;

    var tickTextOffsetXAxis = scaleForWindowSize(25);
    var tickTextOffsetYAxis = scaleForWindowSize(15);
    var yAxisTickTextOffset = scaleForWindowSize(6);
    var fontSize = scaleForWindowSize(10);
    var border = scaleForWindowSize(20);

    var plotHeight = plotPanelHeight - 2*(axesOffset + tickTextOffsetXAxis + border);
    var plotWidth = 1.5*plotHeight;
    
    var displayOffsetTop = scaleForWindowSize(10);
    var displayOffsetBottom = scaleForWindowSize(25);

    // Time outs

    var timeOut = new Object();

    timeOut["loading interaction effect"] = 3000;

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
var nBins = 7; 
var nBinsArray = new Object();
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

    var boxColors = new Object();
        boxColors["normal"] = "#ffffff";
        boxColors["notnormal"] = "#ff3d00";

    var CIFringeLength = 10;

// Scatterplot
var datapointRadius = scaleForWindowSize(4);
var numberOfGrooves = 10;
var topOffset = scaleForWindowSize(25);
var labelOffset = scaleForWindowSize(45);

// Significance test
var significanceTestScaleOffset = scaleForWindowSize(25);

var assumptionNodesLeftOffset = 100;
var assumptionNodesMargin = 15;

var assumptionsText = new Object();
    assumptionsText["normality"] = "Data are normally distributed";
    assumptionsText["homogeneity"] = "Variances are approximately the same";
        
var assumptions = ["normality", "homogeneity"]; // Sphericity (for one-way repeated-measures ANOVA) is checked for and corrected internally (with a remark made in the displayed results).

var significanceTestResultStep = 25;
// var significanceTestResultOffsetTop = plotPanelHeight/2 + scaleForWindowSize(40);

var effectSizeWidth = resultsPanelWidth*0.8;
var effectSizeHeight = scaleForWindowSize(30);

var effectPlotCanvasWidth, effectPlotCanvasHeight;

var computingResultsImageSize = scaleForWindowSize(75);

var selectionButtonWidth = scaleForWindowSize(200);
var selectionButtonHeight = scaleForWindowSize(50);
var selectionButtonOffset = assumptionsPanelHeight/2;//scaleForWindowSize(15);

//transformation
var normalityPlotWidth = scaleForWindowSize(125);
var normalityPlotHeight = normalityPlotWidth*(3/4);
var normalityPlotOffset = scaleForWindowSize(75); //from plotPanelHeight
var boxPlotTransformationDuration = 700;
var scaledPlotPanelHeight = plotPanelHeight*1.75;

var sampleSizeCutoff = 20;

//buttons
var buttonOffset = scaleForWindowSize(150);//assumptionOffsetTop + 2*assumptionStep;
var buttonHeight = 45;
var buttonWidth = 100; //ToDo: find this based on the button text's bounding box size 
var buttonPadding = 25;

// advanced plot button
var advancedPlotButtonHeight = buttonHeight;
var advancedPlotButtonWidth = buttonsPanelWidth/2;
var advancedPlotButtonOffset = scaleForWindowSize(15);

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

var historyButtonTextSize = scaleForWindowSize(14) ;

// Decision tree

var nodeSize = 30;
var nodeTextOffset = 7;

// Definition of decision trees

var decisionTree2Levels = new Object();
var decisionTree3OrMoreLevels = new Object();
var decisionTree2OrMoreIndependentVariables = new Object();
var decisionTreePostHocTests = new Object();

var levelNamesOfDecisionTree = ["Experimental Design?", "Variance is roughly the same?", "Normally distributed?", "Statistical test?"];
var levelNamesOfDecisionTreeForPostHocTests = ["Experimental Design?", "Variance is roughly the same?", "Normally distributed?", "Post-hoc test?"];

for(var i=0; i<levelNamesOfDecisionTree.length; i++)
{
    decisionTree2Levels[levelNamesOfDecisionTree[i]] = new Object();
    decisionTree2Levels[levelNamesOfDecisionTree[i]]["values"] = new Array();
    decisionTree2Levels[levelNamesOfDecisionTree[i]]["parentNodeIDs"] = new Array();
    decisionTree2Levels[levelNamesOfDecisionTree[i]]["pathLabel"] = new Array();

    decisionTree3OrMoreLevels[levelNamesOfDecisionTree[i]] = new Object();
    decisionTree3OrMoreLevels[levelNamesOfDecisionTree[i]]["values"] = new Array();
    decisionTree3OrMoreLevels[levelNamesOfDecisionTree[i]]["parentNodeIDs"] = new Array();
    decisionTree3OrMoreLevels[levelNamesOfDecisionTree[i]]["pathLabel"] = new Array();

    decisionTree2OrMoreIndependentVariables[levelNamesOfDecisionTree[i]] = new Object();
    decisionTree2OrMoreIndependentVariables[levelNamesOfDecisionTree[i]]["values"] = new Array();
    decisionTree2OrMoreIndependentVariables[levelNamesOfDecisionTree[i]]["parentNodeIDs"] = new Array();
    decisionTree2OrMoreIndependentVariables[levelNamesOfDecisionTree[i]]["pathLabel"] = new Array();

    decisionTreePostHocTests[levelNamesOfDecisionTree[i]] = new Object();
    decisionTreePostHocTests[levelNamesOfDecisionTree[i]]["values"] = new Array();
    decisionTreePostHocTests[levelNamesOfDecisionTree[i]]["parentNodeIDs"] = new Array();
    decisionTreePostHocTests[levelNamesOfDecisionTree[i]]["pathLabel"] = new Array();
}

// - - - - - - - - - - - - -  2 levels - - - - - - - - - - - - - 

decisionTree2Levels["Experimental Design?"]["values"] = ["Experimental design?"];
decisionTree2Levels["Experimental Design?"]["parentNodeIDs"] = [null];

var RootInDecisionTreeFor2Levels = decisionTree2Levels[levelNamesOfDecisionTree[0]]["values"][0] + '0';

decisionTree2Levels["Variance is roughly the same?"]["values"] = ["Homogeneity?", "Homogeneity?"];
decisionTree2Levels["Variance is roughly the same?"]["parentNodeIDs"] = [RootInDecisionTreeFor2Levels, RootInDecisionTreeFor2Levels];
decisionTree2Levels["Variance is roughly the same?"]["pathLabel"] = ["within-groups", "between-groups"];

decisionTree2Levels["Normally distributed?"]["values"] = ["Normality?", null, "Normality?", "Normality?"];
decisionTree2Levels["Normally distributed?"]["parentNodeIDs"] = ["Homogeneity?0", null, "Homogeneity?1", "Homogeneity?1"];
decisionTree2Levels["Normally distributed?"]["pathLabel"] = ["Yes", null, "Yes", "No"];

decisionTree2Levels["Statistical test?"]["values"] = ["Paired t-test", "Wilcoxon signed-rank test", null, null, "Unpaired t-test", "Mann-Whitney U test", "Welch's t-test", null];
decisionTree2Levels["Statistical test?"]["parentNodeIDs"] = ["Normality?0", "Normality?0", null, null, "Normality?2", "Normality?2", "Normality?3", null];
decisionTree2Levels["Statistical test?"]["pathLabel"] = ["Yes", "No", null, null, "Yes", "No", "Yes", null];

// - - - - - - - - - - - - -  3+ levels - - - - - - - - - - - - - 

decisionTree3OrMoreLevels["Experimental Design?"]["values"] = ["Experimental design?"];
decisionTree3OrMoreLevels["Experimental Design?"]["parentNodeIDs"] = [null];

var RootInDecisionTreeFor3OrMoreLevels = decisionTree3OrMoreLevels[levelNamesOfDecisionTree[0]]["values"][0] + '0';

decisionTree3OrMoreLevels["Variance is roughly the same?"]["values"] = ["Homogeneity?", "Homogeneity?"];
decisionTree3OrMoreLevels["Variance is roughly the same?"]["parentNodeIDs"] = [RootInDecisionTreeFor3OrMoreLevels, RootInDecisionTreeFor3OrMoreLevels];
decisionTree3OrMoreLevels["Variance is roughly the same?"]["pathLabel"] = ["within-groups", "between-groups"];

decisionTree3OrMoreLevels["Normally distributed?"]["values"] = ["Normality?", null, "Normality?", "Normality?"];
decisionTree3OrMoreLevels["Normally distributed?"]["parentNodeIDs"] = ["Homogeneity?0", null, "Homogeneity?1", "Homogeneity?1"];
decisionTree3OrMoreLevels["Normally distributed?"]["pathLabel"] = ["Yes", null, "Yes", "No"];

decisionTree3OrMoreLevels["Statistical test?"]["values"] = ["One-way RM ANOVA", "Friedman's Analysis", null, null, "One-way ANOVA", "Kruskal Wallis test", "Welch's ANOVA", null];
decisionTree3OrMoreLevels["Statistical test?"]["parentNodeIDs"] = ["Normality?0", "Normality?0", null, null, "Normality?2", "Normality?2", "Normality?3", null];
decisionTree3OrMoreLevels["Statistical test?"]["pathLabel"] = ["Yes", "No", null, null, "Yes", "No", "Yes", null];

// - - - - - - - - - - - - -  2+ IVs - - - - - - - - - - - - - 

decisionTree2OrMoreIndependentVariables["Experimental Design?"]["values"] = ["At least one within-groups factor?"];
decisionTree2OrMoreIndependentVariables["Experimental Design?"]["parentNodeIDs"] = [null];

var RootInDecisionTreeFor2OrMoreIndependentVariables = decisionTree2OrMoreIndependentVariables[levelNamesOfDecisionTree[0]]["values"][0] + '0';

decisionTree2OrMoreIndependentVariables["Variance is roughly the same?"]["values"] = ["Homogeneity?", "Homogeneity?"];
decisionTree2OrMoreIndependentVariables["Variance is roughly the same?"]["parentNodeIDs"] = [RootInDecisionTreeFor2OrMoreIndependentVariables, RootInDecisionTreeFor2OrMoreIndependentVariables];
decisionTree2OrMoreIndependentVariables["Variance is roughly the same?"]["pathLabel"] = ["within-groups", "between-groups"];

decisionTree2OrMoreIndependentVariables["Normally distributed?"]["values"] = ["Normality?", null, "Normality?", null];
decisionTree2OrMoreIndependentVariables["Normally distributed?"]["parentNodeIDs"] = ["Homogeneity?0", null, "Homogeneity?1", null];
decisionTree2OrMoreIndependentVariables["Normally distributed?"]["pathLabel"] = ["Yes", null, "Yes", null];

decisionTree2OrMoreIndependentVariables["Statistical test?"]["values"] = ["Mixed-design Analysis of Variance", null, null, null, "Independent Factorial ANOVA", null, null, null];
decisionTree2OrMoreIndependentVariables["Statistical test?"]["parentNodeIDs"] = ["Normality?0", null, null, null, "Normality?2", null, null, null];
decisionTree2OrMoreIndependentVariables["Statistical test?"]["pathLabel"] = ["Yes", null, null, null, "Yes", null, null, null];

// - - - - - - - - - - - - -  Post-hoc tests - - - - - - - - - - - - - 

decisionTreePostHocTests["Experimental Design?"]["values"] = ["Experimental design?"];
decisionTreePostHocTests["Experimental Design?"]["parentNodeIDs"] = [null];

var RootInDecisionTreeForPostHocTests = decisionTreePostHocTests[levelNamesOfDecisionTree[0]]["values"][0] + '0';

decisionTreePostHocTests["Variance is roughly the same?"]["values"] = ["Homogeneity?", "Homogeneity?"];
decisionTreePostHocTests["Variance is roughly the same?"]["parentNodeIDs"] = [RootInDecisionTreeForPostHocTests, RootInDecisionTreeForPostHocTests];
decisionTreePostHocTests["Variance is roughly the same?"]["pathLabel"] = ["within-groups", "between-groups"];

decisionTreePostHocTests["Normally distributed?"]["values"] = ["Normality?", null, "Normality?", "Normality?"];
decisionTreePostHocTests["Normally distributed?"]["parentNodeIDs"] = ["Homogeneity?0", null, "Homogeneity?1", "Homogeneity?1"];
decisionTreePostHocTests["Normally distributed?"]["pathLabel"] = ["Yes", null, "Yes", "No"];

decisionTreePostHocTests["Statistical test?"]["values"] = ["Pairwise paired t-test*", "Friedman multiple-comparisons", null, null, "Tukey HSD test", "Pairwise unpaired Wilcox-test*", "Pairwise Welch's t-test*", null];
decisionTreePostHocTests["Statistical test?"]["parentNodeIDs"] = ["Normality?0", "Normality?0", null, null, "Normality?2", "Normality?2", "Normality?3", null];
decisionTreePostHocTests["Statistical test?"]["pathLabel"] = ["Yes", "No", null, null, "Yes", "No", "Yes", null];


// - - - - - - - - - - - - -  Unavailable tests settings - - - - - - - - - - - - - 

var unavailableTestParentIdsFor1IV = new Array();
var unavailableTestParentIdsFor2OrMoreIVs  = new Array();
var unavailableTestParentIdsForPostHocTests  = new Array();

var unavailableTestsPathLabelsFor1IV = new Array();
var unavailableTestsPathLabelsFor2OrMoreIVs = new Array();
var unavailableTestsPathLabelsForPostHocTests = new Array();

unavailableTestParentIdsFor1IV = ["Homogeneity0", "Normality3"];
unavailableTestsPathLabelsFor1IV = ["No", "No"];

unavailableTestParentIdsFor2OrMoreIVs = ["Homogeneity0", "Homogeneity1", "Normality0", "Normality2"];
unavailableTestsPathLabelsFor2OrMoreIVs = ["No", "No", "No", "No"];

unavailableTestParentIdsForPostHocTests = ["Normality3", "Homogeneity0"];
unavailableTestsPathLabelsForPostHocTests = ["No", "No"];

// Settings button (assumptions panel)
var settingsButtonRadius = scaleForWindowSize(25);
var settingsButtonOffset = scaleForWindowSize(15);
var settingsButtonImageWidth = settingsButtonRadius*1.75;

// Post-hoc comparison button
var buttonTopOffset;

// Tooltips

var toolTips = new Object();

var fillColor = new Object();

    fillColor["scatter plot data point"] = "black";
    fillColor["mainEffect.mean"] = meanColors["normal"];
    fillColor["CI"] = "#93D5E5";
