var log = console.log
var ok = false
var pokemonList = [];
var ev = [];

async function consumirApi() {
  const startTime = performance.now();
  for (let i = 1; i <= 3; i++) {

    await fetchear(i, pokemonList); 

    if (i == 3) {
      const loader = document.querySelector(".loader-div")
      const cards = document.querySelectorAll(".pkmn-card")
      log(cards)

      cards.forEach((card, i) => {

        card.addEventListener("click", function () {

          const modal = document.querySelector(".modal")
          modal.classList.add("modal-open")
        
          pokemonList[i].getEvolutions();
          pokemonList[i].getEvolutionsSprites();
          pokemonList[i].incrustEvolutions();
          
        })
      })

      loader.style.display = "none"

    }

  }
  // log(pokemonList)
}

async function fetchear(id) {


  await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(data => data.json())
    .then(async pkmn => {

      const pokemon = new Pokemon(pkmn);
      setTimeout( pokemon.createCard(),1)
      pokemonList.push(pokemon)
    })

  
}




consumirApi();
console.log(pokemonList);

