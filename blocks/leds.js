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

goog.provide('Blockly.Blocks.leds');

goog.require('Blockly.Blocks');

Blockly.Blocks.leds.HUE = 90;

Blockly.Blocks['led_green'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("led verde")
        .appendField(new Blockly.FieldDropdown([["ligar", "ON"], ["desligar", "OFF"]]), "STATUS");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(Blockly.Blocks.leds.HUE);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['led_red'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("led vermelho")
        .appendField(new Blockly.FieldDropdown([["ligar", "ON"], ["desligar", "OFF"]]), "STATUS");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(Blockly.Blocks.leds.HUE);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};