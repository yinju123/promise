Object.keys(thenables.fulfilled).forEach(function (outerStringRepresentation) {
    var outerThenableFactory = thenables.fulfilled[outerStringRepresentation];

    Object.keys(thenables.fulfilled).forEach(function (innerStringRepresentation) {
        var innerThenableFactory = thenables.fulfilled[innerStringRepresentation];

        var stringRepresentation = outerStringRepresentation + " for " + innerStringRepresentation;

        function yFactory() {
            return outerThenableFactory(innerThenableFactory(sentinel));
        }

        testCallingResolvePromiseFulfillsWith(yFactory, stringRepresentation, sentinel);
    });
});