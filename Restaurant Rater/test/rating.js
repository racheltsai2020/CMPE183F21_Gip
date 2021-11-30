var Rating = artifacts.require("./Rating.sol");

contract("Rating", function(accounts) {
  var ratingInstance;

  //checks if there are 3 restaurants
  it("initializes with three restaurants", function() { 
    return Rating.deployed().then(function(instance) {
      return instance.restaurantsCount();
    }).then(function(count) {
      assert.equal(count, 3);
    });
  });

  //restaurant is rated correctly
  it("it initializes the restaurants with the correct values", function() {
    return Rating.deployed().then(function(instance) {
      ratingInstance = instance;
      return ratingInstance.restaurants(1);
    }).then(function(restaurant) { //checks if restaurant 1 is rated correctly
      assert.equal(restaurant[0], 1, "contains the correct id");
      assert.equal(restaurant[1], "Gong Cha", "contains the correct name");
      assert.equal(restaurant[2], 0, "contains the correct rates count");
      assert.equal(restaurant[3], 0, "contains the correct total food stars");
      assert.equal(restaurant[4], 0, "contains the correct average food rating");
      assert.equal(restaurant[5], 0, "contains the correct total service stars");
      assert.equal(restaurant[6], 0, "contains the correct average service stars");
      assert.equal(restaurant[7], 0, "contains the correct total environment stars");
      assert.equal(restaurant[8], 0, "contains the correct average environment stars");
      return ratingInstance.restaurants(2);
    }).then(function(restaurant) { //checks if restaurant 2 is rated correctly
      assert.equal(restaurant[0], 2, "contains the correct id");
      assert.equal(restaurant[1], "Philz Coffee", "contains the correct name");
      assert.equal(restaurant[2], 0, "contains the correct rates count");
      assert.equal(restaurant[3], 0, "contains the correct total food stars");
      assert.equal(restaurant[4], 0, "contains the correct average food rating");
      assert.equal(restaurant[5], 0, "contains the correct total service stars");
      assert.equal(restaurant[6], 0, "contains the correct average service stars");
      assert.equal(restaurant[7], 0, "contains the correct total environment stars");
      assert.equal(restaurant[8], 0, "contains the correct average environment stars");
      return ratingInstance.restaurants(3);
    }).then(function(restaurant) { //checks if restaurant 3 is rated correctly
      assert.equal(restaurant[0], 3, "contains the correct id");
      assert.equal(restaurant[1], "Spoonfish Poke", "contains the correct name");
      assert.equal(restaurant[2], 0, "contains the correct rates count");
      assert.equal(restaurant[3], 0, "contains the correct total food stars");
      assert.equal(restaurant[4], 0, "contains the correct average food rating");
      assert.equal(restaurant[5], 0, "contains the correct total service stars");
      assert.equal(restaurant[6], 0, "contains the correct average service stars");
      assert.equal(restaurant[7], 0, "contains the correct total environment stars");
      assert.equal(restaurant[8], 0, "contains the correct average environment stars");
    });
  });

  //checks if the number of votes increases everytime a customer rates
  it("allows a customer to cast a rating", function() { 
    return Rating.deployed().then(function(instance) {
      ratingInstance = instance;
      restaurantId = 1;
      foodRating = 0;
      serviceRating = 0;
      environmentRating = 0;
      return ratingInstance.rate(restaurantId, foodRating, serviceRating, environmentRating, { from: accounts[0] });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "an event was triggered");
      assert.equal(receipt.logs[0].event, "ratedEvent", "the event type is correct");
      assert.equal(receipt.logs[0].args._restaurantId.toNumber(), restaurantId, "the restaurant id is correct");
      return ratingInstance.restaurants(accounts[0]);
    }).then(function(voted) {
      assert(voted, "the voter was marked as voted");
      return ratingInstance.restaurants(restaurantId);
    }).then(function(restaurant) {
      console.log("rate count: ", restaurant[2]);
      var rateCount = restaurant[2];
      assert.equal(rateCount, 1, "increments the Restaurant's rate count");
    })
  });
  
  //throw an error if user choose invalid restaurant
  it("throws an exception for invalid restaurant", function() {
    return Rating.deployed().then(function(instance) {
      ratingInstance = instance;
      return ratingInstance.rate(99, { from: accounts[1] })
    }).then(assert.fail).catch(function(error) {
      assert(error.message, "error message must contain revert");
      return ratingInstance.restaurants(1);
    }).then(function(restaurant1) {
      var ratingCount = restaurant1[2];
      assert.equal(ratingCount, 1, "restaurant 1 did not receive any rates");
      return ratingInstance.restaurants(2);
    }).then(function(restaurant2) {
      var ratingCount = restaurant2[2];
      assert.equal(ratingCount, 0, "restaurant 2 did not receive any rates");
    });
  });


});
