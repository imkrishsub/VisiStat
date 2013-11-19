# A simple R function that runs whatever R code is sent to it :)
runThisRCode <- function(code = "")
{
  if(code == "")
  {
    stop("You didn't enter any code! X-(");
  }
  else
  {
    list(value = eval(parse(text = code)))
  }
}
  
