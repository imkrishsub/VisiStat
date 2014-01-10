performTTest <- function(filePath, groupA, groupB, paired = "FALSE", alternative = "two.sided", alpha = 0.95, variance = "FALSE")
{
  groupA <- c(groupA);
  groupB <- c(groupB);
  
  result = findError(c(list(groupA), list(groupB)));
  error =  result$error;
  
  paired <- eval(parse(text = paired));
  variance <- eval(parse(text = variance));
  
  result = eval(parse(text = paste("t.test(groupA, groupB, alternative=\"two.sided\", paired=",paired,",var.equal=",variance,")",sep="")));
  
  d = abs(smd(groupA, groupB));
  
  list(p=result$p.value, 
  t=result$statistic[["t"]], 
  DOF=result$parameter[["df"]], 
  error = error,
  method=result$method, 
  alpha = alpha,
  mean = result$estimate,
  d = d);
}
