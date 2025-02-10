let screenX = 1920
let screenY = 1080

const gameArea = document.querySelector(".gameArea");
gameArea.style.width = `${screenX}px`;
gameArea.style.height = `${screenY}px`;
gameArea.style.left = `${getComputedStyle(gameArea).left}px`;
gameArea.style.top = `${getComputedStyle(gameArea).top}px`;
console.log(gameArea);

const mapArea = document.createElement(`div`);
mapArea.style.width = `${screenX}px`;
mapArea.style.height = `${screenY}px`;
mapArea.style.left = `100px`;
mapArea.style.top = `100px`;
mapArea.classList.add(`mapArea`);
gameArea.append(mapArea);
console.log(mapArea);


const player = document.createElement("div");
player.classList.add("Player");
player.style.width = `50px`;
player.style.height = `50px`;
player.style.left = `${parseInt(mapArea.style.width)/2}px`;
player.style.top = `${parseInt(mapArea.style.height)/2}px`;
const playerImage = document.createElement("img");
playerImage.src = `./images/Player.png`
playerImage.style.width = `50px`;
playerImage.style.height = `50px`;
gameArea.append(player);
player.append(playerImage)
console.log(player);

let inventoryBox = document.querySelector(`.inventory`)
console.log(inventoryBox)
let speed = 5;



let direction = `right`
let blockedKeys = {}; // Объект для блокировки клавиш
let blockMouse = false;
let flyingItems = []; // Массив активных предметов
let highlightContainer;

let keyboard = {
    w: false,
    a: false,
    s: false,
    d: false,
    e: false,
    tab: {
        press: false,
        action: 0
    },
    f: false,
    space: false,
    arrowRight: false,
    arrowLeft: false,
    arrowUp: false,
    arrowDown: false
}

let itemList = [`wood`,`stone`,`grass`,`berry`,`coin`]
let items = [0,0,0,0,0];


function createBlock(x, y, width = 50, height = 50) {
    const block = document.createElement(`div`);
    block.classList.add(`block`);
    block.style.width = `${width}px`
    block.style.height = `${height}px`
    block.style.left = `${x}px`
    block.style.top = `${y}px`
    const blockImage = document.createElement(`img`);
    blockImage.src = `./images/BlockTexture.png`
    blockImage.style.width = `${width}px`
    blockImage.style.left = `${0}px`
    blockImage.style.top = `${0}px`
    gameArea.append(block);
    block.append(blockImage);
    return block;
}

function createContainer(x, y, width = 50, height = 50) {
    const container = document.createElement(`div`);
    container.classList.add(`containerClose`);
    container.style.width = `${width}px`
    container.style.height = `${height}px`
    container.style.left = `${x}px`
    container.style.top = `${y}px`
    const containerImage = document.createElement(`img`);
    containerImage.src = `./images/ContainerClose.png`
    containerImage.style.position = `absolute`
    containerImage.style.width = `66px`
    containerImage.style.height = `66px`
    containerImage.style.left = `${0-(parseInt(containerImage.style.width)/2-parseInt(container.style.width)/2)}px`
    containerImage.style.top = `${0-(parseInt(containerImage.style.height)/2-parseInt(container.style.height)/2)}px`
    gameArea.append(container);
    container.append(containerImage);
    return container
}

function createItem(x, y, type, width = 25, height = 25) {
    const item = document.createElement('div');
    
    item.classList.add('item', type);
    item.style.width = `${width}px`
    item.style.height = `${height}px`
    item.style.position = 'absolute';
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;

    gameArea.append(item);
    flyingItems.push(item);

    return item;
}

function blockSpecificKeys(keys, duration) {
    keys.forEach(key => {
        blockedKeys[key] = true; // Блокируем клавишу
        if (keyboard[key] !== undefined) {
            keyboard[key] = false; // Принудительно сбрасываем состояние клавиши
        }
    });

    if (duration) {
        setTimeout(() => {
            keys.forEach(key => delete blockedKeys[key]); // Снимаем блокировку через заданное время
        }, duration);
    }
}

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

