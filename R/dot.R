. <- function (..., .env = parent.frame()) 
{
    structure(as.list(match.call()[-1]), env = .env, class = "quoted")
}