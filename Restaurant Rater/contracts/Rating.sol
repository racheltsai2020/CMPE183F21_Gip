pragma solidity 0.4.25;

contract Rating {
    // Model a Restaurant
    struct Restaurant {
        uint id; //0
        string name; //1
        uint ratingCount; //2;
        uint totalFoodStars; //3
        uint avgFoodRating; //4
        uint totalServiceStars; //5
        uint avgServiceRating; //6
        uint totalEnvironStars; //7
        uint avgEnvironRating; //8
    }

    // Store Restaurants
    mapping(uint => Restaurant) public restaurants;

    // Store restaurant count
    uint public restaurantsCount;

    // voted event
    event ratedEvent (
        uint indexed _restaurantId
    );

    constructor () public {
        addRestaurant("Gong Cha");
        addRestaurant("Philz Coffee");
        addRestaurant("Spoonfish Poke");
    }

    //function for adding new restaurant
    function addRestaurant (string _name) private {
        restaurantsCount ++;
        restaurants[restaurantsCount] = Restaurant(restaurantsCount, _name, 0, 0, 0, 0, 0, 0, 0);
    }

    //function for rating different quality
    function rate (uint _restaurantId, uint _food, uint _service, uint _environ) public {

        // require a valid candidate
        require(_restaurantId > 0 && _restaurantId <= restaurantsCount);

        // update candidate vote Count
        restaurants[_restaurantId].ratingCount ++;
        uint rateCount = restaurants[_restaurantId].ratingCount;

        // Calculate and update average food rating
        restaurants[_restaurantId].totalFoodStars = restaurants[_restaurantId].totalFoodStars + _food;
        restaurants[_restaurantId].avgFoodRating = restaurants[_restaurantId].totalFoodStars / rateCount;
        if(restaurants[_restaurantId].totalFoodStars % rateCount > rateCount / 2) {
            restaurants[_restaurantId].avgFoodRating++;
        }

        // Calculate and update average service rating
        restaurants[_restaurantId].totalServiceStars = restaurants[_restaurantId].totalServiceStars + _service;
        restaurants[_restaurantId].avgServiceRating = restaurants[_restaurantId].totalServiceStars / rateCount;
        if(restaurants[_restaurantId].totalServiceStars % rateCount > rateCount / 2) {
            restaurants[_restaurantId].avgServiceRating++;
        }

        // Calculate and update average environment cleanliness rating
        restaurants[_restaurantId].totalEnvironStars = restaurants[_restaurantId].totalEnvironStars + _environ;
        restaurants[_restaurantId].avgEnvironRating = restaurants[_restaurantId].totalEnvironStars / rateCount;
        if(restaurants[_restaurantId].totalEnvironStars % rateCount > rateCount / 2) {
            restaurants[_restaurantId].avgEnvironRating++;
        }

        // trigger rated event
        emit ratedEvent(_restaurantId);

    }
}
