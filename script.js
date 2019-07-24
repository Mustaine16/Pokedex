var log = console.log
var ok = false
var pokemonList = [];
var ev = [];

async function consumirApi() {

  const startTime = performance.now();

  for (let i = 1; i <= 494; i++) {

    await fetchear(i, pokemonList); 

  }  

  const loader = document.querySelector(".loader-div")
  const cards = document.querySelectorAll(".pkmn-card")
  const modal = document.querySelector(".modal")

  cards.forEach((card, i) => {

    card.addEventListener("click", async function () {

      modal.classList.add("modal-open")
      modal.innerHTML = ""
    
      await pokemonList[i].getEvolutions()
      pokemonList[i].getEvolutionsSprites()
      pokemonList[i].incrustStats(this, modal);
      pokemonList[i].incrustEvolutions(modal)
      //Blockea el scroll de fondo
      bodyScrollLock.disableBodyScroll(modal);

    })
  })

  modal.addEventListener("click", () => {
    modal.classList.toggle("modal-open")
    modal.classList.remove(`${modal.classList[1]}`)
    if (!(modal.classList.contains("modal-open"))) {
     bodyScrollLock.enableBodyScroll(modal);
    }
  })
  const result = (performance.now() - startTime)
  console.log(result);
  loader.style.display = "none"

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


