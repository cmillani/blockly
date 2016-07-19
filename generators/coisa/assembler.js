'use strict';

goog.provide('Blockly.Coisa.Assembler');
goog.require('Blockly.Coisa');
goog.require('Decoder');

Blockly.Coisa.Assembler = {
	assembly: function(code) {
    this.code = [];
    this.data = [];
    this.labels = {};
    this.currentSection = "text";
    this.numberOfInstructions = 0;
    this.instructions = [];
		var lines = code.split("\n");
		for (var line in lines)
		{
			// console.log(this.numberOfInstructions)
      // console.log(lines[line])
			if (lines[line] && Decoder.getType(lines[line]) == Decoder.types.Instruction) {
				this.instructions.push(new Instruction(lines[line]));
				this.numberOfInstructions += 4;
			}
			else if (Decoder.getType(lines[line]) == Decoder.types.Directive) {
				TranslateDirective(lines[line]);
			}
			else if (Decoder.getType(lines[line]) == Decoder.types.Label) {
				Label(lines[line]);
			}
			else if (Decoder.getType(lines[line]) == Decoder.types.PseudoInstruction) {
				var splittedLine = lines[line].replace("\t"," ").replace(","," ").replace("("," ").replace(")","").split(/[ ]+/);
				if (splittedLine[0] == "")
				{
					splittedLine = splittedLine.slice(1,splittedLine.length);
				}
				var instruction = splittedLine[0];
				var params = splittedLine.slice(1,splittedLine.length).join().split(",");
				var translated = Decoder.translatePseudo(instruction, params);
				// console.log(translated)
				// console.log(translated)
				for (var item in translated)
				{
          // console.log(translated[item])
          // this.instructions.push(new Instruction(translated[item]))
					this.numberOfInstructions += 4;
				}
        this.instructions.push(new Instruction(lines[line]))
			}
		}
		for (var instruction in this.instructions)
		{
			// console.log(this.instructions[instruction])
			// console.log(this.instructions[instruction].code)
      if(this.instructions[instruction].isPseudo)
      {
        // console.log("pseudo");
        // console.log(this.instructions[instruction])
				var number = this.instructions[instruction].lineNumber;
				var splittedLine = this.instructions[instruction].code.replace("\t"," ").replace(","," ").replace("("," ").replace(")","").split(/[ ]+/);
				if (splittedLine[0] == "")
				{
					splittedLine = splittedLine.slice(1,splittedLine.length);
				}
				var instruction = splittedLine[0];
				var params = splittedLine.slice(1,splittedLine.length).join().split(",");
				var translated = Decoder.translatePseudo(instruction, params, number);
				for (var item in translated)
				{
          // console.log(translated[item])
          var instruct = new Instruction(translated[item])
    			var newC = instruct.assembled();
    			this.code.push(((newC >> 24) & 0xFF));
    			this.code.push(((newC >> 16) & 0xFF));
    			this.code.push(((newC >> 8) & 0xFF));
    			this.code.push((newC & 0xFF));//String.fromCharCode
					// console.log(newC.toString(16));
          // this.numberOfInstructions += 4;
				}
      } else {
  			var newC = this.instructions[instruction].assembled();
  			this.code.push(((newC >> 24) & 0xFF));
  			this.code.push(((newC >> 16) & 0xFF));
  			this.code.push(((newC >> 8) & 0xFF));
  			this.code.push((newC & 0xFF));//String.fromCharCode
				// console.log(newC.toString(16));
      }
			
			// console.log(this.instructions[instruction].code)
			// console.log("---------------")
			
		}
		for (var char in this.data)
		{
			// console.log(this.data[char]);
			this.code.push(this.data[char].charCodeAt(0));
		}
		// console.log(this.code)
		// for (var item in this.code)
//     {
//       console.log(this.code[item].charCodeAt(0).toString(16))
//     }
		// console.log(this.code.join(""));
		return this.code
		// console.log(this.data);
	},
	currentSection: "text",
	instructions: [],
	labels: {},
	numberOfInstructions: 0,
	memoryPosition: function() {
		return this.numberOfInstructions;
	},
	data: [],
	code: []
};

function InterpretLine(line)
{
	if (line && Decoder.getType(line) == Decoder.types.Instruction) {
		Blockly.Coisa.Assembler.instructions.push(new Instruction(line));
		Blockly.Coisa.Assembler.numberOfInstructions += 4;
	}
	else if (Decoder.getType(line) == Decoder.types.Directive) {
		TranslateDirective(line);
	}
	else if (Decoder.getType(line) == Decoder.types.Label) {
		// console.log(line);
		Label(line);
		// Blockly.Coisa.Assembler.labels.push(new Label(line));
	}
	else if (Decoder.getType(line) == Decoder.types.PseudoInstruction) {
		var splittedLine = line.replace("\t"," ").replace(","," ").replace("("," ").replace(")","").split(/[ ]+/);
		if (splittedLine[0] == "")
		{
			splittedLine = splittedLine.slice(1,splittedLine.length);
		}
		var instruction = splittedLine[0];
		var params = splittedLine.slice(1,splittedLine.length).join().split(",");
		var translated = Decoder.translatePseudo(instruction, params);
		// console.log(translated)
		// console.log(translated)
		for (var item in translated)
		{
			// Blockly.Coisa.Assembler.instructions.push(new Instruction(translated[item]))
			Blockly.Coisa.Assembler.numberOfInstructions += 4;
		}
		Blockly.Coisa.Assembler.instructions.push(new Instruction(line))
	}
}

