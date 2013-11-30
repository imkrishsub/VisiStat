function initiateLoadingDatasetAnimation()
{
    var canvas = d3.select("#plotCanvas");
    
    if(document.getElementsByClassName("loadingAnimation").length > 0)
            removeElementsByClassName("loadingAnimation");
            
    var t = canvas.append("text")
        .attr("x", canvasWidth/2)
        .attr("y", canvasHeight/2)
        .attr("text-anchor", "middle")
        .attr("font-size", "32px")
        .text("Loading data")
        .attr("id", "loadingData")
        .attr("class", "loadingAnimation");

    t.transition().duration(500).attr("opacity", "0.3");

    t.transition().delay(500).duration(500).attr("opacity", "1.0");

    t.transition().delay(1000).duration(500).attr("opacity", "0.3");
    
    canvas.append("image")
            .attr("x", canvasWidth/2)
            .attr("y", canvasHeight/4)
            .attr("xlink:href", "images/loading.gif")
            .attr("height", "50")
            .attr("width", "50")
            .attr("class", "loadingAnimation");
            
    loadingDataAnimation = setInterval(function()
    {
        if(document.getElementsByClassName("loadingAnimation").length > 0)
            removeElementsByClassName("loadingAnimation");
            
        var t = canvas.append("text")
            .attr("x", canvasWidth/2)
            .attr("y", canvasHeight/2)
            .attr("text-anchor", "middle")
            .attr("font-size", "32px")
            .text("Loading data")
            .attr("id", "loadingData")
            .attr("class", "loadingAnimation");
        
        t.transition().duration(500).attr("opacity", "0.3");
        
        t.transition().delay(500).duration(500).attr("opacity", "1.0");
        
        t.transition().delay(1000).duration(500).attr("opacity", "0.3");
        
        var X = canvasWidth/2;
        var Y = canvasHeight/4;
    }, 1500);
            
}