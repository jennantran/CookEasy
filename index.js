const searchURL = 'https://www.themealdb.com/api/json/v1/1';


function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}


function getSearch() {

    $('.recipeDisplay').css('display','none');
    const mealInput = $('#myInput').val(); //''
    const ingredient = $('.mainIngredient').val(); //null
    const cuisineType = $('.cuisine').val(); //null


    let params = {};
    let queryString;
    let url;

  //this if statement makes certain that the url only includes one of the three 
  //input types
  
    if(!mealInput && !ingredient && !cuisineType){
        alert('Complete at least one field!')
       throw 'error: insufficient number of parameters';
    }
    if(mealInput){
        params.s = mealInput;
        queryString = formatQueryParams(params);
        url = searchURL + '/search.php?' + queryString;
    }else if(ingredient){
        params.c = ingredient ? ingredient : '';
        queryString = formatQueryParams(params);
        url = searchURL + '/filter.php?' + queryString;
    }else if(cuisineType){
        params.a = cuisineType ? cuisineType : '';
        queryString = formatQueryParams(params);
        url = searchURL + '/filter.php?' + queryString;
    }
          
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayResults(responseJson))
      .catch(err => {
        $('#js-error-message').text('Something went wrong. No results were found.');
      });

}

function getRecipe(idNo){
    let params = {};
    let queryString;
    let url;


    params.i = idNo;
    queryString = formatQueryParams(params);
    url = searchURL + '/lookup.php?' + queryString; 
    $('.results-list').css('display','none');
    
    fetch(url)
    .then(response => {
    if (response.ok) {
        return response.json();
    }
    throw new Error(response.statusText);
    })
    .then(responseJson => displayRecipe(responseJson))
    .catch(err => {
    $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchSubmit() {
    $('.submit').on('click', event => {
        event.preventDefault();
        $('#js-error-message').empty();

        try {
            getSearch();
          }
          catch(error) {
            console.error(error);
          }
          $('#main').val('default');
          $('#cuisine').val('default');
    });
}
  
function displayResults(responseJson) {
    $('.results-list').empty();
    $('.results-list').css('display','grid');
    let elmnt = document.getElementById('results-list');
        elmnt.scrollIntoView({behavior: "smooth"});

    for (let i = 0; i < responseJson.meals.length; i++){
        $('.results-list').append(
            `<div class="cell cell-${i}" id="${responseJson.meals[i].idMeal}"
                    <li>
                       <img class="mealPic" src="${responseJson.meals[i].strMealThumb}" alt="meal picture"/>
                       <h3> ${responseJson.meals[i].strMeal}</h3>
                    </li> 
                </div>`
        );
    };

    $('.cell').on('click', event => {
        event.preventDefault();
        getRecipe(event.currentTarget.id);
    })
}


function displayRecipe(responseJson){
    $('.recipeDisplay').empty();
    $('.recipeDisplay').css('display','flex');
    $('.recipeDisplay').css('flex-direction','column');
    

    $('.recipeDisplay').append(    
        `<img src="${responseJson.meals[0].strMealThumb}" alt="meal pictures"/>
                <h2> ${responseJson.meals[0].strMeal}</h2>`
    );
    
    for(let i = 1; i < 21; i++){
        let measureStr = 'strMeasure' + i;
        let ingredientStr = 'strIngredient' + i;
        let currentMeasure = responseJson.meals[0][measureStr];
        let currentIngredient = responseJson.meals[0][ingredientStr];
   

        if(currentIngredient != false || currentMeasure != false){
            $('.recipeDisplay').append(`
            <div class="ingredients">
                <li>${currentMeasure} ${currentIngredient}</li>
            </div>`);
        }
    }
    $('.recipeDisplay').append(    
         `<p>${responseJson.meals[0].strInstructions}</p>`
    );

    $('.recipeDisplay').append(`<form>
             <input type="button" value="Go back" onclick="window.history.back()">    
         </form>`);

    let elmnt = document.getElementById('recipeDisplay');
    elmnt.scrollIntoView({behavior: "smooth"});
}

$(watchSubmit);