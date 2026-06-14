# Basic Usage

The simplest search form implementation, including basic form elements such as input fields and selectors. Suitable for most simple search scenarios.

## Basic Search Form

<DemoPreview dir="demos/ma-search/basic-usage" />

## Basic Configuration Guide

### Search Item Configuration
- **Input Search**: Use `render: 'input'` to create a text input field
- **Selector Search**: Use `render: 'select'` with `options` to create a dropdown selector
- **Date Search**: Use `render: 'date-picker'` to create a date picker

### Basic Properties
- `label`: The label name for the search item
- `prop`: The key name corresponding to the form data
- `render`: Specifies the component type to render

## Usage Scenarios

### 1. User List Search
Suitable for searching user information by conditions such as username, email, and status.

### 2. Product Information Filtering
Suitable for filtering products by conditions such as product name, category, and price range.

### 3. Order Query
Suitable for querying orders by conditions such as order number, order status, and order time.

## Key Features

- ✅ Simple and easy-to-use API design
- ✅ Support for multiple form component types
- ✅ Automatic form data collection and processing
- ✅ Built-in search and reset functionality
- ✅ Comprehensive event callback mechanism

## Related Links

- [Advanced Search](./advanced-search) - Learn about more complex search configurations
- [Responsive Layout](./responsive-layout) - Learn about adaptive layout configurations
- [Form Validation](./form-validation) - Learn about form validation functionality