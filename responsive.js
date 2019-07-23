


function showFullCard() {
  console.log("dd");
  
  const cards = document.querySelectorAll(".pkmn-card");
  
  for (i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function (event) {
      let card = event.target;
     // let type = this.childNodes[1].childNodes[1].childNodes[0].classList[0] //Es el tipo de cada pokemon, para poder hacer que su background sea igual al color del borde
      

      card.classList.toggle("card-open");
      card.childNodes[0].classList.toggle("name-open")
      card.childNodes[1].childNodes[1].classList.toggle("types-open")

      card.childNodes[2].classList.toggle("stats-open")
      card.childNodes[3].classList.toggle("evs-open")


      bodyScrollLock.disableBodyScroll(card);//Blockea el scroll de fondo

      if (!(card.classList.contains("card-open"))) {
       bodyScrollLock.enableBodyScroll(card);
      }
    })
  };
}