performShapiroWilkTest <- function(distribution)
{  
  dist <- c(distribution); 
  
  result <- eval(parse(text = paste("shapiro.test(dist)")));
  
  list(testStatistic = result$statistic[["W"]], p = result$p.value, method = result$method);
}
