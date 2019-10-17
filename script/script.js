"use strict";

var log = console.log;
var pokemonList = [];
const pokemonMissing = document.querySelector(".pokemon-missing");
const loader = document.querySelector(".loader-div");
var cards = document.querySelectorAll(".pkmn-card");
const modal = document.querySelector(".modal");
const search = document.querySelector(".search-input");
const clearSearch = document.querySelector(".clear-search");
const burger = document.querySelector(".burger-button");
const nameGenerations = document.querySelectorAll(".gen-name");
const modalLoaderContainer = document.querySelector(".modal-loader-container");
const modalLoader = document.querySelector(".modal-loader");
const defaultBackground = document.querySelector(".modal-default-container");

async function consumirApi() {
  const startTime = performance.now();

  //Detiene el loader del modal, sino estaria todo el tiempo haciendo un spin infinito y traeria problemas de rendimiento

  modalLoader.style.display = "none";

  cards.forEach((card, i) => {
    card.addEventListener("click", async function() {
      /*Verifica los width del viewport, para solo utilizar los scripts de BodyScrollLock en dispositivos moviles*/
      var width = Math.max(window.innerWidth || 0);

      let newBackgroundColor = card.classList[2];

      //Verifica si el modal esta abierto
      if (modal.classList.contains("modal-open")) {
        //Elimina la clase que le da color al fondo del modal
        let OldBackgroundColor = modal.classList[2];
        modal.classList.remove(OldBackgroundColor);
        console.log("tiene modalOpen");
        //Elimina el color del Loader
        modalLoaderContainer.classList.remove(OldBackgroundColor);
      }

      //El modal se muestra con el background seteado y con la pokebola de carga
      modal.innerHTML = "";
      modalLoaderContainer.classList.add(newBackgroundColor);
      modalLoaderContainer.style.display = "flex";
      modalLoader.style.display = "flex";
      modal.appendChild(modalLoaderContainer);

      //El modal se abre y toma el color de fondo correspondiente
      modal.classList.add("modal-open");
      modal.classList.add(newBackgroundColor);

      //Blockea el scroll de fondo
      if (modalLoader.style.display != "none" && width < 1366) {
        // bodyScrollLock.disableBodyScroll(modal);
      }

      if (modal.classList.contains("modal-open")) {
        //Procedimientos de cada pokemon para obtener sus respectivos datos

        await fetchear(i + 1);
        let index = pokemonList.length - 1;

        await pokemonList[index].getEvolutions();
        await pokemonList[index].getEvolutionsSprites();
        await pokemonList[index].incrustStats(this, modal);
        await pokemonList[index].shinySprite(modal);
        await pokemonList[index].incrustEvolutions(modal);
        await pokemonList[index].incrustEvolutionsFetchRequest(modal);
        await pokemonList[index].getDamageRelations();
        await pokemonList[index].incrustDamageRelations(modal);
        await pokemonList[index].incrustBackArrow(modal);
      }

      pokemonList = [];
    });
  });

  let tiempoDeCarga = performance.now() - startTime;
  console.log(tiempoDeCarga);

  setTimeout(() => {
    loader.style.display = "none";
    // bodyScrollLock.enableBodyScroll(loader);
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

// bodyScrollLock.disableBodyScroll(loader);

consumirApi();

cards.forEach((e, i) => {
  e.childNodes[3].childNodes[0].setAttribute("height", "96");
  e.childNodes[3].childNodes[0].setAttribute("width", "96");
  e.childNodes[3].childNodes[0].setAttribute("alt", `${e.classList[1]}`);
});

// console.log(window.innerWidth);
