(function () {
    const canvas = document.getElementById('trailCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let points = [];
    const maxPoints = 40; // Length of the flowing line tail

    // Handle canvas resizing
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
        points.push({ x: e.clientX, y: e.clientY });
        
        // Keep the array size limited to the max tail length
        if (points.length > maxPoints) {
            points.shift();
        }
    });

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);

            // Draw smooth curve using quadratic curves
            for (let i = 1; i < points.length - 1; i++) {
                const xc = (points[i].x + points[i + 1].x) / 2;
                const yc = (points[i].y + points[i + 1].y) / 2;
                ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }

            // Line Styling (Pure Black with varying opacity and width for a smooth flow)
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)'; 
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        }

        // Gradually fade out the tail when the mouse stops moving
        if (points.length > 0) {
            points.shift();
        }

        requestAnimationFrame(animate);
    }

    animate();
})();
