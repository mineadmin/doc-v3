# Basic Usage

The simplest implementation of a search form, including basic form elements like input fields and selectors. Suitable for most simple search scenarios.

## Basic Search Form

<DemoPreview dir="demos/ma-search/basic-usage" />

## Basic Configuration Instructions

### Search Item Configuration
- **Input Field Search**: Use `render: 'input'` to create a text input field
- **Selector Search**: Use `render: 'select'` with `options` to create a dropdown selection
- **Date Search**: Use `render: 'date-picker'` to create a date picker

### Basic Properties
- `label`: The label name for the search item
- `prop`: The key name corresponding to the form data
- `render`: Specifies the type of component to render

## Use Cases

### 1. User List Search
Suitable for searching user information by username, email, status, etc.

### 2. Product Information Filtering
Suitable for filtering products by name, category, price range, etc.

### 3. Order Query
Suitable for querying orders by order number, order status, order time, etc.

## Key Features

- ✅ Simple and easy-to-use API design
- ✅ Supports multiple form component types
- ✅ Automatic form data collection and processing
- ✅ Built-in search and reset functionality
- ✅ Comprehensive event callback mechanism

## Related Links

- [Advanced Search](./advanced-search) - Learn about more complex search configurations
- [Responsive Layout](./responsive-layout) - Learn about adaptive layout configurations
- [Form Validation](./form-validation) - Learn about form validation features