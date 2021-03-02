const vue = new Vue({
    el: '#app',
    data: {
        boards: []
    }
})

main()

async function main() {
    const response = await fetch('games.txt')
    const txt = await response.text()
    const games = txtToGames(txt)

    var index = 0

    solveWrapper()
    async function solveWrapper() {
        vue.boards.push(games[index])
        await solve(games[index])
        index++
        solveWrapper()
    }


}

async function solve(game) {
    const promise = new Promise((resolve, reject) => {
        window.requestAnimationFrame(async () => {

            const nextCell = game.nextCell()

            if (nextCell === null) {
                return resolve(true)
            }

            const row = nextCell.rowIndex;
            const col = nextCell.colIndex;

            for (let num = 1; num <= 9; num++) {
                if (game.testInput(row, col, num)) {
                    game.set(row, col, num)

                    game.print()
                    const result = await solve(game)

                    if (result) {
                        return resolve(true);
                    }

                    game.set(row, col, 0)
                }
            }

            return resolve(false);

        })
    })
    return promise



}

//  I wanted to work out a more transformation based way of writing this.
//  Everything I tried made it seriously clunky to read. :/ 
function txtToGames(txt) {
    const lines = txt.split("\n")
        .filter(it => !it.includes("Grid"))

    const games = [];

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        if (lineIndex % 9 === 0) games.push([])

        const cells = lines[lineIndex].split("")
            .map(it => parseInt(it))

        cells.pop()
        games[games.length - 1].push(cells)
    }

    return games.map(it => new SuDoku(it))
}

class SuDoku {
    constructor(value) {
        this.value = value
        this.startingBoard = JSON.parse(JSON.stringify(value)); //  Deep copy
    }

    set(rowIndex, colIndex, value) {
        this.value[rowIndex][colIndex] = value
    }

    nextCell() {
        for (let rowIndex = 0; rowIndex < this.value.length; rowIndex++) {
            for (let colIndex = 0; colIndex < this.value.length; colIndex++) {
                if (!this.value[rowIndex][colIndex]) return {
                    rowIndex,
                    colIndex
                }
            }
        }
        return null
    }

    testInput(rowIndex, colIndex, value) {
        const row = this.getRow(rowIndex)
            .filter(it => !!it)

        for (let i = 0; i < row.length; i++) {
            if (row[i] === value) return false

        }


        const col = this.getCol(colIndex)
            .filter(it => !!it)

        for (let i = 0; i < col.length; i++) {
            if (col[i] === value) return false

        }


        const box = this.getArea(rowIndex, colIndex)
            .filter(it => !!it)

        for (let i = 0; i < box.length; i++) {
            if (box[i] === value) return false

        }

        return true

    }

    getRow(rowIndex) {
        return this.value[rowIndex]
    }

    getCol(colIndex) {
        return this.value.map(row => row[colIndex])
    }

    getArea(rowIndex, colIndex) {
        var row = Math.floor(rowIndex / 3) * 3;
        var col = Math.floor(colIndex / 3) * 3;

        const output = []
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                output.push(this.value[row + i][col + j])
            }
        }
        return output
    }

    print() {
        vue.$forceUpdate();
        // console.log(
        //     this.value[0] + '\n' +
        //     this.value[1] + '\n' +
        //     this.value[2] + '\n' +
        //     this.value[3] + '\n' +
        //     this.value[4] + '\n' +
        //     this.value[5] + '\n' +
        //     this.value[6] + '\n' +
        //     this.value[7] + '\n' +
        //     this.value[8] + '\n'
        // )
    }
}