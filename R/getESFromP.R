getESFromP <- function(p = "", n1 = "", n2 = "", type = "")
{
  install.packages("compute.es");
  
  library(compute.es);
  
  
  if(p == "")
  {
    p = "0.05";
    n1 = "40";
    n2 = "40";
    type = "two";
  }
  
  
  result = pes(eval(parse(text = p)), eval(parse(text = n1)), eval(parse(text = n2)), type);
  
  # result = tes(3.14, 40, 40);
  
  list(d = result$MeanDifference[["d"]], g = result$MeanDifference[["g"]], r = result$Correlation[["r"]], p = p, n1 = n1, n2 = n2, type = type);
}
