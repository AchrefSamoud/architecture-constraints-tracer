# Architecture Constraints Tracer

This is a Visual Studio Code extension that helps you to trace architecture constraints in your codebase. It allows you to register design patterns in your code and warns you when you're editing a part of the code that is part of a registered design pattern.

## Features

1. **Register Design Pattern**: This feature allows you to register a design pattern in your code. You can select a part of your code in the active editor and register it under a key. The key, file path, and the start and end lines of the selection are saved in a JSON file.

2. **Check Record**: This feature checks if the current line in the active editor is part of a registered design pattern. If it is, a warning message is displayed.

## Usage

1. **Register Design Pattern**: To register a design pattern, select the part of the code that represents the design pattern in the active editor. Then, run the `architecture-constraints-tracer.registerDesignPattern` command. You will be asked to enter a key for the design pattern. The design pattern will be registered under this key.

2. **Check Record**: This feature is automatically triggered when you change the selection in the active editor. If the current line is part of a registered design pattern, a warning message will be displayed.

## Installation

To install the extension, follow the standard procedure for installing Visual Studio Code extensions.

## Contributing

Contributions are welcome. Please submit a pull request or create an issue to discuss the changes you want to make.

## License

This project is licensed under the MIT License.