checkForDataTransformationsToSatisfyHomoscedasticity <- function(dataset, DV, IVs)
{   
  table <- as.data.frame(dataset)
  transformations = c("log", "sqrt", "cube", "reciprocal");
  distribution = eval(parse(text = paste("as.vector(table$", DV, ")", sep="")))  
  formulaString = paste(" ~ factor(table$", IVs[1], ")", sep="");
  
  for(i in 2:length(IVs))
  {
    if(length(IVs)>1)
    {
      formulaString = paste(formulaString, " * factor(table$", IVs[i], ")", sep="")
    }
  }
  
  type = "none";
  
  for(i in 1:length(transformations))
  {
    if(transformations[i] == "log")
    {      
      temp = log10(distribution)          
      temp[which(is.infinite(temp))] = 0  # remove all -Inf     
      
      if(length(unique(temp)) != 1)
      {
        result <- eval(parse(text = paste("car::leveneTest(temp ", formulaString, ")", sep="")));        
        
        if(!is.nan(result[["Pr(>F)"]][1]))    
        {
          if(result[["Pr(>F)"]][1] > 0.05)
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
     
      if(type!="none")
        break;
    }
    if(transformations[i] == "sqrt")
    {      
      temp = sqrt(distribution)     
      
      if(length(unique(temp)) != 1)
      {
        result <- eval(parse(text = paste("car::leveneTest(temp", formulaString, ")", sep="")));        

        if(!is.nan(result[["Pr(>F)"]][1]))    
        {         
          if(result[["Pr(>F)"]][1] > 0.05)
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
      
      if(type!="none")
        break;
    }
    if(transformations[i] == "cube")
    {      
      temp = distribution^(1/3)      
      
      if(length(unique(temp)) != 1)
      {
        result <- eval(parse(text = paste("car::leveneTest(temp", formulaString, ")", sep="")));
        
        if(!is.nan(result[["Pr(>F)"]][1]))    
        {
          if(result[["Pr(>F)"]][1] > 0.05)
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
      
      if(type!="none")
        break;
    }
    if(transformations[i] == "reciprocal")
    {      
      temp = 1/distribution
      temp[which(is.infinite(temp))] = 0  # remove all -Inf
      
      if(length(unique(temp)) != 1)
      {
        result <- eval(parse(text = paste("car::leveneTest(temp", formulaString, ")", sep="")));        
        
        if(!is.nan(result[["Pr(>F)"]][1]))    
        {
          if(result[["Pr(>F)"]][1] > 0.05)
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
      
      if(type!="none")
        break;
    }
  }
  
  list(type = type);
}