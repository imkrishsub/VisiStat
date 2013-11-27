getData <- function(dataset, columnName, filePath)
{  
    list(data = eval(parse(text = paste("dataset","$",columnName))));
}