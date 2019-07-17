


function showFullCard() {
  const cards = document.querySelectorAll(".pkmn-card");
  console.log(cards);
  
  
  cards.forEach(card => {
    card.addEventListener("click", function (event) {
      let card = event.target;
      console.log(card);
      

      card.classList.toggle("card-open");
      card.childNodes[2].classList.toggle("stats-open")
      card.childNodes[0].classList.toggle("name-open")

      bodyScrollLock.disableBodyScroll(card);//Blockea el scroll de fondo

      if (!(card.classList.contains("card-open"))) {
        bodyScrollLock.enableBodyScroll(card);
      }
      
    })
  });

}