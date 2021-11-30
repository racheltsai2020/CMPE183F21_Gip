App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },


  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Rating.json", function(rating) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Rating = TruffleContract(rating);
      // Connect provider to interact with contract
      App.contracts.Rating.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Popup alert for successfully rating a restaurant
  popup: function(currentFoodRating,currentServiceRating,currentEnvironRating){
    window.alert('You successfully rated the restaurant! \n Food Quality: ' + currentFoodRating
                  + '\n Service Quality: '+ currentServiceRating
                  + '\n Environment Cleanliness: ' + currentEnvironRating);
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Rating.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.ratedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new rating is recorded
        App.render();
      });
    });
  },

  render: function() {
    var ratingInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show(); //show loading
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });


    // Load contract data
    App.contracts.Rating.deployed().then(function(instance) {
      ratingInstance = instance;
      return ratingInstance.restaurantsCount();
    }).then(function(restaurantsCount) {
      var restaurantsResults = $("#restaurantsResults");
      restaurantsResults.empty();

      var restaurantsSelect = $('#restaurantsSelect');
      restaurantsSelect.empty();


      //get restaurant information
      for (var i = 1; i <= restaurantsCount; i++) {
        ratingInstance.restaurants(i).then(function(restaurant) {
          var id = restaurant[0];
          var name = restaurant[1];
          var ratingCount = restaurant[2];
          var foodQuality = restaurant[4];
          var serviceQuality = restaurant[6];
          var environQuality = restaurant[8];

          // Render restaurant Result
          var restaurantTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + ratingCount + "</td>" +
              "<td><div class='stars-outer'><div class='stars-inner' style='width:" + foodQuality*20 + "%' ></div></div></td>" +
              "<td><div class='stars-outer'><div class='stars-inner' style='width:" + serviceQuality*20 + "%' ></div></div></td>" +
              "<td><div class='stars-outer'><div class='stars-inner' style='width:" + environQuality*20 + "%' ></div></div></td></tr>";

          restaurantsResults.append(restaurantTemplate);

          // Render restaurant options
          var restaurantOption = "<option value='" + id + "' >" + name + "</ option>"
          restaurantsSelect.append(restaurantOption);
        });
      }
    }).then(function() {
      loader.hide();  //hide loading
      content.show(); //show website content
    }).catch(function(error) {
      console.warn(error);
    });
  },

  castRate: function() {
    var restaurantId = $('#restaurantsSelect').val();
    var foodRating = document.getElementsByName('foodRating');
    var serviceRating = document.getElementsByName('serviceRating');
    var environRating = document.getElementsByName('environRating');
    var foodStars;
    var serviceStars;
    var environStars;

    // checks how many stars were selected
    for(var i = 0; i < foodRating.length; i++) {
      if(foodRating[i].checked) {
        foodStars = foodRating[i].value;
      }
      if(serviceRating[i].checked) {
        serviceStars = foodRating[i].value;
      }
      if(environRating[i].checked) {
        environStars = foodRating[i].value;
      }
    }

    App.contracts.Rating.deployed().then(function(instance) {
      return instance.rate(restaurantId, foodStars, serviceStars, environStars, { from: App.account });
    }).then(function(result) {
      // Wait for ratings to update
      var foodRating = document.getElementsByName('foodRating');
      var serviceRating = document.getElementsByName('serviceRating');
      var environRating = document.getElementsByName('environRating');
      var currentFoodRating;
      var currentServiceRating;
      var currentEnvironRating;

      for(var j = 0; j<foodRating.length;j++){
        if(foodRating[j].checked == true){
          currentFoodRating=foodRating[j].value;
        }
        if(serviceRating[j].checked == true){
          currentServiceRating=serviceRating[j].value;
        }
        if(environRating[j].checked == true){
          currentEnvironRating=environRating[j].value;
        }
      }

      // Clears radio buttons
      for(var i = 0; i < foodRating.length; i++) {
        foodRating[i].checked = false;
        serviceRating[i].checked = false;
        environRating[i].checked = false;
      }
      App.popup(currentFoodRating,currentServiceRating,currentEnvironRating);
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
