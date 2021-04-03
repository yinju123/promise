var sentinel = { sentinel: "sentinel" };



let yf = function (value) {
    return {
        then: function (onFulfilled) {
            setTimeout(function () {
                onFulfilled(value);
            }, 0);
        }
    };
}

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


function testCallingResolvePromiseFulfillsWith(yFactory, stringRepresentation, fulfillmentValue) {
    testCallingResolvePromise(yFactory, stringRepresentation, function (promise, done) {
        promise.then(function onPromiseFulfilled(value) {
            assert.strictEqual(value, fulfillmentValue);
            done();
        });
    });
}


function testCallingResolvePromise(yFactory, stringRepresentation, test) {
    describe("`y` is " + stringRepresentation, function () {
        describe("`then` calls `resolvePromise` synchronously", function () {
            function xFactory() {
                return {
                    then: function (resolvePromise) {
                        resolvePromise(yFactory());
                    }
                };
            }

            testPromiseResolution(xFactory, test);
        });
    });
}


function testPromiseResolution(xFactory, test) {
    specify("via return from a fulfilled promise", function (done) {
        var promise = resolved(dummy).then(function onBasePromiseFulfilled() {
            return xFactory();
        });

        test(promise, done);
    });
}


