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

var states = new Array();

var variableCount = 0;

var currentVariableSelection = [];    
var currentVisualisationSelection;

var fullScreen = false;
var help = false;

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

var freezeMouseEvents = false;


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

//settings
var desc = new Object();
desc["Histogram"] = "A histogram is a graphical representation of the distribution of data. It is an estimate of the probability distribution of a continuous variable and was first introduced by Karl Pearson.[1] A histogram is a representation of tabulated frequencies, shown as adjacent rectangles, erected over discrete intervals (bins), with an area equal to the frequency of the observations in the interval. The height of a rectangle is also equal to the frequency density of the interval, i.e., the frequency divided by the width of the interval. The total area of the histogram is equal to the number of data.";
desc["Boxplot"] = "A box plot or boxplot is a convenient way of graphically depicting groups of numerical data through their quartiles. Box plots have lines extending vertically from the boxes (whiskers) indicating variability outside the upper and lower quartiles, hence the terms box-and-whisker plot and box-and-whisker diagram. Outliers may be plotted as individual points.";
desc["Scatterplot"] = "A scatter plot, scatterplot, or scattergraph is a type of mathematical diagram using Cartesian coordinates to display values for two variables for a set of data. The data is displayed as a collection of points, each having the value of one variable determining the position on the horizontal axis and the value of the other variable determining the position on the vertical axis.";
desc["Scatterplot-matrix"] = "Given a set of variables X1, X2, ... , Xk, the scatterplot matrix contains all the pairwise scatter plots of the variables on a single page in a matrix format. That is, if there are k variables, the scatterplot matrix will have k rows and k columns and the ith row and jth column of this matrix is a plot of Xi versus Xj.";
desc["p-value"] = "p-value is the probability of obtaining a test statistic at least as extreme as the one that was actually observed, assuming that the null hypothesis is true.[1] A researcher will often "reject the null hypothesis" when the p-value turns out to be less than a certain significance level, often 0.05";