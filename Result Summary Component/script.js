fetch("data.json")
  .then((response) => response.json())
  .then((data) => fillContent(data))
  .catch((error) => {
    console.log(error);
  });

function fillContent(data) {
  const individuals = document.getElementsByClassName("individual");
  Array.from(individuals).forEach((element, index) => {
    element.innerHTML = `
    <p><img src="${data[index].icon}" alt="icon" /> ${data[index].category}</p>          
  <p class="total"><span class="obtain">${data[index].score}</span> / 100</p>`;
  });
}
