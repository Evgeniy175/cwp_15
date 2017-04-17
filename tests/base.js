class TestsBase {
	static generateUser() {
    return {
      email: `test${TestsBase.getRandomNumber()}@test.by`,
      password: `testpass${TestsBase.getRandomNumber()}`,
      firstname: `testfname${TestsBase.getRandomNumber()}`,
      lastname: `testlname${TestsBase.getRandomNumber()}`
		};
	}

	static generateDomain() {
    return {
      name: `test${TestsBase.getRandomNumber()}.com`
		};
	}

  static getRandomNumber() {
    return Math.floor(Math.random() * 1000000);
  }
}

module.exports = TestsBase;