function fullScreen(element) {
    if(element.requestFullscreen) {
      element.requestFullscreen();
    } else if(element.webkitrequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if(element.mozRequestFullscreen) {
      element.mozRequestFullScreen();
    }
}

// for (let jindex = 0; jindex < parseInt(mapArea.style.height)/50; jindex++) {
//     for (let index = 0; index < parseInt(mapArea.style.width)/50; index++) {
//         if (jindex==0 || jindex==parseInt(parseInt(mapArea.style.height)/50)) {
//             createBlock(50*index,50*jindex)
//         }
//         if (index==0 || index==parseInt(parseInt(mapArea.style.width)/50)) {
//             createBlock(50*index,50*jindex)
//         }
//     }
// }
console.log(parseInt(mapArea.style.top),parseInt(mapArea.style.left));

for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
        let tileId = map.layers.main[y * map.width + x];
        mapArea.style.width = `${map.width*50}px`;
        mapArea.style.height = `${map.height*50}px`;
        switch (tileId) {
            case 1:
                createBlock(x * 50 + parseInt(mapArea.style.left), y * 50 +parseInt(mapArea.style.top));
                break;
            case 2:
                break;
            case 3:
                createContainer(x * 50 + parseInt(mapArea.style.left), y * 50 +parseInt(mapArea.style.top));
                break;
            default:
                console.log(`Неизвестный tileId: ${tileId} в (${x}, ${y})`);
                break;
        }
    }
}


// for (let index = 0; index < 35; index++) {
//     let container = document.createElement(`div`);
//     container.classList.add(`containerClose`);
//     container.style.width = `50px`
//     container.style.height = `50px`
//     container.style.left = `${(getRandomIntInclusive(0,1920))-50}px`
//     container.style.top = `${(getRandomIntInclusive(0,1080))-50}px`
//     let containerImage = document.createElement(`img`);
//     containerImage.src = `./images/ContainerClose.png`
//     containerImage.style.position = `absolute`
//     containerImage.style.width = `66px`
//     containerImage.style.height = `66px`
//     containerImage.style.left = `${0-(parseInt(containerImage.style.width)/2-parseInt(container.style.width)/2)}px`
//     containerImage.style.top = `${0-(parseInt(containerImage.style.height)/2-parseInt(container.style.height)/2)}px`
//     gameArea.append(container);
//     container.append(containerImage);
// }


let arrObjects = document.querySelectorAll(`.block,.item,.containerOpen,.containerClose,.mapArea`)
console.log(arrObjects)


let angle
const xText = document.querySelector(".coordx");
const yText = document.querySelector(".coordy");
const collide1 = document.querySelector(".collide1");
const collide2 = document.querySelector(".collide2");
const collide3 = document.querySelector(".collide3");
const collide4 = document.querySelector(".collide4");
const dialog = document.querySelector(".dialogBox");
const nameDialog = document.querySelector(".nameDialog");
const textDialog = document.querySelector(".textDialog");

dialog.style.display = `none`


// function Camera(objects = []) {
//     if (parseInt(player.style.left) < 0+parseInt(gameArea.style.width)/2) {
//         for (let index = 0; index < objects.length; index++) {
//             if (!objects[index].classList.contains(`Player`)) {
//                 objects[index].style.left = `${parseInt(objects[index].style.left)+speed}px`
//             }
//         }
//         player.style.left = `${parseInt(player.style.left)+speed}px`
//     }
//     if (parseInt(player.style.left)+parseInt(player.style.width) > parseInt(gameArea.style.width)-(parseInt(gameArea.style.width)/2-50)) {
//         for (let index = 0; index < objects.length; index++) {
//             if (!objects[index].classList.contains(`Player`)) {
//                 objects[index].style.left = `${parseInt(objects[index].style.left)-speed}px`
//             }
//         }
//         player.style.left = `${parseInt(player.style.left)-speed}px`
//     }
//     if (parseInt(player.style.top) < 0+parseInt(gameArea.style.height)/2) {
//         for (let index = 0; index < objects.length; index++) {
//             if (!objects[index].classList.contains(`Player`)) {
//                 objects[index].style.top = `${parseInt(objects[index].style.top)+speed}px`
//             }
//         }
//         player.style.top = `${parseInt(player.style.top)+speed}px`
//     }
//     if (parseInt(player.style.top)+parseInt(player.style.height) > parseInt(gameArea.style.height)-(parseInt(gameArea.style.height)/2-50)) {
//         for (let index = 0; index < objects.length; index++) {
//             if (!objects[index].classList.contains(`Player`)) {
//                 objects[index].style.top = `${parseInt(objects[index].style.top)-speed}px`
//             }
//         }
//         player.style.top = `${parseInt(player.style.top)-speed}px`
//     }
// }



