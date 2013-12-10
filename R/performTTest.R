performTTest <- function(filePath, groupA, groupB, paired = "FALSE", alternative = "two.sided", alpha = 0.95, variance = "FALSE")
{
  groupA <- c(groupA);
  groupB <- c(groupB);
  
  paired <- eval(parse(text = paired));
  variance <- eval(parse(text = variance));
  
  result = eval(parse(text = paste("t.test(groupA, groupB, alternative=\"two.sided\", paired=",paired,",var.equal=",variance,")",sep="")));
  
  require(MBESS);
  d = abs(smd(groupA, groupB));
  
  list(p=result$p.value, 
  t=result$statistic[["t"]], 
  DOF=result$parameter[["df"]], 
  CI_mean=result$conf.int, 
  method=result$method, 
  alpha = alpha,
  mean = result$estimate,
  d = d);
}
