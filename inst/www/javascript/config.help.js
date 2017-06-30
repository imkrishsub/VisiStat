// - - - - - - - - - - - - - DEPRECATED - - - - - - - - - - - - - 

// Help text description 
var desc = new Object();
desc["Histogram"] = "Shows the distribution of the data by clustering data into different bins. Hover over each bar to see the number of participants corresponding to the bar. Histogram is useful for viewing the shape of the distribution. ";
desc["Boxplot"] = "Boxplot shows the distribution of the data. It is useful for seeing the central tendency of the distribution. The horizontal line in the middle indicates the median and the circle represents the mean.";
desc["Scatterplot"] = "It is a simple plot of one variable against the other variable. If you select an additional variable that has a fixed number of values, a color boxplot is drawn with the different values of the third variable mapped to different colors (See legend on top-right for inference).";
desc["Scatterplot matrix"] = "A Scatterplot-matrix is an extension of scatterplot. It plots variables pairwise against each other. The color of a cell indicatest the correlation between the variables involved (darker shade of green => more correlation). ";
desc["tukeyHSDPlot"] = "A Tukey's HSD test compares every pair of distributions. The difference between the means and the confidence intervals are plotted. If the confidence interval includes 0 (i.e., no significant effect), it is plotted in red. If not, it is plotted in green color. The golden line indicates zero. ";
desc["interactionEffect"] = "Interaction plot is used to visualise the interaction between the two independent variables. An interaction effect is said to occur when one independent affects the dependent variable differently for different levels of the other independent variable. This can be identified in the plot if two lines intersect.";

desc["regressionLine"] = "A regression line is a model that is fit to the given data so that the sum of squares of errors (distance of points from regression line) is minimum. In multiple regression, the variability due to the other causal variables is also taken into account.";
desc["equation"] = "An equation defines the regression model that is fit to the data. This can be used to predict the value of the outcome variable from the explanatory/causal variables.";
desc["p-value"] = "P-value is the probability of obtaining the data that you got given the null hypothesis is true (i.e., there is no effect). Hence, if the p-value is low (<0.05 at 95% significance level), it must mean that the null hypothesis is false (i.e., there is some effect!)";

desc["effect-size"] = new Object();

desc["effect-size"]["r"] = "Pearson's correlation coefficient is used to find correlation (the direction of change in one variable as the other variable changes) between two ratio variables. It has a range of -1 to +1. -1 implies that one variable decreases as the other increases (negative correlation) and +1 implies one variable increases as the other increases (positive correlation). 0 implies there is no dependence between the two variables.";
desc["effect-size"]["ηS"] = "Eta squared value indicates what amount of variance (change) in the dependent variable is caused due to the independent variable(s). It has a range of 0 to 1.";
desc["effect-size"]["𝜏"] = "It is a measure of correlation. A value of +1 indicates a positive correlation and a value of -1 indicates a negative correlation.";
desc["effect-size"]["rS"] = "R-squared values describes the amount of variance in the dependent variable is caused due to the independent variable(s). It has a range of 0 to 1. For a simple linear regression, it is the square of the pearson's correlation coefficient \'r\'";

desc["variancePlot"] = "A plot of the variances of the distributions in the boxplot. If the bars are green in color, the distributions have approximately same variance (homogeneity of variance). If the bars are in red, the distributions have different variances (heterogeneity of variances).";
desc["normalityPlot"] = "The shape of the curve indicates the type of distribution. Normal/Gaussian distributions are characterised by a bell-curve. Distributions that are approximately normal are plotted in green, whereas distributions that are not normal are plotted in red. Sometimes, it is hard to interpret whether this assumption has been satisfied or not from the shape of the distribution.";

desc["compareMean"] = "Click on this to select the means of the distributions you want to compare.";
desc["compareNow"] = "Click on this to compare the means! Make sure at least 2 means are selected!";
desc["tukeyHSD"] = "Click on this to perform a Tukey's HSD test. Tukey's HSD test is a post-hoc test that is used after a significance test is applied. It is used to find which particular pair of distributions are significantly different from each other. This pairwise-compares each level of the plot against every other level in the boxplot.";
desc["pairwisePostHoc"] = "Click on this to select means of the two levels you want to perform a pairwise post-hoc test on.  It is used to find which particular pair of distributions are significantly different from each other. ";
desc["regression"] = "Click on this to construct a regression model (which can be used to predict the outcome variable from the causal/explanatory variable(s)).";

desc["visualisation"] = new Object();
desc["visualisation"]["Histogram"] = "Shows the distribution of the data by clustering data into different bins. Hover over each bar to see the number of participants corresponding to the bar. Histogram is useful for viewing the shape of the distribution. ";
desc["visualisation"]["Boxplot"] = "Boxplot shows the distribution of the data. It is useful for seeing the central tendency of the distribution. The horizontal line in the middle indicates the median and the circle represents the mean.";
desc["visualisation"]["Scatterplot"] = "It is a simple plot of one variable against the other variable. If you select an additional variable that has a fixed number of values, a color boxplot is drawn with the different values of the third variable mapped to different colors (See legend on top-right for inference).";
desc["visualisation"]["Scatterplot matrix"] = "A Scatterplot-matrix is an extension of scatterplot. It plots variables pairwise against each other. The color of a cell indicatest the correlation between the variables involved (darker shade of green => more correlation). ";

desc["variables"] = new Object();

desc["variables"]["participantID"] = "The ID of the participant";
desc["variables"]["userSatisfaction"] = "The rating given by the participant after the experiment.";
desc["variables"]["satisfaction"] = "The rating given by the participant after the experiment.";
desc["variables"]["userRating"] = "The rating given by the participant after the experiment.";
desc["variables"]["gender"] = "The gender of the participant (\"male\", \"female\").";

desc["variables"]["keyboardLayout"] = "The keyboard layout used by the participant (\"QWERTY\", \"DVORAK\", \"i10\")";
desc["variables"]["typingSpeed"] = "The typing speed of the participant in Words Per Minute (WPM).";
desc["variables"]["errors"] = "The number of errors made by the participant in a minute. ";

desc["variables"]["phoneOS"] = "The OS used by the participant (\"iOS\", \"android\", or \"windows\")";
desc["variables"]["happScore"] = "The happiness score of the participant (out of 100). Higher the score, more happy the user is.";
desc["variables"]["stressScore"] = "The stress score of the participant (out of 100). Higher the score, more stressed the user is.";

desc["variables"]["foodEaten"] = "The food eaten by the participant before taking the test (\"yoghurt\", \"snickers\", and \"sandwich\")";
desc["variables"]["score_V"] = "The verbal (or language) score of the participant in the test (out of 100).";
desc["variables"]["score_Q"] = "The quantitative (or math) score of the participant in the test (out of 100).";

desc["variables"]["condition"] = "The weight-loss condition of the participant (\"noBreakfast\", \"noLunch\", \"noDinner\", and \"control\")";
desc["variables"]["exercise"] = "The level of exercise of the participant during the weight-loss period (\"none\", \"low\", and \"high\")";
desc["variables"]["weightLost"] = "The amount of weight lost by the participant in the weight-loss period (positive value indicates weight was lost and negative value indicates weight was gained)";
desc["variables"]["BMI"] = "The BMI (Body Mass Index) of the participant after the weight-loss period.";