function highlightContainers() {
    const playerX = parseInt(player.style.left) + parseInt(player.style.width) / 2;
    const playerY = parseInt(player.style.top) + parseInt(player.style.height) / 2;

    const containers = document.querySelectorAll('.containerClose'); // Все закрытые сундуки

    containers.forEach(container => {
        const containerX = parseInt(container.style.left) + parseInt(container.offsetWidth) / 2;
        const containerY = parseInt(container.style.top) + parseInt(container.offsetHeight) / 2;

        const distance = Math.sqrt((playerX - containerX) ** 2 + (playerY - containerY) ** 2);

        if (distance < 100) { // Радиус подсветки
            container.firstChild.src = `./images/ContainerSelected.png` // Подсвечиваем
            highlightContainer = container;
        } else {
            container.firstChild.src = `./images/ContainerClose.png` // Убираем подсветку
        }
    });
    
}


function checkCollision(playerer, objects = []) {
    for (let index = 0; index < objects.length; index++) {
        if (
            parseInt(playerer.style.left) < parseInt(objects[index].style.left) + parseInt(objects[index].style.width) &&
            parseInt(playerer.style.top) < parseInt(objects[index].style.top) + parseInt(objects[index].style.height) &&
            parseInt(playerer.style.left) + parseInt(playerer.style.width) > parseInt(objects[index].style.left) &&
            parseInt(playerer.style.height) + parseInt(playerer.style.top) > parseInt(objects[index].style.top)
        ) {
            if (objects[index].classList.contains(`containerClose`)) {
                return true;
            }
            if (objects[index].classList.contains(`block`)) {
                return true;
            }
            if (objects[index].classList.contains(`containerOpen`)) {
                return true;
            }
        }
    }   
    return false;
}

function movePlayer(direction, objects, maxSpeed) {
    let step = maxSpeed; // Начальная скорость движения

    while (step >= 1) {
        let moved = false; // Флаг, указывает, было ли движение

        switch (direction) {
            case 'up':
                player.style.top = `${parseInt(player.style.top) - step}px`;
                if (checkCollision(player, objects)) {
                    player.style.top = `${parseInt(player.style.top) + step}px`; // Откат
                } else {
                    moved = true;
                }
                break;

            case 'down':
                player.style.top = `${parseInt(player.style.top) + step}px`;
                if (checkCollision(player, objects)) {
                    player.style.top = `${parseInt(player.style.top) - step}px`; // Откат
                } else {
                    moved = true;
                }
                break;

            case 'left':
                player.style.left = `${parseInt(player.style.left) - step}px`;
                if (checkCollision(player, objects)) {
                    player.style.left = `${parseInt(player.style.left) + step}px`; // Откат
                } else {
                    moved = true;
                }
                break;

            case 'right':
                player.style.left = `${parseInt(player.style.left) + step}px`;
                if (checkCollision(player, objects)) {
                    player.style.left = `${parseInt(player.style.left) - step}px`; // Откат
                } else {
                    moved = true;
                }
                break;
        }

        // Если движение удалось, выходим из цикла
        if (moved) break;

        // Уменьшаем шаг в 2 раза
        step = Math.floor(step / 2);
    }
}

function addItemToInventory(type) {
    switch (type) {
        case 'wood':
            items[0]++;
            break;
        case 'stone':
            items[1]++;
            break;
        case 'grass':
            items[2]++;
            break;
        case 'berry':
            items[3]++;
            break;
        case 'coin':
            items[4]++;
            break;
    }
    console.log(`Added ${type} to inventory!`);
}

