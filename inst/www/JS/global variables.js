var variables = new Object();     
var variableRows = new Object(); //dependent, independent, participant
var variableTypes = new Object(); //nominal, ordinal, interval, ratio

var IQR = new Object();   
var MIN = new Object();
var MAX = new Object();
var CI = new Object();
var splitData = new Object();
var variableNames = new Array();
var colourBoxPlotData = new Object();

var variableCount = 0;

var currentVariableSelection = [];    
var currentVisualisationSelection;

var fullScreen = false;

// Scatterplot
var outlierValues = [];
var topFringeValues = [];
var bottomFringeValues = [];
    
    
// Mouse events
var _startX = 0;            // mouse starting positions
var _startY = 0;
var _offsetX = 0;           // current element offset
var _offsetY = 0;
var _height = 0;
var _width = 0;
var _dragElement;           // needs to be passed from OnMouseDown to OnMouseMove
var _oldZIndex = 0;         // we temporarily increase the z-index during drag	


var stringForNumber = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

//Significance tests
var variableDataType = new Object();
var experimentalDesign;
var significanceTestNames = new Object();
    significanceTestNames["pT"] = "Paired T-test";
    significanceTestNames["uT"] = "Unpaired T-test";
    significanceTestNames["mT"] = "Mann-Whitney U test";    
    significanceTestNames["wT"] = "Wilcoxon Signed-rank test";
    significanceTestNames["a"] = "Analysis of Variance (ANOVA)";
    significanceTestNames["kT"] = "Kruskal-Wallis test";
    significanceTestNames["rA"] = "Repeated-measures ANOVA";
    significanceTestNames["fT"] = "Friedman Test";
var currentTestType;
var testResults = new Object();
var distributions = new Object();
var variances = new Object();
var participants;
var interactions = [];
    var tukeyResults = new Object();
    
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