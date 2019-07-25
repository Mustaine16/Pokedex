var log = console.log
var pokemonList = [];
const loader = document.querySelector(".loader-div")
const cards = document.querySelectorAll(".pkmn-card")
const modal = document.querySelector(".modal")
const search = document.querySelector(".search-input")

async function consumirApi() {

  const startTime = performance.now();

  for (let i = 1; i <= 494; i++) {

    await fetchear(i, pokemonList); 

  }  

  loader.style.display = "none"
  bodyScrollLock.enableBodyScroll(loader)
  
  cards.forEach((card, i) => {

    card.addEventListener("click", async function () {

      loader.style.display = "flex"
      modal.innerHTML = ""
      modal.classList.add("modal-open")
      bodyScrollLock.disableBodyScroll(loader)

      await pokemonList[i].getEvolutions()
      pokemonList[i].getEvolutionsSprites()
      pokemonList[i].incrustStats(this, modal);
      pokemonList[i].incrustEvolutions(modal)

      setTimeout(() => {

        bodyScrollLock.enableBodyScroll(loader)
        loader.style.display = "none"

      }, 50);

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

  search.addEventListener("input", () => {

    let input = search.value.toLowerCase();

    cards.forEach((card, i) => {

      let pkClass = card.classList.item(1);
      pkClass.startsWith(`${input}`) ? card.style.display = "flex" : card.style.display = "none";
    
    })
    
  })


  let tiempoDeCarga = (performance.now() - startTime)
  console.log(tiempoDeCarga);

}



async function fetchear(id) {


  await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(data => data.json())
    .then(async pkmn => {
      const pokemon = new Pokemon(pkmn);
      pokemonList.push(pokemon)
    })
}


bodyScrollLock.disableBodyScroll(loader)

consumirApi();


