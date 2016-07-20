'use strict';

goog.provide('Decoder')

//Mips Instruciton Encodings
Decoder = {
	encodings: {
		Register: "R",
		Immediate: "I",
		Jump: "J"
	},
  
  subEncodings: {
    "R": {"movn":"ArithLog","movz":"ArithLog","add":"ArithLog","addu":"ArithLog","and":"ArithLog","div":"DivMult","divu":"DivMult",
	             "mult":"DivMult","multu":"DivMult","nor":"ArithLog","or":"ArithLog","sll":"Shift","sllv":"ShiftV","sra":"Shift",
	             "srav":"ShiftV","srl":"Shift","srlv":"ShiftV","sub":"ArithLog","subu":"ArithLog","xor":"ArithLog","slt":"ArithLog",
	             "sltu":"ArithLog","jalr":"JumpR","jr":"JumpR","mfhi":"MoveFrom","mflo":"MoveFrom","mthi":"MoveTo","mtlo":"MoveTo",
	             "syscall":"Trap"},
	  "I": {"addi":"ArithLogI","addiu":"ArithLogI","andi":"ArithLogI","ori":"ArithLogI","xori":"ArithLogI","lui":"LoadI","lhi":"LoadI",
		            "llo":"LoadI","slti":"ArithLogI","sltiu":"ArithLogI","bgez":"EspecialBranch","bgezal":"EspecialBranch","bltz":"EspecialBranch",
		            "bltzal":"EspecialBranch","beq":"Branch","bne":"Branch","lb":"LoadStore","lbu":"LoadStore",
		            "lh":"LoadStore","lhu":"LoadStore","lw":"LoadStore","sb":"LoadStore","sh":"LoadStore","sw":"LoadStore"},
		"J": {"j":"Jump","jal":"Jump","trap":"Trap","swl":"LoadI","swr":"LoadI","lwl":"LoadI","lwr":"LoadI"}
  },
  
  subEncodingsTypes: {
    "ArithLog" : ["rd", "rs", "rt"],
    "DivMult" : ["rs", "rt"],
    "Shift" : ["rd", "rt", "shamt"],
    "ShiftV" : ["rd", "rt", "rs"],
    "JumpR" : ["rs"],
    "MoveFrom" : ["rd"],
    "MoveTo" : ["rs"],
    "ArithLogI" : ["rt", "rs", "immediate"],
    "LoadI" : ["rt", "immediate"], //i is high or low 16 bits of immed32
    "Branch" : ["rs", "rt", "immediate"],  //i is calculated as (label - (current + 4)) >> 2
    "BranchZ" : ["rs", "immediate"], //i is calculated as (label - (current + 4)) >> 2
    "LoadStore" : ["rt", "immediate", "rs"],
    "Jump" : ["immediate"], //i is calculated as (label - (current + 4)) >> 2
    "Trap" : ["immediate"],
    "EspecialBranch" : ["rs", "immediate"]
  },

	//"Types" of line 
	types: {
		Instruction: "Instr",
		Directive: "Dir",
		Label: "Lab",
		PseudoInstruction: "Pseudo"
	},

	//Available instructions
	Instructions: {
		Register: {"movn":0b001011,"movz":0b001010,"add":0b100000,"addu":0b100001,"and":0b100100,"div":0b011010,"divu":0b011011,
	             "mult":0b011000,"multu":0b011001,"nor":0b100111,"or":0b100101,"sll":0b000000,"sllv":0b000100,"sra":0b000011,
	             "srav":0b000111,"srl":0b000010,"srlv":0b000110,"sub":0b100010,"subu":0b100011,"xor":0b100110,"slt":0b101010,
	             "sltu":0b101011,"jalr":0b001001,"jr":0b001000,"mfhi":0b010000,"mflo":0b010010,"mthi":0b010001,"mtlo":0b010011,
	             "syscall":0b001100},
	  Immediate: {"addi":0b001000,"addiu":0b001001,"andi":0b001100,"ori":0b001101,"xori":0b001110,"lui":0b001111,"lhi":0b011001,
		            "llo":0b011000,"slti":0b001010,"sltiu":0b001011,"bgez":0b000001,"bgezal":0b000001,"bltz":0b000001,
		            "bltzal":0b000001,"beq":0b000100,"bne":0b000101,"lb":0b100000,"lbu":0b100100,
		            "lh":0b100001,"lhu":0b100101,"lw":0b100011,"sb":0b101000,"sh":0b101001,"sw":0b101011},
		Jump: {"j":0b000010,"jal":0b000011,"trap":0b011010,"swl":0b101010,"swr":0b101110,"lwl":0b100010,"lwr":0b100110},
		Pseudo: {"move":0,"clear":0,"not":0,"la":0,"li":0,"b":0,"bal":0,"bgt":0,"blt":0,"bge":0,"ble":0,"blez":0,"bgtu":0,"bgtz":0,"beqz":0,"mul":0,"div":0,"rem":0,"nop":0}
	},
	
	//Registersnames
	Registers: {"zero":0,"at":1,"v0":2,"v1":3,"a0":4,"a1":5,"a2":6,"a3":7,
              "t0":8,"t1":9,"t2":10,"t3":11,"t4":12,"t5":13,"t6":14,"t7":15,
              "s0":16,"s1":17,"s2":18,"s3":19,"s4":20,"s5":21,"s6":22,"s7":23,
              "t8":24,"t9":25,"k0":26,"k1":27,"gp":28,"sp":29,"fp":30,"ra":31},

	//Gets the encoding of an instruction
	getEncoding: function(instruction, params) {
		instruction = instruction.toLowerCase();
		if (instruction === "div") { //Div has a special case, should check it
			//If has 2 commas is Pseudo, if not is register
		}
		else if (typeof this.Instructions.Register[instruction] != 'undefined') return this.encodings.Register; //TODO: typeof aproach may not work on old browsers
		else if (typeof this.Instructions.Immediate[instruction] != 'undefined') return this.encodings.Immediate;
		else if (typeof this.Instructions.Jump[instruction] != 'undefined') return this.encodings.Jump;
		// else console.log(instruction);
		// console.log("Encoding Pseudo?");
		return -1 //Error, TODO: Abort
	},

	//Gets "type" of a line
	getType: function(line) {
		var op = line.replace("\t"," ").split(/[ ]+/)[0]
		if (op == "")
		{
			op = line.replace("\t"," ").split(/[ ]+/)[1]
		}
		console.log(line.replace("\t"," ").split(" "))
		// console.log(op);
		if (op){
			if (typeof this.Instructions.Pseudo[op.toLowerCase()] != 'undefined') return this.types.PseudoInstruction;
			else if (line.indexOf(":") != -1) return this.types.Label;
			else if (line.indexOf(".") != -1) return this.types.Directive;
			else return this.types.Instruction;
		}
		else return -1
	},
  
  organizeRegistersOrder: function(instruction, params, encoding)
  {
    var subEncoding = this.subEncodings[encoding][instruction]
    if (typeof subEncoding != undefined)
    {
      var order = this.subEncodingsTypes[subEncoding];
      var rs
      var rt
      var rd
      var shamt
      var immediate
      if (order.indexOf("rs") != -1) rs = this.Registers[params[order.indexOf("rs")].replace("$", "")];
      if (order.indexOf("rt") != -1) rt = this.Registers[params[order.indexOf("rt")].replace("$", "")];
      if (order.indexOf("rd") != -1) rd = this.Registers[params[order.indexOf("rd")].replace("$", "")];
      if (order.indexOf("shamt") != -1) shamt = params[order.indexOf("shamt")].replace("$", "");
      if (order.indexOf("immediate") != -1) immediate = params[order.indexOf("immediate")].replace("$", "");
      return {rs: rs, rt: rt, rd: rd, shamt: shamt, immediate: immediate};
    }
		console.log("FATAL ERROR HERE<<<<<<<<<<<<<<<<<<<<<<<<");
    return null;
  },
	
	translatePseudo: function(instruction, params, position)
	{
    // console.log(instruction)
    // console.log(params)
		// Pseudo:
    for (var i in params)
    {
      if (isNaN(parseInt(params[i])))
      {
        // console.log(Blockly.Coisa.Assembler.labels[immediate])
        // console.log(instruction);
        // console.log(Blockly.Coisa.Assembler.labels)
        // console.log(immediate);
        if (Blockly.Coisa.Assembler.labels[params[i]] != undefined)
        {
          params[i] = Blockly.Coisa.Assembler.labels[params[i]];
        }
        // console.log(immediate);
      }
    }
    if (instruction == "move") {
      return(["add " + params[0] + "," + params[1] + "," + "$zero"]);
    } else if (instruction == "clear") {
      return(["add " + params[0] + "," + "$zero" + "," + "$zero"]);
    } else if (instruction == "not") {
      return(["nor " + params[0] + "," + params[1] + "," + "$zero"]);
    } else if (instruction == "la") {
      return(["lui " + params[0] + "," + ((params[1] >> 16) & 0xFFFF), "ori " + params[0] + "," + params[0] + "," + (params[1] & 0xFFFF)]);
      // return(["lui " + params[0] + "," + params[1], "ori " + params[0] + "," + params[0] + "," + params[1]]);
    } else if (instruction == "li") {
      return(["lui " + params[0] + "," + ((params[1] >> 16) & 0xFFFF), "ori " + params[0] + "," + params[0] + "," + (params[1] & 0xFFFF)]);
      // return(["lui " + params[0] + "," + params[1], "ori " + params[0] + "," + params[0] + "," + params[1]]);
    } else if (instruction == "b") {
      return(["beq " + "$zero" + "," + "$zero" + "," + params[0]]);
    } else if (instruction == "bal") {
      return(["bgezal " + "$zero" + "," + params[0]]);
    } else if (instruction == "bgt") {
      return(["slt " + "$at" + "," + params[1] + "," + params[0], "bne " + "$at" + "," + "$zero" + "," + params[2]]);
    } else if (instruction == "blt") {
      return(["slt " + "$at" + "," + params[0] + "," + params[1], "bne " + "$at" + "," + "$zero" + "," + params[2]]);
    } else if (instruction == "bge") {
			// console.log(instruction)
			// console.log(params)
			if (position)
			{
				params[2] = (params[2] - position) >> 2;
			}
			// console.log(params)
      return(["slt " + "$at" + "," + params[0] + "," + params[1], "beq " + "$at" + "," + "$zero" + "," + params[2]]);
    } else if (instruction == "ble") {
      return(["slt " + "$at" + "," + params[1] + "," + params[0], "beq " + "$at" + "," + "$zero" + "," + params[2]]);
    } else if (instruction == "blez") {
      return(["slt " + "$at" + "," + "$zero" + "," + params[0], "beq " + "$at" + "," + "$zero" + "," + params[1]]);
    } else if (instruction == "bgtu") {
      return(["sltu " + "$at" + "," + params[1] + "," + params[0], "bne " + "$at" + "," + "$zero" + "," + params[2]]);
    } else if (instruction == "bgtz") {
      return(["slt " + "$at" + "," + "$zero" + "," + params[0], "bne " + "$at" + "," + "$zero" + "," + params[1]]);
    } else if (instruction == "beqz") {
      return(["beq " + params[0] + "," + "$zero" + "," + params[1]]);
    } else if (instruction == "mul") {
      return(["mult " + params[1] + "," + params[2], "mflo " + params[0]]);
    } else if (instruction == "div") { // div $d + "," + $s + "," + $t
      return(["div " + params[1] + "," + params[2], "mflo " + params[0]]);
    } else if (instruction == "rem") { // rem $d + "," + $s + "," + $t
      return(["div " + params[1] + "," + params[2], "mfhi " + params[0]]);
    } else if (instruction == "nop") {
      return(["sll $zero, $zero, 0"]);
    }
		console.log("FATAL ERROR HERE<<<<<<<<<<<<<<<<<<<<<<<<");
		console.log(instruction);
		console.log(params);
    return null
	},
	
	decodeR: function(instruction, params) {
    var decoded = 0
    // console.log(params)
    decoded |= ((params["rs"] & 0b111111) << 21) 
    decoded |= ((params["rt"] & 0b111111) << 16) 
    decoded |= ((params["rd"] & 0b111111) << 11) 
    decoded |= ((params["shamt"] & 0b111111) << 8) 
    decoded |= (this.Instructions.Register[instruction] & 0b111111) 
		return decoded
	},
	
	decodeI: function(instruction, params) {
    var decoded = 0
    // console.log(params)
    decoded |= ((this.Instructions.Immediate[instruction] & 0b111111) << 26)
    decoded |= ((params[0] & 0b111111) << 21)
    decoded |= ((params[1] & 0b111111) << 16)
    var immediate = params[2];
    if (isNaN(parseInt(immediate)))
    {
      // console.log(Blockly.Coisa.Assembler.labels[immediate])
      // console.log(Blockly.Coisa.Assembler.labels)
      // console.log(immediate);
      // console.log(instruction);
      immediate = Blockly.Coisa.Assembler.labels[immediate]
      // if (instruction == "lui")
//       {
//         immediate = immediate >> 16 & 0xFFFF
//       } else if (instruction == "ori"){
//         immediate = immediate & 0xFFFF
//       } else {
//         immediate = immediate >> 2
//       }
      // console.log(immediate);
    }
    // console.log(immediate);
    decoded |= (immediate & 0xFFFF)
    // console.log(decoded)
		return decoded
	},
	
	decodeJ: function(instruction, params) {
    var decoded = 0
    // console.log(params)
    decoded |= ((this.Instructions.Jump[instruction] & 0b111111) << 26)
    var immediate = params[0];
    if (isNaN(parseInt(immediate)))
    {
      // console.log(Blockly.Coisa.Assembler.labels[immediate])
      // console.log(instruction);
      // console.log(Blockly.Coisa.Assembler.labels)
      // console.log(immediate);
      immediate = Blockly.Coisa.Assembler.labels[immediate] >> 2
      // console.log(immediate);
    }
    // console.log(immediate);
    decoded |= (immediate & 0x3FFFFFF)
    // console.log(decoded)
		return decoded
	}
}