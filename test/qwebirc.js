describe("Core qwebirc methods", function() {
    it("qwebirc.ready()", function(done) {
        var spy = sinon.spy();
        qwebirc.ready(spy);

        var spy2 = sinon.spy();
        qwebirc.ready(spy2, 1, 2, 3, 4, 5);
        setTimeout(function() {
            expect(spy.callCount).to.be.equal(1);
            expect(spy2.getCall(0).args).to.eql([1, 2, 3, 4, 5]);
            done();
        }, 1000);
    });
});