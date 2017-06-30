# export functions to be used globally
root = exports ? this
root.VisiStat ?= {}
root.VisiStat.UI ?= {}
root.VisiStat.UI.helpText ?= {}
root.VisiStat.UI.helpText

root.VisiStat.UI.helpText.interactionEffect3Way = (iv1, iv2, iv3, dv, isSig=true) ->
	[iv1, iv2, iv3, dv] = (fV(i) for i in [iv1, iv2, iv3, dv])
	(if isSig then \
	 	"<p>
		 	Try selecting different levels of #{iv3} in the graph above. 
		 	Notice how the lines change its slope? This indicates that 
		 	the way #{iv1} and #{iv2} influences #{dv} changes across different levels of #{iv3}.
		 	This is called <b>three-way interaction effect</b>.
	 	</p>
	 	<p>
		 	To interpret this result, you should consider the changes of #{dv} (influenced by #{iv1} and #{iv2})
		 	individually for each level of #{iv3}. 
	 	</p>
	 	" \
	 	else \
	 	"<p>
		 	Regardless of the levels of #{iv3}, the pattern of the influence of #{iv1} and #{iv2} to #{dv}
		 	are the same. In the graph above, try selecting different levels of #{iv3} to see that the slope
		 	of the lines doesn't change. This phenomenon occurs when the <b>three-way interaction effect</b> is not significant. 
	 	</p>
	 	") +
	"<p>Click the downward arrow to see two-way interaction and the main effects.</p>"


root.VisiStat.UI.helpText.interactionEffect2Way = (iv1, iv2, iv3, dv, isSig=true, isHigherSig=true) ->
	[iv1, iv2, iv3, dv] = (fV(i) for i in [iv1, iv2, iv3, dv])
	(if isSig then \
		"<p>
			 In the graph that you selected, do you notice how the lines' slope differ, or even cross each other?
			 This suggests that how #{iv1} influences #{dv} depends on the levels of #{iv2}.
			 This is called <b>two-way interaction effect</b>.
		 </p>
		 <p>
		 	 You should interpret further results by each level of #{iv2} individually.
		 </p>" \
		 else \
		 "<p>
		 	In the graph that you selected, the lines' slope do not differ.
		 	The levels of #{iv2} doesn't change how #{iv1} influences #{dv}.
		 </p>
		 ") +
	(if isHigherSig then \
	 "<p>
	 	 <b>Note:</b> The three-way interaction effect is also significant (click on upward arrow).
	 	 In your interpretation, take the three-way interaction effect into account <i>before</i> the two-way interaction
	 	 and the main effects.
 	 </p>"
	 else \
	 "") +
	"
	<p>Click the downward arrow to see the main effects. Click upward arrow to see 
		the three-way interaction effect.</p>"

root.VisiStat.UI.helpText.interactionEffectMainEffect = (iv1, iv2, iv3, dv, isSig=true, isHigherSig=true) ->
	iv3_in = iv3
	
	[iv1, iv2, iv3, dv] = (fV(i) for i in [iv1, iv2, iv3, dv])

	excludedEffectText = "<i>without</i> taking into account #{iv2}" + (if iv3_in? then " and #{iv3}" else "")

	(if isSig then \
		"<p>
			In the graph that you selected, do you notice how the mean of the #{dv} differs in different levels of #{iv1}?
			This suggests that #{iv1} influences #{dv}, #{excludedEffectText}. 
			This is called <b>main effect</b>.
		</p>" \
		 else \
		 "<p>
		 	In the graph that you selected, the mean of the #{dv} do not differ in different levels of #{iv1}, #{excludedEffectText}. 
		 	This suggests that #{iv1} doesn't influences #{dv}.
		 </p>
		 ") +
	(if isHigherSig then \
		"
		<p>
			<b>Note:</b> Some of the two- or three-way interaction effects are also significant.
			In your interpretation, take these interaction effect into account <b>before</b> interpreting the main effect.
		</p>
		"
		else \
		"") +
	"<p>Click upward arrow to see the two-way and the three-way interaction effect.</p>"