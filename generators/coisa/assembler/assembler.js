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
				this.numberOfInstructions += 4;
			}
			else if (Decoder.getType(lines[line]) == Decoder.types.Directive) {
				TranslateDirective(lines[line]);
			}
			else if (Decoder.getType(lines[line]) == Decoder.types.Label) {
				this.labels.push(new Label(lines[line]));
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
					this.numberOfInstructions += 4;
				}
			}
		}
		for (var instruction in this.instructions)
		{
			var newC = this.instructions[instruction].assembled();
			this.code.push((newC >> 24) & 0xFF);
			this.code.push((newC >> 16) & 0xFF);
			this.code.push((newC >> 8) & 0xFF);
			this.code.push(newC & 0xFF);
			// console.log(this.instructions[instruction].code)
			// console.log(newC.toString(16));
			// console.log("---------------")
			
		}
	},
	currentSection: "text",
	instructions: [],
	labels: [],
	numberOfInstructions: 0,
	memoryPosition: function() {
		return this.numberOfInstructions;
	},
	data: [],
	code: []
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

function TranslateDirective(line)
{
	console.log("Dir:")
	console.log(line);
};
function Label(line){
	// console.log("Lab:")
	// console.log(line);
	// console.log(Blockly.Coisa.Assembler.memoryPosition());
	var splittedLine = line.replace("\t"," ").replace(","," ").replace("("," ").replace(")","").split(/[ ]+/);
	var rest = splittedLine.slice(1,splittedLine.length).join().split(/[,]+/);
	this.position = Blockly.Coisa.Assembler.memoryPosition();
	this.name = splittedLine[0]
	if (rest){
		console.log("AITEEEIMMM")
	}
	console.log(rest)
	console.log(this.position);
};