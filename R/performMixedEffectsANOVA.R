performMixedEffectsANOVA <- function (dataset, dependentVariable, independentVariables, subject) 
{
  dataset = as.data.frame(dataset);
  
  # independentVariables = unlist(strsplit(toString(independentVariables), ", "));  
  
  factorString = toString(toFormulaString(getCombinations(independentVariables))); # the magic function(s)    
  
  formula = paste(dependentVariable, " ~ ", factorString, " + (1 |", subject, ")", sep=""); # append factorString to create formula	    
  altFormula = paste(dependentVariable, " ~ ", factorString, sep="");
  
  formula = as.formula(formula);
  
  # get model using lmerTest::lmer
  model = lmerTest::lmer(formula, data = dataset);
  
  # the stupid-loading-of-the-library-which-does-not-make-sense
  library(pbkrtest)
  
  # perform Wald's test with Kenward-Roger correction
  result = lmerTest::anova(model, ddf = "Kenward-Roger");  
  
  AOVmodel = eval(parse(text = paste("aov(", altFormula, ", data = dataset)", sep="")));
  eSquared = lsr::etaSquared(AOVmodel, type=3);
  labels = names(eSquared[,1])
  
  list(p = result[["Pr(>F)"]], F = result[["F.value"]], numDF = result[["NumDF"]], denomDF = result[["DenDF"]], etaSquared = eSquared[,1], labels = labels);
}
