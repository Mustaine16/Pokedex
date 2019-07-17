


function showFullCard() {
  const cards = document.querySelectorAll(".pkmn-card");
  console.log(cards);
  
  
  cards.forEach(card => {
    card.addEventListener("click", function (event) {
      let card = event.target;
      console.log(card);
      

      card.classList.toggle("open");
      card.childNodes[2].classList.toggle("stats-open")

      bodyScrollLock.disableBodyScroll(card);//Blockea el scroll de fondo

      if (!(card.classList.contains("open"))) {
        bodyScrollLock.enableBodyScroll(card);
      }
      
    })
  });

}