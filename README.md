# e-satisfaction Chrome Extension

This extension is for testing the e-satisfaction integration library on your website fast and easy without messing with your
website's source code.

**NOTE**: You should already have a (sandbox) account on e-satisfaction.

## Installation

This is an early version of this extension and it's not on the Chrome Store (yet).

to install this extension, you should:

1. Go to Extensions page on your chrome (or simply visit chrome://extensions/)
2. Turn on Developer mode (you might find a switch on the top right corner)
3. Download this repository and unzip the file
4. Click on the "Load unpacked" button on your chrome
5. Select the folder where you unzipped the repository
6. Click select and see the extension on your list
7. Turn on the extension
8. You can find the extension next to the address bar, with the e-satisfaction logo

## Usage

To test the e-satisfaction Integration on your website, you can follow these steps:

1. Activate the e-satisfaction extension
2. Click on the e-satisfaction icon next to the address bar
3. Type in your account's Application Id
4. Click "Apply Integration"
5. You should see any questionnaire available on your website

### Questionnaires do not appear

After clicking on the "Apply Integration" button, normally a questionnaire should appear on the page.

According to the Questionnaire Position documentation by e-satisfaction, for a questionnaire to appear, they should:

* Do not have whitelist or blacklist enabled. If they have, make sure your page is allowed
* The questionnaire type is "box" or "box_classic" or
* The questionnaire type is "embedded" and the position is a valid and existing css selector

### Override Questionnaire Integration Settings

Using the normal scenario, you should see the Questionnaires with their integration settings, as they have been configured
on the e-satisfaction dashboard.

However, you can override these setting and make a questionnaire appear on your page on demand.

**NOTE**: You cannot override whitelist and blacklist options.

To override the Questionnaire Integration Settings, simply:

1. Click on the "Add Questionnaire Override" button
2. Open the panel that has been added
3. Type in the Questionnaire Id you want to override settings for
4. Type in the settings you wish.

You can override the following settings:

* Display Language. You can also select how Auto-Detect works.
* Type. You can make a questionnaire appear as box or embed on your page
* Position. You can make a questionnaire appear wherever you want on the page
* Maximized. You can control whether box type is maximized to the user

## Troubleshooting

Feel free to contact us through our [support portal here](https://support.e-satisfaction.com/hc/en-us/requests/new) if something goes wrong.

## Contributing

Feel free to contribute to this repository and fix bugs, if any.
