//A continuación creamos el codigo para consumir el API de Pokemon

const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");

let urlBase = "https://pokeapi.co/api/v2/pokemon/";

for (let i = 1; i <= 151; i++) {
    fetch(urlBase + i)
        .then((response) => response.json())
        .then(data => mostrarPokemon(data, "normal"))
    
}

function mostrarPokemon(poke, version) {

    //Declararemos los tipos de pokemon
    let types = poke.types.map((type) => `<p class="${type.type.name} type">${type.type.name}</p>`);
    types = types.join('');
    
    let pokeId = poke.id.toString();
    if (pokeId.length === 1){
        pokeId = "00" + pokeId;
    }else if (pokeId.length === 2){
        pokeId = "0" + pokeId;
    }

    const div = document.createElement("div");
    div.classList.add("pokemon");

    //Declaramos la imagen del pokemon
    let pokeImage;
    let versionTag;

    if(version === "shiny"){
        //Imagen Pokemon Shiny
        pokeImage = poke.sprites.other["official-artwork"].front_shiny;
        versionTag = "NORMAL"
    }else{
        //Imagen Pokemon Normal
        pokeImage = poke.sprites.other["official-artwork"].front_default;
        versionTag = "SHINY";
    }

    div.innerHTML= `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-image">
            <img id="image-id-${poke.id}" src="${pokeImage}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-name">${poke.name}</h2>
            </div>
            <div class="pokemon-type">
                ${types}
                <p class="version-${poke.id}" id="version-${poke.id}" onclick="shiny(${poke.id})">${versionTag}</p>
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}M</p>
                <p class="stat">${poke.weight}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);


}

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    
    //Vaciamos el listado de pokemon
    listaPokemon.innerHTML = "";
    
    const botonId = event.currentTarget.id;

    for (let i = 1; i <= 151; i++) {
        fetch(urlBase + i)
            .then((response) => response.json())
            .then(data => {

                if(botonId === "ver-todos"){
                    mostrarPokemon(data, "normal");
                }else if(botonId === "shiny"){
                    mostrarPokemon(data, "shiny");
                }else{
                    const types = data.types.map((type) => type.type.name);
                    console.log(types);

                    if (types.some(type => type.includes(botonId))){
                        mostrarPokemon(data, "normal");
                    }
                }
            })
        
    }
}))

function getImage(poke, version){
    //Declaramos la imagen del pokemon
    let pokeImage;

    if(version === "shiny"){
        //Imagen Pokemon Shiny
        pokeImage = poke.sprites.other["official-artwork"].front_shiny;
    }else{
        //Imagen Pokemon Normal
        pokeImage = poke.sprites.other["official-artwork"].front_default;
    }

    return pokeImage;
}

function replaceImage(id, version, tag){

    fetch(urlBase + id)
            .then((response) => response.json())
            .then(data => {
                urlImage = getImage(data, version);
                console.log(urlImage);
                tag.setAttribute("src", urlImage);
            })

}

function shiny(id) {
    //Encuentro el valor de la etiqueta version
    let idVersionTag = "version-" + id;
    console.log(idVersionTag);

    var versionTag = document.getElementById(idVersionTag);
 
    //Declaro la variable de la imagen
    let idImageTag = "image-id-" + id;
    var pokeImageTag = document.getElementById(idImageTag);

    console.log(versionTag.textContent);

    if(versionTag.textContent === "SHINY"){
        //Actualizamos el tag version
        versionTag.textContent = "NORMAL"

        //Actualizamos la imagen a SHINY
        replaceImage(id, "shiny", pokeImageTag);

    }else{
        //Actualizamos el tag version
        versionTag.textContent = "SHINY"

        //Actualizamos la imagen a NORMAL
        replaceImage(id, "normal", pokeImageTag);
        
    }

}