import { ButtonToggleItem } from './button-toggle.builder';

export interface ButtonToggleInterface {

  /**
   * Simulate radio behaviour on enabled items.
   */
  'enabled-items-radio-like'?: boolean;
  values: ButtonToggleItem;
}
