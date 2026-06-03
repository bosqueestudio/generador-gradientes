{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const visualizer = document.getElementById('visualizer');\
const codeOutput = document.getElementById('codeOutput');\
const btnAnimate = document.getElementById('btnAnimate');\
const btnDownload = document.getElementById('btnDownload');\
const angleInput = document.getElementById('angleInput');\
const angleControlGroup = document.getElementById('angle-control-group');\
const blendSlider = document.getElementById('blendSlider');\
const blendValue = document.getElementById('blendValue');\
\
const pickers = [1, 2, 3, 4].map(i => document.getElementById(`picker$\{i\}`));\
const hexInputs = [1, 2, 3, 4].map(i => document.getElementById(`hex$\{i\}`));\
const radiosGtype = document.getElementsByName('gtype');\
const radiosRatio = document.getElementsByName('aspectRatio');\
\
let isAnimating = false;\
\
// Configuraci\'f3n inicial de fusi\'f3n de colores\
calculateStops(0);\
\
// Sincronizar selectores de colores\
pickers.forEach((picker, index) => \{\
    picker.addEventListener('input', (e) => \{\
        let color = e.target.value;\
        hexInputs[index].value = color;\
        document.documentElement.style.setProperty(`--color$\{index + 1\}`, color);\
        updateOutputText();\
    \});\
\});\
\
hexInputs.forEach((input, index) => \{\
    input.addEventListener('input', (e) => \{\
        let color = e.target.value;\
        if(/^#[0-9A-F]\{6\}$/i.test(color)) \{\
            pickers[index].value = color;\
            document.documentElement.style.setProperty(`--color$\{index + 1\}`, color);\
            updateOutputText();\
        \}\
    \});\
\});\
\
// Cambiar Tipo de Gradiente\
radiosGtype.forEach(radio => \{\
    radio.addEventListener('change', (e) => \{\
        document.getElementById('lbl-linear').classList.toggle('active', e.target.value === 'linear');\
        document.getElementById('lbl-radial').classList.toggle('active', e.target.value === 'radial');\
        \
        if (e.target.value === 'linear') \{\
            visualizer.classList.remove('radial-gradient');\
            visualizer.classList.add('linear-gradient');\
            angleControlGroup.style.display = 'block';\
        \} else \{\
            visualizer.classList.remove('linear-gradient');\
            visualizer.classList.add('radial-gradient');\
            angleControlGroup.style.display = 'none';\
        \}\
        updateOutputText();\
    \});\
\});\
\
// Control de \'c1ngulo Manual\
angleInput.addEventListener('input', (e) => \{\
    if(!isAnimating) \{\
        let value = parseInt(e.target.value) || 0;\
        document.documentElement.style.setProperty('--angle', `$\{value\}deg`);\
        updateOutputText();\
    \}\
\});\
\
// L\'f3gica del Slider de Fusi\'f3n\
blendSlider.addEventListener('input', (e) => \{\
    let val = parseInt(e.target.value);\
    blendValue.textContent = `$\{val\}%`;\
    calculateStops(val);\
    updateOutputText();\
\});\
\
function calculateStops(blendFactor) \{\
    let stop2 = 33 + (blendFactor * 0.33); \
    let stop3 = 66 - (blendFactor * 0.33);\
    document.documentElement.style.setProperty('--stop2', `$\{stop2\}%`);\
    document.documentElement.style.setProperty('--stop3', `$\{stop3\}%`);\
\}\
\
// Control de Aspect Ratio\
radiosRatio.forEach(radio => \{\
    radio.addEventListener('change', (e) => \{\
        visualizer.classList.remove('ratio-16-9', 'ratio-3-4', 'ratio-9-16');\
        document.getElementById('lbl-16-9').classList.remove('active');\
        document.getElementById('lbl-3-4').classList.remove('active');\
        document.getElementById('lbl-9-16').classList.remove('active');\
\
        document.getElementById(`lbl-$\{e.target.value\}`).classList.add('active');\
        visualizer.classList.add(`ratio-$\{e.target.value\}`);\
    \});\
\});\
\
// Actualizar caja de texto con el c\'f3digo CSS real\
function updateOutputText() \{\
    const type = document.querySelector('input[name="gtype"]:checked').value;\
    const c1 = hexInputs[0].value;\
    const c2 = hexInputs[1].value;\
    const c3 = hexInputs[2].value;\
    const c4 = hexInputs[3].value;\
    const s2 = getComputedStyle(document.documentElement).getPropertyValue('--stop2').trim();\
    const s3 = getComputedStyle(document.documentElement).getPropertyValue('--stop3').trim();\
\
    if (type === 'linear') \{\
        const angle = getComputedStyle(document.documentElement).getPropertyValue('--angle').trim();\
        codeOutput.textContent = `background: linear-gradient($\{angle\}, $\{c1\} 0%, $\{c2\} $\{s2\}, $\{c3\} $\{s3\}, $\{c4\} 100%);`;\
    \} else \{\
        const posX = getComputedStyle(document.documentElement).getPropertyValue('--posX').trim();\
        const posY = getComputedStyle(document.documentElement).getPropertyValue('--posY').trim();\
        codeOutput.textContent = `background: radial-gradient(circle at $\{posX\} $\{posY\}, $\{c1\} 0%, $\{c2\} $\{s2\}, $\{c3\} $\{s3\}, $\{c4\} 100%);`;\
    \}\
\}\
\
// L\'f3gica de Animaci\'f3n Din\'e1mica\
let currentAngle = 0; let currentX = 50; let currentY = 50;\
let targetAngle = 0; let targetX = 50; let targetY = 50;\
\
function animate() \{\
    if (!isAnimating) return;\
\
    currentAngle += (targetAngle - currentAngle) * 0.05;\
    currentX += (targetX - currentX) * 0.05;\
    currentY += (targetY - currentY) * 0.05;\
\
    const type = document.querySelector('input[name="gtype"]:checked').value;\
    if (type === 'linear') \{\
        document.documentElement.style.setProperty('--angle', `$\{Math.round(currentAngle)\}deg`);\
        angleInput.value = Math.round(currentAngle);\
    \} else \{\
        document.documentElement.style.setProperty('--posX', `$\{Math.round(currentX)\}%`);\
        document.documentElement.style.setProperty('--posY', `$\{Math.round(currentY)\}%`);\
    \}\
\
    updateOutputText();\
\
    if (Math.abs(targetAngle - currentAngle) < 1 && Math.abs(targetX - currentX) < 1) \{\
        pickNewTargets();\
    \}\
\
    requestAnimationFrame(animate);\
\}\
\
function pickNewTargets() \{\
    targetAngle = Math.random() * 360;\
    targetX = Math.random() * 100;\
    targetY = Math.random() * 100;\
\}\
\
btnAnimate.addEventListener('click', () => \{\
    isAnimating = !isAnimating;\
    if (isAnimating) \{\
        btnAnimate.textContent = "Detener Animaci\'f3n";\
        btnAnimate.classList.add('active');\
        pickNewTargets();\
        animate();\
    \} else \{\
        btnAnimate.textContent = "Iniciar Animaci\'f3n";\
        btnAnimate.classList.remove('active');\
    \}\
\});\
\
// Descargar como Imagen PNG\
btnDownload.addEventListener('click', () => \{\
    if (typeof html2canvas === 'undefined') \{\
        alert("La librer\'eda de descarga a\'fan se est\'e1 cargando. Intenta de nuevo en un segundo.");\
        return;\
    \}\
    \
    codeOutput.style.display = 'none';\
\
    html2canvas(visualizer, \{\
        useCORS: true, \
        logging: false,\
        width: visualizer.offsetWidth,\
        height: visualizer.offsetHeight\
    \}).then(canvas => \{\
        const link = document.createElement('a');\
        link.download = `gradiente-$\{document.querySelector('input[name="aspectRatio"]:checked').value\}.png`;\
        link.href = canvas.toDataURL('image/png');\
        link.click();\
        \
        codeOutput.style.display = 'block';\
    \});\
\});}