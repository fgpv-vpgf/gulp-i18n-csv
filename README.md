# gulp-i18n-csv

[![Join the chat at https://gitter.im/fgpv-vpgf/gulp-i18n-csv](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/fgpv-vpgf/gulp-i18n-csv?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> Create internationalized files from a CSV translations file


## Install

```bash
$ npm install --save-dev gulp-i18n-csv
```


## Usage

```js
var gulp = require('gulp');
var gulpi18nCsv = require('gulp-i18n-csv');

gulp.task('default', function () {
	return gulp.src('node_modules/gulp-i18n-csv/sample/wet.csv')
		.pipe(gulpi18nCsv())
		.pipe(gulp.dest('./output'));
});
```


## API

`gulpi18nCsv([ options ])`

### options

#### pretty

Type: `boolean`
Default: `false`

When `true`, outputs human-readble JSON.

#### resource path (resPath)

Type: `string`
Default: `locales/\__lng__/\__ns__.json`

When specified, writes file to specified location.

##### Examples

\__lng__ - language name
\__ns__ - namespace (defaults to 'translation')

```js
gulpi18nCsv({ resPath: 'locales/__lng__/__ns__.json' })
```
```
'locales/en/translation.json'
'locales/fr/translation.json'
'locales/zh-Hans/translation.json'
...
```

Another one:

```js
gulpi18nCsv({ resPath: 'locales/__ns__-__lng__.json' })
```

```
'locales/translation-en.json'
'locales/translation-fr.json'
'locales/translation-zh-Hans.json'
...
```

### Formatting

If a superkey has subkeys after it , do not have the superkey as a key in the csv file at all.
(ie. if `foo` has subkey `foo.bar`, do not have `foo` as a key in the csv file)

### Deep-key nesting

gulp-i18n-csv provides deep key nesting when the key is separated by periods.

##### Example:

| key              | string |
|------------------|--------|
| foo.bar.blah.dog | hello  |

This about should become

```json
{
    "foo": {
        "bar": {
            "blah": {
                "dog": "hello"
            }
        }
    }
}
```

### Splitting

Allows for splitting top-level keys into separate files depending on the option specified.

Use this to split every top-level key into its own csv file:
```js
gulpi18nCsv({ split: true })
```

Replace with an array to split only keys in array from the main translation file:
```js
gulpi18nCsv({ split: ['cal', 'lang', 'tab'] })
```

Replace with string to only split one key away from the main translation file:
```js
gulpi18nCsv({ split: 'tab' })
```

If resPath is provided when splitting, the key being split will replace ```__ns__``` in the file path.

#### Examples

Say you have the following .csv:

| key          |       string                 |
|--------------|------------------------|
| lang     | ru                   |
| tab.play     | Tab Play                   |
| tab.blar     | Tab Blar               |
| help.one     | Help One                   |
| help.three | Help Two                   |
| help.four     | Help Three                   |

When the following is specified, will separate into 3 files: __lang.json__, __tab.json__, and __help.json__.  
```js
{split: true}
```

When the following is specified, will separate into 3 files: __translation.json__, __tab.json__, and __help.json__.  
```js
{split: [tab, help]}
```
When the following is specified, will separate into 2 files: __lang.json__ and __translation.json__.
```js
{split: lang}
```


##### If resPath provided as well
```js
{ resPath: 'locales/__lng__/__ns__.json', split: true }
```
Will separate into 3 files at paths __locales/ru/lang.json__, __locales/ru/tab.json__, __locales/ru/help.json__.

## License

MIT © [Cynthia (Qingwei) Li](http://github.com/cynngah)
