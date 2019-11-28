"use strict";

search.addEventListener("input", () => {
  let input = search.value.toLowerCase();
  let checkPokemons = 0; //Esta variable va a ser utilizada para chequear si todos los pokemones se encuentran con display = none, y asi

  //Oculta los "1°Gen, 2°Gen, etc"
  if (!(input === "")) {
    nameGenerations.forEach(e => (e.style.display = "none"));
  } else {
    nameGenerations.forEach(e => (e.style.display = "block"));
  }

  cards.forEach((card, i) => {
    let pkClass = card.classList.item(1);

    if (pkClass.startsWith(`${input}`)) {
      card.style.display = "flex";
      checkPokemons > 0 ? checkPokemons-- : checkPokemons;

      if (pokemonMissing.classList[1])
        pokemonMissing.classList.remove("pokemon-missing-active");
    } else {
      card.style.display = "none";
      checkPokemons++;
    }

    if (checkPokemons == 807) {
      pokemonMissing.classList.add("pokemon-missing-active");
    }
  });
});

clearSearch.addEventListener("click", () => {
  //Muestra todas las cards de vueta
  cards.forEach(card => (card.style.display = "flex"));
  search.value = "";
  //Desaparece el pokemon missing
  pokemonMissing.classList.remove("pokemon-missing-active");

  //Reaparecen las barras de separacion por generaciones
  nameGenerations.forEach(e => (e.style.display = "block"));
});

burger.addEventListener("click", () => {
  let typesBar = document.querySelector(".search-types");
  typesBar.classList.toggle("search-types-active");
});

types.forEach(type => {
  type.addEventListener("click", e => {
    cards.forEach((card, i) => {
      //En caso de seleccionar AllTypes, se muestran todos los pokemones, barra de gens y desaperece un posible pokemonMissing

      if (type.className === "allTypes") {
        card.style.display = "flex";
        search.value = "";
        pokemonMissing.classList.remove("pokemon-missing-active");
        return true;
      }

      //Verifica cuantos tipos tiene el pokemon, dependiendo de las clases

      //Los que possen 2 estilos, en su clase llevan un, por ejemplo, "flying2", asi que se le hace el slice para retirar ese "2"

      let pkType1 = card.classList.item(2);
      let pkType2 = card.classList.item(3)
        ? card.classList.item(3).slice(0, -1)
        : false;

      if (pkType2 == type.className || pkType1 == type.className) {
        search.value = "";
        nameGenerations.forEach(e => (e.style.display = "block"));
        card.style.display = "flex";
        pokemonMissing.classList.remove("pokemon-missing-active");
      } else {
        card.style.display = "none";
      }
    });

    //Crear un indicador para saber que tipo estamos filtrando

    if (type.className != "allTypes") {
      const filterContainer = document.querySelector("#filter-container");
      const filterText = document.createElement("span");
      const typeCardy = document.createElement("span");

      filterText.innerText = "Filtering by: ";
      typeCardy.innerText = `${type.className}`;
      typeCardy.classList.add(`${type.className}-cardy`);
      typeCardy.classList.add("type");

      filterContainer.appendChild(filterText);
      filterContainer.appendChild(typeCardy);
    }

    //Ocultar la barra
    let typesBar = document.querySelector(".search-types");
    typesBar.classList.toggle("search-types-active");
  });
});
