class TestsBase {
	static generateUser() {
		return {
      email: `test${Math.random()}@test.by`,
      password: `testpass${Math.random()}`,
      firstname: `testfname${Math.random()}`,
      lastname: `testlname${Math.random()}`
		};
	}
}

module.exports = TestsBase;
