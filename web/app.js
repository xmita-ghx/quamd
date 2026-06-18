/**
 * Quamd Web UI App Controller
 * Proprietary Software - Copyright (c) 2026 Asmita Ghorai. All rights reserved.
 * * Manages the live workspace typing events and hooks into the canvas context grid.
 */

document.addEventListener('DOMContentLoaded', () => {
    const codeInput = document.getElementById('code-input');
    const canvas = document.getElementById('quamd-canvas');
    const ctx = canvas.getContext('2d');

    // 1. Core Render Loop: Maps structural operations list to Canvas Pixels
    function drawCircuitToCanvas() {
        const rawCode = codeInput.value;
        
        // Safety check: parse layout only using our unified core function
        if (typeof parseQuamdToLayout !== 'function') {
            console.error('Quamd Core Parser Engine not detected.');
            return;
        }

        // Get the coordinate calculations
        const layout = parseQuamdToLayout(rawCode);

        // Adjust HTML5 Canvas canvas drawing buffer scale dimensions safely
        canvas.width = layout.width;
        canvas.height = layout.height;

        // Clean Canvas field slate with a sleek dark midnight space backdrop
        ctx.fillStyle = '#070a12';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Iterate and draw custom operations vector items matching the standard
        layout.operations.forEach((op) => {
            switch(op.type) {
                case 'wire':
                    // Background baseline wire paths
                    ctx.strokeStyle = '#374151'; 
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(op.x1, op.y1);
                    ctx.lineTo(op.x2, op.y2);
                    ctx.stroke();
                    break;

                case 'gate_box':
                    // Premium theme blue fill for Hadamard boxes
                    ctx.fillStyle = '#2563eb';
                    ctx.strokeStyle = '#60a5fa';
                    ctx.lineWidth = 1.5;
                    
                    // Draw box with clean square edges
                    ctx.fillRect(op.x, op.y, op.width, op.height);
                    ctx.strokeRect(op.x, op.y, op.width, op.height);

                    // Drop gate text label centrally
                    ctx.fillStyle = '#f9fafb';
                    ctx.font = 'bold 14px "Fira Code", monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(op.label, op.x + (op.width / 2), op.y + (op.height / 2));
                    break;

                case 'cx_line':
                    // Controlled-NOT connector line vertical links
                    ctx.strokeStyle = '#ef4444';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(op.x, op.y1);
                    ctx.lineTo(op.x, op.y2);
                    ctx.stroke();
                    break;

                case 'cx_control':
                    // Control dot
                    ctx.fillStyle = '#ef4444';
                    ctx.beginPath();
                    ctx.arc(op.cx, op.cy, op.radius, 0, 2 * Math.PI);
                    ctx.fill();
                    break;

                case 'cx_target':
                    // Target crosshair circle wrapper
                    ctx.strokeStyle = '#ef4444';
                    ctx.lineWidth = 2;
                    ctx.fillStyle = '#070a12'; // Keep target background empty
                    
                    ctx.beginPath();
                    ctx.arc(op.cx, op.cy, op.radius, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();

                    // Inner cross coordinate drawing lines
                    ctx.beginPath();
                    // Vertical line
                    ctx.moveTo(op.cx, op.cy - op.radius);
                    ctx.lineTo(op.cx, op.cy + op.radius);
                    // Horizontal line
                    ctx.moveTo(op.cx - op.radius, op.cy);
                    ctx.lineTo(op.cx + op.radius, op.cy);
                    ctx.stroke();
                    break;
            }
        });
    }

    // 3. Real-time Event Listener tracking user text entries
    codeInput.addEventListener('input', drawCircuitToCanvas);

    // Initial first-paint render update loop call on loading
    drawCircuitToCanvas();
});