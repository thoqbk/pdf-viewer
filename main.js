// Two tests: one page and multiple pages:
var pdfData = atob(multiPagesPdf);

// Loaded via <script> tag, create shortcut to access PDF.js exports.
var pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = '/lib/pdf.worker.js';

// Using DocumentInitParameters object to load binary data.

var loadingTask = pdfjsLib.getDocument({data: pdfData});
loadingTask.promise.then(function(pdf) {
    var pages = pdf.numPages;
    // Render thumbnail
    renderPage(pdf.getPage(1), 'thumbnail');
    // Render pages
    $('.left').html('');
    for(var pageNo = 1; pageNo <= pages; pageNo++) {
        var componentId = 'page-no-' + pageNo;
        $('.left').append('<canvas id="' + componentId + '"></canvas>');
        renderPage(pdf.getPage(pageNo), componentId);
    }
}, function (reason) {
    console.error(reason);
});

var renderPage = function(page, componentId) {
    page.then(function(page) {
        console.log('Page loaded');
        var scale = 1.5;
        var viewport = page.getViewport(scale);
        // Prepare canvas using PDF page dimensions
        var canvas = document.getElementById(componentId);
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        var renderTask = page.render(renderContext);
        renderTask.then(function () {
            console.log('Page rendered');
        });
    });
}