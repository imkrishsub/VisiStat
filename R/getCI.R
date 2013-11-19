getCI <- function(dataset, variableName, alpha = "0.95")
{  
  table <- as.data.frame(dataset)
        
  distribution = eval(parse(text = paste("table","$",variableName)));
  
  mean = mean(distribution);  
  sigma = sd(distribution);  
  n = length(distribution);
    
  alpha = eval(parse(text = alpha));
  z = (1 - alpha)/2;
  
  error <- qnorm(z)*sigma/sqrt(n);
  
  list(min = mean - error, max = mean + error);
}