function Instruction(line)
{
	var splittedLine = line.replace("\t"," ").replace(","," ").replace("("," ").replace(")","").split(/[ ]+/);
	if (splittedLine[0] == "")
	{
		splittedLine = splittedLine.slice(1,splittedLine.length);
		// console.log(splittedLine)
	}
	var instruction = splittedLine[0];
	var params = splittedLine.slice(1,splittedLine.length).join().split(/[,]+/);
	var encoding = Decoder.getEncoding(instruction, params);
  if (encoding != -1)
  {
	  var registers = Decoder.organizeRegistersOrder(instruction, params, encoding);
  }
  this.isPseudo = false
	if (encoding == Decoder.encodings.Register)
	{
		var rs = registers["rs"];
		var rt = registers["rt"];
		var rd = registers["rd"];
		var shamt = registers["shamt"];
	}
	else if (encoding == Decoder.encodings.Immediate)
	{
		var rs = registers["rs"];
		var rt = registers["rt"];
		var immediate = registers["immediate"];
	}
	else if (encoding == Decoder.encodings.Jump)
	{
		var address = registers["immediate"];
	}
  else { //Pseudo Instruction
    this.isPseudo = true
  }
	this.lineNumber = Blockly.Coisa.Assembler.numberOfInstructions;
	this.code = line
	this.assembled = function()
	{
		if (encoding == Decoder.encodings.Register) return Decoder.decodeR(instruction,{rs: rs,rt: rt,rd: rd,shamt: shamt});
		else if (encoding == Decoder.encodings.Immediate) return Decoder.decodeI(instruction,[rs,rt,immediate]);
		else if (encoding == Decoder.encodings.Jump) return Decoder.decodeJ(instruction,[address]);
		else {
			console.log("FATAL ERROR HERE<<<<<<<<<<<<<<<<<<<<<<<<");
			return -1;
		}
	}
};



function TranslateDirective(line)
{
	// console.log(line)
	var splittedLine = line.replace("\t"," ").replace(","," ").replace("("," ").replace(")","").split(/[ ]+/);
	var params = splittedLine.slice(1,splittedLine.length).join().split(/[,]+/);
	var command = splittedLine[0];
	// console.log(command);
	if (command == ".data")
	{
		
	} 
	else if (command == ".asciiz")
	{
    params = params.join(" ")
    // console.log(params)
		var theString = params.replace("\"","").replace("\"","");
    // console.log(theString);
    var special = false
		for (var i = 0; i < theString.length; i++)
		{
      if (theString.charAt(i) == "\\")
      {
        special = true
      }
      if (!special)
      {
			  Blockly.Coisa.Assembler.data.push(theString.charAt(i))
        Blockly.Coisa.Assembler.numberOfInstructions += 1;
      } else {
        if (theString.charAt(i) == "n")
        {
  			  Blockly.Coisa.Assembler.data.push("\n")
          Blockly.Coisa.Assembler.numberOfInstructions += 1;
        }
      }
		}
		Blockly.Coisa.Assembler.data.push('\0')
    Blockly.Coisa.Assembler.numberOfInstructions += 1;
    
	}
};

function ClearArray(array)
{
	var newArray = []
	for (var item in array)
	{
		if (array[item])
		{
			newArray.push(array[item]);
		}
	}
	return newArray;
}

function Label(line){
	// console.log("Lab:")
	// console.log(line);
	// console.log(Blockly.Coisa.Assembler.memoryPosition());
	var splittedLine = line.replace("\t"," ").replace(","," ").replace("("," ").replace(")","").split(/[ ]+/);
	var command = splittedLine.slice(1,splittedLine.length).join(" ").split(/[,]+/);
	var position = Blockly.Coisa.Assembler.memoryPosition();
	var theName = splittedLine[0]
	// console.log(theName);
	// console.log(position);
	// console.log()
	Blockly.Coisa.Assembler.labels[theName.replace(":","")] = position;
  // console.log(Blockly.Coisa.Assembler.labels);
	// console.log(Blockly.Coisa.Assembler.labels);
	command = ClearArray(command);
	// console.log(Object.keys(command).length);
	if (Object.keys(command).length > 0){
		// console.log("AITEEEIMMM");
		// console.log(command[0]);
		InterpretLine(command.join(" "));
	}
	// console.log(this.position);
};