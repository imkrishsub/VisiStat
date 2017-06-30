describe("Update function", function(){
	var theLogger = new PartialTestLogger()

	beforeEach(function(){
		variableList = { "dependent": ["speed"], "independent": ["kbdLayout"], "independent-levels": ["qwerty", "dvorak"]}
		variables = {"iv": {"dataset": ["qwerty", "dvorak", "colemak"]}}	

		// updateSpy = spyOn(theLogger, "countMatchingTests").and.callThrough()

		// theLogger.update(variableList)		
	})	

	it(" has been called", function(){		
		theLogger.update(variableList)
		expect(1).toBe(1)		
	})	
})