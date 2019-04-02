<script type="application/javascript">
    // Get the initial js files
    let js_to_load = ['polyfill', 'app', 'vendor'];

    fetch('/dist/manifest.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (!Object.keys(data).length) {
                console.error('Manifest.json file is blank!');
                return;
            }

            for (let x = 0, len = js_to_load.length; x < len; x++) {
                if (!data[js_to_load[x]] || !data[js_to_load[x]].hasOwnProperty('js')) {
                    continue;
                }

                let scriptTag = document.createElement('script');
                scriptTag.src = data[js_to_load[x]].js;
                document.querySelector('body').appendChild(scriptTag);
            }
        }).then(function () {
        setTimeout(function () {
            document.body.classList.remove('webpack-loading');
        }, 500);
    });
</script>
