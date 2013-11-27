loadFile <- function(filePath)
{
    fileType = substr(filePath, nchar(filePath) - 3 + 1, nchar(filePath));
    
    if(fileType == "txt")
        dataset <- read.table(filePath, head=T);
    if(fileType == "csv")
        dataset <- read.csv(filePath, head=T);
        
    dataset[is.na(dataset)] = "null";
    
    variableNames = names(dataset);
    
    list(dataset = dataset, variableNames = variableNames);
    
}