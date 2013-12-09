function initiateLoadingDatasetAnimation()
{
    var canvas = d3.select("#plotCanvas");
    
    if(document.getElementsByClassName("loadingAnimation").length > 0)
            removeElementsByClassName("loadingDataset");
            
    canvas.append("text")
        .attr("x", canvasWidth/2)
        .attr("y", canvasHeight/2)
        .attr("text-anchor", "middle")
        .attr("font-size", "32px")
        .text("Loading data")
        .attr("id", "text")
        .attr("class", "loadingAnimation");    
    canvas.append("image")
            .attr("x", canvasWidth/2 - loadingImageSize/2)
            .attr("y", canvasHeight/4)
            .attr("xlink:href", "images/loading.gif")
            .attr("height", loadingImageSize)
            .attr("width", loadingImageSize)
            .attr("id", "image")
            .attr("class", "loadingAnimation");            
}