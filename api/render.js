/**
 * Quamd Cloud Render Pipeline Engine
 * Proprietary Software - Copyright (c) 2026 Asmita Ghorai. All rights reserved.
 * * Serverless API handler translating code strings into static image binary streams.
 */

const { createCanvas } = require('canvas');
const path = require('path');
const fs = require('fs');

// Safely bridge across folders to reference our unified core parsing logic
const { parseQuamdToLayout } = require('../core/quamd-core.js');

module.exports = async (req, res) => {
    try {
        // 1. Capture incoming code parameter query string (fallback to default example if empty)
        const rawCode = req.query.code || '#.# H(0); CX(0,1); #.#';

        // 2. Compute structural spatial geometric dimensions using core parser
        const layout = parseQuamdToLayout(rawCode);

        // 3. Instantiate server-side Node-Canvas context matching calculations
        const canvas = createCanvas(layout.width, layout.height);
        const ctx = canvas.getContext('2d');

        // Clean background slate with sleek deep navy space backdrop
        ctx.fillStyle = '#070a12';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 4. Paint vector operations matching standard web dashboard theme specifications
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

                    // Drop textual grid alignment marks
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

        // 5. Convert drawn pixel matrices directly into a flat PNG image buffer
        const imageBuffer = canvas.toBuffer('image/png');

        // 6. Set explicit client headers so browsers interpret stream as an image file
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=60');
        
        // Push raw binary stream directly out to destination payload
        res.status(200).send(imageBuffer);

    } catch (error) {
        console.error('Cloud Canvas Runtime Exception:', error);
        res.status(500).json({ error: 'Failed to process drawing coordinates array.' });
    }
};