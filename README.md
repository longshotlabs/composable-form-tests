# Composable Form Tests

Exposes functions that test your React components to ensure they correctly implement the [Composable Form Spec](http://forms.dairystatedesigns.com/). Assumes a [Jest](https://facebook.github.io/jest/) test environment and requires a peer dev dependency of `enzyme`.

## Installation

```
$ npm i --save-dev composable-form-tests jest-cli babel-jest enzyme
```

## How to Test an "Input" Component

In your input tests file, which will be run by Jest:

```js
import React from 'react';
import { mount } from 'enzyme';
import { testInput } from 'composable-form-tests';
import MyInputComponent from './MyInputComponent';

testInput({
  component: MyInputComponent,
  mount,
  ...<other options>
});
```

### testInput Options

| component        | REQUIRED. The component class that you are testing, which you intend to conform to the Composable Form "Input" Specification |
|------------------|------------------------------------------------------------------------------------------------------------------------------|
| defaultValue     | REQUIRED. The value that your component has when neither the user nor the containing Form passes in a `value` prop           |
| exampleValueOne  | REQUIRED. A value that would make sense for your input. Must be different from the `defaultValue` and from `exampleValueTwo` |
| exampleValueTwo  | REQUIRED. A value that would make sense for your input. Must be different from `exampleValueTwo`.                            |
| mount            | REQUIRED. The `mount` function imported from `enzyme` package                                                                |
| options          | OPTIONAL. If your input takes options, the options array.                                                                    |
| props            | OPTIONAL. A props object that should be used as props on the input for all tests                                             |
| simulateChanging | OPTIONAL. If your input ever calls `onChanging`, use this function to simulate one user action that will cause it to happen. |
| simulateChanged  | REQUIRED. Use this function to simulate one user action that will cause `onChange` to be called.                            |
| simulateSubmit   | OPTIONAL. If your input ever calls `onSubmit`, use this function to simulate one user action that will cause it to happen.   |

### Basic Input Example

```js
import React from 'react';
import { mount } from 'enzyme';
import { testInput } from 'composable-form-tests';
import Input from './Input';

testInput({
  component: Input,
  defaultValue: null,
  exampleValueOne: 'ONE',
  exampleValueTwo: 'TWO',
  mount,
  simulateChanging(wrapper, value) {
    // Refer to Enzyme documentation
    wrapper.find('input').simulate('change', { target: { value } });
  },
  simulateChanged(wrapper, value) {
    // Refer to Enzyme documentation
    wrapper.find('input').simulate('blur', { target: { value } });
  },
  simulateSubmit(wrapper) {
    // Refer to Enzyme documentation
    wrapper.find('input').simulate('keypress', { which: 13 });
  },
});
```

### Select Input Example

```js
import React from 'react';
import { mount } from 'enzyme';
import { testInput } from 'composable-form-tests';
import SelectInput from './SelectInput';

testInput({
  component: SelectInput,
  defaultValue: null,
  exampleValueOne: 'a',
  exampleValueTwo: 'b',
  mount,
  options: [
    { label: 'A', value: 'a' },
    { label: 'B', value: 'b' },
    { label: 'C', value: 'c' },
  ],
  simulateChanged(wrapper, value) {
    // Refer to Enzyme documentation
    wrapper.find('select').simulate('change', { target: { value } });
  },
});
```
