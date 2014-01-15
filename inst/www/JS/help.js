//settings
var desc = new Object();
desc["Histogram"] = "Shows the distribution of the data by clustering data into different bins. Hover over each bar to see the number of participants corresponding to the bar. Histogram is useful for viewing the shape of the distribution. ";
desc["Boxplot"] = "Boxplot shows the distribution of the data. It is useful for seeing the central tendency of the distribution. Hover over individual entities of the boxplot to get more help. ";
desc["Scatterplot"] = "It is a simple plot of one variable against the other variable. If you select an additional variable that has a fixed number of values, a color boxplot is drawn with the different values of the third variable mapped to different colors (See legend on top-right for inference).";
desc["Scatterplot-matrix"] = "A Scatterplot-matrix is an extension of scatterplot. It plots variables pairwise against each other. The color of a cell indicatest the correlation between the variables involved (darker shade of green => more correlation). ";

desc["regressionLine"] = "A regression line is a model that is fit to the given data so that the sum of squares of errors (distance of points from regression line) is minimum. In multiple regression, the variability due to the other causal variables is also taken into account.";
desc["equation"] = "An equation defines the regression model that is fit to the data. This can be used to predict the value of the outcome variable from the explanatory/causal variables.";
desc["p-value"] = "P-value is the probability of obtaining the data that you got given the null hypothesis is true (i.e., there is no effect). Hence, if the p-value is low (<0.05 at 95% significance level), it must mean that the null hypothesis is false (i.e., there is some effect!)";

desc["parameter"] = new Object();
desc["parameter"]["t"] = "The t-statistic is a ratio of the departure of an estimated parameter from its notional value and its standard error.";
desc["parameter"]["F"] = "The F-statistic is the ratio of variance between treatments to the variance within treatments.";
desc["parameter"]["cS"] = "The chi-square statistic is a normalized sum of squared deviations between observed and theoretical frequencies.";
desc["parameter"]["U"] = "";
desc["parameter"]["V"] = "";
desc["parameter"]["z"] = "";

desc["method"] = new Object();

desc["method"]["WT"] = "Welch's t-test is used when there are 2 conditions are compared and they are unpaired (i.e., between-groups factor). Welch's t-test is the alternative to unpaired t-test when homogeneity of variances is not met (i.e., the distributions have unequal variances). It still requires the distributions to be normal.";
desc["method"]["pT"] = "A paired t-test is used when there are 2 conditions are compared and they are paired (i.e., within-groups factor). Paired t-test can be used only when the distributions are normal and homogeneity of variances is met (i.e., the distributions have equal variances). However, since there is no alternative when homogeneity of variances is not met, a paired t-test is used even then.";
desc["method"]["upT"] = "An unpaired t-test is used when there are 2 conditions are compared and they are unpaired (i.e., between-groups factor). Unpaired t-test can be used only when the distributions are normal and homogeneity of variances is met (i.e., the distributions have equal variances).";
desc["method"]["mwT"] = "Mann–Whitney U test (also called the Wilcoxon rank-sum test) is used when 2 conditions are compared and they are unpaired (i.e., between-groups factor). It is an alternative test for unpaired t-test. It is used when the distributions are not normal. It still requires the homogeneity of variances to hold (i.e., the distributions should have equal variance).";
desc["method"]["wT"] = "Wilcoxon signed-rank test is used when 2 conditions are compared and they are paired (i.e., within-groups factor). It is an alternative test for paired t-test. It is used when the distributions are not normal. It still requires the homogeneity of variances to hold (i.e., the distributions should have equal variance).";

desc["method"]["owA"] = "One-way ANOVA is used when 3 or more conditions are compared and the independent variable is a between-groups factor (different participants are used for different conditions). It can be used when the distributions are normal and when homogeneity of variances is met (i.e., the distributions have equal variances).";
desc["method"]["twA"] = "Two-way ANOVA is used when there are 2 independent variables (both must be between-groups factor) and a dependent variable. It is used to see the effect of each independent variable on the dependent variable as well as the interaction between the independent variables.";
desc["method"]["owrA"] = "One-way repeated-measures ANOVA is used when 3 or more conditions are compared and the independent variable is a within-groups factor (same set of participants for all conditions). It can be used when the distributions are normal and when homogeneity of variances is met (i.e., the distributions have equal variances.)";
desc["method"]["fA"] = "Mixed-design ANOVA is used when there are 2 independent variables (one between-groups factor and one within-groups factor) and a dependent variable. it is used to see the effect of each independent variable on the dependent variable as well as the interaction between the two independent variables.";
desc["method"]["fT"] = "Friedman's test is used when 3 or more conditions are compared and the independent variable is a within-groups factor (same set of participants for all conditions). It is an alternative for one-way repeated-measures ANOVA. It can be used even when the distributions are not normal but requires the homogeneity of variances to be met (i.e., the distributions must have equal variances).";
desc["method"]["WA"] = "Welch's ANOVA is used when 3 or more conditions are compared and the independent variable is a between-groups factor (different participants are used for different conditions). It is an alternative to the one-way ANOVA. It can be used used when homogeneity of variances is not met (i.e., the distributions have unequal variances). It still requires the distributions to follow normal distributions.";
desc["method"]["kwT"] = "Kruskal-Wallis test is used when 3 or more conditions are compared and the independent variable is a between-groups factor (different participants are used for different conditions). It is an alternative to the one-way ANOVA. It can be used used when distributions are not normal. However, it requires homogeneity of variances to be met (i.e., the distributions must have equal variances)."; 

