# What's this folder used for?

**features** Within a given feature folder, the Redux logic for that feature should be written as a single "slice" file, preferably using the Redux Toolkit createSlice API.


- Structure Files as Feature Folders with Single-File Logic
Redux itself does not care about how your application's folders and files are structured. However, co-locating logic for a given feature in one place typically makes it easier to maintain that code.

- Because of this, we recommend that most applications should structure files using a "feature folder" approach (all files for a feature in the same folder). Within a given feature folder, the Redux logic for that feature should be written as a single "slice" file, preferably using the Redux Toolkit createSlice API. (This is also known as the "ducks" pattern). While older Redux codebases often used a "folder-by-type" approach with separate folders for "actions" and "reducers", keeping related logic together makes it easier to find and update that code.


- /features has folders that contain all functionality related to a specific feature. In this example, todosSlice.ts is a "duck"-style file that contains a call to RTK's createSlice() function, and exports the slice reducer and action creators.

- Doc: https://redux.js.org/style-guide/#structure-files-as-feature-folders-with-single-file-logic
