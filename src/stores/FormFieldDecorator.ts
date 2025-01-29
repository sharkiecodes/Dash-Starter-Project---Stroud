// FormFieldDecorator.ts
import { FieldDefinition } from "./FieldDefinition";

/**
 * The options you can pass to @FormField.
 * Omit `name` from here because the decorator
 * automatically derives `name` from the property key.
 */

export interface FormFieldOptions extends Omit<FieldDefinition, "name"> {}

/**
 * A property decorator that merges a new FieldDefinition into
 * the class's static fieldDefinitions array.
 */
export function FormField(options: FormFieldOptions) {
  return function (target: any, propertyKey: string) {
    // Ensure the class has a static 'fieldDefinitions' array
    if (!target.constructor.hasOwnProperty("fieldDefinitions")) {
      target.constructor.fieldDefinitions = [...(target.constructor.fieldDefinitions || [])];
    }

    // Append a new FieldDefinition
    target.constructor.fieldDefinitions.push({
      name: propertyKey,           // the actual property name, e.g. "title"
      label: options.label,
      inputType: options.inputType,
      defaultValue: options.defaultValue,
    } as FieldDefinition);
  };
}

 /**Example use case:
    * The @FormField decorator sees propertyKey = "title" and 
    * appends an object { name: "title", label: "Title", … } into 
    * NodeStore.fieldDefinitions.
    * The form can later retrieve NodeStore.fieldDefinitions and 
    * see an entry describing how to render the “Title” input. */