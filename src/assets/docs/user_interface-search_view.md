# Search View
The view can be shown by clicking on the ![Search](/assets/docs/search-button.png) button in the [Action Bar](/docs/user_interface#2._Action_Bar).

<img src="/assets/docs/ui-search.png" class="fit-image" alt="Search view">

## Search query
The search query can be modified by clicking the buttons on the right to toggle between:
* search being case-sensitive / case-insensitive
* search using plain text / regex

## References
This section shows all branches & tags whose names match the search query. Clicking will jump to that reference in the main view.

## Commits
This section shows all commits where the search query matches one of:
* commit id
* author name or email
* commit message

The commit message is shown at the top, followed by the author and commit id. Clicking on the commit id will jump to that commit in the main view.

## Files
This section shows a list of files, where the search query matches a change made to that file by one or more commits.
The file path is displayed at the top, followed by a list of commits where the matching changes were made. Clicking on one of these commits will display the [File Popup](/docs/user_interface-search_view#File_Popup).

## File Popup
This popup displays the diff of a particular file in a particular commit, with the changes that match the search query highlighted. From here there are buttons to jump to the commit, or perform a file blame.

<img src="/assets/docs/ui-search-popup.png" class="fit-image" alt="Search view popup">
