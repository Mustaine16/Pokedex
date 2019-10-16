"use strict";

class Pokemon {
  constructor(pk) {
    // pk ---> El pokemon obtenido a traves de un fetch
    this.name = pk.species.name;
    this.sprite = new Image();
    this.spriteShiny = new Image();
    this.sprite.src = pk.sprites.front_default;
    this.spriteShiny.src = pk.sprites.front_shiny;
    this.types = pk.types; //Para añadir si o si hay que invocar a la funcion getTypes()
    this.hp = pk.stats[5].base_stat;
    this.attack = pk.stats[4].base_stat;
    this.defense = pk.stats[3].base_stat;
    this.speed = pk.stats[0].base_stat;
    this.attackSp = pk.stats[2].base_stat;
    this.defenseSp = pk.stats[1].base_stat;
    this.evolutionsUrl = pk.species.url;
    this.damage = {
      attack: {
        quadruple: [],
        double: [],
        half: [],
        quarter: [],
        none: []
      },
      defense: {
        quadruple: [],
        double: [],
        half: [],
        quarter: [],
        none: []
      }
    };
  }

  createCard() {
    //Card para cada pokemon
    const card = document.createElement("div");
    card.classList.add("pkmn-card");
    card.classList.add(`${this.name}`);

    //----Nombre
    const name = document.createElement("div");
    name.classList.add("pkmn-name");
    name.innerText = this.name;

    //---Sprites
    const assetDiv = document.createElement("div");
    assetDiv.classList.add("asset");
    const asset = this.sprite;
    asset.classList.add(`sprite-${this.name}`);
    assetDiv.appendChild(asset);

    //Types

    const typeArr = this.getTypes();

    //Para definir el fondo de cada mini-card dependiendo de su tipo
    if (typeArr.length > 1) {
      card.classList.add(`${typeArr[1]}`);
    } else {
      card.classList.add(`${typeArr[0]}`);
    }

    ///Incrustar TODO

    const pkmnList = document.querySelector(".pkmn-list");

    card.appendChild(name);
    card.appendChild(assetDiv);
    pkmnList.appendChild(card);
  }

