const HelloWorld = artifacts.require("HelloWorld");

contract("HelloWorld", (accounts) => {
  let helloWorldInstance;

  before(async () => {
    // Deploy a fresh instance before tests
    helloWorldInstance = await HelloWorld.new();
  });

  it("Should set and get name correctly", async () => {
    // Get initial name
    let result = await helloWorldInstance.yourName();
    assert.equal(result, "Unknown", "Initial name should be Unknown");

    // Set name
    await helloWorldInstance.setName("User Name");

    // Get updated name
    result = await helloWorldInstance.yourName();

    // Assert
    assert.equal(result, "User Name", "Name was not set correctly");
  });
});
