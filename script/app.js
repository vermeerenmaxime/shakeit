
let main = {}, card = {}, button = {}, form = { email:{},name:{},age:{},submit:{}}, page = {}, loadingwindow;

let getDOMElements = () => {
    main.title = document.querySelector(".js-main-title");

    main.desc = document.querySelector(".js-main-desc");
    card.img = document.querySelector(".js-card-img");
    card.title = document.querySelector(".js-card-title");
    card.bubble = document.querySelector(".js-card-category");
    card.alcoholic = document.querySelector(".js-card-alcoholic");
    card.Ingredients = document.querySelector(".js-card-ingredients");

    button.refresh = document.querySelector(".js-button-refresh");
    loadingwindow = document.querySelector(".js-loading");

    form.email.input = document.querySelector(".js-form-email-input");
    form.email.message = document.querySelector(".js-form-email-message");
    form.email.field = document.querySelector(".js-form-email-field");
    
    form.name.input = document.querySelector(".js-form-name-input");
    form.name.message = document.querySelector(".js-form-name-message");
    form.name.field = document.querySelector(".js-form-name-field");

    form.age.input = document.querySelector(".js-form-age-input");
    form.age.message = document.querySelector(".js-form-age-message");

    form.submit = document.querySelector(".js-form-submit");

    if (button.refresh) {
        button.refresh.addEventListener("click", () => {
            getCocktailAPI();
            loadingwindow.style.display = "block";
            setTimeout(function () {
                loadingwindow.style.display = "none";
            }, 1000);
        });
    }
}

let enableListeners = () => {
    
    form.email.input.addEventListener('blur', function () {
        if (!isValid(form.email)) {
            form.email.input.addEventListener("input", doubleCheckEmail);
            isEmpty(form.email.input.value) == false ?
                
                addErrors(form.email, "Invalid email ❌") :
                addErrors(form.email, "This field is required ✋🏼");
        } else {
            form.email.input.removeEventListener("input", doubleCheckEmail);
        }
    });

    form.name.input.addEventListener('blur', function() {
        if (!isValid(form.name)) {
            form.name.input.addEventListener("input", doubleCheckName);
            isEmpty(form.name.input.value) == false ?
                addErrors(form.name, "Invalid name, too short ❌") :
                addErrors(form.name, "This field is required ✋🏼");
        } else {
            form.name.input.removeEventListener("input", doubleCheckName);
        }
         
    });

    form.age.input.addEventListener('click', function() {
        if(form.age.input.checked){
            form.age.message.innerHTML = "";
        }else{
            form.age.message.innerHTML = "** If you're underaged, you won't be able to use the tool for alcholic drinks. 👀";
        }
         
    });

}

const isEmpty = function (fieldValue) {
    return !fieldValue || !fieldValue.length;
};

const isValid = function (obj) {
    if (obj === form.email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(obj.input.value);
    } else if (obj === form.name) {
        return obj.input.value.length > 2;
    } else {
        return false;
    }
};

const doubleCheckEmail = function () {
    if (!isEmpty(form.email.input.value) && !isValid(form.email)) {
        addErrors(form.email, "Invalid email ❌");
    } else {
        removeErrors(form.email);
    }
};

const doubleCheckName = function() {
    if (!isEmpty(form.name.input.value) && !isValid(form.name)) {
        addErrors(form.name, "Invalid name, too short ❌");
    } else {
        removeErrors(form.name);
    }
};

const addErrors = function (globalVar, message) {
    globalVar.field.classList.add("has-error");
    globalVar.message.innerHTML = message;
}

const removeErrors = function (globalVar) {
    globalVar.field.classList.remove("has-error");
    globalVar.message.innerHTML = "";
}


function containNumber(string) {
    var re = /\d/;
    if (re.test(string)) return true
    else return false;
}

// function rectangleWidth(data){
//     let width = "100%";
//     switch (data) {
//         case "1/3 shot":
//             width = "33%";
//             break;
//         case "1 shot":
//             width = "100%";
//             break;
//         case "Juice of 1/2":
//             width = "50%";
//             break;

//         default:
//             break;
//     }
// }


