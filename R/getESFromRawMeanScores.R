getESFromRawMeanScores <- function(m1 = "", m2 = "",  sd1 = "", sd2 = "", n1 = "", n2 = "")
{
  if(m1 == "")
  {
    m1 = "2.4";
    m2 = "5.4";
    n1 = "40";
    n2 = "40";
    sd1 = "5";
    sd2 = "3.5";
  }
  
  
  # result = mes(eval(parse(text = m1)), eval(parse(text = m2)), eval(parse(text = sd1)), eval(parse(text = sd2)), eval(parse(text = n1)), eval(parse(text = n2)));
  result = mes(2.4, 5.4, 5, 3, 40, 40);
  
  list(d = result$MeanDifference[["d"]], g = result$MeanDifference[["g"]], r = result$Correlation[["r"]], m1 = m1, m2 = m2, sd1 = sd1, sd2 = sd2, n1 = n1, n2 = n2);
}
