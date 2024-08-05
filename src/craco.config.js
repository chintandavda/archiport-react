const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: { '@primary-color': '#FA8072' }, // Change the primary color
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
