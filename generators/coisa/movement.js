/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Coisa for logic blocks.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Coisa.movement');

goog.require('Blockly.Coisa');

Blockly.Coisa['movement_robot'] = function(block) {
  var dropdown_movement = block.getFieldValue('movement');
  var code = "";
  if (dropdown_movement == "ahead")
  {
	  code = "li	$v0, 12\n";
	  code += "li	$v1, 15\n";
		code += "la	$t4, movmID\n";
	  code += "syscall\n";
  }
  else if (dropdown_movement == "right")
  {
	  code = "li	$v0, 12\n";
	  code += "li	$v1, 16\n";
		code += "la	$t4, movmID\n";
	  code += "syscall\n";
  }
  else 
  {
	  code = "li	$v0, 12\n";
	  code += "li	$v1, 17\n";
		code += "la $t4, movmID\n";
	  code += "syscall\n";
  }
  return code;
};

Blockly.Coisa['setup_movement'] = function(block) {
	var code = "li	$v0, 12\n";
	code+= "li	$v1, 18\n";
	code+= "la	$t4, movmID\n";
	code+= "syscall\n";
  return code;
};

Blockly.Coisa['go_forward'] = function(block) {
	var code = "li	$v0, 12\n";
	code += "li	$v1, 21\n";
	code += "la	$t4, movmID\n";
	code += "syscall\n";
  return code;
};
Blockly.Coisa['go_left'] = function(block) {
	var code = "li	$v0, 12\n";
	code += "li	$v1, 22\n";
	code += "la	$t4, movmID\n";
	code += "syscall\n";
  return code;
};
Blockly.Coisa['go_right'] = function(block) {
	var code = "li	$v0, 12\n";
	code += "li	$v1, 23\n";
	code += "la	$t4, movmID\n";
	code += "syscall\n";
  return code;
};
Blockly.Coisa['stop'] = function(block) {
	var code = "li	$v0, 12\n";
	code += "li	$v1, 24\n";
	code += "la	$t4, movmID\n";
	code += "syscall\n";
  return code;
};

var forward_th = 60;
var left_th = 20;
var right_th = 20;

Blockly.Coisa['step_forward'] = function(block) {
  if(!Blockly.Coisa['movements_seq'])
  {
    Blockly.Coisa['movements_seq'] = 0;
  }
  Blockly.Coisa['movements_seq'] += 1;
	var code = "";
	//Here we check the previous and the next block
	//We need to know if we need to start the motor now or during the handler
	var prev, next, first, last;
	[prev, next] = getNeighbours(block);
	
	if (prev != "step_forward" && prev != "turn_left" && prev != "turn_right") {
		first = true;
	}
	if (next != "step_forward" && next != "turn_left" && next != "turn_right") {
		last = true;
	}
	//Knowing our neighbours we can now create the code
	if (first) {
		//Sets up to go forward
		code += "li	$v0, 12\n";
		code += "li	$v1, 21\n";
		code += "la	$t4, movmID\n";
		code += "syscall\n";
		//Call Set threshold
		code += "li	$v0, 12\n";
		code += "li	$v1, 7\n";
		code += "li	$a0,"+forward_th+"\n"; //Threshold here
		code += "la	$t4, encdID\n";
		code += "syscall\n";
		//Registers handler to movement threshold
		code += "li	$a0, 1\n";
		code += "la	$a1, mov"+Blockly.Coisa['movements_seq']+"handler\n";
		code += "la	$a2, encdID\n";
		code += "li	$v0, 14\n";
		code += "syscall\n";
	}
	//If not first, must only register a handler
	setup_next(last, next);
  return code;
};
Blockly.Coisa['turn_right'] = function(block) {
  if(!Blockly.Coisa['movements_seq'])
  {
    Blockly.Coisa['movements_seq'] = 0;
  }
  Blockly.Coisa['movements_seq'] += 1;
	var code = "";
	//Here we check the previous and the next block
	//We need to know if we need to start the motor now or during the handler
	var prev, next, first, last;
	[prev, next] = getNeighbours(block);
	
	if (prev != "step_forward" && prev != "turn_left" && prev != "turn_right") {
		first = true;
	}
	if (next != "step_forward" && next != "turn_left" && next != "turn_right") {
		last = true;
	}
	//Knowing our neighbours we can now create the code
	if (first) {
		//Sets up to go right
		code += "li	$v0, 12\n";
		code += "li	$v1, 23\n";
		code += "la	$t4, movmID\n";
		code += "syscall\n";
		//Call Set threshold
		code += "li	$v0, 12\n";
		code += "li	$v1, 7\n";
		code += "li	$a0,"+right_th+"\n"; //Threshold here
		code += "la	$t4, encdID\n";
		code += "syscall\n";
		//Registers handler to movement threshold
		code += "li	$a0, 1\n";
		code += "la	$a1, mov"+Blockly.Coisa['movements_seq']+"handler\n";
		code += "la	$a2, encdID\n";
		code += "li	$v0, 14\n";
		code += "syscall\n";
	}
	//If not first, must only register a handler
	setup_next(last, next);
  return code;
};
Blockly.Coisa['turn_left'] = function(block) {
  if(!Blockly.Coisa['movements_seq'])
  {
    Blockly.Coisa['movements_seq'] = 0;
  }
  Blockly.Coisa['movements_seq'] += 1;
	var code = "";
	//Here we check the previous and the next block
	//We need to know if we need to start the motor now or during the handler
	var prev, next, first, last;
	[prev, next] = getNeighbours(block);
	
	if (prev != "step_forward" && prev != "turn_left" && prev != "turn_right") {
		first = true;
	}
	if (next != "step_forward" && next != "turn_left" && next != "turn_right") {
		last = true;
	}
	//Knowing our neighbours we can now create the code
	if (first) {
		//Sets up to go forward
		code += "li	$v0, 12\n";
		code += "li	$v1, 22\n";
		code += "la	$t4, movmID\n";
		code += "syscall\n";
		//Call Set threshold
		code += "li	$v0, 12\n";
		code += "li	$v1, 7\n";
		code += "li	$a0,"+left_th+"\n"; //Threshold here
		code += "la	$t4, encdID\n";
		code += "syscall\n";
		//Registers handler to movement threshold
		code += "li	$a0, 1\n";
		code += "la	$a1, mov"+Blockly.Coisa['movements_seq']+"handler\n";
		code += "la	$a2, encdID\n";
		code += "li	$v0, 14\n";
		code += "syscall\n";
	}
	//If not first, must only register a handler
	setup_next(last, next);
  return code;
};

