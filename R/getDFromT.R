getDFromT <- function(t = "", n1 = "", n2 = "")
{
  result = t_to_d(eval(parse(text = t)), eval(parse(text = n1)), eval(parse(text = n2)));

  
  list(d = result[1]);
}
