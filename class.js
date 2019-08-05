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
    this.attackSp = pk.stats[2].base_stat;
    this.defenseSp = pk.stats[1].base_stat;
    this.evolutionsUrl = pk.species.url;
    this.damage = {
      "attack": {
        "quadruple": [],
        "double": [],
        "half": [],
        "quarter": [],
        "none": []
      },
      "defense": {
        "quadruple": [],
        "double": [],
        "half": [],
        "quarter": [],
        "none": []
      },
    }
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

                for (let i = 0; i < numberOfEvolutions; i++) {
                  evoChain.push({
                    "name": evoData.evolves_to[i].species.name,
                    "min_level": !evoData.evolves_to[i] ? 1 : evoData.evolves_to[i].evolution_details[0].min_level,
                    "trigger": !evoData.evolves_to[i] ? null : evoData.evolves_to[i].evolution_details[0].trigger.name,
                    "item": !evoData.evolves_to[i] ? null : evoData.evolves_to[i].evolution_details[0].item
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
    } else if (this.evolutions[i].trigger == "use-item") {
      return `using ${this.evolutions[i].item.name}`
    } else if (this.evolutions[i].trigger == "trade") {
      return 'at trade'
    } else {
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

    for (let i = 0; i < stats.length; i++) {

      //Each Stat Row Container
      const statRow = document.createElement("div");
      statRow.classList.add("stats-row")

      //Stat row content (Name --- Value)
      const statName = document.createElement("span")
      switch (i) {
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
      if (stats[i] >= 170) {
        setTimeout(() => {
          statBarColor.style.width = `${(stats[i] / 2.55)}%`
        }, i * 100);
      } else {
        setTimeout(() => {
          statBarColor.style.width = `${(stats[i] / 1.8)}%`
        }, i * 100);
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

  async getDamageRelations() {

    let DamageComparation =
    {
      "attack": [
        {
          "double": [],
          "half": [],
          "none": []
        },
        {
          "double": [],
          "half": [],
          "none": []
        }
      ],
      "defense": {
        "quadruple": [],
        "double": [],
        "half": [],
        "quarter": [],
        "none": []
      }
    }
    
    //Arrays para pushear cada tipo y despues comparar y ver si se encuentra, y ha partir de ahi caluclar x4- x2- x0.5- x0.25 o none
    let defDbArr = []
    let defHalfArr = []
    let defNoneArr = []

    for (let i = 0; i < this.types.length; i++) {

      const url = this.types[i].type.url

      await fetch(`${url}`)
        .then(res => res.json())
        .then(res => {

          /*********************
          * 
          * 
          * Attacking Damage
          *
          *
          *********************/
      
          const attDouble = res.damage_relations.double_damage_to;
          const attHalf = res.damage_relations.half_damage_to;
          const attNone = res.damage_relations.no_damage_to;
          
          //---Double

          for (let index = 0; index < attDouble.length; index++) {
            DamageComparation.attack[i].double.push(attDouble[index].name)
          }
          
          //---Half

          for (let index = 0; index < attHalf.length; index++) {
            DamageComparation.attack[i].half.push(attHalf[index].name)
          }
   
          //---None
          for (let index = 0; index < attNone.length; index++) {
            DamageComparation.attack[i].none.push(attNone[index].name)
          }

          if (this.types.length == 1) {
            DamageComparation.attack.pop()
          }

          
          /*********************
          * 
          * 
          * Defensive Damage
          *
          *
          *********************/
        
          const defDouble = res.damage_relations.double_damage_from;
          const defHalf = res.damage_relations.half_damage_from;
          const defNone = res.damage_relations.no_damage_from;
         
          //En el primer tipo simplemente se pushea todo, y en el segundo se verifica/compara/calcula las resistencias y debilidades finales
          if (i === 0) {

            //Double
            for (let index = 0; index < defDouble.length; index++) {
              defDbArr.push(defDouble[index].name)
            }
         
            //Half
            for (let index = 0; index < defHalf.length; index++) {
              defHalfArr.push(defHalf[index].name)
            }

            //None
            for (let index = 0; index < defNone.length; index++) {
              defNoneArr.push(defNone[index].name)
            }
  

            //En caso de que el pokemon solo sea de un Tipo

            if (this.types.length == 1) {


              //Pushear los arrays Defensivos al Objeto Model Final 

              (defDbArr.length > 0) ? DamageComparation.defense.double.push(defDbArr) : console.log("none double", this.name);
          
              (defHalfArr.length > 0) ? DamageComparation.defense.half.push(defHalfArr) : console.log("none half", this.name);
              
              (defNoneArr.length > 0) ? DamageComparation.defense.none.push(defNoneArr) : console.log("none none");

              //Resultado final seteado
              this.damage = DamageComparation
              console.log(this.damage);
            }
            
          } else {

            //Double
            for (let index = 0; index < defDouble.length; index++) {
              verify(defDouble[index].name,"double")
            }
         
            //Half
            for (let index = 0; index < defHalf.length; index++) {
              verify(defHalf[index].name,"half")
            }

            //None
            for (let index = 0; index < defNone.length; index++) {
              verify(defNone[index].name,"none")
            }

            console.log(defNoneArr);
            //Pushear los arrays al Objeto Model Final

            (defDbArr.length > 0 )? DamageComparation.defense.double.push(defDbArr): console.log("none double",this.name);
          
            (defHalfArr.length > 0) ? DamageComparation.defense.half.push(defHalfArr) : console.log("none half", this.name);
              
            (defNoneArr.length > 0) ? DamageComparation.defense.none.push(defNoneArr) : console.log("none none", this.name);

            //Resultado final seteado
            this.damage = DamageComparation
            console.log(this.damage);
          }
        })
    }


    function verify(stat, value) {
      switch (value) {
        case "double":
          if (defDbArr.some(e => e == `${stat}`) && stat) {

            //Busca el indice del elemento y luego lo elimina en Double
    
            let i = defDbArr.indexOf(stat)
            defDbArr.splice(i, 1)
            
            //Pushear en Quadruple
    
            DamageComparation.defense.quadruple.push(stat)
          
          } else if (defHalfArr.some(e => e == `${stat}`) && stat) {
            
            //Busca el indice del elemento y luego lo elimina en Half
    
            let i = defHalfArr.indexOf(stat)
            defHalfArr.splice(i, 1)
    
          } else if(!(defNoneArr.some(e => e == stat) && stat)){
          //Se pushea de manera normal
          defDbArr.push(stat)
          }

          break;
        case "half":
          if (defDbArr.some(e => e == `${stat}`)) {

            //Busca el indice del elemento y luego lo elimina en Double
    
            let i = defDbArr.indexOf(stat)
            
            defDbArr.splice(i, 1)
            
          } else if (defHalfArr.some(e => e == `${stat}`)) {
              
            //Busca el indice del elemento y luego lo elimina en Half
      
            let i = defHalfArr.indexOf(stat)
            defHalfArr.splice(i, 1)
            
            
            //Pushea el valor a 0.25x

            DamageComparation.defense.quarter.push(stat)
      
          } else if(!(defNoneArr.some(e => e == stat) && stat)){
            //Se pushea de manera normal
            defHalfArr.push(stat)
          }

          break;
        case "none":
          
            if (defDbArr.some(e => e == `${stat}`)) {
              //Busca el indice del elemento y luego lo elimina en Double
    
              let i = defDbArr.indexOf(stat)
              defDbArr.splice(i, 1)

              //Pushea el valor a None

              DamageComparation.defense.none.push(stat)
            
            } else if (defHalfArr.some(e => e == `${stat}`)) {
              
              //Busca el indice del elemento y luego lo elimina en Half
      
              let i = defHalfArr.indexOf(stat)
              defHalfArr.splice(i, 1)
            
              //Pushea el valor a None

              DamageComparation.defense.none.push(stat)
      
            } else if (!(defNoneArr.some(e => e == stat))) {
              //Se pushea normalmente
              DamageComparation.defense.none.push(stat)
            }
          
          break;
        default: console.log("error")
          break;
      }




    
    

    }
  }

  incrustDamageRelations(modal) {
    const container = document.createElement("div")
    const containerTitle = document.createElement("div")
    const containerButtons = document.createElement("div")
    const offensiveButton = document.createElement("div")
    const defensiveButton = document.createElement("div")

    //Container
    container.classList.add("damage-container")
    containerTitle.innerText = "Damage Relation"
    containerTitle.classList.add("damage-title")

    //Buttons
    containerButtons.classList.add("damage-button-container")
    offensiveButton.classList.add("damage-button")
    defensiveButton.classList.add("damage-button")
    offensiveButton.innerText = "Offensive"
    defensiveButton.innerText = "Defensive"

    /**********
    * 
    * 
    * Offensive
    * 
    * 
    ***********/

    //Container y card por tipo, mas cada mini cardy
    const offensiveContainer = document.createElement("div")
    const attackTitle = document.createElement("div")
    const typeOffensive = document.createElement("div")
    const typeCardy = document.createElement("div")

    offensiveContainer.classList.add("offensive-container")
    typeOffensive.classList.add("type-offensive")
    typeCardy.classList.add("type-cardy")
    attackTitle.classList.add("attack-title")
    attackTitle.innerText ="Attack"

    //Logic

    const attack = this.damage.attack;

    for (let i = 0; i < attack.length; i++){

      //Main Type (Se crea una cardy para el tipo al que se esta refiriendo)
      const offensiveContainerByType = document.createElement("div")
      offensiveContainerByType.classList.add("offensive")
      offensiveContainerByType.classList.add(`${this.types[i].type.name}-cardy`)   //Type Background Color
      offensiveContainerByType.innerText = `${this.types[i].type.name}`


      //Double
      if(attack[i].double.length > 0)
        attack[i].double.forEach((e) => {

          const typeCardys = typeCardy.cloneNode(true)

          typeCardys.classList.add(`${e}-cardy`)
          typeCardys.innerText = `x2  ${e}`

          offensiveContainerByType.appendChild(typeCardys)
        });
      
      //Half
      if(attack[i].half.length > 0)
      attack[i].half.forEach((e) => {

        const typeCardys = typeCardy.cloneNode(true)

        typeCardys.classList.add(`${e}-cardy`)
        typeCardys.innerText = `x0.5  ${e}`

        offensiveContainerByType.appendChild(typeCardys)
      });

      //None
      if(attack[i].none.length > 0)
      attack[i].none.forEach((e) => {

        const typeCardys = typeCardy.cloneNode(true)

        typeCardys.classList.add(`${e}-cardy`)
        typeCardys.innerText = `x0  ${e}`

        offensiveContainerByType.appendChild(typeCardys)
      });
      
      //Final Appends
      offensiveContainer.prepend(offensiveContainerByType)
    }

    /**
     * 
     * 
     * Defense
     * 
     * 
     */

    //Container y card por tipo, mas cada mini cardy
    const defensiveContainer = document.createElement("div")
    const defenseTitle = document.createElement("div")
    const typeDefensive = document.createElement("div")

    defensiveContainer.classList.add("offensive-container")
    typeDefensive.classList.add("type-offensive")
    defenseTitle.classList.add("attack-title")
    defenseTitle.innerText ="Defense"

    //Logic

    const defense = this.damage.defense;
    
    //Main Type (Se crea una cardy para el tipo al que se esta refiriendo)
    const defensiveContainerByType = document.createElement("div")
    defensiveContainerByType.classList.add("defensive")

    //Quadruple
    if(defense.quadruple && defense.quadruple.length > 0)
      defense.quadruple.forEach((e) => {
        console.log(e);
        
        const typeCardys = typeCardy.cloneNode(true)
        typeCardys.classList.add(`${e}-cardy`)
        typeCardys.innerText = `x4  ${e}`
        defensiveContainerByType.appendChild(typeCardys)
      });

    //Double
    if(defense.double && defense.double.length > 0)
      defense.double[0].forEach((e) => {
        console.log(e);
        
        const typeCardys = typeCardy.cloneNode(true)
        typeCardys.classList.add(`${e}-cardy`)
        typeCardys.innerText = `x2  ${e}`
        defensiveContainerByType.appendChild(typeCardys)
      });
    
    //Half
    if(defense.half && defense.half.length > 0)
    defense.half[0].forEach((e) => {
      const typeCardys = typeCardy.cloneNode(true)
      typeCardys.classList.add(`${e}-cardy`)
      typeCardys.innerText = `x0.5  ${e}`
      defensiveContainerByType.appendChild(typeCardys)
    });

    //Quarter
    if(defense.quarter && defense.quarter.length > 0)
      defense.quarter.forEach((e) => {
        console.log(e);
        
        const typeCardys = typeCardy.cloneNode(true)
        typeCardys.classList.add(`${e}-cardy`)
        typeCardys.innerText = `x0.25  ${e}`
        defensiveContainerByType.appendChild(typeCardys)
      });
    
    //None
    if(defense.none && defense.none.length > 0)
    defense.none.forEach((e) => {
      const typeCardys = typeCardy.cloneNode(true)
      typeCardys.classList.add(`${e}-cardy`)
      typeCardys.innerText = `x0  ${e}`
      defensiveContainerByType.appendChild(typeCardys)
    });
    
    //Final Appends
    defensiveContainer.prepend(defensiveContainerByType)
    

    containerButtons.appendChild(offensiveButton)
    containerButtons.appendChild(defensiveButton)

    container.appendChild(containerTitle)
    container.appendChild(attackTitle)
    container.appendChild(offensiveContainer)
    container.appendChild(defenseTitle)
    container.appendChild(defensiveContainer)
    modal.appendChild(container)

  }

  incrustBackArrow(modal){
    const arrow = new Image();
    arrow.src = "./img/left-arrow.svg"
    arrow.classList.add("back-arrow")

    modal.appendChild(arrow)

    arrow.addEventListener("click", () => {

      let modalColor = modal.classList[1]
  
      modal.classList.remove(modalColor)
      modal.classList.remove("modal-open")

      if (!(modal.classList.contains("modal-open"))) {
       bodyScrollLock.enableBodyScroll(modal);
      }
  
      modal.innerHTML = ""
  
    })
  }
  

    
  



} 