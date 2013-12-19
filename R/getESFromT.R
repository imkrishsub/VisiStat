getESFromT <- function(t = "", n1 = "", n2 = "")
{
result = tes(eval(parse(text = t)), eval(parse(text = n1)), eval(parse(text = n2)));
  
  # result = tes(3.14, 40, 40);
  
  list(d = result$MeanDifference[["d"]], g = result$MeanDifference[["g"]], r = result$Correlation[["r"]], t= t, n1 = n1, n2 = n2);
}