let showResult = (data) => {
    drink = data["drinks"][0];

    if (main.title) {
        main.title.innerHTML = drink['strDrink'];
        main.desc.innerHTML = drink['strInstructions'];
    }
    card.title.innerHTML = drink['strDrink'];
    card.bubble.innerHTML = drink['strCategory'];


    // card.img.classList.remove("animation-pop");
    // card.img.classList.add("animation-pop");
    card.img.innerHTML = `<img src="${drink['strDrinkThumb']}" alt="${drink['strDrink']}" class="c-card-img animation-pop"/>`;
    // card.img.src = drink['strDrinkThumb'];


    let ingredients = [];
    for (let i = 0; i < 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];

        if ((ingredient != null || measure != null) && (ingredient != "" || measure != "")) {
            if (measure === "null") { measure = ""; }
            ingredients.push({
                name: ingredient,
                measure: measure
            });
        }
    }

    let measureLength = {
        // uom : "1/4",
        // measure : "25"
        "1/4": "25",
        "3/4": "75",
        "1/3": "33",
        "1/3 oz": "33",
        "1/2 oz": "50",
        "3/4 oz": "75",
        "2 1/2 oz": "100",
        "1 oz": "100",
        "1 oz ": "100",
        "2 oz": "100",
        "2 oz ": "100",
        "3 oz": "100",
        "4 oz": "100",
        "4 oz ": "100",
        "5 oz": "100",
        "5 oz ": "100",
        "11/2 oz": "100",

        "1/3 shot": "33",
        "1/2 shot": "50",

        "1/2 tsp": "50",
        "1 tsp": "100",
        "2 tsp": "100",

        "1 tblsp": "100",

        "1/2 slice": "50",

        "Juice of 1/2": "50",

        "20 ml": "20",
        "30 ml white": "30",
        "30 ml": "30",
        "5 ml": "15",

        "5 cl": "100",
        "1.5 cl": "15",
        "2.5 cl": "50",
        "1/2 oz ": "100",

        "2 spoon": "100"
    };

    // console.log(measureLength);

    let htmlString_ingredients = "";
    for (const ingredient of ingredients) {
        // let rectangleWidth = Math.floor((Math.random() * 100) + 1);
        htmlString_ingredients += `<div class="c-ingredient">
        <div class="c-ingredient__title--right">${ingredient.measure}</div>
                                <div class="c-ingredient__title">
                                    ${ingredient.name}
                                    </div>`;

        if (containNumber(ingredient.measure)) {
            let rectangleWidth = 0;

            console.log(`${ingredient.name} -${ingredient.measure}- ${measureLength[ingredient.measure]} ${(ingredient.measure in measureLength)}`);

            const typeSubstrings = [ingredient.measure.substring(0, 1),
            ingredient.measure.substring(0, 2),
            ingredient.measure.substring(0, 3),
            ingredient.measure.substring(0, 4),
            ingredient.measure.substring(0, 5),
            ingredient.measure.substring(ingredient.measure.length - 2,
                ingredient.measure.length)];
            // console.log(typeSubstring);

            for (let typeSubstring of typeSubstrings) {
                if (typeSubstring == "1" || typeSubstring == "10") rectangleWidth = 10;
                else if (typeSubstring == "1.5" || typeSubstring == "15") rectangleWidth = 15;
                else if (typeSubstring == "2" || typeSubstring == "1/5" || typeSubstring == "1 1/5") rectangleWidth = 20;
                else if (typeSubstring == "1/4" || typeSubstring == "2.5" || typeSubstring == "1 1/4") rectangleWidth = 25;
                else if (typeSubstring == "3") rectangleWidth = 30;
                else if (typeSubstring == "1/3" || typeSubstring == "1-2") rectangleWidth = 33;
                else if (typeSubstring == "4") rectangleWidth = 40;
                else if (typeSubstring == "1/2" || typeSubstring == "50" || typeSubstring == "½" || typeSubstring == "1 1/2" || typeSubstring == "5") rectangleWidth = 50;
                else if (typeSubstring == "6") rectangleWidth = 60;
                else if (typeSubstring == "2-3") rectangleWidth = 66;
                else if (typeSubstring == "2 1/2" || typeSubstring == "10 cl") rectangleWidth = 90;
                else if (typeSubstring == "3/4") rectangleWidth = 75;
            }

            if (rectangleWidth > 0) {
                htmlString_ingredients += `<svg width="100%" height="7">
                                            <rect class="c-ingredient__rectangle" data-width="${rectangleWidth}%" min-width="5%" width="${rectangleWidth}%" height="7" rx="3.5" />
                                            </svg>`;
            }
        }
        htmlString_ingredients += `</div>`;
    }

    card.Ingredients.innerHTML = htmlString_ingredients;

    htmlString_alcoholic = "";
    if (drink['strAlcoholic'] == "Alcoholic") htmlString_alcoholic = "Alcoholic drink";
    else htmlString_alcoholic = "Non-Alcoholic drink";

    card.alcoholic.innerHTML = "* " + htmlString_alcoholic;
}


let getCocktailAPI = async () => {
    console.log("ShakeIt - Maxime Vermeeren 2MCT")
    const data = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
        .then((r) => r.json())
        .catch((err) => console.error('An error occured:', err));

    console.log(data['drinks'][0])

    // Met de fetch API proberen we de data op te halen.
    // Als dat gelukt is, gaan we naar onze showResult functie.
    if (data) {
        showResult(data);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    getDOMElements();

    page.find = document.querySelector(".js-page-find");
    page.intro = document.querySelector(".js-page-intro");

    if (page.find) {
        getCocktailAPI();
    }
    if (page.intro) {
        // console.log(form.email.input);
        enableListeners();
    }
});

window.addEventListener("load", function () {
    loadingwindow.style.display = "none";
});
