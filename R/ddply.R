ddply <- function (.data, .variables, .fun = NULL, ..., .progress = "none", 
    .inform = FALSE, .drop = TRUE, .parallel = FALSE, .paropts = NULL) 
{
    if (empty(.data)) 
        return(.data)
    .variables <- as.quoted(.variables)
    pieces <- splitter_d(.data, .variables, drop = .drop)
    ldply(.data = pieces, .fun = .fun, ..., .progress = .progress, 
        .inform = .inform, .parallel = .parallel, .paropts = .paropts)
}