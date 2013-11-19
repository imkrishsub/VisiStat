getESFromChiSquared <- function(ChiSquared = "", n = "")
{
  
  install.packages("compute.es");
  
  library(compute.es);
  
  
  if(ChiSquared == "")
  {
    ChiSquared = "3.14";
    n = "40";
  }
  
  
  result = chies(eval(parse(text = ChiSquared)), eval(parse(text = n)));
  
  # result = tes(3.14, 40, 40);
  
  list(d = result$MeanDifference[["d"]], g = result$MeanDifference[["g"]], r = result$Correlation[["r"]], ChiSquared = ChiSquared, n = n);
}
