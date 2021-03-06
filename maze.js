'use strict'

let WALL;
let CELL;
let ENTRY;
let EXIT;
let ROAD;
let height;
let width;
let listOfCells;
let generatedMaze;
let countOfUnvisitedCells;
let coordinateOfEntry;
let coordinateOfExit;

const setInitialValues = () => {
    CELL = 0;
    WALL = 1;
    ENTRY = 2;
    EXIT = 3;
    ROAD = 4;
    height = 21;
    width = 21;
    listOfCells = [];
    countOfUnvisitedCells = 0;
}

const generateBasisOfMaze = (height, width) => {
    const countOfCellsInRow = width;
    const generatedBasisOfMaze = new Array;

    while (height > 0) {
        const row = new Array;

        while (width > 0) {
            if (width % 2 === 0 && height % 2 === 0) {
                listOfCells.push({ x: height - 1, y: width - 1, visited: false });
                countOfUnvisitedCells++;
                row.push(0);
                width--;
            } else {
                row.push(1);
                width--;
            };
        };

        generatedBasisOfMaze.push(row);
        height--;
        width = countOfCellsInRow;
    };

    return generatedBasisOfMaze;
};

const getNeighbors = (cell, getNeighborsForFindTheWay) => {
    const neighbors = [];

    if (!getNeighborsForFindTheWay) {
        if (cell.x - 2 > 0) {
            const neighbor = findCellByCoordinates({ x: cell.x - 2, y: cell.y });

            neighbors.push(neighbor)
        };
        if (cell.x + 2 < height - 1) {
            const neighbor = findCellByCoordinates({ x: cell.x + 2, y: cell.y });

            neighbors.push(neighbor);
        };
        if (cell.y + 2 < width - 1) {
            const neighbor = findCellByCoordinates({ x: cell.x, y: cell.y + 2 });

            neighbors.push(neighbor);
        };
        if (cell.y - 2 > 0) {
            const neighbor = findCellByCoordinates({ x: cell.x, y: cell.y - 2 });

            neighbors.push(neighbor);
        }
    } else {
        if (generatedMaze[cell.x - 1][cell.y] === CELL || generatedMaze[cell.x - 1][cell.y] === EXIT) {
            const neighbor = findCellByCoordinates({ x: cell.x - 1, y: cell.y });
            neighbors.push(neighbor);
        };
        if (generatedMaze[cell.x + 1][cell.y] === CELL || generatedMaze[cell.x + 1][cell.y] === EXIT) {
            const neighbor = findCellByCoordinates({ x: cell.x + 1, y: cell.y });

            neighbors.push(neighbor);
        }
        if (generatedMaze[cell.x][cell.y + 1] === CELL || generatedMaze[cell.x][cell.y + 1] === EXIT) {
            const neighbor = findCellByCoordinates({ x: cell.x, y: cell.y + 1 });

            neighbors.push(neighbor);
        }
        if (generatedMaze[cell.x][cell.y - 1] === CELL || generatedMaze[cell.x][cell.y - 1] === EXIT) {
            const neighbor = findCellByCoordinates({ x: cell.x, y: cell.y - 1 });

            neighbors.push(neighbor);
        }
    }


    return neighbors;
}

const getRandomNeighbor = (neighbors) => {
    const countOfNeighbors = neighbors.length;
    const minValue = 1;
    const rand = Math.round(minValue - 0.5 + Math.random() * (countOfNeighbors - minValue + 1));

    return neighbors[rand - 1];
}

const breakTheWall = (firstCell, secondCell, basis) => {
    const cellsAreOnOneRow = firstCell.x === secondCell.x;
    let coordinateOfWall;

    if (cellsAreOnOneRow) {
        coordinateOfWall = { x: firstCell.x, y: firstCell.y > secondCell.y ? firstCell.y - 1 : firstCell.y + 1 };
    } else {
        coordinateOfWall = { x: firstCell.x > secondCell.x ? firstCell.x - 1 : firstCell.x + 1, y: firstCell.y };
    }

    const height = coordinateOfWall.x;
    const positionOnRow = coordinateOfWall.y;

    listOfCells.push({ x: coordinateOfWall.x, y: coordinateOfWall.y, visited: true });

    basis[height].splice(positionOnRow, 1, 0);

    return basis;
}

const findCellByCoordinates = (coordinates) => {
    return listOfCells.find(el => {
        return el.x === coordinates.x && el.y === coordinates.y;
    });
}

