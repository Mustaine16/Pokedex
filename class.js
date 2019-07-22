class Pokemon {

  constructor(pk) { // pk ---> El pokemon obtenido a traves de un fetch
    this.name = pk.species.name;
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
    const name = document.createElement("div")
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
      typeElement1.classList.add(`${typeArr[1]}-cardy`)
      typeElement1.classList.add("types")
      card.classList.add(`${typeArr[1]}`)
      type.appendChild(typeElement1)

      const typeElement2 = document.createElement("span")
      typeElement2.innerText = `${typeArr[0]}`
      typeElement2.classList.add(`${typeArr[0]}-cardy`)
      typeElement2.classList.add("types")
      // card.classList.add(`${typeArr[0]}`)
      type.appendChild(typeElement2)

    } else {
      const typeElement = document.createElement("span")
      typeElement.innerText = `${typeArr[0]}`
      typeElement.classList.add(`${typeArr[0]}-cardy`)
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
  
    if (this.evolutions.length > 1) {

      //------------Evolutions---------------------

      const pokeCard = document.querySelector(`.${this.name}`)
      const containerEvolutions = document.createElement("div")
      const containerEvolutionsBrand = document.createElement("div")
      // let arrow = document.createElement("img")
      containerEvolutions.classList.add("evs-container")
      containerEvolutionsBrand.classList.add("evolutions-title")
      containerEvolutionsBrand.innerText = "Evolutions"
      const evsList = document.createElement("div")
      const baseEv = document.createElement("div")
      const firstEv = document.createElement("div")
      const secondEv = document.createElement("div")

      evsList.classList.add("evs-list")
      baseEv.classList.add("ev")
      firstEv.classList.add("ev")
      secondEv.classList.add("ev")
      // arrow.src = "./img/arrow.png"
      


      //Base-------------------------------------------

      const baseName = document.createElement("span")
      let baseSprite = document.createElement("img")

      baseName.innerText = `${this.evolutions[0].name}`

      baseSprite.src = `${this.evolutions[0].sprite.src}`

      //Incrustar evolucion base

      baseEv.appendChild(baseSprite)
      baseEv.appendChild(baseName)
      containerEvolutions.appendChild(containerEvolutionsBrand)
      evsList.appendChild(baseEv)
      // evsList.appendChild(arrow)
      containerEvolutions.appendChild(evsList)
      pokeCard.appendChild(containerEvolutions)



      //First Evolution-----------------------------------
        
      const firstEvName = document.createElement("span")
      let firstSprite = document.createElement("img")
      firstEvName.innerText = `${this.evolutions[1].name}`
      firstSprite.src = `${this.evolutions[1].sprite.src}`
      firstEv.appendChild(firstSprite)
      firstEv.appendChild(firstEvName)
      evsList.appendChild(firstEv)
      containerEvolutions.append(evsList)
      pokeCard.append(containerEvolutions)


      //Second Evolution-----------------------------------

      if (this.evolutions.length === 3) {
        const secondEvName = document.createElement("span")
        let secondSprite = document.createElement("img")
        secondEvName.innerText = `${this.evolutions[2].name}`
        secondSprite.src = `${this.evolutions[2].sprite.src}`
        secondEv.appendChild(secondSprite)
        secondEv.appendChild(secondEvName)
        evsList.appendChild(secondEv)
        containerEvolutions.append(evsList)
        pokeCard.append(containerEvolutions)
      }
      

      //Eevees----------------------------------------------

      if (this.evolutions.length === 9) {

        
        for (let i = 2; i <= 8; i++) {

          if (i != 7) {
            //Base-------------------------------------------
            const baseEve = document.createElement("div")
            const baseEveName = document.createElement("span")
            let baseEveSprite = document.createElement("img")
            baseEve.classList.add("ev")
            let eeveeEvolution = document.createElement("div")


            baseEveName.innerText = `${this.evolutions[0].name}`

            baseEveSprite.src = `${this.evolutions[0].sprite.src}`

            baseEve.appendChild(baseEveSprite)
            baseEve.appendChild(baseEveName)
            evsList.appendChild(baseEve)
            containerEvolutions.appendChild(evsList)
            pokeCard.appendChild(containerEvolutions)
    

            //Eevee Evolution--------------------------------

            let eveEvo = document.createElement("div")
            let eveName = document.createElement("span")
            let eveSprite = document.createElement("img")


            eveName.innerText = `${this.evolutions[i].name}`
            eveSprite.src = `${this.evolutions[i].sprite.src}`
            eveEvo.classList.add("evs-list")
            eeveeEvolution.classList.add("ev")

            eeveeEvolution.appendChild(eveSprite)
            eeveeEvolution.appendChild(eveName)
            eveEvo.appendChild(baseEve)
            eveEvo.appendChild(eeveeEvolution)
            containerEvolutions.appendChild(eveEvo)
            pokeCard.append(containerEvolutions)
          } 
        } 
      }

    } else {

      //En caso de que el pokemon no tenga evoluciones
      
      const pokeCard = document.querySelector(`.${this.name}`)
      const containerEvolutions = document.createElement("div")
      const containerEvolutionsBrand = document.createElement("div")
      const noEvolutions = document.createElement("div")
      containerEvolutions.classList.add("evs-container")
      containerEvolutionsBrand.classList.add("evolutions-title")
      containerEvolutionsBrand.innerText = "Evolutions"
      noEvolutions.innerText = `${this.name} has not evolutions`

      containerEvolutions.appendChild(containerEvolutionsBrand)
      containerEvolutions.appendChild(noEvolutions)
      pokeCard.appendChild(containerEvolutions)
    }
  }
}
  

    
  



  