performHomoscedasticityTest <- function(dependentVariable, independentVariable, dataset)
{  
  table <- as.data.frame(dataset) 
  
  result <- eval(parse(text = paste("levene.test(table$",dependentVariable,", table$", independentVariable, ",location = \"mean\")")));
  
  list(testStatistic = result$statistic[["Test Statistic"]], p = result$p.value, method = result$method, data = toString(dataset));
}