var getNeighbours = function(block) {
	var prev;
	var next;
	try {prev = block.previousConnection.targetConnection.sourceBlock_.type;}
	catch(err) {prev = "";}
	try {next = block.nextConnection.targetConnection.sourceBlock_.type;}
	catch(err) {next = "";}
	var first = false;
	var last = false;
	
	return [prev, next];
}

//Sets up handler for this and the next movement
var setup_next = function(last, next) {
	if (!Blockly.Coisa['mov_handlers']) {
		Blockly.Coisa['mov_handlers'] = "";
	}
	//Sets handler for mov end
	Blockly.Coisa['mov_handlers'] += "mov"+Blockly.Coisa['movements_seq']+"handler:\n";
	//Removes this handler handler
	Blockly.Coisa['mov_handlers'] += "li	$a0, 1\n";
	Blockly.Coisa['mov_handlers'] += "la	$a1, mov"+Blockly.Coisa['movements_seq']+"handler\n";
	Blockly.Coisa['mov_handlers'] += "la	$a2, encdID\n";
	Blockly.Coisa['mov_handlers'] += "li	$v0, 15\n";
	Blockly.Coisa['mov_handlers'] += "syscall\n";
	if (last) { // If is last stop all motors
		Blockly.Coisa['mov_handlers'] += "li	$v0, 12\n";
		Blockly.Coisa['mov_handlers'] += "li	$v1, 24\n";
		Blockly.Coisa['mov_handlers'] += "la	$t4, movmID\n";
		Blockly.Coisa['mov_handlers'] += "syscall\n";
	} else {
		switch (next) {
			case "step_forward":
				//Set Threshold
				Blockly.Coisa['mov_handlers'] += "li	$v0, 12\n";
				Blockly.Coisa['mov_handlers'] += "li	$v1, 7\n";
				Blockly.Coisa['mov_handlers'] += "li	$a0,"+forward_th+"\n"; //Threshold here
				Blockly.Coisa['mov_handlers'] += "la	$t4, encdID\n";
				Blockly.Coisa['mov_handlers'] += "syscall\n";
				//Go forward
				Blockly.Coisa['mov_handlers'] += "li	$v0, 12\n";
				Blockly.Coisa['mov_handlers'] += "li	$v1, 21\n";
				Blockly.Coisa['mov_handlers'] += "la	$t4, movmID\n";
				Blockly.Coisa['mov_handlers'] += "syscall\n";
				break;
			case "turn_left":
				//Set Threshold
				Blockly.Coisa['mov_handlers'] += "li	$v0, 12\n";
				Blockly.Coisa['mov_handlers'] += "li	$v1, 7\n";
				Blockly.Coisa['mov_handlers'] += "li	$a0,"+left_th+"\n"; //Threshold here
				Blockly.Coisa['mov_handlers'] += "la	$t4, encdID\n";
				Blockly.Coisa['mov_handlers'] += "syscall\n";
				//Go left
				Blockly.Coisa['mov_handlers'] += "li	$v0, 12\n";
				Blockly.Coisa['mov_handlers'] += "li	$v1, 22\n";
				Blockly.Coisa['mov_handlers'] += "la	$t4, movmID\n";
				Blockly.Coisa['mov_handlers'] += "syscall\n";
				break;
			case "turn_right":
				//Set Threshold
				Blockly.Coisa['mov_handlers'] += "li	$v0, 12\n";
				Blockly.Coisa['mov_handlers'] += "li	$v1, 7\n";
				Blockly.Coisa['mov_handlers'] += "li	$a0,"+right_th+"\n"; //Threshold here
				Blockly.Coisa['mov_handlers'] += "la	$t4, encdID\n";
				Blockly.Coisa['mov_handlers'] += "syscall\n";
				//Go Right
				Blockly.Coisa['mov_handlers'] += "li	$v0, 12\n";
				Blockly.Coisa['mov_handlers'] += "li	$v1, 23\n";
				Blockly.Coisa['mov_handlers'] += "la	$t4, movmID\n";
				Blockly.Coisa['mov_handlers'] += "syscall\n";
				break;
		}
		//Registers handler to next movement threshold
		Blockly.Coisa['mov_handlers'] += "li	$a0, 1\n";
		Blockly.Coisa['mov_handlers'] += "la	$a1, mov"+(Blockly.Coisa['movements_seq']+1)+"handler\n";
		Blockly.Coisa['mov_handlers'] += "la	$a2, encdID\n";
		Blockly.Coisa['mov_handlers'] += "li	$v0, 14\n";
		Blockly.Coisa['mov_handlers'] += "syscall\n";
	}
	//Returns
	Blockly.Coisa['mov_handlers'] += "jr	$ra\n";
	Blockly.Coisa['mov_handlers'] += "nop\n";
}