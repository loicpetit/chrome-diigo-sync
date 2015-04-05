# Unit test
Create unit test for the Javascript modules in a test branch

# Option to add automatically a tag
A tag always added in the Diigo bookmark created by that extension. Useful to retrieve all bookmark synchronized.

# Delete tags
Actually when a Chrome bookmark is moved, the Diigo bookmark is updated with the new tags but the old tags are still associated with it. Currently the API don't provide that functionnality.

# Delete bookmarks
When a Chrome bookmark is deleted, the corresponding Diigo bookmark is removed.
The Diigo API doesn't get access to the delete functionnality.

More over, some functionality can't be setup without delete bookmarks :
*  White list : synchronize only if a tag in the white list is in the bookmark tags
*  Black list : synchronize only if the bookmark tags don't have a tag in the black list

These can't be setup because Chrome create bookmark when you click to add it and update it when you choose the good folder. If the default folder is valid, the bookmark will be create in the Diigo bookmarks, but if the bookmark is moved in a folder where the associated tags are not in the white list or contain a black list tag, the Diigo bookmark must be delete.

# Group rules
Add/Delete Diigo bookmarks in function of their tags. If a bookmark contain some tags, add it in a Diigo group, else remove it.
The Diigo API doesn't have that functionnality.
