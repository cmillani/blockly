/**
 * @license
 * Visual Blocks Editor
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
 * @fileoverview Logic blocks for Blockly.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Blocks.movement');

goog.require('Blockly.Blocks');


/**
 * Common HSV hue for all blocks in this category.
 */
Blockly.Blocks.movement.HUE = 75;

Blockly.Blocks['movement_robot'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Move")
        .appendField(new Blockly.FieldDropdown([["Ahead", "ahead"], ["Clockwise", "right"], ["Anticlockwise", "left"]]), "movement");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(Blockly.Blocks.movement.HUE);
    this.setTooltip('');
    this.setHelpUrl('http://www.google.com/');
  }
};

Blockly.Blocks['setup_movement'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Setup Robot Movement");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(Blockly.Blocks.movement.HUE);
    this.setTooltip('');
    this.setHelpUrl('http://www.google.com/');
  }
};