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
      let modalLoader = document.querySelector(".modal-loader")
      let backColor = card.classList[2]

      //El modal baja con el background seteado y con la pokebola de carga
      modal.innerHTML = ""
      modalLoader.style.display = "flex"
      modal.appendChild(modalLoader)
      modal.classList.add(backColor)
      modal.classList.add("modal-open")

      //Procedimientos de cada pokemon para obtener sus respectivos datos

      await pokemonList[i].getEvolutions()
      pokemonList[i].getEvolutionsSprites()
      pokemonList[i].incrustStats(this, modal);
      pokemonList[i].incrustEvolutions(modal)

      modalLoader.style.display = "none"

      //Blockea el scroll de fondo
      if(modalLoader.style.display != "none")
      bodyScrollLock.disableBodyScroll(modal);
    })
  })

  modal.addEventListener("click", () => {
    let modalColor = modal.classList[1]

    modal.classList.remove(modalColor)
    modal.classList.remove("modal-open")

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


