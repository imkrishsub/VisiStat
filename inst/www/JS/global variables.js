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
desc["Histogram"] = "A histogram is a graphical representation of the distribution of data. It is an estimate of the probability distribution of a continuous variable and was first introduced by Karl Pearson. A histogram is a representation of tabulated frequencies, shown as adjacent rectangles, erected over discrete intervals (bins), with an area equal to the frequency of the observations in the interval. The height of a rectangle is also equal to the frequency density of the interval, i.e., the frequency divided by the width of the interval. The total area of the histogram is equal to the number of data.";
desc["Boxplot"] = "A box plot or boxplot is a convenient way of graphically depicting groups of numerical data through their quartiles. Box plots have lines extending vertically from the boxes (whiskers) indicating variability outside the upper and lower quartiles, hence the terms box-and-whisker plot and box-and-whisker diagram. Outliers may be plotted as individual points.";
desc["Scatterplot"] = "A scatter plot, scatterplot, or scattergraph is a type of mathematical diagram using Cartesian coordinates to display values for two variables for a set of data. The data is displayed as a collection of points, each having the value of one variable determining the position on the horizontal axis and the value of the other variable determining the position on the vertical axis.";
desc["Scatterplot-matrix"] = "Given a set of variables X1, X2, ... , Xk, the scatterplot matrix contains all the pairwise scatter plots of the variables on a single page in a matrix format. That is, if there are k variables, the scatterplot matrix will have k rows and k columns and the ith row and jth column of this matrix is a plot of Xi versus Xj.";
desc["p-value"] = "p-value is the probability of obtaining a test statistic at least as extreme as the one that was actually observed, assuming that the null hypothesis is true. A researcher will often \"reject the null hypothesis\" when the p-value turns out to be less than a certain significance level, often 0.05";

desc["parameter"] = new Object();
desc["parameter"]["t"] = "The t-statistic is a ratio of the departure of an estimated parameter from its notional value and its standard error.";
desc["parameter"]["F"] = "The F-statistic is the ratio of variance between treatments to the variance within treatments.";
desc["parameter"]["cS"] = "The chi-square statistic is a normalized sum of squared deviations between observed and theoretical frequencies.";
desc["parameter"]["U"] = "TBD";
desc["parameter"]["V"] = "TBD";
desc["parameter"]["z"] = "TBD";

desc["test"] = new Object();

desc["test"]["WT"] = "Welch's t test is an adaptation of Student's t-test intended for use with two samples having possibly unequal variances";
desc["test"]["pT"] = "Paired samples t-tests typically consist of a sample of matched pairs of similar units, or one group of units that has been tested twice";
desc["test"]["upT"] = "The independent samples t-test is used when two separate sets of independent and identically distributed samples are obtained, one from each of the two populations being compared.";
desc["test"]["mwT"] = "The Mann–Whitney U test (also called the Mann–Whitney–Wilcoxon (MWW), Wilcoxon rank-sum test, or Wilcoxon–Mann–Whitney test) is a non-parametric test of the null hypothesis that two populations are the same against an alternative hypothesis, especially that a particular population tends to have larger values than the other. It has greater efficiency than the t-test on non-normal distributions, such as a mixture of normal distributions, and it is nearly as efficient as the t-test on normal distributions";
desc["test"]["wT"] = "Wilcoxon signed-rank test is a non-parametric statistical hypothesis test used when comparing two related samples, matched samples, or repeated measurements on a single sample to assess whether their population mean ranks differ (i.e. it is a paired difference test). It can be used as an alternative to the paired Student's t-test, t-test for matched pairs, or the t-test for dependent samples when the population cannot be assumed to be normally distributed.";

desc["test"]["owA"] = "one-way analysis of variance (abbreviated one-way ANOVA) is a technique used to compare means of two or more samples (using the F distribution). This technique can be used only for numerical data.";
desc["test"]["twA"] = "the two-way analysis of variance (ANOVA) test is an extension of the one-way ANOVA test that examines the influence of different categorical independent variables on one dependent variable. While the one-way ANOVA measures the significant effect of one independent variable, the two-way ANOVA is used when there are more than one independent variable and multiple observations for each independent variable. The two-way ANOVA can not only determine the main effect of contributions of each independent variable but also identifies if there is a significant interaction effect between the independent variables.";
desc["test"]["owrA"] = "Repeated measures analysis of variance (rANOVA) is a commonly used statistical approach to repeated measure designs. With such designs, the repeated-measure factor (the qualitative independent variable) is the within-subjects factor, while the dependent quantitative variable on which each participant is measured is the dependent variable.";
desc["test"]["fA"] = "In a mixed-design analysis of variance model (also known as a split-plot ANOVA) is used to test for differences between two or more independent groups whilst subjecting participants to repeated measures. Thus, in a mixed-design ANOVA model, one factor (a fixed effects factor) is a between-subjects variable and the other (a random effects factor) is a within-subjects variable. Thus, overall, the model is a type of mixed effect model.";
desc["test"]["fT"] = "The Friedman test is a non-parametric statistical test developed by the U.S. economist Milton Friedman. Similar to the parametric repeated measures ANOVA, it is used to detect differences in treatments across multiple test attempts.";
desc["test"]["WA"] = "If the data show a lot of heteroscedasticity (different groups have different variances), the one-way anova can yield an inaccurate P-value; the probability of a false positive may be much higher than 5 percent. In that case, the most common alternative is Welch's anova.";
desc["test"]["kwT"] = "The Kruskal–Wallis one-way analysis of variance by ranks (named after William Kruskal and W. Allen Wallis) is a non-parametric method for testing whether samples originate from the same distribution. It is used for comparing more than two samples that are independent, or not related. The parametric equivalent of the Kruskal-Wallis test is the one-way analysis of variance (ANOVA).";

desc["test"]["pC"] = "the Pearson product-moment correlation coefficient (sometimes referred to as the PPMCC or PCC,[1] or Pearson's r) is a measure of the linear correlation (dependence) between two variables X and Y, giving a value between +1 and −1 inclusive, where 1 is total positive correlation, 0 is no correlation, and −1 is total negative correlation. It is widely used in the sciences as a measure of the degree of linear dependence between two variables.";
desc["test"]["kC"] = "the Kendall rank correlation coefficient, commonly referred to as Kendall's tau (τ) coefficient, is a statistic used to measure the association between two measured quantities. A tau test is a non-parametric hypothesis test for statistical dependence based on the tau coefficient.";
desc["test"]["bC"] = "point biserial correlation coefficient (rpb) is a correlation coefficient used when one variable (e.g. Y) is dichotomous; Y can either be \"naturally\" dichotomous, like gender, or an artificially dichotomized variable. In most situations it is not advisable to artificially dichotomize variables.";