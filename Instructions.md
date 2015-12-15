#The Terry Converter App

####The Terry Converter Application is designed to convert the CSV output from Machforms into PDF files.

##Steps
0. Prerequisite: Install and Configure Google Chrome Plugin (see below).
1. Login to Machforms and enter the response viewing interface, select the responses to export, and export/save as a "Comma Separated Values".
2. Navigate to the Downloads folder in Finder, right click > Open With > 'TextEdit'
3. Select all the content of the file and paste it into the Terry Converter Application.
4. Click on "Process Input". This may take a few seconds to a minute based on how many entries have been selected. If this process does not finish in a minute or two it is likely the Chrome Plugin was not properly installed/configured.
5. A list of all students' application that were exported should be visible from the newly populated list.
6. The "Download All" button may be clicked in order to download individual PDFs of every student, or the individual download icon may be clicked to download just one PDF for that specific student.

##Install and Configure Google Chrome Plugin
1. Download and install plugin from [here](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?utm_source=chrome-app-launcher-info-dialog).
2. A new icon should be added to the toolbar in Chrome (top right). Click on it and click the "trash" icon on the existing item in the "Intercepted URLs or URL patterns" section.
3. Add a new rule `http://www.uh.edu/honors/machform/machform/` by typing it into the field marked "URL or URL patterns" and click the "plus" button.