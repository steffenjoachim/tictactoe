let fields = [ null, null, null, null, null, null, null, null, null];

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
    [0, 4, 8], [2, 4, 6], // diagonal
];


let currentPlayer = 'circle';

 function init(){
    render();
 }

 function render() {
    let tableHTML = '<table>';

    for (let i = 0; i < 3; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            const fieldValue = fields[index];
            let symbol = '';

            if (fieldValue === 'circle') {
                symbol = generateCircleSVG() ;
            } else if (fieldValue === 'cross') {
                symbol = generateCrossSVG();
            }

            tableHTML += `<td onclick="handleClick(this, ${index})">${symbol}</td>`;
        }
        tableHTML += '</tr>';
    }

    tableHTML += '</table>';

    document.getElementById('content').innerHTML = tableHTML;
}

function generateCircleSVG() {
    const outerColor = 'rgb(28, 175, 213)';
    const innerColor = 'rgb(51, 50, 51)';
    const strokeWidth = 10;
    const width = 70;
    const height = 70;
  
    const radius = (width - strokeWidth) / 2;
  
    const svgCode = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <circle cx="${width / 2}" cy="${height / 2}" r="${radius}" fill="none" stroke="${outerColor}" stroke-width="${strokeWidth}">
          <animate attributeName="stroke-dasharray" from="0 ${2 * Math.PI * radius}" to="${2 * Math.PI * radius} 0" dur="0.5s" fill="freeze" />
        </circle>
        <circle cx="${width / 2}" cy="${height / 2}" r="${radius - strokeWidth}" fill="${innerColor}" />
      </svg>
    `;
  
    return svgCode;
  }


function handleClick(cell, index) {
    if (isGameFinished()) {
      return; // Spiel bereits beendet, keine weiteren Aktionen ausführen
    }
  
    if (fields[index] === null) {
      fields[index] = currentPlayer;
      cell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
      cell.onclick = null;
  
      if (currentPlayer === 'circle') {
        currentPlayer = 'cross';
      } else {
        currentPlayer = 'circle';
      }
  
      if (isGameFinished()) {
        const winCombination = getWinningCombination();
        drawWinningLine(winCombination);
      }
    }
  }

function isGameFinished() {
    return fields.every((field) => field !== null) || getWinningCombination() !== null;
}

function getWinningCombination() {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
        const [a, b, c] = WINNING_COMBINATIONS[i];
        if (fields[a] === fields[b] && fields[b] === fields[c] && fields[a] !== null) {
            return WINNING_COMBINATIONS[i];
        }
    }
    return null;
}


  function generateCrossSVG() {
    const color = 'rgb(255, 237, 7)';
    const width = 70;
    const height = 70;
    const strokeWidth = 10;
  
    const svgCode = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <line x1="${strokeWidth / 2}" y1="0" x2="${width - strokeWidth / 2}" y2="${height}" stroke="${color}" stroke-width="${strokeWidth}">
          <animate attributeName="stroke-dasharray" from="0 ${width - strokeWidth}" to="${width - strokeWidth} 0" dur="0.5s" fill="freeze" />
        </line>
        <line x1="${width - strokeWidth / 2}" y1="0" x2="${strokeWidth / 2}" y2="${height}" stroke="${color}" stroke-width="${strokeWidth}">
          <animate attributeName="stroke-dasharray" from="0 ${width - strokeWidth}" to="${width - strokeWidth} 0" dur="0.5s" fill="freeze" />
        </line>
      </svg>
    `;
  
    return svgCode;
  }

  
  function drawWinningLine(combination) {
    const lineColor = '#ffffff';
    const lineWidth = 5;

    const startCell = document.querySelectorAll(`td`)[combination[0]];
    const endCell = document.querySelectorAll(`td`)[combination[2]];
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    const contentRect = document.getElementById('content').getBoundingClientRect();

    const lineLength = Math.sqrt(
        Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
    );
    const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);

    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.width = `${lineLength}px`;
    line.style.height = `${lineWidth}px`;
    line.style.backgroundColor = lineColor;
    line.style.top = `${ startRect.top + startRect.height / 2 - lineWidth / 2 } px`;
    line.style.left = `${ startRect.left + startRect.width / 2 } px`;
    line.style.transform = `rotate(${ lineAngle }rad)`;
    line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 2 - contentRect.top}px`;
    line.style.left = `${startRect.left + startRect.width / 2 - contentRect.left}px`;
    line.style.transform = `rotate(${lineAngle}rad)`;
    line.style.transformOrigin = `top left`;
    document.getElementById('content').appendChild(line);
}

function restartGame(){
    fields = [ null, null, null, null, null, null, null, null, null];
    render();
    currentPlayer = 'circle';
}
