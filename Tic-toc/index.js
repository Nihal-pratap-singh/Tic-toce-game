let currentPlayer = 'X';
        let gameBoard = [];
        let gridSize = 3;
        let winStreak = 3;

        const gameBoardElement = document.getElementById('game-board');
        const statusElement = document.getElementById('status');
        const startGameButton = document.getElementById('start-game');
        const gridSizeInput = document.getElementById('grid-size');
        const winStreakInput = document.getElementById('win-streak');

        function initializeGame() {
            gridSize = parseInt(gridSizeInput.value);
            winStreak = parseInt(winStreakInput.value);

            if (gridSize < 3 || gridSize > 10 || winStreak < 3 || winStreak > gridSize) {
                alert('Invalid input. Grid size must be between 3 and 10, and win streak must be between 3 and grid size.');
                return;
            }

            gameBoard = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
            currentPlayer = 'X';
            statusElement.textContent = `Player ${currentPlayer}'s turn`;

            gameBoardElement.innerHTML = '';
            gameBoardElement.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;

            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    cell.dataset.row = i;
                    cell.dataset.col = j;
                    cell.addEventListener('click', handleCellClick);
                    gameBoardElement.appendChild(cell);
                }
            }
        }

        function handleCellClick(event) {
            const row = parseInt(event.target.dataset.row);
            const col = parseInt(event.target.dataset.col);

            if (gameBoard[row][col] === '') {
                gameBoard[row][col] = currentPlayer;
                event.target.textContent = currentPlayer;

                if (checkWin(row, col)) {
                    statusElement.textContent = `Player ${currentPlayer} wins!`;
                    disableBoard();
                } else if (checkDraw()) {
                    statusElement.textContent = "It's a draw!";
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    statusElement.textContent = `Player ${currentPlayer}'s turn`;
                }
            }
        }

        function checkWin(row, col) {
            const directions = [
                [1, 0], [0, 1], [1, 1], [1, -1]
            ];

            for (const [dx, dy] of directions) {
                let count = 1;
                count += countDirection(row, col, dx, dy);
                count += countDirection(row, col, -dx, -dy);

                if (count >= winStreak) {
                    return true;
                }
            }
            return false;
        }

        function countDirection(row, col, dx, dy) {
            let count = 0;
            let x = row + dx;
            let y = col + dy;

            while (
                x >= 0 && x < gridSize &&
                y >= 0 && y < gridSize &&
                gameBoard[x][y] === currentPlayer
            ) {
                count++;
                x += dx;
                y += dy;
            }

            return count;
        }

        function checkDraw() {
            return gameBoard.every(row => row.every(cell => cell !== ''));
        }

        function disableBoard() {
            const cells = document.querySelectorAll('.cell');
            cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
        }

        startGameButton.addEventListener('click', initializeGame);

        // Initialize the game with default settings
        initializeGame();