function updateFlyingItems() {
    const playerX = parseInt(player.style.left) + parseInt(player.style.width) / 2;
    const playerY = parseInt(player.style.top) + parseInt(player.style.height) / 2;

    flyingItems = flyingItems.filter(item => {
        const itemX = parseInt(item.style.left) + parseInt(item.offsetWidth) / 2;
        const itemY = parseInt(item.style.top) + parseInt(item.offsetHeight) / 2;

        // Вычисляем направление к игроку
        const deltaX = playerX - itemX;
        const deltaY = playerY - itemY;
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

        // Если предмет достиг игрока, добавляем его в инвентарь и удаляем
        if (distance < 10) {
            gameArea.removeChild(item);
            addItemToInventory(item.classList[1]); // Добавляем в инвентарь по типу предмета
            return false; // Удаляем предмет из массива
        }

        // Перемещаем предмет ближе к игроку
        const speed = 10; // Скорость полёта
        item.style.left = `${parseInt(item.style.left) + (deltaX / distance) * speed}px`;
        item.style.top = `${parseInt(item.style.top) + (deltaY / distance) * speed}px`;

        return true; // Оставляем предмет в массиве
    });
}


function update() {
    document.documentElement.scrollTo({
        top: parseInt(player.style.top)-1080/2,
        left: parseInt(player.style.left)-1920/2,
        behavior: `auto`
      });
      switch (direction) {
        case `up`:
            player.lastChild.style.transform = `rotate(-90deg)`
            break;
        case `down`:
            player.lastChild.style.transform = `rotate(90deg)`
            break;
        case `left`:
            player.lastChild.style.transform = `rotate(-180deg)`
            break;
        case `right`:
            player.lastChild.style.transform = `rotate(0deg)`
            break;
        default:
            break;
    }
    arrObjects = document.querySelectorAll(`.block,.item,.containerOpen,.containerClose,.mapArea`)
    if (keyboard.w){ direction = `up`; movePlayer('up', arrObjects, speed); /*Camera(arrObjects)*/};
    if (keyboard.s){ direction = `down`; movePlayer('down', arrObjects, speed); /*Camera(arrObjects)*/};
    if (keyboard.a){ direction = `left`; movePlayer('left', arrObjects, speed); /*Camera(arrObjects)*/} ;
    if (keyboard.d){ direction = `right`; movePlayer('right', arrObjects, speed); /*Camera(arrObjects)*/} ;
    if (keyboard.tab.action==0) {
        inventoryBox.style.display = `none`
        blockedKeys = {}
    } else {
        inventoryBox.style.display = `block`
        blockSpecificKeys([`w`,`a`,`s`,`d`,` `,`f`,`q`,`ArrowUp`,`ArrowDown`,`ArrowRight`,`ArrowLeft`])
        if (keyboard.tab.action>1) {
            keyboard.tab.action=0
        }
    }

    
    document.querySelector(`.inventory .lineItems .itemBox .woodp`).innerText = `${items[0]}`
    document.querySelector(`.inventory .lineItems .itemBox .stonep`).innerText = `${items[1]}`
    document.querySelector(`.inventory .lineItems .itemBox .grassp`).innerText = `${items[2]}`
    document.querySelector(`.inventory .lineItems .itemBox .berryp`).innerText = `${items[3]}`
    document.querySelector(`.inventory .lineItems .itemBox .coinp`).innerText = `${items[4]}`
    xText.innerText = `X: ${parseInt(mapArea.style.left)*-1+parseInt(player.style.left)}`;
    yText.innerText = `Y: ${parseInt(mapArea.style.top)*-1+parseInt(player.style.top)}`;
    collide1.innerText = `Items: ${items}`;
    collide2.innerText = `Objects: ${document.querySelectorAll(`.block,.item,.containerClose,.containerOpen`).length}`;

    highlightContainers()
    updateFlyingItems();
}

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();

