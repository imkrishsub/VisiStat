performKruskalWallisTest <- function(dependentVariable, independentVariable)
{
  dependentVariable <- c(dependentVariable);
  independentVariable <- c(independentVariable);
  
  independentVariable <- as.factor(independentVariable);
  
  result <- eval(parse(text = paste("kruskal.test(dependentVariable ~ independentVariable)"))); 
  
  etaSq = result$statistic[["Kruskal-Wallis chi-squared"]]/(length(independentVariable)-1);
  
  list(ChiSquared = result$statistic[["Kruskal-Wallis chi-squared"]], DF = result$parameter[["df"]], p = result$p.value, etaSquared = etaSq);
}
