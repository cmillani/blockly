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

goog.provide('Blockly.Coisa.weave');

goog.require('Blockly.Coisa');

Blockly.Coisa['light_command'] = function(block) {
  var dropdown_estado = block.getFieldValue('estado');
	var code = "li	$v0, 16\n";
	if (dropdown_estado == 'LIGAR') {
		code += "li	$v1, 2\n";
	} else {
		code += "li	$v1, 3\n";
	}
	code += "syscall\n";
  return code;
};

Blockly.Coisa['light_state'] = function(block) {
	var code = "li	$v0, 16\n";
	code += "li	$v1, 1\n";
	code += "syscall\n";
  return [code, Blockly.JavaScript.ORDER_NONE];
};