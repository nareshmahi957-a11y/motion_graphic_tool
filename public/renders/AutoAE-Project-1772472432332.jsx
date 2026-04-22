
app.beginUndoGroup("AutoAE Pro Build");

// 1. Create the Main Composition
var compName = "AutoAE_Project_Main";
var compWidth = 1080;
var compHeight = 1920;
var mainComp = app.project.items.addComp(compName, compWidth, compHeight, 1, 10, 30);
mainComp.openInViewer();

// 2. Dynamic Background Color
var bgLayer = mainComp.layers.addSolid(${aeBgColor}, "Scene Background", compWidth, compHeight, 1);
bgLayer.locked = true;

// Helper function to create text
function createTextLayer(textStr, fSize, fColor, yOffset, isBold) {
    if (!textStr) return null;
    var tLayer = mainComp.layers.addText(textStr);
    var tProp = tLayer.property("Source Text");
    var tDoc = tProp.value;
    tDoc.fontSize = fSize;
    tDoc.fillColor = fColor;
    tDoc.font = isBold ? "Arial-BoldMT" : "ArialMT"; // Safe fallback fonts
    tDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
    tProp.setValue(tDoc);
    
    // Position text in the lower third of the screen
    tLayer.property("Position").setValue([compWidth/2, 1400 + yOffset]);
    return tLayer;
}

// 3. Generate the 3 Text Layers (Stacked perfectly)
var topLayer = createTextLayer("${topText}", 45, [1,1,1], -120, false);
var mainLayer = createTextLayer("${mainText}", ${fontSize}, ${aeColor}, 0, true);
var bottomLayer = createTextLayer("${bottomText}", 40, [1,1,1], 80, false);

// 4. Add Native AE Glow Effect to Main Text
if (mainLayer) {
    var glow = mainLayer.Effects.addProperty("ADBE Glo2");
    glow.property("Glow Radius").setValue(80);
    glow.property("Glow Intensity").setValue(1.5);
    glow.property("Glow Colors").setValue(2); // Set to A & B Colors
    glow.property("Color A").setValue(${aeColor});
    glow.property("Color B").setValue(${aeColor});
}

alert("AutoAE Pro: Successfully built customized project!");
app.endUndoGroup();
      