loadFile <- function(fileName)
{
    # fileType = substr(filePath, nchar(filePath) - 3 + 1, nchar(filePath));
    
    # if(fileType == "txt")
    #     dataset <- read.table(filePath, head=T);
    # if(fileType == "csv")
    #     dataset <- read.csv(filePath, head=T);

    fileName = eval(parse(text = eval(parse(text = paste("data(", fileName, ")", sep="")))));
    
    variableNames = names(fileName);
    
    list(dataset = fileName, variableNames = variableNames);    
}