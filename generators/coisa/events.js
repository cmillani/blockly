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

goog.provide('Blockly.Coisa.events');

goog.require('Blockly.Coisa');

Blockly.Coisa['event_onstart'] = function(block) {
  var statements_name = Blockly.Coisa.statementToCode(block, 'CODE', Blockly.Coisa.ORDER_NONE);
	var code = "main:\n"
	code += "addiu	$sp,$sp,-4\n";
	code += "sw	$ra,0($sp)\n";
	code += statements_name;
	code += "#handlers_register#\n"
	code += "lw	$ra,0($sp)\n";
	code += "addiu	$sp,$sp, 4\n";
	code += "jr	$ra\n";
	code += "nop\n";
	
  return code;
};


Blockly.Coisa['event_btdown'] = function(block) {
  var statements_code = Blockly.Coisa.statementToCode(block, 'CODE');
	
	var code = "btdown:\n"
	code += "addiu	$sp,$sp,-4\n";
	code += "sw	$ra,0($sp)\n";
	code += statements_code;
	code += "lw	$ra,0($sp)\n";
	code += "addiu	$sp,$sp, 4\n";
	code += "jr	$ra\n";
	code += "nop\n";
	
	if(!Blockly.Coisa['events_init'])
	{
		Blockly.Coisa['events_init'] = ""
	} 
	
	Blockly.Coisa['events_init'] += "li	$a0, 0\n";
	Blockly.Coisa['events_init'] += "li	$a1, 5\n";
	Blockly.Coisa['events_init'] += "li	$v0, 12\n";
	Blockly.Coisa['events_init'] += "li	$v1, 21\n";
	Blockly.Coisa['events_init'] += "la	$t4, btogID\n";
	Blockly.Coisa['events_init'] += "syscall\n";
	
	Blockly.Coisa['events_init'] += "li	$a0, 1\n";
	Blockly.Coisa['events_init'] += "la	$a1, btdown\n";
	Blockly.Coisa['events_init'] += "la	$a2, btogID\n";
	Blockly.Coisa['events_init'] += "li	$v0, 14\n";
	Blockly.Coisa['events_init'] += "syscall\n";
	
  return code;
};

Blockly.Coisa['event_distancechange'] = function(block) {
  var value_threshold = Blockly.Coisa.valueToCode(block, 'threshold', Blockly.Coisa.ORDER_NONE);
  var statements_codecloser = Blockly.Coisa.statementToCode(block, 'CodeCloser');
  var statements_codelarger = Blockly.Coisa.statementToCode(block, 'CodeLarger');

	//US Event must be adapted in order to work with this -> one event to closer, one to larger, and change registration method
	var code = "";
	code += "gotcloser:\n";
	code += "addiu	$sp, $sp,-4\n";
	code += "sw	$ra, 0($sp)\n";
	code += statements_codecloser;
	code += "lw	$ra, 0($sp)\n";
	code += "addiu	$sp, $sp, 4\n";
	code += "jr	$ra\n";
	code += "nop\n";
	
	code += "gotlarger:\n";
	code += "addiu	$sp,$sp,-4\n";
	code += "sw	$ra, 0($sp)\n";
	code += statements_codelarger
	code += "lw	$ra, 0($sp)\n";
	code += "addiu	$sp, $sp, 4\n";
	code += "jr	$ra\n";
	code += "nop\n";
	
	
	if(!Blockly.Coisa['events_init'])
	{
		Blockly.Coisa['events_init'] = ""
	} 
	
	Blockly.Coisa['events_init'] += "li	$v0, 12\n";
	Blockly.Coisa['events_init'] += "li	$v1, 2\n";
	Blockly.Coisa['events_init'] += "la	$t4, usID\n";
	Blockly.Coisa['events_init'] += "syscall\n";
	
	Blockly.Coisa['events_init'] += "li	$a0, 1\n";
	Blockly.Coisa['events_init'] += "la	$a1, gotcloser\n";
	Blockly.Coisa['events_init'] += "la	$a2, usID\n"
	Blockly.Coisa['events_init'] += "li	$t0, 1\n"
	Blockly.Coisa['events_init'] += value_threshold
	Blockly.Coisa['events_init'] += "move	$a3, $s1\n";
	Blockly.Coisa['events_init'] += "li	$v0, 14\n";
	Blockly.Coisa['events_init'] += "syscall\n";
	
	Blockly.Coisa['events_init'] += "li	$a0, 1\n";
	Blockly.Coisa['events_init'] += "la	$a1, gotlarger\n";
	Blockly.Coisa['events_init'] += "la	$a2, usIDf\n"
	Blockly.Coisa['events_init'] += "li	$v0, 14\n";
	Blockly.Coisa['events_init'] += "syscall\n";
	
  return code;
};
