readFile <- function(filePath, ...){
  if(!grepl(".txt$", filePath)){
    stop("Uploaded file must be a .txt file!")
  }
  read.table(file, ...);
}