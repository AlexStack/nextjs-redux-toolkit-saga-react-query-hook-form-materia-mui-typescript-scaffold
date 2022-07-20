# What's this folder used for?

**i18n** folder files save internationalization files used throughout the application.

- i18n stands for internationalization and takes care of the language support of the application. The including JSON files are basically objects contains fixed constants as keys and their associated translations as values.

- Therefore, the keys should be equal for each language file. Only the values (translations) differ from each other. You can easily query those language files later on by writing your own custom hook or component.
