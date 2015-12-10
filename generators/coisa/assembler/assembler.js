'use strict';

goog.provide('Blockly.Coisa.Assembler');
goog.require('Blockly.Coisa');
goog.require('Decoder');

Blockly.Coisa.Assembler = {
	assembly: function(code) {
		var lines = code.split("\n");
		for (var line in lines)
		{
			if (lines[line] && Decoder.getType(lines[line]) == Decoder.types.Instruction) {
				this.instructions.push(new Instruction(lines[line]));
			}
			else {
				
			}
		}
	},
	instructions: [],
	sections: [],
	labels: [],
	data: []
};

function Instruction(line)
{
	var splittedLine = line.replace("\t"," ").split(" ");
	var encoding = Decoder.getEncoding(splittedLine[0]);
	console.log(splittedLine);
	console.log(encoding);
	if (encoding == Decoder.encodings.Register)
	{
		var rs;
		var rt;
		var rd;
		var shamt;
		var funct;
	}
	else if (encoding == Decoder.encodings.Immediate)
	{
		var op;
		var rs;
		var rt;
		var immediate;
	}
	else if (encoding == Decoder.encodings.Jump)
	{
		var op;
		var address;
	}
	this.assembled = function()
	{
		return 0;
	}
};