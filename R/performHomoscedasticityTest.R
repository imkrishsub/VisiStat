performHomoscedasticityTest <- function(dataset, DV, IVs)
{  
  table <- as.data.frame(dataset)   
  formulaString = paste(DV, "~",sep="");
  
  for(i in 1:length(IVs))
  {
    eval(parse(text = paste("table$", IVs[i], " = as.factor(table$", IVs[i], ")", sep="")))
    if(i == 1)
      formulaString = paste(formulaString, "factor(", IVs[i], ")", sep="")
    else
      formulaString = paste(formulaString, "*", "factor(", IVs[i], ")",  sep="")
  }    
  result <- eval(parse(text = paste("car::leveneTest(", formulaString, ", data = table, center = \"mean\")", sep="")));
  
  list(p = result[["Pr(>F)"]][[1]]);
}
