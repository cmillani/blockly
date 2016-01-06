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
				var splittedLine = lines[line].replace("\t"," ").replace(","," ").replace("("," ").replace(")","").split(/[ ]+/);
				var instruction = splittedLine[0];
				var params = splittedLine.slice(1,splittedLine.length).join().split(",");
				var translated = Decoder.translatePseudo(instruction, params);
				// console.log(translated)
				for (var item in translated)
				{
					this.instructions.push(new Instruction(translated[item]))
				}
			}
		}
		for (var instruction in this.instructions)
		{
			var newC = this.instructions[instruction].assembled();
			code += newC;
			// console.log(this.instructions[instruction].code)
			console.log(newC.toString(16));
			// console.log("---------------")
			
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
	var splittedLine = line.replace("\t"," ").replace(","," ").replace("("," ").replace(")","").split(/[ ]+/);
	var instruction = splittedLine[0];
	var params = splittedLine.slice(1,splittedLine.length).join().split(/[,]+/);
	var encoding = Decoder.getEncoding(instruction, params);
	var registers = Decoder.organizeRegistersOrder(instruction, params, encoding);

	if (encoding == Decoder.encodings.Register)
	{
		var rs = registers["rs"] | 0;
		var rt = registers["rt"] | 0;
		var rd = registers["rd"] | 0;
		var shamt = registers["shamt"] | 0;
	}
	else if (encoding == Decoder.encodings.Immediate)
	{
		var rs = registers["rs"] | 0;
		var rt = registers["rt"] | 0;
		var immediate = registers["immediate"] | 0;
	}
	else if (encoding == Decoder.encodings.Jump)
	{
		var address = registers["immediate"] | 0;
	}
	this.code = line
	this.assembled = function()
	{
		if (encoding == Decoder.encodings.Register) return Decoder.decodeR(instruction,{rs: rs,rt: rt,rd: rd,shamt: shamt});
		else if (encoding == Decoder.encodings.Immediate) return Decoder.decodeI(instruction,[rs,rt,immediate]);
		else if (encoding == Decoder.encodings.Jump) return Decoder.decodeJ(instruction,[address]);
		else return -1;
	}
};