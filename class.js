class Pokemon {

  constructor(pk) { // pk ---> El pokemon obtenido a traves de un fetch
    this.name = pk.species.name;
    this.sprite = new Image();
    this.sprite.src = pk.sprites.front_default;
    this.types = pk.types; //Para añadir si o si hay que invocar a la funcion getTypes()
    this.hp = pk.stats[5].base_stat;
    this.attack = pk.stats[4].base_stat;
    this.defense = pk.stats[3].base_stat;
    this.speed = pk.stats[0].base_stat;
    this.attackSp =pk.stats[2].base_stat;
    this.defenseSp = pk.stats[1].base_stat;
    this.evolutionsUrl = pk.species.url;
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

    //Types

    const typeArr = this.getTypes();

    //Para definir el fondo de cada mini-card dependiendo de su tipo
    if (typeArr.length > 1) {
      card.classList.add(`${typeArr[1]}`)
    } else {
      card.classList.add(`${typeArr[0]}`)
    }
    
    ///Incrustar TODO    
    
    
    const pkmnList = document.querySelector(".pkmn-list")

    card.appendChild(name)
    card.appendChild(assetDiv)
    pkmnList.appendChild(card)

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
    await fetch(`${this.evolutionsUrl}`)
      .then(data => data.json())
      .then(async data => {
        await fetch(`${data.evolution_chain.url}`)
          .then(data => data.json())
          .then(data => {
            
            let evoChain = [];
            let evoData = data.chain;
            
            evoChain.push({
              "name": evoData.species.name,
            });
            
            do {

              let numberOfEvolutions = evoData.evolves_to.length;  
            
              if (numberOfEvolutions >= 1) {

                for (let i = 0;i < numberOfEvolutions; i++) { 
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

  getEvolutionsSprites() {
  
    this.evolutions.forEach(ev => {
      ev.sprite = (document.querySelector(`.sprite-${ev.name}`))
    })

  }

  incrustEvolutions(modal) {
  
    if (this.evolutions.length > 1) {

      //------------Evolutions---------------------

      const containerEvolutions = document.createElement("div")
      const containerEvolutionsBrand = document.createElement("div")
      const arrowDiv = document.createElement("div")
      const arrow = document.createElement("img")
      const arrowText = document.createElement("span")
      const evsList = document.createElement("div")
      const baseEv = document.createElement("div")
      const firstEv = document.createElement("div")
      const secondEv = document.createElement("div")
      
      containerEvolutions.classList.add("evs-container")
      containerEvolutionsBrand.classList.add("evolutions-title")
      containerEvolutionsBrand.innerText = "Evolutions"
      evsList.classList.add("evs-list")
      baseEv.classList.add("ev")
      firstEv.classList.add("ev")
      secondEv.classList.add("ev")
      arrowDiv.classList.add("arrow-div")
      arrow.classList.add("arrow")
      arrow.src = "./img/arrow.svg"
      arrowText.innerText = this.incrustEvolutionsTriggers(1)
      arrowDiv.appendChild(arrow)
      arrowDiv.appendChild(arrowText)
      


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
      evsList.appendChild(arrowDiv)

      //First Evolution-----------------------------------
        
      const firstEvName = document.createElement("span")
      let firstSprite = document.createElement("img")
      firstEvName.innerText = `${this.evolutions[1].name}`
      firstSprite.src = `${this.evolutions[1].sprite.src}`
      firstEv.appendChild(firstSprite)
      firstEv.appendChild(firstEvName)
      evsList.appendChild(firstEv)
      containerEvolutions.append(evsList)
      modal.appendChild(containerEvolutions)




      //Second Evolution-----------------------------------

      if (this.evolutions.length === 3) {
        const secondEvDiv = document.createElement("div")

        const firstEvClone = firstEv.cloneNode(true)
        const arrowDivClone = arrowDiv.cloneNode()
        const arrowClone = arrow.cloneNode(true)
        const arrowTextClone = arrowText.cloneNode();
        

        const secondEvName = document.createElement("span")
        let secondEvSprite = document.createElement("img")

        secondEvDiv.classList.add("evs-list")

        secondEvName.innerText = `${this.evolutions[2].name}`
        secondEvSprite.src = `${this.evolutions[2].sprite.src}`
        secondEv.appendChild(secondEvSprite)
        secondEv.appendChild(secondEvName)

        secondEvDiv.appendChild(firstEvClone)

        arrowTextClone.innerText = this.incrustEvolutionsTriggers(2)
        arrowDivClone.appendChild(arrowClone)
        arrowDivClone.appendChild(arrowTextClone)

        secondEvDiv.appendChild(arrowDivClone)
        secondEvDiv.appendChild(secondEv)
        containerEvolutions.append(secondEvDiv)
        modal.append(containerEvolutions)
      }
      

      //Eevees, Tyrogue, Gardevoir----------------------------------------------

      if (this.evolutions.length > 3) {

        if (this.evolutions.length === 9) {

          for (let i = 2; i < 8; i++) {

          
            //Base-------------------------------------------

            const firstEeveeClone = baseEv.cloneNode(true)
            const arrowDivClone = arrowDiv.cloneNode()
            const arrowClone = arrow.cloneNode(true)
            const arrowTextClone = arrowText.cloneNode();


            //Eevee Evolution--------------------------------
            let eeveeEvolution = document.createElement("div")
            let eveEvo = document.createElement("div")
            let eveName = document.createElement("span")
            let eveSprite = document.createElement("img")


            eveName.innerText = `${this.evolutions[i].name}`
            eveSprite.src = `${this.evolutions[i].sprite.src}`
            eveEvo.classList.add("evs-list")
            eeveeEvolution.classList.add("ev")

            eeveeEvolution.appendChild(eveSprite)
            eeveeEvolution.appendChild(eveName)
            eveEvo.appendChild(firstEeveeClone)
          
            arrowTextClone.innerText = this.incrustEvolutionsTriggers(i)
            arrowDivClone.appendChild(arrowClone)
            arrowDivClone.appendChild(arrowTextClone)
            eveEvo.appendChild(arrowDivClone)

            eveEvo.appendChild(eeveeEvolution)
            containerEvolutions.appendChild(eveEvo)
            modal.append(containerEvolutions)
          }
        } else {

          if (this.evolutions[0].name == "tyrogue") {
            for (let i = 2; i < this.evolutions.length; i++) {

              //Base-------------------------------------------

              const firstEeveeClone = baseEv.cloneNode(true)
              const arrowDivClone = arrowDiv.cloneNode()
              const arrowClone = arrow.cloneNode(true)
              const arrowTextClone = arrowText.cloneNode();


              //Eevee Evolution--------------------------------
              let eeveeEvolution = document.createElement("div")
              let eveEvo = document.createElement("div")
              let eveName = document.createElement("span")
              let eveSprite = document.createElement("img")


              eveName.innerText = `${this.evolutions[i].name}`
              eveSprite.src = `${this.evolutions[i].sprite.src}`
              eveEvo.classList.add("evs-list")
              eeveeEvolution.classList.add("ev")

              eeveeEvolution.appendChild(eveSprite)
              eeveeEvolution.appendChild(eveName)
              eveEvo.appendChild(firstEeveeClone)
          
              arrowTextClone.innerText = this.incrustEvolutionsTriggers(i)
              arrowDivClone.appendChild(arrowClone)
              arrowDivClone.appendChild(arrowTextClone)
              eveEvo.appendChild(arrowDivClone)

              eveEvo.appendChild(eeveeEvolution)
              containerEvolutions.appendChild(eveEvo)
              modal.append(containerEvolutions)
            }
          } else {
            for (let i = 2; i < this.evolutions.length; i++) {

              //Base-------------------------------------------

              const firstEvoClone = firstEv.cloneNode(true)
              const arrowDivClone = arrowDiv.cloneNode()
              const arrowClone = arrow.cloneNode(true)
              const arrowTextClone = arrowText.cloneNode();


              //Kirlia Evolution--------------------------------
              let eeveeEvolution = document.createElement("div")
              let eveEvo = document.createElement("div")
              let eveName = document.createElement("span")
              let eveSprite = document.createElement("img")


              eveName.innerText = `${this.evolutions[i].name}`
              eveSprite.src = `${this.evolutions[i].sprite.src}`
              eveEvo.classList.add("evs-list")
              eeveeEvolution.classList.add("ev")

              eeveeEvolution.appendChild(eveSprite)
              eeveeEvolution.appendChild(eveName)
              eveEvo.appendChild(firstEvoClone)
          
              arrowTextClone.innerText = this.incrustEvolutionsTriggers(i)
              arrowDivClone.appendChild(arrowClone)
              arrowDivClone.appendChild(arrowTextClone)
              eveEvo.appendChild(arrowDivClone)

              eveEvo.appendChild(eeveeEvolution)
              containerEvolutions.appendChild(eveEvo)
              modal.append(containerEvolutions)
            }
          }
        }
      } 
    } else {

      //En caso de que el pokemon no tenga evoluciones
    
      const containerEvolutions = document.createElement("div")
      const containerEvolutionsBrand = document.createElement("div")
      const noEvolutions = document.createElement("div")

      containerEvolutions.classList.add("evs-container")
      containerEvolutionsBrand.classList.add("evolutions-title")
      noEvolutions.classList.add("empty")
      containerEvolutionsBrand.innerText = "Evolutions"
      noEvolutions.innerText = `${this.name} has no evolutions`

      containerEvolutions.appendChild(containerEvolutionsBrand)
      containerEvolutions.appendChild(noEvolutions)
      modal.appendChild(containerEvolutions)
    }
  }

  incrustEvolutionsTriggers(i) {
    if (this.evolutions[i].min_level != null) {
      return `level ${this.evolutions[i].min_level}`
    } else if(this.evolutions[i].trigger == "use-item"){
      return `using ${this.evolutions[i].item.name}`
    } else if (this.evolutions[i].trigger == "trade") { 
      return 'at trade'
    } else{
      return 'at high friendship'
    }
  }

  incrustStats(miniCard, modal) {

    //Name
    const nameDiv = miniCard.children[0].cloneNode(true);
    nameDiv.classList.add("name-open")

    
    //Sprite and Type container

    const spriteAndType = document.createElement("div")
    spriteAndType.classList.add("sprite-and-type")
    

    //Sprite

    const spriteDiv = miniCard.children[1].cloneNode(true);
    spriteAndType.appendChild(spriteDiv)


    //---Types

    const typeArr = this.getTypes();
    
    const type = document.createElement("div")
    type.classList.add("types")

    //Incrustar los Tipos en los stats del pokemon

    if (typeArr.length > 1) {
      const typeElement1 = document.createElement("span")
      typeElement1.innerText = `${typeArr[1]}`
      typeElement1.classList.add(`${typeArr[1]}-cardy`)
      typeElement1.classList.add("type")
      type.appendChild(typeElement1)


      const typeElement2 = document.createElement("span")
      typeElement2.innerText = `${typeArr[0]}`
      typeElement2.classList.add(`${typeArr[0]}-cardy`)
      typeElement2.classList.add("type")
      type.appendChild(typeElement2)
      spriteAndType.appendChild(type)

    } else {
      const typeElement = document.createElement("span")
      typeElement.innerText = `${typeArr[0]}`
      typeElement.classList.add(`${typeArr[0]}-cardy`)
      typeElement.classList.add("types")
      type.appendChild(typeElement)
      spriteAndType.appendChild(type)
    }

    
    //---Stats

    const stats = [
      this.hp,
      this.attack,
      this.defense,
      this.speed,
      this.attackSp,
      this.defenseSp
    ];
          
    const statsContainer = document.createElement("div");
    statsContainer.classList.add("stats-container")

    for (let i = 0; i < stats.length;i++){

      //Each Stat Row Container
      const statRow = document.createElement("div");
      statRow.classList.add("stats-row")

      //Stat row content (Name --- Value)
      const statName = document.createElement("span")
      switch(i) {
        case 0:
          statName.innerText = "HP"
          break;
        case 1:
          statName.innerText = "Attack"
          break;
        case 2:
          statName.innerText = "Defense"
          break;
        case 3:
          statName.innerText = "Speed"
        break;
        case 4:
          statName.innerText = "Sp Att."
        break;
        case 5:
          statName.innerText = "Sp Def."
          break;
      }

      //Stat Bar
      const statBar = document.createElement("div")
      statBar.classList.add("stat-bar")
      
      //Value and Bar container
      const statBarContainer = document.createElement("div")
      statBarContainer.classList.add("stats-value-and-bar")

      //Stat-bar Value
      const statValue = document.createElement("span")
      statValue.classList.add("stat-value")
      statValue.innerText = stats[i]

      //Bar color
      const statBarColor = document.createElement("div")
      statBarColor.classList.add("stat-bar-bg")
      if (stats[i] >= 170 ) {
        statBarColor.style.width = `${(stats[i] / 2.55)}%`
      } else {
        statBarColor.style.width = `${(stats[i] / 1.8)}%`
      }

      
      //Incrust
      statBar.appendChild(statBarColor)
      statBarContainer.appendChild(statValue)
      statBarContainer.appendChild(statBar)
      statRow.appendChild(statName)
      statRow.appendChild(statBarContainer)
      statsContainer.appendChild(statRow)
    }

    //Incrustar Todo
    // spriteAndStats.appendChild(spriteAndType)
    // spriteAndStats.appendChild(statsContainer)
    modal.appendChild(nameDiv)
    modal.appendChild(spriteAndType)
    modal.appendChild(statsContainer)

  }
}
  

    
  



  