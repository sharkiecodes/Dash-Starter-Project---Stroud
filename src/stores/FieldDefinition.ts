// FieldDefinition.ts
/**This interface provides a standard format for the properties each node store can have.
 * Each NodeStore has an array of fieldDefinitions 
 * which implement this interface.
 * 
 * Having a FieldDefinition in each NodeStore allows the NodeStore to contain
 * information about which fields it has (similar to facets in Dash). 
 * This allows each node to provide necessary
 * information to the "Add Node" feature, which
 * relies on knowing the fields a node can have so that a user 
 * can input them appropriately.
 * 
 * Essentially, a FieldDefinition describes a single user-editable field for a NodeStore.
 *
 */
export interface FieldDefinition {
  /**
   * The name of the property in the NodeStore subclass.
   * For example, "title", "url", or "content".
   */
  name: string;

  /**
   * A label to display in the form UI for this field.
   */
  label: string;

  /**
   * Informs how the form should render this field.
   * Common examples: "string", "textArea", "url", "number",
   * or even "date".
   */
  inputType?: string;

  /**
   * Default value for this field if the user doesn’t specify one.
   * An example use case: setting the default 'title' property to "Image Node".
   */
  defaultValue?: any;
}
