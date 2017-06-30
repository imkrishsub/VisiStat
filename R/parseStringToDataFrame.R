parseStringToDataFrame <- function (content) 
{
	dataset = data.frame(read.table(textConnection(content), header=T, sep=","));
	variableNames = names(dataset);

	list(dataset = dataset, variableNames = variableNames);   
}