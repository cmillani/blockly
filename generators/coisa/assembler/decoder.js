'use strict';

goog.provide('Decoder')

//Mips Instruciton Encodings
Decoder = {
	encodings: {
		Register: "R",
		Immediate: "I",
		Jump: "J"
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
		Pseudo: {"move":0,"clear":0,"not":0,"la":0,"li":0,"b":0,"bal":0,"bgt":0,"blt":0,"bge":0,"ble":0,"blez":0,"bgtu":0,"bgtz":0,"beqz":0,"mul":0,"div":0,"rem":0}
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
		else console.log(instruction);
		return -1 //Error, TODO: Abort
	},

	//Gets "type" of a line
	getType: function(line) {
		if (typeof this.Instructions.Pseudo[line.replace("\t"," ").split(" ")[0].toLowerCase()] != 'undefined') return this.types.PseudoInstruction;
		else if (line.indexOf(":") != -1) return this.types.Label;
		else if (line.indexOf(".") != -1) return this.types.Directive;
		else return this.types.Instruction;
	},
	
	translatePseudo: function(instruction, params)
	{
		// Pseudo: {"move":0,"clear":0,"not":0,"la":0,"li":0,"b":0,"bal":0,"bgt":0,"blt":0,"bge":0,"ble":0,"blez":0,"bgtu":0,"bgtz":0,"beqz":0,"mul":0,"div":0,"rem":0}
	},
	
	decodeR: function(instruction, params) {
    console.log(this.Instructions.Register[instruction])
    var decoded = this.Instructions.Register[instruction]
		return decoded
	},
	
	decodeI: function(instruction, params) {
    console.log(this.Instructions.Immediate[instruction])
    var decoded = this.Instructions.Immediate[instruction]
		return decoded
	},
	
	decodeJ: function(instruction, params) {
    console.log(this.Instructions.Jump[instruction])
    var decoded = this.Instructions.Jump[instruction]
		return decoded
	}
}