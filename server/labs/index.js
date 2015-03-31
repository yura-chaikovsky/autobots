var EMPTY = 0,
  FILL = 1;

function makePizdatyiRandom(maximumValue) {
  return Math.floor(Math.random() * maximumValue);
}

module.exports = {
  generateLabyrinth: function(height, width) {
    var labyrinth = new Array(height),
      filledRows = [],
      emptyRows = [],
      content;

    for (var y = 0; y < height; ++y) {
      labyrinth[y] = new Array(width);

      for (var x = 0; x < width; ++x) {
        labyrinth[y][x] = EMPTY;
      }
    }

    for (var y = 1; y < height - 1; ++y) {
      labyrinth[y] = new Array(width);

      content = y % 2;

      if (content === 1) {
        filledRows.push({
          rowNum: y
        });
      } else {
        emptyRows.push({
          rowNum: y
        });
      };

      for (var x = 0; x < width; ++x) {
        labyrinth[y][x] = content === 0 ? EMPTY : FILL;
      }
    }

    filledRows.forEach(function(obj) {
      var count = makePizdatyiRandom(width * .3) + 1;

      for (var i = 0; i < count; ++i) {
        var index = makePizdatyiRandom(width);

        if (labyrinth[obj.rowNum][index] === EMPTY ||
          labyrinth[obj.rowNum][index - 1] === EMPTY ||
          labyrinth[obj.rowNum][index + 1] === EMPTY) {
          --i;

          continue;
        }

        labyrinth[obj.rowNum][index] = EMPTY;
      }
    });

    emptyRows.forEach(function(obj) {
      var count = makePizdatyiRandom(width * .3),
        position,
        currentRow,
        nextRow,
        previousRow,
        hasEmptyCellOnTheNextRow,
        hasEmptyCellOnThePreviousRow,
        lengthOfEmptyCellsInCurrentLine,
        newEmptyCellPosition,
        rowAfterRow;

      for (var i = 0; i < count; ++i) {
        position = makePizdatyiRandom(width),
        currentRow = labyrinth[obj.rowNum];
        previousRow = labyrinth[obj.rowNum - 1],
        nextRow = labyrinth[obj.rowNum + 1];

        if (currentRow[position] === FILL ||
          previousRow[position] === EMPTY ||
          nextRow[position] === EMPTY) {
          --i;

          continue;
        }

        currentRow[position] = FILL;

        for (var coefficientOfDirrection = -1; coefficientOfDirrection < 3; 
          coefficientOfDirrection += 2) {

          hasEmptyCellOnTheNextRow = false;
          hasEmptyCellOnThePreviousRow = false;
          lengthOfEmptyCellsInCurrentLine = 0;

          while (currentRow[position +
            coefficientOfDirrection * (lengthOfEmptyCellsInCurrentLine + 1)] === EMPTY) {
            hasEmptyCellOnTheNextRow = hasEmptyCellOnTheNextRow ||
              (nextRow[position + coefficientOfDirrection *
              (lengthOfEmptyCellsInCurrentLine + 1)] === EMPTY);
            hasEmptyCellOnThePreviousRow = hasEmptyCellOnThePreviousRow ||
              (previousRow[position + coefficientOfDirrection *
              (lengthOfEmptyCellsInCurrentLine + 1)] === EMPTY);

            ++lengthOfEmptyCellsInCurrentLine;
          }

          if (lengthOfEmptyCellsInCurrentLine === 0 ||
            (hasEmptyCellOnTheNextRow && hasEmptyCellOnThePreviousRow)) {

            continue;
          }

          if (!hasEmptyCellOnTheNextRow) {
            newEmptyCellPosition = position + 
              coefficientOfDirrection * makePizdatyiRandom(lengthOfEmptyCellsInCurrentLine);

            nextRow[newEmptyCellPosition + coefficientOfDirrection] = EMPTY;

            rowAfterRow = labyrinth[obj.rowNum + 2];

            rowAfterRow[newEmptyCellPosition + coefficientOfDirrection] = EMPTY;
          }

          if (!hasEmptyCellOnThePreviousRow) {
            newEmptyCellPosition = position + 
              coefficientOfDirrection * makePizdatyiRandom(lengthOfEmptyCellsInCurrentLine);

            previousRow[newEmptyCellPosition + coefficientOfDirrection] = EMPTY;

            rowAfterRow = labyrinth[obj.rowNum - 2];

            rowAfterRow[newEmptyCellPosition + coefficientOfDirrection] = EMPTY;
          }
        }
      }
    });

    return labyrinth;
  }
};

console.log(module.exports.generateLabyrinth(19, 19).map(function(a) {
  return a.map(function(el) {
    return el === EMPTY ? ' ' : '#';
  }).join('');
}));