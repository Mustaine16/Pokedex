var log = console.log
var ok = false
var pokemonList = [];
var ev = [];

async function consumirApi() {
  const startTime = performance.now();
  for (let i = 1; i <= 494; i++) {

    await fetchear(i, pokemonList); 
    if (i == 494) {
      const duration = performance.now() - startTime;
      console.log(`fetchear todos los pokemones${duration}ms`);

      const startTime2 = performance.now();
      for (let i= 0; i < pokemonList.length; i++) {
        await pokemonList[i].getEvolutions()
      }
      const duration2 = performance.now() - startTime2;
      console.log(`getEvolutions todos los pokemones${duration2}ms`);
      
      const startTime3 = performance.now();
      for (let i= 0; i < pokemonList.length; i++) {
        pokemonList[i].getEvolutionSprites();
        pokemonList[i].incrustEvolutions();
      }
      const duration3 = performance.now() - startTime3;
      console.log(`getEvSprites y todos los pokemones ${duration3}ms`);

      showFullCard()//Cuando por fin todo esta cargado correctamente, se habilita la expansion de tarjetas de cada pokemon
      
      const loader = document.querySelector(".loader-div")
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



/*
function showPokemons(pkmn) {
  
  //Card para cada pokemon
  const card = document.createElement("div")
  card.classList.add("pkmn-card")

  //Nombre
  const name = document.createElement("p")
  name.classList.add("pkmn-name")
  name.innerText = pkmn.name;

  //Sprites
  const assetDiv = document.createElement("div")
  assetDiv.classList.add("asset")
  const asset = new Image();
  asset.src = pkmn.sprites.front_default;
  assetDiv.appendChild(asset);

  //Stats
  const data = document.createElement("div");
  data.classList.add("stats")

  const type = document.createElement("div")
  type.classList.add("type")
  const hp = document.createElement("p")
  const attack = document.createElement("p")
  const defense = document.createElement("p")

  //Verificar la cantidad de tipos qu epuede ser un pokemon (Por ejemplo Blubasaur es tipo planta y veneno)
  const typeArr = []
  pkmn.types.forEach((e, i) => {
    let typeName = e.type.name
    typeArr.push(typeName)
  });

  //Incrustar los Tipos en los stats del pokemon

  if (typeArr.length > 1) {
    const typeElement1 = document.createElement("span")
    typeElement1.innerText = `${typeArr[1]}`
    typeElement1.classList.add(`${typeArr[1]}`)
    typeElement1.classList.add("types")
    card.classList.add(`${typeArr[0]}`)
    type.appendChild(typeElement1)

    const typeElement2 = document.createElement("span")
    typeElement2.innerText = `${typeArr[0]}`
    typeElement2.classList.add(`${typeArr[0]}`)
    typeElement2.classList.add("types")
    card.classList.add(`${typeArr[1]}`)
    type.appendChild(typeElement2)
    
  } else {
    const typeElement = document.createElement("span")
    typeElement.innerText = `${typeArr[0]}`
    typeElement.classList.add(`${typeArr[0]}`)
    typeElement.classList.add("types")
    type.appendChild(typeElement)
    card.classList.add(`${typeArr[0]}`)
  }



  //Resto de stats

  hp.innerText = `HP: ${pkmn.stats[5].base_stat}`
  attack.innerText = `Attack: ${pkmn.stats[4].base_stat}`
  defense.innerText = `Defense: ${pkmn.stats[3].base_stat}`

  //Incrustar todo los stats
  data.appendChild(type)
  data.appendChild(hp)
  data.appendChild(attack)
  data.appendChild(defense)

  ///Incrustar TODO    
  const pkmnList = document.querySelector(".pkmn-list")

  card.appendChild(name)
  card.appendChild(assetDiv)
  card.appendChild(data)

  pkmnList.appendChild(card)
}
*/
