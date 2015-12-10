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
		Label: "Lab"
	},

	//Available instructions
	Instructions: {
		Register: ["movn","movz","add","addu","and","div","divu",
	             "mult","multu","nor","or","sll","sllv","sra",
	             "srav","srl","srlv","sub","subu","xor","slt",
	             "sltu","jalr","jr","mfhi","mflo","mthi","mtlo",
	             "syscall"],
	  Immediate: ["addi","addiu","andi","ori","xori","lui","lhi",
		            "llo","slti","sltiu","bgez","bgezal","bltz",
		            "bltzal","beq","bgtz","blez","bne","lb","lbu",
		            "lh","lhu","lw","sb","sh","sw"],
		Jump: ["j","jal","trap","swl","swr","lwl","lwr"]
	},

	//Gets the encoding of an instruction
	getEncoding: function(instruction) {
		instruction = instruction.toLowerCase();
		return this.encodings.Register;
	},

	//Gets "type" of a line
	getType: function(line) {
		if (line.indexOf(":") != -1) return this.types.Label;
		else if (line.indexOf(".") != -1) return this.types.Directive;
		else return this.types.Instruction;
	}
}