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
    }, 1500);
            
}