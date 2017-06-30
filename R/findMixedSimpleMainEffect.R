findMixedSimpleMainEffect <- function(wholeDataset, DV, IV, fixedIVs, fixedIVLevels, subjectID)
{
  table <- as.data.frame(wholeDataset);
  
  
  # subset the dataset
  subsetString = paste("subset(table,", fixedIVs[1], " == \"", fixedIVLevels[1], "\"", sep="")
  
  if(length(fixedIVs) > 1)
  {
    for(i in 2:length(fixedIVs))
    {
      subsetString = paste(subsetString, " & ", fixedIVs[i], " == \"", fixedIVLevels[i], "\"", sep="");
    }
  }
  
  subsetString = paste(subsetString, ")", sep="") 
  eval(parse(text = paste("table <- ", subsetString, sep="")))
  
  return(performMixedEffectsANOVA(table, DV, IV, subjectID))
}