import React from 'react';

// This function takes some config info allowing you to customize to the input being tested
// and then runs tests for it to be sure that it matches the Composable Forms Input Spec
export default function testInput({
  component: Input,
  // exampleValueOne must be different from defaultValue && exampleValueTwo, but
  // defaultValue && exampleValueTwo may be the same
  defaultValue,
  exampleValueOne,
  exampleValueTwo,
  mount,
  options,
  props,
  simulateChanging,
  simulateChanged,
  simulateSubmit,
}) {
  const inputName = Input.name;

  test(`${inputName} has isFormInput static property`, () => {
    expect(Input.isFormInput).toBe(true);
  });

  test(`${inputName} must not set a default value for "value" prop`, () => {
    expect(Input.defaultProps && Input.defaultProps.value).toBe(undefined);
  });

  test(`${inputName} must not set a default value for "errors" prop`, () => {
    expect(Input.defaultProps && Input.defaultProps.errors).toBe(undefined);
  });

  test(`${inputName} calls onChanging followed by onChange before initial mount`, () => {
    const onChanging = jest.fn();
    const onChange = jest.fn();

    mount(<Input name="test" onChanging={onChanging} onChange={onChange} options={options} {...props} />);

    expect(onChanging).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);

    expect(onChanging).toHaveBeenLastCalledWith(defaultValue);
    expect(onChange).toHaveBeenLastCalledWith(defaultValue);
  });

  test(`${inputName} calls onChanging and onChange`, () => {
    const onChanging = jest.fn();
    const onChange = jest.fn();

    const wrapper = mount(<Input name="test" onChanging={onChanging} onChange={onChange} options={options} {...props} />);

    onChanging.mockClear();
    onChange.mockClear();

    // Inputs need not have a way of "changing" but must call only onChanging
    // and not onChange if they do.
    if (typeof simulateChanging === 'function') {
      simulateChanging(wrapper, exampleValueOne);
      expect(onChanging).toHaveBeenCalledTimes(1);
      expect(onChanging).toHaveBeenLastCalledWith(exampleValueOne);
      expect(onChange).toHaveBeenCalledTimes(0);
    }

    simulateChanged(wrapper, exampleValueOne);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(exampleValueOne);
  });

  if (typeof simulateSubmit === 'function') {
    test(`${inputName} calls onSubmit`, () => {
      const onSubmit = jest.fn();

      const wrapper = mount(<Input name="test" onSubmit={onSubmit} options={options} {...props} />);
      simulateSubmit(wrapper);

      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  }

  test(`${inputName} calls onChanging followed by onChange when the value prop changes`, () => {
    const onChanging = jest.fn();
    const onChange = jest.fn();

    const wrapper = mount(<Input name="test" onChanging={onChanging} onChange={onChange} value={exampleValueOne} options={options} {...props} />);

    wrapper.setProps({ value: exampleValueTwo });

    expect(onChanging).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledTimes(2);

    expect(onChanging.mock.calls[0][0]).toEqual(exampleValueOne);
    expect(onChange.mock.calls[0][0]).toEqual(exampleValueOne);
    expect(onChanging.mock.calls[1][0]).toEqual(exampleValueTwo);
    expect(onChange.mock.calls[1][0]).toEqual(exampleValueTwo);
  });

  test(`${inputName} getValue`, () => {
    const wrapper = mount(<Input name="test" value={exampleValueOne} options={options} {...props} />);

    // Inputs can optionally have an getValue method
    if (typeof wrapper.instance().getValue !== 'function') {
      expect(true).toBe(true);
      return;
    }

    expect(wrapper.instance().getValue()).toEqual(exampleValueOne);

    wrapper.setProps({ value: exampleValueTwo });
    expect(wrapper.instance().getValue()).toEqual(exampleValueTwo);

    simulateChanged(wrapper, exampleValueOne);
    expect(wrapper.instance().getValue()).toEqual(exampleValueOne);
  });

  test(`${inputName} isDirty`, () => {
    const wrapper = mount(<Input name="test" value={exampleValueOne} options={options} {...props} />);

    // Inputs can optionally have an isDirty method
    if (typeof wrapper.instance().isDirty !== 'function') {
      expect(true).toBe(true);
      return;
    }

    expect(wrapper.instance().isDirty()).toBe(false);

    // Should only be true if changed by user rather than by prop
    wrapper.setProps({ value: exampleValueTwo });
    expect(wrapper.instance().isDirty()).toBe(false);

    simulateChanged(wrapper, exampleValueOne);
    expect(wrapper.instance().isDirty()).toBe(true);
  });

  test(`${inputName} resetValue works and calls onChanging and onChange`, () => {
    const onChanging = jest.fn();
    const onChange = jest.fn();

    const wrapper = mount(<Input name="test" onChanging={onChanging} onChange={onChange} value={exampleValueOne} options={options} {...props} />);

    // Inputs can optionally have an getValue and resetValue methods
    if (typeof wrapper.instance().getValue !== 'function' || typeof wrapper.instance().resetValue !== 'function') {
      expect(true).toBe(true);
      return;
    }

    expect(wrapper.instance().getValue()).toEqual(exampleValueOne);

    simulateChanged(wrapper, exampleValueTwo);
    expect(wrapper.instance().getValue()).toEqual(exampleValueTwo);

    onChanging.mockClear();
    onChange.mockClear();

    wrapper.instance().resetValue();
    expect(wrapper.instance().getValue()).toEqual(exampleValueOne);

    expect(onChanging).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);

    expect(onChanging).toHaveBeenLastCalledWith(exampleValueOne);
    expect(onChange).toHaveBeenLastCalledWith(exampleValueOne);
  });

  test(`${inputName} setValue works and calls onChanging and onChange`, () => {
    const onChanging = jest.fn();
    const onChange = jest.fn();

    const wrapper = mount(<Input name="test" onChanging={onChanging} onChange={onChange} value={exampleValueOne} options={options} {...props} />);

    // Inputs can optionally have getValue and setValue methods
    if (typeof wrapper.instance().getValue !== 'function' || typeof wrapper.instance().setValue !== 'function') {
      expect(true).toBe(true);
      return;
    }

    expect(wrapper.instance().getValue()).toEqual(exampleValueOne);

    onChanging.mockClear();
    onChange.mockClear();

    wrapper.instance().setValue(exampleValueTwo);
    expect(wrapper.instance().getValue()).toEqual(exampleValueTwo);

    // Inputs can optionally have an isDirty method
    if (typeof wrapper.instance().isDirty === 'function') {
      expect(wrapper.instance().isDirty()).toBe(true);
    }

    expect(onChanging).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);

    expect(onChanging).toHaveBeenLastCalledWith(exampleValueTwo);
    expect(onChange).toHaveBeenLastCalledWith(exampleValueTwo);
  });
}
