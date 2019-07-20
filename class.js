class Pokemon {

  constructor(pk) { // pk ---> El pokemon obtenido a traves de un fetch
    this.name = pk.name;
    this.sprite = new Image();
    this.sprite.src = pk.sprites.front_default;
    this.types = pk.types; //Para añadir si o si hay que invocar a la funcion getTypes()
    this.hp = pk.stats[5].base_stat;
    this.attack = pk.stats[4].base_stat;
    this.defense = pk.stats[3].base_stat;
    this.evolutionsUrl = pk.species.url;
  }

  getTypes() {
    //Verificar la cantidad de tipos que puede ser un pokemon (Por ejemplo Blubasaur es tipo planta y veneno)

    const typeArr = []
    this.types.forEach((e, i) => {
      let typeName = e.type.name
      typeArr.push(typeName)
    });

    return typeArr

  }

  async getEvolutions() {
    var pokeEvolutions = [];
    await fetch(`${this.evolutionsUrl}`)
      .then(data => data.json())
      .then(async data => {
        await fetch(`${data.evolution_chain.url}`)
          .then(data => data.json())
          .then(data => {
            
            let evoChain = [];
            let evoData = data.chain;

            do {
              let numberOfEvolutions = evoData.evolves_to.length;  
            
              evoChain.push({
                "name": evoData.species.name,
              });

              if (numberOfEvolutions > 1) {

                for (let i = 1;i < numberOfEvolutions; i++) { 
                  evoChain.push({
                    "name": evoData.evolves_to[i].species.name,
                    "min_level": !evoData.evolves_to[i]? 1 : evoData.evolves_to[i].evolution_details[0].min_level,
                    "trigger": !evoData.evolves_to[i]? null : evoData.evolves_to[i].evolution_details[0].trigger.name,
                    "item": !evoData.evolves_to[i]? null : evoData.evolves_to[i].evolution_details[0].item
                 });
                }
              }        
            
              evoData = evoData['evolves_to'][0];
            
            } while (!!evoData && evoData.hasOwnProperty('evolves_to'));

            this.evolutions = evoChain;

                      })
                  })
              }

  createCard() {

    //Card para cada pokemon
    const card = document.createElement("div");
    card.classList.add("pkmn-card");
    card.classList.add(`${this.name}`)

    //----Nombre
    const name = document.createElement("p")
    name.classList.add("pkmn-name")
    name.innerText = this.name;
    
    //---Sprites
    const assetDiv = document.createElement("div")
    assetDiv.classList.add("asset")
    const asset = this.sprite
    asset.classList.add(`sprite-${this.name}`)
    assetDiv.appendChild(asset);

    //---Stats
    const data = document.createElement("div");
    data.classList.add("stats")

    const hp = document.createElement("p")
    const attack = document.createElement("p")
    const defense = document.createElement("p")

    //---Types

    const typeArr = this.getTypes();
    
    const type = document.createElement("div")
    type.classList.add("type")

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

    assetDiv.appendChild(type) //Incrustar los types al lado del sprite

    //Resto de stats

    hp.innerText = `HP: ${this.hp}`
    attack.innerText = `Attack: ${this.attack}`
    defense.innerText = `Defense: ${this.defense}`


    //Incrustar todo los stats
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

  getEvolutionSprites() {
  
    this.evolutions.forEach(ev => {
      ev.sprite = (document.querySelector(`.sprite-${ev.name}`))
    })

  }

  
  incrustEvolutions() {
  
    //------------Evolutions---------------------
    const pokeCard = document.querySelector(`.${this.name}`)
    const containerEvolutions = document.createElement("div")
    containerEvolutions.classList.add("evs-container")
    const baseEv = document.createElement("div")
    const firstEv = document.createElement("div")
    const secondEv = document.createElement("div")

    baseEv.classList.add("ev")
    firstEv.classList.add("ev")
    secondEv.classList.add("ev")


    //Base-------------------------------------------

    const baseName = document.createElement("span")
    let baseSprite = document.createElement("img")

    baseName.innerText = `${this.evolutions[0].name}`

    baseSprite.src = `${this.evolutions[0].sprite.src}`

    //Incrustar evolucion base

    baseEv.appendChild(baseSprite)
    baseEv.appendChild(baseName)
    containerEvolutions.appendChild(baseEv)
    pokeCard.appendChild(containerEvolutions)
    


    //First Evolution-----------------------------------

    if (this.evolutions[1]) {
      if (this.evolutions[1].sprite == null) {
        console.log(this);
        
      }
      //Base
      const firstEvName = document.createElement("span")
      let firstSprite = document.createElement("img")

      firstEvName.innerText = `${this.evolutions[1].name}`
      firstSprite.src = `${this.evolutions[1].sprite.src}`

      firstEv.appendChild(firstSprite)
      firstEv.appendChild(firstEvName)
      containerEvolutions.append(firstEv)
      pokeCard.append(containerEvolutions)

    }

    //Second Evolution-----------------------------------
    
    
    if (this.evolutions[2]) {
      if (this.evolutions[2].sprite == null) {
        console.log(this);
        
      }
      //Base
      const secondEvName = document.createElement("span")
      let secondSprite = document.createElement("img")

      secondEvName.innerText = `${this.evolutions[2].name}`
      secondSprite.src = `${this.evolutions[2].sprite.src}`

      secondEv.appendChild(secondSprite)
      secondEv.appendChild(secondEvName)
      containerEvolutions.append(secondEv)
      pokeCard.append(containerEvolutions)

    }
  
  }
  
}
    
  



  