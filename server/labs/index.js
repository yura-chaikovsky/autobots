var EMPTY = 0,
  FILL = 1;

module.exports = {
  getLab: function(n, m) {
    var arr = new Array(n),
    filledLines = [],
    emptyLines = [];

    arr[0] = new Array(m);
    arr[n - 1] = new Array(m);

    for (var i = 0; i < m; ++i) {
      arr[0][i] = EMPTY;
      arr[n - 1][i] = EMPTY;
    }

    for (var i = 1; i < n - 1; ++i) {
      arr[i] = new Array(m);

      cont = i % 2;

      if (cont === 1) {
        filledLines.push({
          rowNum: i
        });
      } else {
        emptyLines.push({
          rowNum: i
        });
      };

      for (var j = 0; j < m; ++j) {
        arr[i][j] = cont === 0 ? EMPTY : FILL;
      }
    }

    filledLines.forEach(function(obj) {
      var l = (Math.random() * (m * .3) << 0) + 1;

      for (var i = 0; i < l; ++i) {
        var ind = (Math.random() * m) >> 0;

        if (arr[obj.rowNum][ind] === EMPTY || arr[obj.rowNum][ind - 1] === EMPTY || arr[obj.rowNum][ind + 1] === EMPTY) {
          --i;

          continue;
        }

        arr[obj.rowNum][ind] = EMPTY;
      }
    });

    emptyLines.forEach(function(obj) {
      var l = (Math.random() * (m * .3) << 0);

      for (var i = 0; i < l; ++i) {
        var pos = (Math.random() * m) >> 0,
        cur = arr[obj.rowNum];
        prev = arr[obj.rowNum - 1],
        next = arr[obj.rowNum + 1];

        if (cur[pos] === FILL || prev[pos] === EMPTY || next[pos] === EMPTY) {
          --i;

          continue;
        }

        cur[pos] = FILL;

        for (var k = -1; k < 3; k += 2) {
          var hasNext = false,
          hasPrev = false,
          length = 0;

          while (cur[pos + k * (length + 1)] === EMPTY) {
            hasNext = hasNext || (next[pos + k * (length + 1)] === EMPTY);
            hasPrev = hasPrev || (prev[pos + k * (length + 1)] === EMPTY);

            ++length;
          }

          if (length === 0 || (hasNext && hasPrev)) {
            continue;
          }

          var emptyCell;

          if (!hasNext) {
            emptyCell = pos + (k * Math.random() * length >> 0);

            next[emptyCell + k] = EMPTY;

            var wall = arr[obj.rowNum + 2];

            wall[emptyCell + k] = EMPTY;
          }

          if (!hasPrev) {
            emptyCell = pos + (k * Math.random() * length >> 0);

            prev[emptyCell + k] = EMPTY;

            var wall = arr[obj.rowNum - 2];

            wall[emptyCell + k] = EMPTY;
          }
        }
      }
    });

    return arr;
  }
};
