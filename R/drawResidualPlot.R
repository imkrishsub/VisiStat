drawResidualPlot <- function(dataset, dependentVariable, independentVariables)
{
  # construct linear model
  
  dataset = as.data.frame(dataset);
  
  factorString = toFormulaString(getCombinations(independentVariables)); # the magic function(s)    
  
  formula = paste(dependentVariable, " ~ ", factorString, sep=""); # append factorString to create formula	
  formula = as.formula(formula);
  
  model = lm(formula, data = dataset);
  
  y <- residuals(model) # residuals
  x <- predict(model) #fitted values
  
  d = data.frame(x = x, y = y) # construct a data frame

  library(ggplot2)
  
  p = ggplot(d, aes(x = x, y = y)) + geom_point() + xlab("Residuals") + ylab("Fitted values");
  p = p + geom_hline(yintercept = 0);
  
  p
}