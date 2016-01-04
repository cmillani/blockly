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
			else if (Decoder.getType(lines[line]) == Decoder.types.Directive) {
				
			}
			else if (Decoder.getType(lines[line]) == Decoder.types.Label) {
				
			}
			else if (Decoder.getType(lines[line]) == Decoder.types.PseudoInstruction) {
				
			}
		}
		for (var instruction in this.instructions)
		{
			code += this.instructions[instruction].assembled();
		}
	},
	instructions: [],
	sections: [],
	labels: [],
	data: [],
	code: ""
};

function Instruction(line)
{
	var splittedLine = line.replace("\t"," ").split(" ");
	var instruction = splittedLine[0];
	var params = splittedLine.slice(1,splittedLine.length).join().split(",");
	var encoding = Decoder.getEncoding(instruction, params);

	if (encoding == Decoder.encodings.Register)
	{
		var rs = params[0];
		var rt = params[1];
		var rd = params[2];
		var shamt = params[3];
		var funct = params[4];
	}
	else if (encoding == Decoder.encodings.Immediate)
	{
		var op = params[0];
		var rs = params[1];
		var rt = params[2];
		var immediate = params[3];
	}
	else if (encoding == Decoder.encodings.Jump)
	{
		var op = params[0];
		var address = params[1];
	}
	this.assembled = function()
	{
		if (encoding == Decoder.encodings.Register) return Decoder.decodeR(instruction,[rs,rt,rd,shamt,funct]);
		else if (encoding == Decoder.encodings.Immediate) return Decoder.decodeI(instruction,[op,rs,rt,immediate]);
		else if (encoding == Decoder.encodings.Jump) return Decoder.decodeJ(instruction,[op,address]);
		else return -1;
	}
};