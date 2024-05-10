var epCount = 0;

function addCampo() {
  const divEle = document.getElementById("inputFields");
  const newDiv = document.createElement('div');
  newDiv.innerHTML = `
    <div class='control block-cube block-input'>
    <input type="text" id="ep_nome_${epCount}" name="eps[${epCount}][nome]" placeholder="Nome do Ep">
      <div class='bg-top'>
        <div class='bg-inner'></div>
      </div>
      <div class='bg-right'>
        <div class='bg-inner'></div>
      </div>
      <div class='bg'>
        <div class='bg-inner'></div>
      </div>
    </div>
  `;
  divEle.appendChild(newDiv);
  epCount++;
};

var epCountEp = 0;

function addCampoEp() {
  const divEle = document.getElementById("inputFields");
  const newDiv = document.createElement('div');
  newDiv.innerHTML = `
      <div class='control block-cube block-input'>
      <input type="text" id="ep_lista_musicas_${epCountEp}" name="eps[${epCountEp}][lista_musicas]" placeholder="Música">
        <div class='bg-top'>
          <div class='bg-inner'></div>
        </div>
        <div class='bg-right'>
          <div class='bg-inner'></div>
        </div>
        <div class='bg'>
          <div class='bg-inner'></div>
        </div>
      </div>
    `;
  divEle.appendChild(newDiv);
  epCountEp++;
};


document.querySelector("html").classList.add('js');

var fileInput = document.querySelector(".input-file"),
  button = document.querySelector(".input-file-trigger"),
  the_return = document.querySelector(".file-return");

button.addEventListener("keydown", function (event) {
  if (event.keyCode == 13 || event.keyCode == 32) {
    fileInput.focus();
  }
});
button.addEventListener("click", function (event) {
  fileInput.focus();
  return false;
});
fileInput.addEventListener("change", function (event) {
  the_return.innerHTML = this.value;
});