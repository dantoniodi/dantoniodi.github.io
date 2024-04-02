const getUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`

const generatePokes = () => Array(151).fill().map((_, index) =>
    fetch(getUrl(index + 1)).then(resp => resp.json())
)

const generateHTML = pokemons => pokemons.reduce((el, {name,id,types,sprites}) => {
    const mainTypes = types.map(typeInfo => typeInfo.type.name)

    el += `
        <li class="card ${mainTypes[0]}">
            <img class="card-image" alt="${name}" src="${sprites['front_default']}"/>
            <h2 class="card-title">${id}. ${name}</h2>
            <p class="card-subtitle">${mainTypes.join(' - ')}</p>
        </li>
    `
    return el
}, '')

const insertPokes = pokemons => {
    const ul = document.querySelector('.pokedex')
    ul.innerHTML = pokemons
}

const pokeRequest = generatePokes()

Promise.all(pokeRequest).then(generateHTML).then(insertPokes)