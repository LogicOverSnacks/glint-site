# User Interface
The main view in Glint shows you information about an individual Git repository, including a history of commits, available branches, and details about an individual commit.

<img src="/assets/docs/user-interface-highlighted.png" class="fit-image">

## 1. Tab Bar
<img src="/assets/docs/ui-1.png" class="fit-image">

Each repository opened in Glint has its own tab. The + button on the right can be used to open new repositories.

## 2. Action Bar
<img src="/assets/docs/ui-2.png" class="fit-image">

The Action Bar allows you to perform commonly used Git actions on the repository.

From left to right, these are: undo, redo, fetch, pull, push, create tag, create branch, stash, edit/rebase, search, and finally view settings for the repository.

## 3. Profile Selector & Settings
<img src="/assets/docs/ui-3.png" class="fit-image">

Within Glint you can configure profiles, which let you specify the name & email used in commits, as well as which credentials to use when interacting with Git remotes. This dropdown lets you to select the currently active profile.

## 4. Branches Panel
<img src="/assets/docs/ui-4.png" class="fit-image">

The Branches Panel displays all available branches and tags, including branches on the remote(s). There is also a section where you can see, add, remove, or open submodules (opening a submodule will open it in a new tab). The button in the top-left allows you to show/hide the entire panel.

## 5. Commit Graph
<img src="/assets/docs/ui-5.png" class="fit-image">

The Commit Graph displays a history of commits in the repository, along with the commit message and an icon representing the author. The colorful lines on the left show the lineage of parent commits, including where merges have occurred. Any branches or tags pointing to the commits are listed before the commit message.

A commit can be selected by clicking on it, and this determines what is shown in the Commit Details view (see 6. below). Right-clicking a commit brings up a context menu from which you can initiate merges, create branches, revert commits, and more.

## 6. Commit Details
<img src="/assets/docs/ui-6.png" class="fit-image">

The top half displays the commit id, message, author, and date & time of the selected commit.

The bottom half shows the file changes that were made in this commit. You can toggle between displaying these files in a list or a directory tree, and clicking on a file will display the corresponding diff in the [Diff View](/docs/user_interface-diff_view).
