---
'@keystatic/core': patch
---

Fix creating an entry always failing with "This entry has been updated since it was opened" when an unrelated commit landed on the branch after the admin UI was loaded. Creating an entry now retries on the new branch head when the entry still doesn't exist there, matching the existing behaviour for edits. If an entry with the same slug was created in the meantime, the "create a new branch" dialog is still shown.
