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

var forward_th = 30;
var left_th = 25;
var right_th = 25;

Blockly.Coisa['step_forward'] = function(block) {
	//Sets forward
	var code = "li	$v0, 12\n";
	code += "li	$v1, 21\n";
	code += "la	$t4, movmID\n";
	code += "syscall\n";
	//Holds
	code += "li	$v0, 18\n";
	code += "la	$a0, "+forward_th+"\n"; //Threshold
	code += "syscall\n";
  return code;
};
Blockly.Coisa['turn_right'] = function(block) {
	var code = "li	$v0, 12\n";
	code += "li	$v1, 23\n";
	code += "la	$t4, movmID\n";
	code += "syscall\n";
	//Holds
	code += "li	$v0, 18\n";
	code += "la	$a0, "+right_th+"\n"; //Threshold
	code += "syscall\n";
  return code;
};
Blockly.Coisa['turn_left'] = function(block) {
	var code = "li	$v0, 12\n";
	code += "li	$v1, 22\n";
	code += "la	$t4, movmID\n";
	code += "syscall\n";
	//Holds
	code += "li	$v0, 18\n";
	code += "la	$a0, "+left_th+"\n"; //Threshold
	code += "syscall\n";
  return code;
};
Blockly.Coisa['set_step_sz'] = function(block) {
	var code = Blockly.Coisa.valueToCode(block, 'stepSize', Blockly.Coisa.ORDER_NONE);
	code += "addiu	$a0, $s1, 0\n";;
	code += "li	$v0, 12\n";
	code += "li	$v1, 25\n";
	code += "la	$t4, movmID\n";
	code += "syscall\n";
  return code;
};