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
 * @fileoverview Generating Coisa for loop blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Coisa.loops');

goog.require('Blockly.Coisa');


Blockly.Coisa['controls_repeat_ext'] = function(block) {
  // Repeat n times.
  if(!Blockly.Coisa['controls_repeat_ext'].count)
  {
    Blockly.Coisa['controls_repeat_ext'].count = 0;
  }
  Blockly.Coisa['controls_repeat_ext'].count += 1;
  console.log(Blockly.Coisa['controls_repeat_ext'].count);
  if (block.getField('TIMES')) {
    // Internal number.
    var repeats = Number(block.getFieldValue('TIMES'));
  } else {
    // External number.
    var repeats = Blockly.Coisa.valueToCode(block, 'TIMES',
        Blockly.Coisa.ORDER_ASSIGNMENT) || '0';
  }
  var branch = Blockly.Coisa.statementToCode(block, 'DO');
  branch = Blockly.Coisa.addLoopTrap(branch, block.id);
  var code = '';
  var loopVar = Blockly.Coisa.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  var endVar = repeats;
  if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
    var endVar = Blockly.Coisa.variableDB_.getDistinctName(
        'repeat_end', Blockly.Variables.NAME_TYPE);
    // code += 'var ' + endVar + ' = ' + repeats + ';\n'; ---->>>> TODO: New variable created, alloc space
  }
  code += "addiu	sp,sp,-8\n";
  code += "sw	s0,0(sp)\n";
  code += "sw	s1,4(sp)\n";
  code += "clear	s0\n";
  code += "repeatloop_"+Blockly.Coisa['controls_repeat_ext'].count+":\n";
  code += "bge	s0,s1,endrepeat_"+Blockly.Coisa['controls_repeat_ext'].count+"\n";
  
  code += branch;//TODO: load the endVar to s1
  
  code += "addiu	s0, s0, 1\n";
  code += "j	dowhileloop_"+Blockly.Coisa['controls_repeat_ext'].count+"\n";
  code += "endrepeat_"+Blockly.Coisa['controls_repeat_ext'].count+":\n";
  code += "lw	s1,4(sp)\n";
  code += "lw	s0,0(sp)\n";
  code += "addiu	sp, sp, 8\n";
  // code += 'for (var ' + loopVar + ' = 0; ' +
//       loopVar + ' < ' + endVar + '; ' +
//       loopVar + '++) {\n' +
//       branch + '}\n';
  return code;
};

Blockly.Coisa['controls_repeat'] =
    Blockly.Coisa['controls_repeat_ext'];

Blockly.Coisa['controls_whileUntil'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.Coisa.valueToCode(block, 'BOOL',
      until ? Blockly.Coisa.ORDER_LOGICAL_NOT :
      Blockly.Coisa.ORDER_NONE) || 'false';
  var branch = Blockly.Coisa.statementToCode(block, 'DO');
  branch = Blockly.Coisa.addLoopTrap(branch, block.id);
  if (until) {
    argument0 = '!' + argument0;
  }
  return 'while (' + argument0 + ') {\n' + branch + '}\n';
};

