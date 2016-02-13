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

goog.provide('Blockly.Coisa.serial');

goog.require('Blockly.Coisa');

Blockly.Coisa['serial_printnum'] = function(block) {
  var value_num = Blockly.Coisa.valueToCode(block, 'NUM', Blockly.Coisa.ORDER_NONE);

  var code = '';
	code += value_num;
  code += "li	$v0, 12\n";
  code += "li	$v1, 13\n";
	code += "la	$t4, rxtxID\n";
	code += "move	$a0, $s1\n";
  code += "syscall\n";
  return code;
};


Blockly.Coisa['serial_print'] = function(block) {
  var value_text = Blockly.Coisa.valueToCode(block, 'TEXT', Blockly.Coisa.ORDER_NONE);

  var code = '';
	code += value_text;
// addiu	$sp,$sp,-16
// sw	$v0,0($sp)
// sw	$v1,4($sp)
// sw	$t4,8($sp)
// sw	$a0,16($sp)
  code += "li	$v0, 12\n";
  code += "li	$v1, 14\n";
	code += "la	$t4, rxtxID\n";
	code += "move	$a0, $s2\n";
  code += "syscall\n";
// lw	$a0,16($sp)
// lw	$t4,8($sp)
// lw	$v1,4($sp)
// lw	$v0,0($sp)
// addiu	$sp, $sp, 16
  return code;
};
// .data
// rxtxID: .asciiz "RXTX"