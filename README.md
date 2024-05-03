gmail-analyzer
==================
Boilerplate to analyze stored emails.

`groupBySender.js` - sows the size of emails grouped by sender.

Prepare
------------
Export all emails using Google Takeout. (Mbox format)

Installation
------------
npm install

Example
-------
node groupBySender.js "./All mail Including Spam and Trash-001.mbox"