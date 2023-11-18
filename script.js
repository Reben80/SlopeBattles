document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.querySelector("#gameCanvas");
    const ctx = canvas.getContext("2d");
    let gridSize = 6; // Default grid size
    let cellSize = canvas.width / gridSize; // Calculate cell size based on grid size
    let points = [];
    let animations = [];
    let slopes = new Set(); // Set to keep track of slopes

    // Event Listeners
    canvas.addEventListener("click", handleCanvasClick);
    document.querySelector(".start-button").addEventListener("click", startGame);
    document.querySelector(".reset-button").addEventListener("click", resetGame);
    document.getElementById("gridSizeSelector").addEventListener("change", function() {
        gridSize = parseInt(this.value);
        cellSize = canvas.width / gridSize; // Recalculate cell size
        startGame(); // Restart the game with the new grid size
    });

   function handleCanvasClick(event) {
    const clickedPoint = getClickedPoint(event);

    if (clickedPoint.x >= 0 && clickedPoint.x < gridSize && clickedPoint.y >= 0 && clickedPoint.y < gridSize) {
        if (isPointValid(clickedPoint)) {
            for (let existingPoint of points) {
                const slope = calculateSlope(clickedPoint, existingPoint);
                slopes.add(slope);
            }
            points.push(clickedPoint);
            animations.push({ point: clickedPoint, radius: 0 });
            animateDot();
            redrawCanvas(); // Redraw the canvas after a valid move
        } else {
            flashIllegalMove(clickedPoint);
        }
    }
}

function flashIllegalMove(point) {
    // Draw the illegal move indication
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.fillRect(point.x * cellSize, point.y * cellSize, cellSize, cellSize);

    // Wait for 0.5 seconds before redrawing the canvas
    setTimeout(() => {
        redrawCanvas();
    }, 500);
}


    function getClickedPoint(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return {
            x: Math.floor(x / cellSize),
            y: Math.floor(y / cellSize)
        };
    }

    function isPointValid(newPoint) {
        if (points.some(p => p.x === newPoint.x || p.y === newPoint.y)) return false;
        for (let existingPoint of points) {
            const slope = calculateSlope(newPoint, existingPoint);
            if (slopes.has(slope)) {
                return false;
            }
        }
        return true;
    }

    function calculateSlope(p1, p2) {
        if (p2.x === p1.x) return Infinity;
        return (p2.y - p1.y) / (p2.x - p1.x);
    }

    function animateDot() {
        let animationFinished = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGridLines();
        for (let animation of animations) {
            if (animation.radius < cellSize / 3) {
                animation.radius += cellSize / 30;
                animationFinished = false;
            }
            ctx.beginPath();
            ctx.arc((animation.point.x + 0.5) * cellSize, (animation.point.y + 0.5) * cellSize, animation.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#FF3000";
            ctx.fill();
        }
        drawPoints();
        if (!animationFinished) {
            requestAnimationFrame(animateDot);
        }
    }

function drawGridLines() {
    ctx.strokeStyle = "#AAAAAA"; // A more contrasting grey for the grid lines
    ctx.lineWidth = 1.5; // Slightly thicker lines for better visibility

    // Drawing the grid lines
    for (let i = 1; i < gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, gridSize * cellSize);
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(gridSize * cellSize, i * cellSize);
        ctx.stroke();
    }

    // Resetting line width to default for other elements
    ctx.lineWidth = 1;
}

function drawPoints() {
    const dotFillColor = "#87CEEB"; // Sky blue color for the dot fill

    for (const point of points) {
        ctx.beginPath();
        ctx.arc((point.x + 0.5) * cellSize, (point.y + 0.5) * cellSize, cellSize / 3, 0, Math.PI * 2);
        ctx.fillStyle = dotFillColor;
        ctx.fill();
    }
}




    function flashIllegalMove(point) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.fillRect(point.x * cellSize, point.y * cellSize, cellSize, cellSize);
        setTimeout(() => {
            drawGridLines();
            drawPoints();
        }, 500);
    }

    function startGame() {
        points = [];
        animations = [];
        slopes.clear();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGridLines();
        updateMessage(`Game has started! Grid size is ${gridSize} x ${gridSize}. Click on the grid to place your points.`);
    }

    function resetGame() {
        points = [];
        animations = [];
        slopes.clear();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGridLines();
        updateMessage("Game has been reset.");
    }

    function updateMessage(message) {
        document.querySelector(".message").textContent = message;
    }

    // Initialize the game with the default grid size
    startGame();
});