window.addEventListener("keydown", function(event) {
    if (blockedKeys[event.key]) return; // Если клавиша заблокирована, ничего не делаем

        switch (event.key) {
            case `w`:
                keyboard.w = true
                break;
            case `s`:
                keyboard.s = true
                break;
            case `a`:
                keyboard.a = true
                break;
            case `d`:
                keyboard.d = true
                break; 
            case `f`:
                keyboard.f = true
                fullScreen(document.documentElement)
                break;
            case ` `:
                if (!keyboard.space) {
                    for (let index = 0; index < 50; index++) {
                        movePlayer(direction,arrObjects,speed)
                        /*Camera(arrObjects)*/
                    }
                }
                blockSpecificKeys([` `],10000) 
                console.log(blockedKeys);
                
                keyboard.space = true
                break; 
                
            case `Tab`:
                event.preventDefault()
                if (!keyboard.tab.press) {
                    keyboard.tab.action++
                    keyboard.tab.press = true
                    
                }
                break;  
            case `e`:
                keyboard.e = true
                const container = highlightContainer
                
                if (highlightContainer) {
                    for (let jindex = 0; jindex < getRandomIntInclusive(1,10); jindex++) {
                        createItem(
                            getRandomIntInclusive(parseInt(container.style.left)-50,
                            parseInt(container.style.left+container.style.width)+50),
                            getRandomIntInclusive(
                                parseInt(container.style.top)-50,parseInt(container.style.top+container.style.height)+50),
                                itemList[getRandomIntInclusive(0,itemList.length)]
                            )
                    }
                    container.classList.remove(`containerClose`);
                    container.firstChild.style.height = `97px`
                    container.firstChild.style.top = `${parseInt(container.firstChild.style.top)-31}px`
                    container.firstChild.src = `./images/ContainerOpen.png`
                    container.classList.add(`containerOpen`);
                }
                highlightContainer = false
                break;       
            default:
                console.log(event.key)
                break;
        } 
})

window.addEventListener("keyup", function(event) {
        switch (event.key) {
            case `w`:
                keyboard.w = false
                break;
            case `s`:
                keyboard.s = false
                break;
            case `a`:
                keyboard.a = false
                break;
            case `d`:
                keyboard.d = false
                break;
            case ` `:
                keyboard.space = false
                break;
            case `Tab`:
                keyboard.tab.press = false
                break; 
            case `e`:
                keyboard.q = false
                break;
            case `space`:
                keyboard.space = false
                break;
            case `ArrowRight`:
                keyboard.arrowRight = false   
                break;
            default:
                
                break;
        }   
})

document.addEventListener(`contextmenu`, function(event) {
    event.preventDefault()
    if(keyboard.tab.action>0 || blockMouse){return}
    let massAttack = document.createElement(`div`)
        massAttack.style.width = `${parseInt(player.style.width)}px`
        massAttack.style.height = `${parseInt(player.style.height)}px`
        massAttack.style.background = `rgba(255, 255, 0, 0.5)`;
        massAttack.style.borderRadius = `50%`

        massAttack.style.position = `absolute`
        massAttack.style.left = `${parseInt(player.style.left)}px`
        massAttack.style.top = `${parseInt(player.style.top)}px`

        massAttack.style.transformOrigin = `center`
        gameArea.append(massAttack)
        massAttack.style.transform = `scale(1)`
        massAttack.style.animation = `massAttackActive .25s`
    
        setTimeout(function() {
            massAttack.remove()
        },250)
        blockMouse = true;
    setTimeout(function() {
        blockMouse = false;
    },500)
})

document.addEventListener(`click`, function(event) {
    if(keyboard.tab.action>0 || blockMouse){return}
    event.preventDefault()
    angle = Math.atan2(event.clientX - (parseInt(player.style.left)+(parseInt(player.style.width)/2)), -(event.clientY - (parseInt(player.style.top)+(parseInt(player.style.height)/2)))) * (180 / Math.PI);
    console.log(angle);
    if (angle>-45 && angle <= 45) {
        direction = `up`;
        for (let index = 0; index < 15; index++) {
            movePlayer(direction, arrObjects, speed)
            /*Camera(arrObjects)*/
        }
    }
    else if((angle < -135 && angle > -180) || (angle >= 135 && angle <= 180)){
        direction = `down`;
        for (let index = 0; index < 15; index++) {
            movePlayer(direction, arrObjects, speed)
            /*Camera(arrObjects)*/
        }
    }
    else if(angle < 135 && angle > 45){
        direction = `right`;
        for (let index = 0; index < 15; index++) {
            movePlayer(direction, arrObjects, speed)
            /*Camera(arrObjects)*/
        }
    }
    else if(angle > -135 && angle < -45){
        direction = `left`;
        for (let index = 0; index < 15; index++) {
            movePlayer(direction, arrObjects, speed)
            /*Camera(arrObjects)*/
        }
    }
    blockMouse = true;
    setTimeout(function() {
        blockMouse = false;
    },300)
    
})




