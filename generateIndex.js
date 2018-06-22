/*
 *  Copyright © 2016-2017, RWTH Aachen University
 *  Authors: Richard Marston
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  A copy of the GNU General Public License is in the LICENSE file
 *  in the top level directory of this source tree.
 */

/*
 * Utility functions
 */

var startTag = function (name, attributes) {
  let tag = '<' + name
  for (let attr in attributes) {
    if (attributes[attr]['value'] != 'NO VALUE') {
      tag += ' ' + attributes[attr]['key'] + '=' + attributes[attr]['value']
    }
    else {
      tag += ' ' + attributes[attr]['key']
    }
  }
  return tag
}

var endTag = function (name) {
  return '</' + name + '>'
}

var depth = -1

print_with_endl_and_indent = function(front_indent, text, endl='') {
  process.stdout.write(front_indent + text + endl)
}

print_without_endl_or_indent = function(front_indent, text, endl='') {
  process.stdout.write(text)
}

var printTag = function(tag, readable=false) {
  var print_func
  if (readable) {
    print_func = print_with_endl_and_indent
  } else {
    print_func = print_without_endl_or_indent
  }
  var indent = '    '.repeat(++depth)
  var numberOfChildren = invalidOrZeroLength(tag.children) ? 0 : tag.children.length
  var emptyInside = tag.text === undefined || tag.text.length === 0
  print_func(indent, startTag(tag.name, tag.attributes))
  if (numberOfChildren === 0 && emptyInside) {
    print_func('', '/>', '\n')
    depth--
  } else {
    if (tag.text.length > 0) {
      print_func('', '>' + tag.text)
      print_func('', endTag(tag.name), '\n')
      indent = '    '.repeat(depth--)
    } else {
      print_func('', '>', '\n')
      for (let index in tag.children) {
        printTag(tag.children[index], readable)
      }
      indent = '    '.repeat(depth--)
      print_func(indent, endTag(tag.name), '\n')
    }
  }
}

var invalidOrZeroLength = function(array) {
  return ((array === undefined) || (array === null) || (array.length == 0))
}

var startJson = function(name, attributes) {
  let tag = name+':{'
  for (let attr in attributes) {
    tag += ' ' + attributes[attr]['key'] + '=' + attributes[attr]['value']
  }
  tag += '\n'
  return tag
}

var printTagJson = function(tag) {
  var indent = '    '.repeat(++depth)
  var numberOfChildren = invalidOrZeroLength(tag.children) ? 0 : tag.children.length
  var emptyInside = tag.text === undefined || tag.text.length === 0
  process.stderr.write(indent + startJson(tag.name, tag.attributes))
  for (let index in tag.children) {
    printTagJson(tag.children[index])
  }
  process.stderr.write(indent+'}\n')
  indent = '    '.repeat(depth--)
}

/*
 * This is the tag class that does most of the work
 */
function tag(name){
  this.attributes = []
  this.children = []
  this.text = ""
  this.name = name

  this.a = function(key, value) {
    this.attributes.push({ 'key': key, 'value': value })
    return this
  }
  this.c = function(tag) {
    this.children.push(tag)
    return this
  }
  this.t = function(words) {
    this.text = words
    return this
  }
}
var makeFileMenu = function (open_text, open_name, open_action,
                             save_text, save_name, save_action,
                             diag_text, diag_name, diag_action) {
  let open_input = new tag('input').a('id', '"' + open_name + '"').a('type', '"file"').a('style', '"display:none"').a('multiple', '"true"')
  let open_a_tag = new tag('a').t(open_text).a('href', '"#"').a('class', '"button"').a('type', '"file"').a('onclick', open_action)
  let save_a_tag = new tag('a').a('id', '"' + save_name + '"').a('type', '"file"').a('download', '"pinturaGrid.xml"')
  let save_span = new tag('span').t(save_text).a('class', '"button"').a('onclick', '"' + save_action + '"')
  let diag_tag = new tag('div').a('id', '"'+diag_name+'"').a('class', '"button"')
  let diag_a_tag = new tag('a').t(diag_text).a('onclick', diag_action)
  return new tag('div').c(open_input).c(open_a_tag).c(save_span).c(save_a_tag).c(diag_tag).c(diag_a_tag).a('id', '"menu"')
}
var makeAccordionDiv = function(id, action) {
  return new tag('div').a('id', '"'+id+'"').c(new tag('div').a('id', '"'+id+'-accordion"').t(" "))
}
/*
 * global html tag
 */