desc["method"]["pC"] = "Pearson's correlation coefficient is used to find correlation (the change in one variable as the other variable changes) between two ratio variables. It has a range of -1 to +1. -1 implies that one variable decreases as the other increases (negative correlation) and +1 implies one variable increases as the other increases (positive correlation). 0 implies there is no dependence between the two variables.";
desc["method"]["kC"] = "Kendall's correlation coefficient is used to find correlation (the change in one variable as the other variable changes) when an interval variable is present. It has a range of -1 to +1. -1 implies that one variable decreases as the other increases (negative correlation) and +1 implies one variable increases as the other increases (positive correlation). 0 implies there is no dependence between the two variables.";
desc["method"]["bC"] = "Biserial correlation coefficient is used to find correlation (the change in one variable as the other variable changes) when one of the variables is binary (can take only two values). It has a range of -1 to +1. -1 implies that one variable decreases as the other increases (negative correlation) and +1 implies one variable increases as the other increases (positive correlation). 0 implies there is no dependence between the two variables.";

desc["method"]["ptT"] = "Post-hoc tests are used as a follow up to the significance tests (like t-test or ANOVA). Pairwise t-tests can be used to compare two conditions when both normality of distributions and homogeneity of variances are met.";
desc["method"]["pwT"] = "Post-hoc tests are used as a follow up to the significance tests (like t-test or ANOVA). Pairwise t-tests can be used to compare two conditions when homogeneity of variances is met. It doens't require the distributions to be normal.";

desc["method"]["linR"] = "Linear regression is used to construct a model (usually a line) to predict the outcome variable from the causal/explanatory variable.";
desc["method"]["mulR"] = "Multiple regression is an extension of linear regression where we construct a model to predict the outcome variable from multiple causal/explanatory variables.";

desc["effect-size"] = new Object();

desc["effect-size"]["d"] = "Cohen's d is an effect size. It indicates the difference between the means of two distributions in terms of the pooled standard deviation. 0.2, 0.5, and 0.8 are considered as general guidelines for small, medium, and large effect sizes respectively.";
desc["effect-size"]["r"] = "Pearson's correlation coefficient r is the measure of correlation between two distributions. -1 indicates a perfect negative correlation, +1 indicates a perfect positive correlation, and 0 indicates no relation.";
desc["effect-size"]["eS"] = "Eta squared value describes the amount of variance accounted for in the sample.";
desc["effect-size"]["𝜏"] = "It is a measure of rank correlation, i.e., the similarity of the orderings of the data when ranked by each of the quantities. It is named after Maurice Kendall, who developed it in 1938.";
desc["effect-size"]["rS"] = "R squared values describes the amount of variance accounted for in the sample. In case of simple linear regression, it is the square of the pearson's correlation coefficient r.";

desc["assumptions"] = new Object(); 

desc["assumptions"]["normality"] = "This assumption checks if the distributions of the group are normal distributions (i.e., if they follow a Gaussian distribution characteristic of a bell-curve).";
desc["assumptions"]["homogeneity"] = "Homogeneity of variances means that the variances of the distributions are roughly the same.";

desc["variancePlot"] = "This plot compares the variances of the distributions. If the bars are green in color, the distributions have approximately same variance (homogeneity of variance). If the bars are in red, the distributions have different variances (heterogeneity of variances).";
desc["normalityPlot"] = "The shape of the curve indicates the type of distribution. Normal/Gaussian distributions are characterised by a bell-curve. Distributions that are approximately normal are plotted in green, whereas distributions that are not normal are plotted in red.";

desc["compareMean"] = "Click on this to selects means of the distributions you want to compare.";
desc["compareNow"] = "Click on this to compare the means! Make sure at least 2 means are selected!";
desc["tukeyHSD"] = "Click on this to perform a Tukey's HSD test. This pairwise-compares each level of the plot against every other level in the boxplot.";
desc["pairwisePostHoc"] = "Click on this to select means of the two levels you want to perform a pairwise post-hoc test on.";
desc["regression"] = "Click on this to construct a regression model (predicting a variable from other variable(s)).";

desc["variables"] = new Object();

desc["variables"]["participantID"] = "The ID of the participant";
desc["variables"]["keyboardLayout"] = "The keyboard layout used by the participant (\"QWERTY\", \"DVORAK\", \"i10\")";
desc["variables"]["gender"] = "The gender of the participant";
desc["variables"]["typingSpeed"] = "The typing speed of the participant in Words Per Minute (WPM).";
desc["variables"]["errors"] = "The number of errors made by the participant in a minute";
desc["variables"]["userSatisfaction"] = "The rating given by the participant after using the keyboard layout.";

desc["variables"]["phoneOS"] = "The OS used by the participant (iOS, android, or windows)";
desc["variables"]["happScore"] = "The happiness score of the participant (out of 100)";
desc["variables"]["stressScore"] = "The stress score of the participant (out of 100)";
desc["variables"]["satisfaction"] = "The rating given by the participant after using the keyboard layout.";