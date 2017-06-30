/**
 * Global object that is used to store all global variables
 * @type {Object}
 */
var global = {};

//////////
//Flags //
//////////

global.flags = {};

global.flags.isTestWithoutTimeout  = false; // if true, perform tests without delay (for re-plots)
global.flags.userDidSelectTestManually = false; 

///////////////////////
//Interaction-effect //
///////////////////////

global.interactionEffect = {};

////////////////////
//Data-properties //
////////////////////

global.CIForSDs = {};
global.SDs = {};

var variables = new Object();     
var variableRoles = new Object(); 
var variableTypes = new Object(); 
var variablesFromOpenCPU = new Object();

var IQR = new Object();   
var MIN = new Object();
var MAX = new Object();
var CI = new Object();
var splitData = new Object();
var variableNames = new Array();
var listOfResearchQuestions = new Array();
var listOfVariableSelections = new Array();
var listOfVisualizationSelections = new Array();
var variableLists = new Array();
var listOfTestTypes = new Array();
var listOfLevelsCompared = new Array();
var allLevels = new Array();
var reportingTextsArray = new Object();

var dataIsIncomplete = false;

var widthOfEachBox;

var testTypesSelectedForReport = new Array();
var researchQuestionsSelectedForReport = new Array();
var variablesSelectedForReport = new Array();

var numberOfEntriesInHistory = 0;

var colourBoxPlotData = new Object();

var homogeneityTestResults = new Object();
var normalityTestResults = new Object();

var states = new Array();

var variableCount = 0;

var selectedVariables = [];    
var selectedVisualisation;

var fullScreen = false;
var help = false;

// Scatterplot
var outlierValues = [];
var topFringeValues = [];
var bottomFringeValues = [];

var logListTests = new Array();    
var logViz = new Array();    
    
// Mouse events
var _startX = 0;            // mouse starting positions
var _startY = 0;
var _offsetX = 0;           // current element offset
var _offsetY = 0;
var _height = 0;
var _width = 0;
var _dragElement;           // needs to be passed from OnMouseDown to OnMouseMove
var _oldZIndex = 0;         // we temporarily increase the z-index during drag	

//flags
var freezeMouseEvents = false;
var reportMode = false;


var stringForNumber = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

//Significance tests
var variableDataType = new Object();
var experimentalDesign;
var significanceTestNames = new Object();
    significanceTestNames["pairedTTest"] = "Paired t-test";
    significanceTestNames["uT"] = "Unpaired t-test";
    significanceTestNames["mT"] = "Mann-Whitney U test";    
    significanceTestNames["WelchTTest"] = "Wilcoxon Signed-rank test";
    significanceTestNames["a"] = "Analysis of Variance (ANOVA)";
    significanceTestNames["kT"] = "Kruskal-Wallis test";
    significanceTestNames["rA"] = "Repeated-measures ANOVA";
    significanceTestNames["FriedmanTest"] = "Friedman Test";
var currentTestType;

var multiVariateTestResults = new Object();
var postHocTestResults = new Object();

var distributions = new Object();
var myDistributions = new Object();
var variances = new Object();
var participants;
var tukeyResults = new Object();
var usedMultiVariateTestType, usedPostHocTestType; // Can take values 'warning', 'error', and 'proper'/undefined

// Interaction effect

var effects = new Object();
var highestOrderSignificantEffect, highestOrderEffect;
    
var sampleSizesAreEqual = true;
var pairwiseComparisons = false;

var log = new Array();

//transformations
var transformationType;

var boxes = [];
var meanCircles = [];
var medianLines = [];
var topFringes = [];
var bottomFringes = [];
var topFringeConnectors = [];
var bottomFringeConnectors = [];
var CILines = [];
var CITopLines = [];
var CIBottomLines = [];
var yAxisTexts = [];

//histogram curve
var curveX = [];
var curveY = [];
var distributionType;
var densityCurveColors = new Object();
    densityCurveColors["normal"] = "green";
    densityCurveColors["notnormal"] = "red";
    
//animations B-)
var loadingDataAnimation;

//miscellaneous
var factorials = [0, 1, 2, 6, 24, 120];

var STATES = new Object();

var entryHeight, entryWidth;
var currentHistoryPanelTop;
//--------COPY THIS (you don't need the textfield for pure text)
//reporting results from ANOVA are saved as a text for post-hoc analysis
var resultsFromANOVA;

// Tabs in the sidePanel
var tabTopSelected = scaleForWindowSize(10);
var tabTopUnselected = scaleForWindowSize(15);

// Border
var borderWidth = scaleForWindowSize(3);

// Margin for help sidePanel
var marginHelpPanel = scaleForWindowSize(5);