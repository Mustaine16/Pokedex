var log = console.log
var pokemonList = [];
const loader = document.querySelector(".loader-div")
const cards = document.querySelectorAll(".pkmn-card")
const modal = document.querySelector(".modal")
const search = document.querySelector(".search-input")
const modalLoader = document.querySelector(".modal-loader")

async function consumirApi() {

  const startTime = performance.now()

  
  cards.forEach((card, i) => {

    card.addEventListener("click", async function () {

      let backColor = card.classList[2]

      //El modal baja con el background seteado y con la pokebola de carga
      modal.innerHTML = ""
      modalLoader.style.display = "flex"
      modal.appendChild(modalLoader)
      if ((modal.classList.contains("modal-open"))) { 
        modal.classList.remove(1)
      }
      modal.classList.add(backColor)
      modal.classList.add("modal-open")
    
      //Blockea el scroll de fondo
      if (modalLoader.style.display != "none") {
        bodyScrollLock.disableBodyScroll(modal);
      }

      if (modal.classList.contains("modal-open")) {
        //Procedimientos de cada pokemon para obtener sus respectivos datos
        
        await fetchear(i + 1)
        let len = pokemonList.length

        await pokemonList[(len-1)].getEvolutions()
        pokemonList[(len - 1)].getEvolutionsSprites()
        
        modalLoader.style.display = "none"
        pokemonList[(len - 1)].incrustStats(this, modal);
        pokemonList[(len - 1)].incrustEvolutions(modal)
        await pokemonList[(len - 1)].getDamageRelations()
        pokemonList[(len - 1)].incrustDamageRelations(modal)
        pokemonList[(len - 1)].incrustBackArrow(modal);
      }

    })
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

  setTimeout(() => {
    loader.style.display = "none"
    bodyScrollLock.enableBodyScroll(loader)
  }, 1000);


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