var html = new tag('html').c(new tag('head').c(new tag('title').t('Pintura')))

var body = new tag('body')
body.c(new tag('link').a('rel', '"stylesheet"').a('href', '"css/svg.css"'))
body.c(new tag('link').a('rel', '"stylesheet"').a('href', '"css/layout.css"'))
body.c(new tag('link').a('rel', '"stylesheet"').a('href', '"css/colours.css"'))

var sidebar = new tag('div').
                  a('id', '"sidebar"').
                  c(new tag('div').a('class', '"component-sidebar-list"').t(' ')).
                  c(makeFileMenu('Open file', 'fileopen', 'fileopen.click()',
                                 'Save file', 'filesave', 'currentCimsvg().saveGridXml()',
                                 'Add Diagram', 'diagram-add', 'currentCimsvg().addDiagram()'))

var svg = new tag('svg').a('id', '"svg"').
	          a('xmlns', '"http://www.w3.org/2000/svg"').
	          a('xmlns:xlink','"http://www.w3.org/1999/xlink"').
	          c(new tag('rect').
                      a('class', '"backing"').
                      a('onclick', '"currentCimsvg().checkComponentReadyToAdd(evt)"')).
	          c(new tag('g').a('class', '"grid"')).
	          c(new tag('g').a('class', '"diagrams"'))

var svg2 = new tag('svg').a('id', '"svg2"').
	          a('xmlns', '"http://www.w3.org/2000/svg"').
	          a('xmlns:xlink','"http://www.w3.org/1999/xlink"').
	          c(new tag('rect').
                      a('class', '"backing"').
                      a('onclick', '"currentCimsvg().checkComponentReadyToAdd(evt)"')).
	          c(new tag('g').a('class', '"grid"')).
	          c(new tag('g').a('class', '"diagrams"'))


var radio_input = function(onchange, name, id, text, checked=false) {
    var input = new tag('input').
	              a('type', '"radio"').
                      a('onchange', onchange).
                      a('name', name).
                      a('id', id)

    var label = new tag('label').
	              a('class', '"dark-font panel-button"').
	              a('for', id).t(text)

    if (checked) {
        input.a('checked', 'NO VALUE')
    }

    return new tag('a').c(input).c(label)
};

var floating_panel_header = function(floating_panel_id) {
    return new tag('div').
	           a('class', '"wide-row list-title"').
	           c(new tag('span').
                   a('id', '"' + floating_panel_id + '-component-name"').
                   a('class', '"floating-panel-title button row-left"').
                   t("title goes here")).
               c(new tag('span').
                   c(new tag('span').
                       a('class', '"button row-right panel-button"').
                       a('onclick', '"currentCimsvg().hideFloatingMenu();"').
                       t("<b>&times;</b>")))
};

var diagram = new tag('div').a('id', '"diagram-display"').a('class', '"row-right"').c(svg).c(svg2)

var make_floating_panel = function(title, id) {
    return new tag('div').
	           a('id', '"'+id+'"').
               a('class', '"floating-panel row-left dialog-over-diagram"').
               c(new tag('div').a('class', '"floating-panel-table invisible"').
               c(floating_panel_header(id)).
           c(new tag('div').
               a('class', '"floating-menu-list"').
			   t(" ")))
}

var floating_menu = make_floating_panel('floating-menu', 'floating-menu')

var main = new tag('div').a('id', '"main"').c(diagram).c(floating_menu)

body.c(main).c(sidebar)

body.c(new tag('script').a('type', '"text/javascript"').a('src', '"html/cimsvg.js"').t(" "))
body.c(new tag('script').a('type', '"text/javascript"').a('src', '"index.js"').t(" "))

html.c(body)

console.log(`<!--
    Copyright © 2016-2017, RWTH Aachen University
    Authors: Richard Marston

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    A copy of the GNU General Public License is in the LICENSE file
    in the top level directory of this source tree.
-->
<!DOCTYPE HTML>`)
//printTagJson(html)
printTag(html) //, true)
