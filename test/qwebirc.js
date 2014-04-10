describe("Core qwebirc methods", function() {
    it("qwebirc.ready()", function(done) {
        var spy = sinon.spy();
        qwebirc.ready(spy);
        setTimeout(function() {
            expect(spy.callCount).to.be.equal(1);
            done();
        }, 1000);
    });
});