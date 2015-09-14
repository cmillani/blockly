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

goog.provide('Blockly.Coisa.logic');

goog.require('Blockly.Coisa');


Blockly.Coisa['controls_if'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var argument = Blockly.Coisa.valueToCode(block, 'IF' + n,
      Blockly.Coisa.ORDER_NONE) || 'false';
  var branch = Blockly.Coisa.statementToCode(block, 'DO' + n);
  var code = 'if (' + argument + ') {\n' + branch + '}';
  for (n = 1; n <= block.elseifCount_; n++) {
    argument = Blockly.Coisa.valueToCode(block, 'IF' + n,
        Blockly.Coisa.ORDER_NONE) || 'false';
    branch = Blockly.Coisa.statementToCode(block, 'DO' + n);
    code += ' else if (' + argument + ') {\n' + branch + '}';
  }
  if (block.elseCount_) {
    branch = Blockly.Coisa.statementToCode(block, 'ELSE');
    code += ' else {\n' + branch + '}';
  }
  return code + '\n';
};

Blockly.Coisa['logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.Coisa.ORDER_EQUALITY : Blockly.Coisa.ORDER_RELATIONAL;
  var argument0 = Blockly.Coisa.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Coisa.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Coisa['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.Coisa.ORDER_LOGICAL_AND :
      Blockly.Coisa.ORDER_LOGICAL_OR;
  var argument0 = Blockly.Coisa.valueToCode(block, 'A', order);
  var argument1 = Blockly.Coisa.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Coisa['logic_negate'] = function(block) {
  // Negation.
  var order = Blockly.Coisa.ORDER_LOGICAL_NOT;
  var argument0 = Blockly.Coisa.valueToCode(block, 'BOOL', order) ||
      'true';
  var code = '!' + argument0;
  return [code, order];
};

Blockly.Coisa['logic_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.Coisa.ORDER_ATOMIC];
};

Blockly.Coisa['logic_null'] = function(block) {
  // Null data type.
  return ['null', Blockly.Coisa.ORDER_ATOMIC];
};

Blockly.Coisa['logic_ternary'] = function(block) {
  // Ternary operator.
  var value_if = Blockly.Coisa.valueToCode(block, 'IF',
      Blockly.Coisa.ORDER_CONDITIONAL) || 'false';
  var value_then = Blockly.Coisa.valueToCode(block, 'THEN',
      Blockly.Coisa.ORDER_CONDITIONAL) || 'null';
  var value_else = Blockly.Coisa.valueToCode(block, 'ELSE',
      Blockly.Coisa.ORDER_CONDITIONAL) || 'null';
  var code = value_if + ' ? ' + value_then + ' : ' + value_else;
  return [code, Blockly.Coisa.ORDER_CONDITIONAL];
};
