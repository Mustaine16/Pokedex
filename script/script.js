"use strict";

var log = console.log;
var pokemonList = [];
const pokemonMissing = document.querySelector(".pokemon-missing");
const loader = document.querySelector(".loader-div");
const cards = document.querySelectorAll(".pkmn-card");
const modal = document.querySelector(".modal");
const search = document.querySelector(".search-input");
const clearSearch = document.querySelector(".clear-search");
const burger = document.querySelector(".burger-button");
const nameGenerations = document.querySelectorAll(".gen-name");
const modalLoaderContainer = document.querySelector(".modal-loader-container");
const modalLoader = document.querySelector(".modal-loader");

async function consumirApi() {
  const startTime = performance.now();

  //Detiene el loader del modal, sino estaria todo el tiempo haciendo un spin infinito y traeria problemas de rendimiento

  modalLoader.style.display = "none";

  cards.forEach((card, i) => {
    card.addEventListener("click", async function() {
      let backColor = card.classList[2];

      //El modal baja con el background seteado y con la pokebola de carga
      modal.innerHTML = "";
      modalLoaderContainer.classList.add(backColor);
      modalLoaderContainer.style.display = "flex";
      modalLoader.style.display = "flex";
      modal.appendChild(modalLoaderContainer);
      if (modal.classList.contains("modal-open")) {
        modal.classList.remove(1);
      }
      modal.classList.add(backColor);
      modal.classList.add("modal-open");

      //Blockea el scroll de fondo
      if (modalLoader.style.display != "none") {
        bodyScrollLock.disableBodyScroll(modal);
      }

      if (modal.classList.contains("modal-open")) {
        //Procedimientos de cada pokemon para obtener sus respectivos datos

        await fetchear(i + 1);
        let index = pokemonList.length - 1;

        await pokemonList[index].getEvolutions();
        await pokemonList[index].getEvolutionsSprites();
        await pokemonList[index].incrustStats(this, modal);
        await pokemonList[index].incrustEvolutions(modal);
        await pokemonList[index].getDamageRelations();
        await pokemonList[index].incrustDamageRelations(modal);
        await pokemonList[index].incrustBackArrow(modal);
      }
    });
  });

  let tiempoDeCarga = performance.now() - startTime;
  console.log(tiempoDeCarga);

  setTimeout(() => {
    loader.style.display = "none";
    bodyScrollLock.enableBodyScroll(loader);
  }, 2000);
}

async function fetchear(id) {
  try {
    await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(data => data.json())
      .then(async pkmn => {
        const pokemon = new Pokemon(pkmn);
        pokemonList.push(pokemon);
      });
  } catch (err) {
    console.log(err);
  }
}

bodyScrollLock.disableBodyScroll(loader);

consumirApi();

cards.forEach((e, i) => {
  e.childNodes[3].childNodes[0].setAttribute("height", "96");
  e.childNodes[3].childNodes[0].setAttribute("width", "96");
  e.childNodes[3].childNodes[0].setAttribute("alt", `${e.classList[1]}`);
});

console.log(window.innerWidth);
