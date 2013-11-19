getESFromF <- function(FVal = "", n1 = "", n2 = "")
{
  
  install.packages("compute.es");
  
  library(compute.es);
  
  
  if(FVal == "")
  {
    FVal = "3.14";
    n1 = "40";
    n2 = "40";
  }
  
  
  result = fes(eval(parse(text = FVal)), eval(parse(text = n1)), eval(parse(text = n2)));
  
  # result = fes(3.14, 40, 40);
  
  list(d = result$MeanDifference[["d"]], g = result$MeanDifference[["g"]], r = result$Correlation[["r"]], FVal= FVal, n1 = n1, n2 = n2);
}
