(() => {
    const HANDLEBARS = require('handlebars');
    const FILESYSTEM = require('fs');
    const PATH = require('path');
    const DIRECTORY_PATH = PATH.join(__dirname, 'data');
    const DIST_DIRECTORY = 'dist';
    const LOG_MESSAGES = {
        UNABLE_SCAN_DIRECTORY: 'Unable to scan directory: '
    };

    FILESYSTEM.readdir(DIRECTORY_PATH, (err, files) => {
        let contentByLanguage = {};
        let languageId = '';

        if (err) {
            return console.log(LOG_MESSAGES.UNABLE_SCAN_DIRECTORY + err);
        }
        files.forEach(function (fileName) {
            contentByLanguage = JSON.parse(FILESYSTEM.readFileSync(`data/${fileName}`, 'utf-8'));
            languageId = fileName.replace('.json', '');

            generateHTMLFile(languageId, contentByLanguage);
        });
    });

    function generateHTMLFile(lang, langData) {
        const templateFile = FILESYSTEM.readFileSync('templates/home.hbs', 'utf-8');
        const compiledTemplate = HANDLEBARS.compile(templateFile);
        const renderedTemplate = compiledTemplate({
            lang,
            ...langData
        });

        createDistDirectoryIfItDoesNotExist();

        FILESYSTEM.writeFile(`${DIST_DIRECTORY}/${lang}.html`, renderedTemplate, (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });
    }

    function createDistDirectoryIfItDoesNotExist() {
        if (!FILESYSTEM.existsSync(DIST_DIRECTORY)) {
            FILESYSTEM.mkdirSync(DIST_DIRECTORY);
        }
    }
})();


