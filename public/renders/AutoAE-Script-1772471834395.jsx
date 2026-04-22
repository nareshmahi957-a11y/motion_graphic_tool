
// AutoAE Pro - Generated After Effects Script
app.beginUndoGroup("AutoAE Build Project");

// 1. Create the Main Composition
var compName = "AutoAE_Project_Main";
var compWidth = 1080;
var compHeight = 1920;
var compPixelAspect = 1;
var compDuration = 10; // seconds
var compFPS = 30;
var mainComp = app.project.items.addComp(compName, compWidth, compHeight, compPixelAspect, compDuration, compFPS);
mainComp.openInViewer();

// 2. Create Background
var bgLayer = mainComp.layers.addSolid([0.02, 0.02, 0.03], "BG Dark", compWidth, compHeight, compPixelAspect);
bgLayer.locked = true;

// 3. Create Main Text Layer from Next.js State
var textLayer = mainComp.layers.addText("Master Mind");
var textProp = textLayer.property("Source Text");
var textDoc = textProp.value;
textDoc.fontSize = 135;
textDoc.fillColor = [0, 1, 1];
textDoc.font = "Montserrat-Black";
textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
textProp.setValue(textDoc);

// Center the text in the comp
var textRect = textLayer.sourceRectAtTime(0, false);
textLayer.property("Position").setValue([compWidth/2, compHeight/2]);

alert("AutoAE Project Successfully Reconstructed in After Effects!");
app.endUndoGroup();
      