const generateMaze = (height, width) => {
    let basis = generateBasisOfMaze(height, width);
    let currentCell = { x: 1, y: 1 };

    findCellByCoordinates(currentCell).visited = true;
    countOfUnvisitedCells--;

    while (countOfUnvisitedCells > 0) {
        const neighbors = getNeighbors(currentCell);
        const unvisitedNeigebors = neighbors.filter(neighbor => !neighbor.visited);

        if (unvisitedNeigebors.length > 0) {
            const nextCell = getRandomNeighbor(unvisitedNeigebors);

            basis = breakTheWall(currentCell, nextCell, basis);
            nextCell.visited = true;
            currentCell = nextCell;
            countOfUnvisitedCells--;
        } else {
            const nextCell = getRandomNeighbor(neighbors);
            currentCell = nextCell;
        }
    }

    return basis;
};

const getRandomCell = () => {
    const minValue = 0;
    const rand = Math.round(minValue - 0.5 + Math.random() * (listOfCells.length - 1 - minValue + 1));

    return listOfCells[rand];
}

const generateEntry = (maze) => {
    const randomCell = getRandomCell();

    coordinateOfEntry = { x: randomCell.x, y: randomCell.y };
    maze[randomCell.x].splice(randomCell.y, 1, ENTRY);
    return;
}

const generateExit = (maze) => {
    const randomCell = getRandomCell();

    coordinateOfExit = { x: randomCell.x, y: randomCell.y };
    maze[randomCell.x].splice(randomCell.y, 1, EXIT);
    return;
}

const drawMaze = (generatedMaze) => {
    const maze = document.querySelector('.maze');

    maze.innerHTML = '';
    generatedMaze.forEach(rowOfCells => {
        const row = document.createElement('div');

        row.classList.add('row');
        rowOfCells.forEach(cell => {
            if (cell === WALL) {
                const wall = document.createElement('div');

                wall.classList.add('wall');
                row.appendChild(wall);
            } else if (cell === ENTRY) {
                const space = document.createElement('div');
                const entry = document.createElement('div');

                space.classList.add('space');
                entry.classList.add('entry');
                space.appendChild(entry);
                row.appendChild(space);
            } else if (cell === EXIT) {
                const space = document.createElement('div');
                const exit = document.createElement('div');

                space.classList.add('space');
                exit.classList.add('exit');
                space.appendChild(exit);
                row.appendChild(space);
            } else if (cell === ROAD) {
                const space = document.createElement('div');
                const road = document.createElement('div');

                space.classList.add('space');
                road.classList.add('road');
                space.appendChild(road);
                row.appendChild(space);
            } else {
                const space = document.createElement('div');

                space.classList.add('space');
                row.appendChild(space);
            };
        });
        maze.appendChild(row);
    });
};

const drawTheWay = (wayToExit) => {
    let entry = findCellByCoordinates(coordinateOfEntry);
    let exit = findCellByCoordinates(coordinateOfExit);

    wayToExit.forEach(el => {
        if (el !== entry && el !== exit) {
            generatedMaze[el.x].splice(el.y, 1, ROAD);
        }
    });

    drawMaze(generatedMaze);
}

const findTheWay = () => {
    document.querySelector('.start').removeEventListener('click', findTheWay);
    const getNeighborsForFindTheWay = true;
    const wayToExit = [];
    let entry = findCellByCoordinates(coordinateOfEntry);
    let exit = findCellByCoordinates(coordinateOfExit);

    wayToExit.push(entry);
    listOfCells.forEach(el => el.visited = false);
    entry.visited = true;

    while (wayToExit[wayToExit.length - 1] !== exit) {
        const neighbors = getNeighbors(wayToExit[wayToExit.length - 1], getNeighborsForFindTheWay);
        const unvisitedNeigebors = neighbors.filter(neighbor => !neighbor.visited);

        if (unvisitedNeigebors.length > 0) {
            const nextCell = getRandomNeighbor(unvisitedNeigebors);

            wayToExit.push(nextCell);
            nextCell.visited = true;
        } else {
            wayToExit.pop();
        }
    }

    drawTheWay(wayToExit);
}

const createMaze = () => {
    setInitialValues();
    generatedMaze = generateMaze(height, width);
    generateEntry(generatedMaze);
    generateExit(generatedMaze);
    drawMaze(generatedMaze);
    document.querySelector('.start').addEventListener('click', findTheWay);
}

createMaze();

document.querySelector('.generate').addEventListener('click', createMaze);
