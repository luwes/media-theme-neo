import {
  TemplateInstance,
  NodeTemplatePart,
  createProcessor,
  AttributeTemplatePart,
} from '../node_modules/@github/template-parts/lib/index.js';

export function css(strings, ...values) {
  return values.reduce((finalString, value, index) => {
    return `${finalString}${value}${strings[index + 1]}`;
  }, strings[0]);
}

// NOTE: These are either direct ports or significantly based off of github's jtml template part processing logic. For more, see: https://github.com/github/jtml

function processSubTemplate(part, value) {
  if (value instanceof TemplateResult && part instanceof NodeTemplatePart) {
    value.renderInto(part);
    return true;
  }
  return false;
}

function processDocumentFragment(part, value) {
  if (value instanceof DocumentFragment && part instanceof NodeTemplatePart) {
    if (value.childNodes.length) part.replace(...value.childNodes);
    return true;
  }
  return false;
}

export function processPropertyIdentity(part, value) {
  if (part instanceof AttributeTemplatePart) {
    const ns = part.attributeNamespace;
    const oldValue = part.element.getAttributeNS(ns, part.attributeName);
    if (String(value) !== oldValue) {
      part.value = String(value);
    }
    return true;
  }
  part.value = String(value);
  return true;
}

export function processBooleanAttribute(part, value) {
  if (
    typeof value === 'boolean' &&
    part instanceof AttributeTemplatePart
    // can't use this because on custom elements the props are always undefined
    // typeof part.element[part.attributeName as keyof Element] === 'boolean'
  ) {
    const ns = part.attributeNamespace;
    const oldValue = part.element.hasAttributeNS(ns, part.attributeName);
    if (value !== oldValue) {
      part.booleanValue = value;
    }
    return true;
  }
  return false;
}

export function processBooleanNode(part, value) {
  if (value === false && part instanceof NodeTemplatePart) {
    part.replace('');
    return true;
  }
  return false;
}

function isIterable(value) {
  return typeof value === 'object' && Symbol.iterator in value;
}

function processIterable(part, value) {
  if (!isIterable(value)) return false;
  if (part instanceof NodeTemplatePart) {
    const nodes = [];
    for (const item of value) {
      if (item instanceof TemplateResult) {
        const fragment = document.createDocumentFragment();
        item.renderInto(fragment);
        nodes.push(...fragment.childNodes);
      } else if (item instanceof DocumentFragment) {
        nodes.push(...item.childNodes);
      } else {
        nodes.push(String(item));
      }
    }
    if (nodes.length) part.replace(...nodes);
    return true;
  } else {
    part.value = Array.from(value).join(' ');
    return true;
  }
}

export function processFunction(part, value) {
  if (typeof value === 'function') {
    value(part);
    return true;
  }
  return false;
}

export function processPart(part, value) {
  processFunction(part, value) ||
    processBooleanAttribute(part, value) ||
    processBooleanNode(part, value) ||
    processSubTemplate(part, value) ||
    processDocumentFragment(part, value) ||
    processIterable(part, value) ||
    processPropertyIdentity(part, value);
}

const templates = {};
const renderedTemplates = new WeakMap();
const renderedTemplateInstances = new WeakMap();
export class TemplateResult {
  constructor(strings, values, processor) {
    this.strings = strings;
    this.values = values;
    this.processor = processor;
  }
  get template() {
    const cacheKey = this.strings.join('$~$')
    if (templates[cacheKey]) {
      return templates[cacheKey];
    } else {
      const template = document.createElement('template');
      const end = this.strings.length - 1;
      template.innerHTML = this.strings.reduce(
        (str, cur, i) => str + cur + (i < end ? `{{ ${i} }}` : ''),
        ''
      );
      templates[cacheKey] = template;
      return template;
    }
  }
  renderInto(element) {
    const template = this.template;
    if (renderedTemplates.get(element) !== template) {
      renderedTemplates.set(element, template);
      const instance = new TemplateInstance(
        template,
        this.values,
        this.processor
      );
      renderedTemplateInstances.set(element, instance);
      if (element instanceof NodeTemplatePart) {
        element.replace(...instance.children);
      } else {
        element.textContent = '';
        element.append(instance);
      }
      return;
    }
    const templateInstance = renderedTemplateInstances.get(element);
    if (templateInstance) {
      templateInstance.update(this.values);
    }
  }
}

const defaultProcessor = createProcessor(processPart);
export function html(strings, ...values) {
  return new TemplateResult(strings, values, defaultProcessor);
}

export function render(result, element) {
  result.renderInto(element);
}

export const unsafeHTML = (value) => (part) => {
  if (!(part instanceof NodeTemplatePart)) return;
  const template = document.createElement('template');
  template.innerHTML = value;
  const fragment = document.importNode(template.content, true);
  part.replace(...fragment.childNodes);
};