Blockly.Coisa['controls_for'] = function(block) {
  // For loop.
  var variable0 = Blockly.Coisa.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.Coisa.valueToCode(block, 'FROM',
      Blockly.Coisa.ORDER_ASSIGNMENT) || '0';
  var argument1 = Blockly.Coisa.valueToCode(block, 'TO',
      Blockly.Coisa.ORDER_ASSIGNMENT) || '0';
  var increment = Blockly.Coisa.valueToCode(block, 'BY',
      Blockly.Coisa.ORDER_ASSIGNMENT) || '1';
  var branch = Blockly.Coisa.statementToCode(block, 'DO');
  branch = Blockly.Coisa.addLoopTrap(branch, block.id);
  var code;
  if (Blockly.isNumber(argument0) && Blockly.isNumber(argument1) &&
      Blockly.isNumber(increment)) {
    // All arguments are simple numbers.
    var up = parseFloat(argument0) <= parseFloat(argument1);
    code = 'for (' + variable0 + ' = ' + argument0 + '; ' +
        variable0 + (up ? ' <= ' : ' >= ') + argument1 + '; ' +
        variable0;
    var step = Math.abs(parseFloat(increment));
    if (step == 1) {
      code += up ? '++' : '--';
    } else {
      code += (up ? ' += ' : ' -= ') + step;
    }
    code += ') {\n' + branch + '}\n';
  } else {
    code = '';
    // Cache non-trivial values to variables to prevent repeated look-ups.
    var startVar = argument0;
    if (!argument0.match(/^\w+$/) && !Blockly.isNumber(argument0)) {
      startVar = Blockly.Coisa.variableDB_.getDistinctName(
          variable0 + '_start', Blockly.Variables.NAME_TYPE);
      code += 'var ' + startVar + ' = ' + argument0 + ';\n';
    }
    var endVar = argument1;
    if (!argument1.match(/^\w+$/) && !Blockly.isNumber(argument1)) {
      var endVar = Blockly.Coisa.variableDB_.getDistinctName(
          variable0 + '_end', Blockly.Variables.NAME_TYPE);
      code += 'var ' + endVar + ' = ' + argument1 + ';\n';
    }
    // Determine loop direction at start, in case one of the bounds
    // changes during loop execution.
    var incVar = Blockly.Coisa.variableDB_.getDistinctName(
        variable0 + '_inc', Blockly.Variables.NAME_TYPE);
    code += 'var ' + incVar + ' = ';
    if (Blockly.isNumber(increment)) {
      code += Math.abs(increment) + ';\n';
    } else {
      code += 'Math.abs(' + increment + ');\n';
    }
    code += 'if (' + startVar + ' > ' + endVar + ') {\n';
    code += Blockly.Coisa.INDENT + incVar + ' = -' + incVar + ';\n';
    code += '}\n';
    code += 'for (' + variable0 + ' = ' + startVar + ';\n' +
        '     ' + incVar + ' >= 0 ? ' +
        variable0 + ' <= ' + endVar + ' : ' +
        variable0 + ' >= ' + endVar + ';\n' +
        '     ' + variable0 + ' += ' + incVar + ') {\n' +
        branch + '}\n';
  }
  return code;
};

Blockly.Coisa['controls_forEach'] = function(block) {
  // For each loop.
  var variable0 = Blockly.Coisa.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.Coisa.valueToCode(block, 'LIST',
      Blockly.Coisa.ORDER_ASSIGNMENT) || '[]';
  var branch = Blockly.Coisa.statementToCode(block, 'DO');
  branch = Blockly.Coisa.addLoopTrap(branch, block.id);
  var code = '';
  // Cache non-trivial values to variables to prevent repeated look-ups.
  var listVar = argument0;
  if (!argument0.match(/^\w+$/)) {
    listVar = Blockly.Coisa.variableDB_.getDistinctName(
        variable0 + '_list', Blockly.Variables.NAME_TYPE);
    code += 'var ' + listVar + ' = ' + argument0 + ';\n';
  }
  var indexVar = Blockly.Coisa.variableDB_.getDistinctName(
      variable0 + '_index', Blockly.Variables.NAME_TYPE);
  branch = Blockly.Coisa.INDENT + variable0 + ' = ' +
      listVar + '[' + indexVar + '];\n' + branch;
  code += 'for (var ' + indexVar + ' in ' + listVar + ') {\n' + branch + '}\n';
  return code;
};

Blockly.Coisa['controls_flow_statements'] = function(block) {
  // Flow statements: continue, break.
  switch (block.getFieldValue('FLOW')) {
    case 'BREAK':
      return 'break;\n';
    case 'CONTINUE':
      return 'continue;\n';
  }
  throw 'Unknown flow statement.';
};