  getTypes() {
    //Verificar la cantidad de tipos que puede ser un pokemon (Por ejemplo Blubasaur es tipo planta y veneno)

    const typeArr = [];
    this.types.forEach((e, i) => {
      let typeName = e.type.name;
      typeArr.push(typeName);
    });

    return typeArr;
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
              name: evoData.species.name
            });

            do {
              let numberOfEvolutions = evoData.evolves_to.length;

              if (numberOfEvolutions >= 1) {
                for (let i = 0; i < numberOfEvolutions; i++) {
                  evoChain.push({
                    name: evoData.evolves_to[i].species.name,
                    min_level: !evoData.evolves_to[i]
                      ? 1
                      : evoData.evolves_to[i].evolution_details[0].min_level,
                    trigger: !evoData.evolves_to[i]
                      ? null
                      : evoData.evolves_to[i].evolution_details[0].trigger.name,
                    item: !evoData.evolves_to[i]
                      ? null
                      : evoData.evolves_to[i].evolution_details[0].item
                  });
                }
              }

              evoData = evoData["evolves_to"][1] || evoData["evolves_to"][0];

              // this.evolutions[0].id
            } while (!!evoData && evoData.hasOwnProperty("evolves_to"));

            this.evolutions = evoChain;
            console.log(evoChain);
            // this.evolutions[1].id()
          });
      });
  }

  getEvolutionsSprites() {
    this.evolutions.forEach(ev => {
      ev.sprite = document.querySelector(`.sprite-${ev.name}`);
    });
  }

  incrustEvolutions(modal) {
    if (this.evolutions.length > 1) {
      //------------Container and Title "Evolutions"---------------------

      const containerEvolutions = document.createElement("div");
      const containerEvolutionsBrand = document.createElement("div");

      containerEvolutions.classList.add("evs-container");
      containerEvolutionsBrand.classList.add("evolutions-title");
      containerEvolutionsBrand.innerText = "Evolutions";

      //First Evolution-----------------------------------

      const firstEvolution = this.crearRowEvolution(0, 1);

      //Append Evolution

      containerEvolutions.appendChild(containerEvolutionsBrand);
      containerEvolutions.appendChild(firstEvolution);

      //Append in modal

      modal.appendChild(containerEvolutions);

      //Second Evolution-----------------------------------

      if (this.evolutions.length === 3) {
        //Evolution row
        const secondEvolution = this.crearRowEvolution(1, 2);

        //Append
        containerEvolutions.appendChild(secondEvolution);
        modal.append(containerEvolutions);
      }

      //Eevees, Tyrogue, Gardevoir, Wurmple----------------------------------------------

      if (this.evolutions.length > 3) {
        //Eevee

        if (this.evolutions.length === 9) {
          for (let i = 2; i < 8; i++) {
            //Pokemons
            let evolution = this.crearRowEvolution(0, i);

            //Apends
            containerEvolutions.appendChild(evolution);
          }

          modal.appendChild(containerEvolutions);
        } else {
          //Tyrogue / Hitmonlee / Hitmonchan / Hitmontop

          if (this.evolutions[0].name == "tyrogue") {
            //Pokemons
            let hitmonchan = this.crearRowEvolution(0, 2);
            let hitmontop = this.crearRowEvolution(0, 3);

            //Apends
            containerEvolutions.appendChild(hitmonchan);
            containerEvolutions.appendChild(hitmontop);
            modal.appendChild(containerEvolutions);
          }

          //Ralts / Kirlia / Gardevoir / Gallade
          else if (this.evolutions[0].name == "ralts") {
            //Pokemon
            let gardevoir = this.crearRowEvolution(1, 2);
            let gallade = this.crearRowEvolution(1, 3);

            //Appends
            containerEvolutions.appendChild(gardevoir);
            containerEvolutions.appendChild(gallade);
            modal.appendChild(containerEvolutions);
          }

          //Wurmple / Silcoon / BeautiFly / Dustox
          else if (this.evolutions[0].name == "wurmple") {
            //Pokemons
            let cascoon = this.crearRowEvolution(0, 3);
            let beautiFly = this.crearRowEvolution(1, 2);
            let dustox = this.crearRowEvolution(3, 4);

            //Appends
            containerEvolutions.appendChild(cascoon);
            containerEvolutions.appendChild(beautiFly);
            containerEvolutions.appendChild(dustox);
            modal.appendChild(containerEvolutions);
          }
        }
      }
    } else {
      //En caso de que el pokemon no tenga evoluciones

      const containerEvolutions = document.createElement("div");
      const containerEvolutionsBrand = document.createElement("div");
      const noEvolutions = document.createElement("div");

      containerEvolutions.classList.add("evs-container");
      containerEvolutionsBrand.classList.add("evolutions-title");
      noEvolutions.classList.add("empty");
      containerEvolutionsBrand.innerText = "Evolutions";
      noEvolutions.innerText = `${this.name} has no evolutions`;

      containerEvolutions.appendChild(containerEvolutionsBrand);
      containerEvolutions.appendChild(noEvolutions);
      modal.appendChild(containerEvolutions);
    }
  }

  incrustEvolutionsTriggers(i) {
    if (this.evolutions[i].min_level != null) {
      return `level ${this.evolutions[i].min_level}`;
    } else if (this.evolutions[i].trigger == "use-item") {
      return `using ${this.evolutions[i].item.name}`;
    } else if (this.evolutions[i].trigger == "trade") {
      return "at trade";
    } else {
      return "at high friendship";
    }
  }

  incrustStats(miniCard, modal) {
    //Name
    const nameDiv = miniCard.children[0].cloneNode(true);
    nameDiv.classList.add("name-open");

    //Sprite and Type container

    const spriteAndType = document.createElement("div");
    spriteAndType.classList.add("sprite-and-type");

    //Sprite

    const spriteDiv = miniCard.children[1].cloneNode(true);
    spriteAndType.appendChild(spriteDiv);

    //Sprite Shiny
    const shinySprite = this.spriteShiny;
    shinySprite.classList.add("shiny");
    spriteDiv.appendChild(shinySprite);

    //Shiny text-box
    const shinyText = document.createElement("span");
    shinyText.innerText = "Shiny";
    shinyText.classList.add("shiny-text");
    spriteDiv.appendChild(shinyText);

    //---Types

    const typeArr = this.getTypes();

    const type = document.createElement("div");
    type.classList.add("types");

    //Incrustar los Tipos en los stats del pokemon

    if (typeArr.length > 1) {
      const typeElement1 = document.createElement("span");
      typeElement1.innerText = `${typeArr[1]}`;
      typeElement1.classList.add(`${typeArr[1]}-cardy`);
      typeElement1.classList.add("type");
      type.appendChild(typeElement1);

      const typeElement2 = document.createElement("span");
      typeElement2.innerText = `${typeArr[0]}`;
      typeElement2.classList.add(`${typeArr[0]}-cardy`);
      typeElement2.classList.add("type");
      type.appendChild(typeElement2);
      spriteAndType.appendChild(type);
    } else {
      const typeElement = document.createElement("span");
      typeElement.innerText = `${typeArr[0]}`;
      typeElement.classList.add(`${typeArr[0]}-cardy`);
      typeElement.classList.add("types");
      type.appendChild(typeElement);
      spriteAndType.appendChild(type);
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
    statsContainer.classList.add("stats-container");

    for (let i = 0; i < stats.length; i++) {
      //Each Stat Row Container
      const statRow = document.createElement("div");
      statRow.classList.add("stats-row");

      //Stat row content (Name --- Value)
      const statName = document.createElement("span");
      switch (i) {
        case 0:
          statName.innerText = "HP";
          break;
        case 1:
          statName.innerText = "Attack";
          break;
        case 2:
          statName.innerText = "Defense";
          break;
        case 3:
          statName.innerText = "Speed";
          break;
        case 4:
          statName.innerText = "Sp Att.";
          break;
        case 5:
          statName.innerText = "Sp Def.";
          break;
      }

      //Stat Bar
      const statBar = document.createElement("div");
      statBar.classList.add("stat-bar");

      //Value and Bar container
      const statBarContainer = document.createElement("div");
      statBarContainer.classList.add("stats-value-and-bar");

      //Stat-bar Value
      const statValue = document.createElement("span");
      statValue.classList.add("stat-value");
      statValue.innerText = stats[i];

      //Bar color
      const statBarColor = document.createElement("div");
      statBarColor.classList.add("stat-bar-bg");
      if (stats[i] >= 170) {
        setTimeout(() => {
          statBarColor.style.width = `${stats[i] / 2.55}%`;
        }, i * 100);
      } else {
        setTimeout(() => {
          statBarColor.style.width = `${stats[i] / 1.8}%`;
        }, i * 100);
      }

      //Incrust
      statBar.appendChild(statBarColor);
      statBarContainer.appendChild(statValue);
      statBarContainer.appendChild(statBar);
      statRow.appendChild(statName);
      statRow.appendChild(statBarContainer);
      statsContainer.appendChild(statRow);
    }

    //Incrustar Todo
    // spriteAndStats.appendChild(spriteAndType)
    // spriteAndStats.appendChild(statsContainer)
    modal.appendChild(nameDiv);
    modal.appendChild(spriteAndType);
    modal.appendChild(statsContainer);
  }

  async getDamageRelations() {
    let DamageComparation = {
      attack: [
        {
          double: [],
          half: [],
          none: []
        },
        {
          double: [],
          half: [],
          none: []
        }
      ],
      defense: {
        quadruple: [],
        double: [],
        half: [],
        quarter: [],
        none: []
      }
    };

    //Arrays para pushear cada tipo y despues comparar y ver si se encuentra, y ha partir de ahi caluclar x4- x2- x0.5- x0.25 o none
    let defDbArr = [];
    let defHalfArr = [];
    let defNoneArr = [];

    for (let i = 0; i < this.types.length; i++) {
      const url = this.types[i].type.url;

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
            DamageComparation.attack[i].double.push(attDouble[index].name);
          }

          //---Half

          for (let index = 0; index < attHalf.length; index++) {
            DamageComparation.attack[i].half.push(attHalf[index].name);
          }

          //---None
          for (let index = 0; index < attNone.length; index++) {
            DamageComparation.attack[i].none.push(attNone[index].name);
          }

          if (this.types.length == 1) {
            DamageComparation.attack.pop();
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
              defDbArr.push(defDouble[index].name);
            }

            //Half
            for (let index = 0; index < defHalf.length; index++) {
              defHalfArr.push(defHalf[index].name);
            }

            //None
            for (let index = 0; index < defNone.length; index++) {
              defNoneArr.push(defNone[index].name);
            }

            //En caso de que el pokemon solo sea de un Tipo

            if (this.types.length == 1) {
              //Pushear los arrays Defensivos al Objeto Model Final

              defDbArr.length > 0
                ? defDbArr.forEach(e =>
                    DamageComparation.defense.double.push(e)
                  )
                : console.log("none double", this.name);

              defHalfArr.length > 0
                ? defHalfArr.forEach(e =>
                    DamageComparation.defense.half.push(e)
                  )
                : console.log("none half", this.name);

              defNoneArr.length > 0
                ? defNoneArr.forEach(e =>
                    DamageComparation.defense.none.push(e)
                  )
                : console.log("none none", this.name);

              //Resultado final seteado
              this.damage = DamageComparation;
              console.log(this.damage);
            }
          } else {
            //Double
            for (let index = 0; index < defDouble.length; index++) {
              verify(defDouble[index].name, "double");
            }

            //Half
            for (let index = 0; index < defHalf.length; index++) {
              verify(defHalf[index].name, "half");
            }

            //None
            for (let index = 0; index < defNone.length; index++) {
              verify(defNone[index].name, "none");
            }

            console.log(defNoneArr);
            //Pushear los arrays al Objeto Model Final

            defDbArr.length > 0
              ? defDbArr.forEach(e => DamageComparation.defense.double.push(e))
              : console.log("none double", this.name);

            defHalfArr.length > 0
              ? defHalfArr.forEach(e => DamageComparation.defense.half.push(e))
              : console.log("none half", this.name);

            defNoneArr.length > 0
              ? defNoneArr.forEach(e => DamageComparation.defense.none.push(e))
              : console.log("none none", this.name);

            //Resultado final seteado
            this.damage = DamageComparation;
            console.log(this.damage);
          }
        });
    }

    function verify(stat, value) {
      switch (value) {
        case "double":
          if (defDbArr.some(e => e == `${stat}`) && stat) {
            //Busca el indice del elemento y luego lo elimina en Double

            let i = defDbArr.indexOf(stat);
            defDbArr.splice(i, 1);

            //Pushear en Quadruple

            DamageComparation.defense.quadruple.push(stat);
          } else if (defHalfArr.some(e => e == `${stat}`) && stat) {
            //Busca el indice del elemento y luego lo elimina en Half

            let i = defHalfArr.indexOf(stat);
            defHalfArr.splice(i, 1);
          } else if (!(defNoneArr.some(e => e == stat) && stat)) {
            //Se pushea de manera normal
            defDbArr.push(stat);
          }

          break;
        case "half":
          if (defDbArr.some(e => e == `${stat}`)) {
            //Busca el indice del elemento y luego lo elimina en Double

            let i = defDbArr.indexOf(stat);

            defDbArr.splice(i, 1);
          } else if (defHalfArr.some(e => e == `${stat}`)) {
            //Busca el indice del elemento y luego lo elimina en Half

            let i = defHalfArr.indexOf(stat);
            defHalfArr.splice(i, 1);

            //Pushea el valor a 0.25x

            DamageComparation.defense.quarter.push(stat);
          } else if (!(defNoneArr.some(e => e == stat) && stat)) {
            //Se pushea de manera normal
            defHalfArr.push(stat);
          }

          break;
        case "none":
          if (defDbArr.some(e => e == `${stat}`)) {
            //Busca el indice del elemento y luego lo elimina en Double

            let i = defDbArr.indexOf(stat);
            defDbArr.splice(i, 1);

            //Pushea el valor a None

            DamageComparation.defense.none.push(stat);
          } else if (defHalfArr.some(e => e == `${stat}`)) {
            //Busca el indice del elemento y luego lo elimina en Half

            let i = defHalfArr.indexOf(stat);
            defHalfArr.splice(i, 1);

            //Pushea el valor a None

            DamageComparation.defense.none.push(stat);
          } else if (!defNoneArr.some(e => e == stat)) {
            //Se pushea normalmente
            DamageComparation.defense.none.push(stat);
          }

          break;
        default:
          console.log("error");
          break;
      }
    }
  }

  incrustDamageRelations(modal) {
    const container = document.createElement("div");
    const containerAttDef = document.createElement("div");
    const containerTitle = document.createElement("div");

    //Container
    container.classList.add("damage-container");
    containerTitle.innerText = "Damage Relation";
    containerTitle.classList.add("damage-title");

    //Container para aplicar flex column - row
    containerAttDef.classList.add("container-att-def");

    /**********
     *
     *
     * Offensive
     *
     *
     ***********/

    //Container ,card por tipo, counter (Ej x2,x0.5,etc) mas cada mini cardy
    const offensiveContainerTypes = document.createElement("div");
    const offensiveContainer = document.createElement("div");
    const attackTitle = document.createElement("div");
    const typeTitle = document.createElement("div");
    const typeCardy = document.createElement("div");
    const counterContainer = document.createElement("div");
    const counter = document.createElement("p");
    const counterTypes = document.createElement("div");

    offensiveContainer.classList.add("offensive-container");
    offensiveContainerTypes.classList.add("offensive-container-by-types");
    typeCardy.classList.add("type-cardy");
    counterContainer.classList.add("counter-container");
    counter.classList.add("counter");
    counterTypes.classList.add("counter-types");
    attackTitle.classList.add("attack-title");
    attackTitle.innerText = "Attack";

    //Logic

    const attack = this.damage.attack;

    for (let i = 0; i < attack.length; i++) {
      //Main Type (Se crea un Header para el tipo al que se esta refiriendo)
      const offensiveContainerByType = document.createElement("div");
      const typeTitles = typeTitle.cloneNode();
      typeTitles.classList.add(`${this.types[i].type.name}-cardy`);
      typeTitles.classList.add("damage-type-title");
      offensiveContainerByType.classList.add("offensive");
      typeTitles.innerText = `${this.types[i].type.name}`;
      offensiveContainerByType.appendChild(typeTitles);

      //Double
      attacking(attack[i].double, "X2", i);

      //Half
      attacking(attack[i].half, "x0.5", i);

      //None
      attacking(attack[i].none, "X0", i);

      //Final Appends
      function attacking(quantity, number, i) {
        if (quantity.length > 0) {
          let p = counter.cloneNode(true);
          let counterContainer_ = counterContainer.cloneNode(true);
          let counterTypes_ = counterTypes.cloneNode(true);

          p.innerText = number;
          counterContainer_.appendChild(p);

          quantity.forEach(e => {
            const typeCardys = typeCardy.cloneNode(true);

            typeCardys.classList.add(`${e}-cardy`);
            typeCardys.innerText = `${e}`;

            counterTypes_.appendChild(typeCardys);
          });

          counterContainer_.appendChild(counterTypes_);
          offensiveContainerByType.appendChild(counterContainer_);
        }

        offensiveContainerTypes.prepend(offensiveContainerByType);
      }
    }

    /**
     *
     *
     * Defense
     *
     *
     */

    //Container y card por tipo, mas cada mini cardy
    const defensiveContainer = document.createElement("div");
    const defenseTitle = document.createElement("div");
    const typeDefensive = document.createElement("div");

    defensiveContainer.classList.add("defensive-container");
    typeDefensive.classList.add("type-offensive");
    defenseTitle.classList.add("defense-title");
    defenseTitle.innerText = "Takes damage from";

    //Logic

    const defense = this.damage.defense;

    //Container que contiene los damageRelations calculados
    const defenseCalculated = document.createElement("div");
    defenseCalculated.classList.add("defensive");

    //Div con el background de el o los tipos que se usan para calcular la Damage Relation
    const typesDefense = document.createElement("div");
    typesDefense.classList.add("defense-color");

    if (this.types.length > 1) {
      // typesDefense.innerText = `${this.types[1].type.name} / ${this.types[0].type.name} `
      typesDefense.style.background = `linear-gradient(to right,var(--${this.types[1].type.name}-bg-open) 0%, var(--${this.types[1].type.name}-bg-open) 50%,var(--${this.types[0].type.name}-bg-open) 50%, var(--${this.types[0].type.name}-bg-open) 100%)`;

      for (let i = 0; i < this.types.length; i++) {
        const typeName = document.createElement("span");
        typeName.innerText = this.types[i].type.name;
        typesDefense.prepend(typeName);
      }
    } else {
      const typeName = document.createElement("span");
      typeName.innerText = this.types[0].type.name;
      typesDefense.style.background = `var(--${this.types[0].type.name}-bg-open)`;
      typesDefense.appendChild(typeName);
    }

    defenseCalculated.prepend(typesDefense);

    //Quadruple
    defending(defense.quadruple, "X4");

    //Double
    defending(defense.double, "X2");

    //Half
    defending(defense.half, "X0.5");

    //Quarter
    defending(defense.quarter, "X0.25");

    //None
    defending(defense.none, "X0");

    //Final Appends
    defensiveContainer.prepend(defenseCalculated);
    offensiveContainer.appendChild(attackTitle);
    offensiveContainer.appendChild(offensiveContainerTypes);

    defensiveContainer.prepend(defenseTitle);
    container.appendChild(containerTitle);
    containerAttDef.appendChild(offensiveContainer);
    containerAttDef.appendChild(defensiveContainer);
    container.appendChild(containerAttDef);
    modal.appendChild(container);

    function defending(quantity, number) {
      if (quantity && quantity.length > 0) {
        let p = counter.cloneNode(true);
        let counterContainer_ = counterContainer.cloneNode(true);
        let counterTypes_ = counterTypes.cloneNode(true);

        p.innerText = number;
        counterContainer_.appendChild(p);

        quantity.forEach(e => {
          const typeCardys = typeCardy.cloneNode(true);
          typeCardys.classList.add(`${e}-cardy`);
          typeCardys.innerText = `${e}`;
          counterTypes_.appendChild(typeCardys);
        });

        counterContainer_.appendChild(counterTypes_);
        defenseCalculated.appendChild(counterContainer_);
      }
    }
  }

  incrustBackArrow(modal) {
    const arrow = new Image();
    arrow.src = "./img/left-arrow.svg";
    arrow.classList.add("back-arrow");

    modal.appendChild(arrow);
    modalLoaderContainer.style.display = "none";
    modalLoader.style.display = "none";
    arrow.addEventListener("click", () => {
      modal.classList.toggle("modal-open");

      if (!modal.classList.contains("modal-open")) {
        bodyScrollLock.enableBodyScroll(modal);
      }

      setTimeout(() => {
        let modalColor = modal.classList[1];

        modalLoaderContainer.classList.remove(modalColor);
        modal.classList.remove(modalColor);

        modal.innerHTML = "";
      }, 200);
    });
  }

  incrustEvolutionsLinks(modal) {
    let evolutions = document.querySelectorAll();
  }

  crearRowEvolution(i1, i2) {
    const row = document.createElement("div");
    const pokeBase = document.createElement("div");
    const pokeEvolution = document.createElement("div");
    const arrowDiv = document.createElement("div");
    const arrow = document.createElement("img");
    const arrowText = document.createElement("span");
    const pokeBaseName = document.createElement("span");
    const pokeEvolutionName = document.createElement("span");
    const pokeBaseSprite = document.createElement("img");
    const pokeEvolutionSprite = document.createElement("img");

    //ClassList
    row.classList.add("evs-list");
    pokeBase.classList.add("ev");
    pokeEvolution.classList.add("ev");
    arrowDiv.classList.add("arrow-div");
    arrow.classList.add("arrow");

    //Names
    pokeBaseName.innerText = this.evolutions[i1].name;
    pokeEvolutionName.innerText = this.evolutions[i2].name;

    //Sprites
    pokeBaseSprite.src = `${this.evolutions[i1].sprite.src}`;
    pokeEvolutionSprite.src = `${this.evolutions[i2].sprite.src}`;

    //Arrow
    arrow.src = "./img/arrow.svg";
    arrowText.innerText = this.incrustEvolutionsTriggers(i2);

    //Apends
    pokeBase.appendChild(pokeBaseSprite);
    pokeBase.appendChild(pokeBaseName);

    pokeEvolution.appendChild(pokeEvolutionSprite);
    pokeEvolution.appendChild(pokeEvolutionName);

    arrowDiv.appendChild(arrow);
    arrowDiv.appendChild(arrowText);

    //Final Apends

    row.appendChild(pokeBase);
    row.appendChild(arrowDiv);
    row.appendChild(pokeEvolution);

    return row;
  }

  shinySprite(modal) {
    const spriteDiv = modal.children[2].children[0];
    const sprite = modal.children[2].children[0].children[0];
    const shiny = modal.children[2].children[0].children[1];
    const shinyText = modal.children[2].children[0].children[2];

    spriteDiv.addEventListener("click", () => {
      sprite.classList.toggle("sprite-off");
      shiny.classList.toggle("shiny-active");
      shinyText.classList.toggle("shiny-text-active");
    });
  }
}
