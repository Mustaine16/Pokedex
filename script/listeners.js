"use strict";

const types = document.querySelectorAll("ul li");

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

    if (checkPokemons == 494) {
      pokemonMissing.classList.add("pokemon-missing-active");
    }
  });
});

clearSearch.addEventListener("click", () => {
  cards.forEach(card => (card.style.display = "flex"));
  search.value = "";
  pokemonMissing.classList.remove("pokemon-missing-active");
});

burger.addEventListener("click", () => {
  let typesBar = document.querySelector(".search-types");
  typesBar.classList.toggle("search-types-active");
});

types.forEach(type => {
  type.addEventListener("click", e => {
    cards.forEach((card, i) => {
      // console.log(e.target);

      if (e.target.classList[0] === "allTypes") {
        card.style.display = "flex";
        search.value = "";
        pokemonMissing.classList.remove("pokemon-missing-active");
        return true;
      }

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

    let typesBar = document.querySelector(".search-types");
    typesBar.classList.toggle("search-types-active");
  });
});
