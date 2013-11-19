getQQPlotCoordinates <- function(dataset = "", columnName = "")
{
  if(dataset == "")
  {   
    dataset = "beaver1";
    columnName = "time";
  }
  else if(columnName == "")
  {
    # Load the first column name by default
    columnName = names(eval(parse(text = dataset)))[1]; 
  }
      
  distribution = eval(parse(text = paste(dataset,"$",columnName)));   
  
  coordinates = qqnorm(distribution);
  
  list(x = coordinates[["x"]], y = coordinates[["y"]], dataset = dataset, columnName = columnName);
}
