/**
 * Quamd Core Engine Parser
 * Proprietary Software - Copyright (c) 2026 Asmita Ghorai. All rights reserved.
 * * Takes a raw quantum command string and outputs structural geometry instructions.
 */

function parseQuamdToLayout(rawString) {
    // 1. Clean the incoming string by stripping out global #.# tag wrappers if present
    let cleanString = rawString.replace(/#\.#/g, '').trim();
    
    // 2. Tokenize by splitting commands by semicolons, cleaning whitespace
    const commands = cleanString.split(';').map(s => s.trim()).filter(Boolean);
    
    let totalWires = 1;
    let timeline = [];

    // 3. Process commands chronologically to map logical gate placement
    commands.forEach((cmd) => {
        if (cmd.startsWith('H(')) {
            const match = cmd.match(/\d+/);
            if (match) {
                const wire = parseInt(match[0], 10);
                if (wire + 1 > totalWires) totalWires = wire + 1;
                timeline.push({ type: 'H', wire: wire });
            }
        } else if (cmd.startsWith('CX(')) {
            const numbers = cmd.match(/\d+/g);
            if (numbers && numbers.length >= 2) {
                const control = parseInt(numbers[0], 10);
                const target = parseInt(numbers[1], 10);
                const maxWire = Math.max(control, target);
                if (maxWire + 1 > totalWires) totalWires = maxWire + 1;
                timeline.push({ type: 'CX', control: control, target: target });
            }
        }
    });

    // 4. Geometry Canvas Mathematics & Constant Grid Constraints
    const PADDING_X = 40;
    const PADDING_Y = 40;
    const WIRE_SPACING = 50;
    const MOMENT_SPACING = 70;
    const GATE_SIZE = 30;

    const svgWidth = PADDING_X * 2 + (timeline.length * MOMENT_SPACING);
    const svgHeight = PADDING_Y * 2 + ((totalWires - 1) * WIRE_SPACING);

    // This structured layout array will store every explicit line, box, and dot
    let drawingOperations = [];

    // 5. Calculate Background Quantum Wire Grid Line Coordinates
    for (let i = 0; i < totalWires; i++) {
        const y = PADDING_Y + (i * WIRE_SPACING);
        drawingOperations.push({
            type: 'wire',
            x1: PADDING_X,
            y1: y,
            x2: svgWidth - PADDING_X,
            y2: y,
            wireIndex: i
        });
    }

    // 6. Translate Abstract Quantum Moments into Concrete Vector Space Coordinates
    timeline.forEach((op, momentIdx) => {
        // Calculate the central horizontal baseline milestone for this moment block
        const centerX = PADDING_X + (momentIdx * MOMENT_SPACING) + (MOMENT_SPACING / 2);

        if (op.type === 'H') {
            const baselineY = PADDING_Y + (op.wire * WIRE_SPACING);
            drawingOperations.push({
                type: 'gate_box',
                label: 'H',
                x: centerX - (GATE_SIZE / 2),
                y: baselineY - (GATE_SIZE / 2),
                width: GATE_SIZE,
                height: GATE_SIZE,
                wire: op.wire
            });
        } else if (op.type === 'CX') {
            const yControl = PADDING_Y + (op.control * WIRE_SPACING);
            const yTarget = PADDING_Y + (op.target * WIRE_SPACING);
            
            drawingOperations.push({
                type: 'cx_line',
                x: centerX,
                y1: yControl,
                y2: yTarget
            });
            drawingOperations.push({
                type: 'cx_control',
                cx: centerX,
                cy: yControl,
                radius: 4
            });
            drawingOperations.push({
                type: 'cx_target',
                cx: centerX,
                cy: yTarget,
                radius: 9
            });
        }
    });

    // 7. Output standard coordinate payload contract
    return {
        width: svgWidth,
        height: svgHeight,
        totalWires: totalWires,
        operations: drawingOperations
    };
}

// Node.js environment configuration export safety bridge
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseQuamdToLayout };
}