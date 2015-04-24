var EMPTY = '0',
  FILL = '1';

/*Получаем случайное целое число от 0 до maximumValue*/
function makeOtlichnyiRandom(maximumValue) {
  return Math.floor(Math.random() * maximumValue);
}

module.exports = {
  /*Собсно, функция, которая генерирует лабиринт с заданными размерами.
    Желательно использовать нечетное число для высоты, так красивее получается.
    Идея в том, чтобы оставить первую и последнию линии пустыми и чередовать 
      заполненные линии с практически пустыми.
  */
  generateLabyrinth: function(height, width) {
    var labyrinth = new Array(height),
      filledRows = [],
      emptyRows = [],
      content;

    /*Инитим наш лабиринт пустыми клетками*/
    for (var y = 0; y < height; ++y) {
      labyrinth[y] = new Array(width);

      for (var x = 0; x < width; ++x) {
        labyrinth[y][x] = EMPTY;
      }
    }

    /*Делим на четные и нечетные линии*/
    for (var y = 1; y < height - 1; ++y) {
      content = y % 2;

      if (content === 0) {
        emptyRows.push({
          rowNum: y
        });

        continue;
      }

      filledRows.push({
        rowNum: y
      });

      /*Заполняем нечетный ряд сплошной стеной*/
      for (var x = 0; x < width; ++x) {
        labyrinth[y][x] = FILL;
      }
    }

    /*Теперь делаем проходы в заолненных рядах, чтобы боты могли пройти друг к другу*/
    filledRows.forEach(function(obj) {
      var count = makeOtlichnyiRandom(width * .3) + 1;

      for (var i = 0; i < count; ++i) {
        var index = makeOtlichnyiRandom(width);

        /*Чтобы не делать двойных проходов*/
        if (labyrinth[obj.rowNum][index] === EMPTY ||
          labyrinth[obj.rowNum][index - 1] === EMPTY ||
          labyrinth[obj.rowNum][index + 1] === EMPTY) {

          --i;

          continue;
        }

        labyrinth[obj.rowNum][index] = EMPTY;
      }
    });

    /*Чтобы лабиринт не выглядел сухо, нужно заполнить пустые линии*/
    emptyRows.forEach(function(obj) {
      var count = makeOtlichnyiRandom(width * .3),
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
        position = makeOtlichnyiRandom(width),
        currentRow = labyrinth[obj.rowNum];
        previousRow = labyrinth[obj.rowNum - 1],
        nextRow = labyrinth[obj.rowNum + 1];

        /*Если здесь есть уже стена или мы перекрываем проход для верхней или нижней стены -
          то нам эта позиция не подходит*/
        if (currentRow[position] === FILL ||
          previousRow[position] === EMPTY ||
          nextRow[position] === EMPTY) {

          --i;

          continue;
        }

        /*Ставим стену*/
        currentRow[position] = FILL;

        /*Чтобы не было тупиков, нужно убедиьтся, что у верхней и нижней стены есть проходы,
            как с левой, так и справой стороны, до ближайшей стены или границы.
          Если прохода нет - то следует его поставить, проходы слева и справа -
            сделают более красивый лабиринт
          Цикл, собственно говоря, перебирает направления влево и вправо, соответственно*/
        for (var coefficientOfDirrection = -1; coefficientOfDirrection < 3; 
          coefficientOfDirrection += 2) {

          hasEmptyCellOnTheNextRow = false;
          hasEmptyCellOnThePreviousRow = false;
          lengthOfEmptyCellsInCurrentLine = 0;

          /*Определяем длину свободных клеток до следующей стены или грницы.
            Заодно, проверяем, есть ли проходы для верхней и нижней линии.*/
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

          /*Если у нас стоит стена - то в результате просто получется удвоенная стена,
              и никаких проходов в текущем направлении делать не надо*/
          if (lengthOfEmptyCellsInCurrentLine === 0 ||
            (hasEmptyCellOnTheNextRow && hasEmptyCellOnThePreviousRow)) {

            continue;
          }

          /*Если мы не нашли проход в нижней линии - то стоит его сделать*/
          if (!hasEmptyCellOnTheNextRow) {
            newEmptyCellPosition = position + 
              coefficientOfDirrection * makeOtlichnyiRandom(lengthOfEmptyCellsInCurrentLine);

            nextRow[newEmptyCellPosition + coefficientOfDirrection] = EMPTY;

            rowAfterRow = labyrinth[obj.rowNum + 2];

            /*Для того, чтобы не получилось так, что мы проход делаем напротив стены,
                в ряду через один ниже*/
            rowAfterRow[newEmptyCellPosition + coefficientOfDirrection] = EMPTY;
          }

          /*Тоже самое для верхнего ряда*/
          if (!hasEmptyCellOnThePreviousRow) {
            newEmptyCellPosition = position + 
              coefficientOfDirrection * makeOtlichnyiRandom(lengthOfEmptyCellsInCurrentLine);

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
