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
 * @fileoverview Text blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Blocks.events');

goog.require('Blockly.Blocks');

/**
 * Common HSV hue for all blocks in this category.
 */
Blockly.Blocks.events.HUE = 85;

Blockly.Blocks['event_onstart'] = {
  init: function() {
    this.appendStatementInput("CODE")
				.setCheck(null)
        .appendField("quando começar");
    this.setColour(Blockly.Blocks.events.HUE);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['event_btdown'] = {
  init: function() {
    this.appendStatementInput("CODE")
        .setCheck(null)
        .appendField("quando apertar botão");
    this.setColour(Blockly.Blocks.events.HUE);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['event_distancechange'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("quando a distância mudar");
    this.appendValueInput("threshold")
        .setCheck("Number")
        .appendField("limite");
    this.appendStatementInput("CodeCloser")
        .setCheck(null)
        .appendField("inferior ao limite");
    this.appendStatementInput("CodeLarger")
        .setCheck(null)
        .appendField("superior ao limite");
    this.setColour(Blockly.Blocks.events.HUE);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};