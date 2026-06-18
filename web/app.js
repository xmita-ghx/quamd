/**
 * Quamd Client Platform Orchestrator
 * Client UI handlers and copy-to-clipboard functionality pipelines.
 */

document.addEventListener('DOMContentLoaded', () => {
    const codeInput = document.getElementById('code-input');
    const canvas = document.getElementById('quamd-canvas');

    // Safe verify check for structural layout loading configurations
    if (!codeInput || !canvas) {
        console.error("Initialization failure: elements missing.");
        return;
    }

    // --- Core Canvas Render Logic Trigger ---
    function updateCircuitView() {
        const rawString = codeInput.value;
        
        try {
            // Reference unified algorithm object array exposed via global window runtime space
            if (typeof window.parseQuamdToLayout === 'function') {
                const layout = window.parseQuamdToLayout(rawString);
                renderLayoutToCanvas(canvas, layout);
            }
        } catch (err) {
            console.error("Render loop exception tracked:", err);
        }
    }

    // Bind real-time input listeners 
    codeInput.addEventListener('input', updateCircuitView);
    
    // Core baseline initial view instantiation call
    updateCircuitView();


    // --- Global Utility Clipboard Functions ---
    function triggerCopyFeedback(buttonNode, textNode, targetTextValue, successText = "Copied!") {
        navigator.clipboard.writeText(targetTextValue)
            .then(() => {
                const originalText = textNode.textContent;
                buttonNode.classList.add('copied');
                textNode.textContent = successText;

                setTimeout(() => {
                    buttonNode.classList.remove('copied');
                    textNode.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error("Clipboard copy operation blocked:", err);
            });
    }

    // Copy Handler 1: Interpreter Code Panel Button
    const copyCodeBtn = document.getElementById('copy-code-btn');
    if (copyCodeBtn) {
        const txt = copyCodeBtn.querySelector('.copy-text');
        copyCodeBtn.addEventListener('click', () => {
            triggerCopyFeedback(copyCodeBtn, txt, codeInput.value);
        });
    }

    // Copy Handler 2: Layout Viewport String Configuration Box Button
    const copyCanvasBtn = document.getElementById('copy-canvas-btn');
    if (copyCanvasBtn) {
        const txt = copyCanvasBtn.querySelector('.copy-text');
        copyCanvasBtn.addEventListener('click', () => {
            triggerCopyFeedback(copyCanvasBtn, txt, codeInput.value);
        });
    }

    // Copy Handler 3: Documentation Website Snippet Code Integration Button
    const copySnippetBtn = document.getElementById('copy-snippet-btn');
    if (copySnippetBtn) {
        const txt = copySnippetBtn.querySelector('span');
        copySnippetBtn.addEventListener('click', () => {
            const rawSnippetString = `<script src="https://quamd.org/core/quamd-core.js"></script>`;
            triggerCopyFeedback(copySnippetBtn, txt, rawSnippetString, "Snippet Copied!");
        });
    }
});

/**
 * Renders parsed layout operations onto HTML5 Canvas
 */
function renderLayoutToCanvas(canvas, layout) {
    const ctx = canvas.getContext('2d');
    
    // Set matching dimensions
    canvas.width = layout.width;
    canvas.height = layout.height;

    // Clear background
    ctx.fillStyle = '#070a12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render operational layers
    layout.operations.forEach((op) => {
        switch(op.type) {
            case 'wire':
                ctx.strokeStyle = '#374151'; 
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(op.x1, op.y1);
                ctx.lineTo(op.x2, op.y2);
                ctx.stroke();
                break;

            case 'gate_box':
                ctx.fillStyle = '#2563eb';
                ctx.strokeStyle = '#60a5fa';
                ctx.lineWidth = 1.5;
                ctx.fillRect(op.x, op.y, op.width, op.height);
                ctx.strokeRect(op.x, op.y, op.width, op.height);

                ctx.fillStyle = '#f9fafb';
                ctx.font = 'bold 14px "Courier New", Courier, monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(op.label, op.x + (op.width / 2), op.y + (op.height / 2));
                break;

            case 'cx_line':
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(op.x, op.y1);
                ctx.lineTo(op.x, op.y2);
                ctx.stroke();
                break;

            case 'cx_control':
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.arc(op.cx, op.cy, op.radius, 0, 2 * Math.PI);
                ctx.fill();
                break;

            case 'cx_target':
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 2;
                ctx.fillStyle = '#070a12';
                
                ctx.beginPath();
                ctx.arc(op.cx, op.cy, op.radius, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(op.cx, op.cy - op.radius);
                ctx.lineTo(op.cx, op.cy + op.radius);
                ctx.moveTo(op.cx - op.radius, op.cy);
                ctx.lineTo(op.cx + op.radius, op.cy);
                ctx.stroke();
                break;
        }
    });
}