// var element = document.querySelector("#greeting");
// element.innerText = "Hello, world!";
// function jump(h) {
// 	console.log(''')
// 	var url = location.href;               //Save down the URL without hash.
//   location.href = "#"+h;                 //Go to the target element.
//   history.replaceState(null,null,url);   //Don't like hashes. Changing it back.
// }
//0x20C38FF648C3

var blocksXML = {
	event_onstart: '<block type="event_onstart"></block>',
	event_btdown: '<block type="event_btdown"></block>',
	event_distancechange: '<block type="event_distancechange"><value name="threshold"><block type="math_number"><field name="NUM">20</field></block></value></block>',
	controls_if: '<block type="controls_if"></block>',
	logic_compare: '<block type="logic_compare"></block>',
	math_number: '<block type="math_number"></block>',
	distance: '<block type="distance"></block>',
	led_red: '<block type="led_red"></block>',
	led_green: '<block type="led_green"></block>',
	go_forward: '<block type="go_forward"></block>',
	go_left: '<block type="go_left"></block>',
	go_right: '<block type="go_right"></block>',
	stop: '<block type="stop"></block>',
	step_forward: '<block type="step_forward"></block>',
	turn_right: '<block type="turn_right"></block>',
	turn_left: '<block type="turn_left"></block>',
	controls_repeat_ext: '<block type="controls_repeat_ext"><value name="TIMES"><block type="math_number"><field name="NUM">10</field></block></value></block>',
	controls_repeat_forever: '<block type= "controls_repeat_forever"></block>',
	controls_whileUntil: '<block type="controls_whileUntil"></block>'
};

Object.freeze(blocksXML);

function getCurrentBlocks(workspace) {
	var xml = Blockly.Xml.workspaceToDom(workspace);
	var xmlText = Blockly.Xml.domToPrettyText(xml);
	console.log(xmlText);
	return xmlText;
}

function setGroupOfBlocks(workspace, blocks) {
	var toolbox = "<xml>";
	
	for (var i in blocks) {
		var newLine = blocksXML[blocks[i]];
		if (newLine == undefined) {
			throw new Error("Invalid Block");
		}
		toolbox += newLine;
	}
	
	toolbox += "</xml>";
	workspace.updateToolbox(toolbox);
}

/*If */
function setBlocksInSpace(workspace, xml) {
	workspace.clear();
	if (xml == null) {
			xml = [
    	  '<xml xmlns="http://www.w3.org/1999/xhtml">' +
    	  '	<block type="event_onstart" x="313" y="263"></block>' +
    	  '</xml>'].join('\n');
	}
  var dom = Blockly.Xml.textToDom(xml);
  Blockly.Xml.domToWorkspace(dom, workspace);
}