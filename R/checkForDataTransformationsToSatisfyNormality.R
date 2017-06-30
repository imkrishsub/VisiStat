checkForDataTransformationsToSatisfyNormality <- function(distributions)
{   
  numberOfDistributions = length(distributions);  
  transformations = c("log", "sqrt", "cube", "reciprocal");
  
  type = "none";
  
  for(i in 1:length(transformations))
  {    
    if(transformations[i] == "log")
    {      
      for(k in 1:numberOfDistributions)
      {
        temp = log10(distributions[[k]])
        temp[which(is.infinite(temp))] = 0  # remove all -Inf
        
        if(length(unique(temp)) != 1)
        {
          result <- shapiro.test(temp);
          if(!is.nan(result$p.value))    
          {
            if(result$p.value > 0.05)
            {
              type = "log";
            }
            else
            {
              type = "none";
              break;
            }
          }
        }
      }
      if(type!="none")
        break;
    }
    if(transformations[i] == "sqrt")
    {	
      for(k in 1:numberOfDistributions)
      {
        temp = sqrt(distributions[[k]])
        
        if(length(unique(temp)) != 1)
        {
          result <- shapiro.test(temp);
          if(!is.nan(result$p.value))    
          {
            if(result$p.value > 0.05)
            {
              type = "sqrt";
            }
            else
            {
              type = "none";
              break;
            }
          }
        }
      }
      
      if(type!="none")
        break;
    }
    if(transformations[i] == "cube")
    {	
      for(k in 1:numberOfDistributions)
      {
        temp = distributions[[k]]^(1/3)
        
        if(length(unique(temp)) != 1)
        {
          result <- shapiro.test(temp);
          if(!is.nan(result$p.value))    
          {
            if(result$p.value > 0.05)
            {
              type = "cube";
            }
            else
            {
              type = "none";
              break;
            }
          }
        }
      }
      if(type!="none")
        break;
    }
    if(transformations[i] == "reciprocal")
    {
      for(k in 1:numberOfDistributions)
      {
        temp = 1/distributions[[k]]
        temp[which(is.infinite(temp))] = 0  # remove all -Inf
        
        if(length(unique(temp)) != 1)
        {
          result <- shapiro.test(temp);
          if(!is.nan(result$p.value))    
          {
            if(result$p.value > 0.05)
            {
              type = "reciprocal";
            }
            else
            {
              type = "none";
              break;
            }
          }
        }
      }
      if(type!="none")
        break;
    }
  }
  
  list(type = type);
}