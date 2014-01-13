ldply <- function (.data, .fun = NULL, ..., .progress = "none", .inform = FALSE, 
    .parallel = FALSE, .paropts = NULL) 
{
    if (!inherits(.data, "split")) 
        .data <- as.list(.data)
    res <- llply(.data = .data, .fun = .fun, ..., .progress = .progress, 
        .inform = .inform, .parallel = .parallel, .paropts = .paropts)
    list_to_dataframe(res, attr(.data, "split_labels"))
}